"use server";

import { supabase } from "@/lib/supabase";

type FeatureInput = {
  title: string;
  description: string;
};

type ImageInput = {
  url: string;
  alt: string;
};

type SizeInput = {
  size: string;
  stock: number;
};

export type CreateProductPayload = {
  slug: string;
  ref: string;
  name: string;
  price: string;
  availability?: string;
  /** Descripción larga opcional del producto */
  description?: string;
  /** Categoría libre, p.ej. "OXFORDS", "ZAPATO BUENO" */
  categoria?: string;
  imageUrl: string;
  altText: string;
  features: FeatureInput[];
  images: ImageInput[];
  sizes?: SizeInput[];
  /** Tipo de producto: Industrial, Hombre o Mujer (pestañas independientes). */
  tipo?: string;
};

export type CreateProductResult =
  | { success: true; productId: string }
  | { success: false; error: string };

type ProductListItem = {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  price_cents: number;
  categoria: string | null;
  tipo: string | null;
  availability: string | null;
};

type ProductFeatureRow = {
  title: string;
  description: string;
  position: number;
};

type ProductImageRow = {
  image_url: string;
  alt_text: string | null;
  position: number;
};

export type ProductEditorData = {
  id: string;
  slug: string;
  ref: string;
  name: string;
  price: string;
  availability: string;
  description: string;
  categoria: string;
  imageUrl: string;
  altText: string;
  tipo: string;
  sizes: SizeInput[];
  features: FeatureInput[];
  images: ImageInput[];
};

/** Parses price string to integer (COP). Handles "450000", "450.000", "$450.000". */
function parsePriceToCents(priceStr: string): number {
  const digitsOnly = priceStr.replace(/\D/g, ""); // drop $ . , etc. so "450.000" -> 450000
  const num = Number(digitsOnly);
  return Number.isFinite(num) ? Math.round(num) : 0;
}

export async function createProductWithRelations(
  payload: CreateProductPayload
): Promise<CreateProductResult> {
  try {
    const priceCents = parsePriceToCents(payload.price);

    const { data: existing } = await supabase
      .from("products")
      .select("id")
      .eq("slug", payload.slug)
      .maybeSingle();

    if (existing) {
      return { success: false, error: "Ya existe un producto con ese slug" };
    }

    const { data: product, error: productError } = await supabase
      .from("products")
      .insert({
        slug: payload.slug,
        ref: payload.ref || null,
        name: payload.name,
        description: payload.description || null,
        price_cents: priceCents,
        availability: payload.availability || null,
        categoria: payload.categoria || null,
        image_url: payload.imageUrl,
        alt_text: payload.altText,
        tipo: payload.tipo || null,
        sizes: (payload.sizes ?? []).filter(
          (s) => s.size.trim() && Number.isFinite(s.stock) && s.stock >= 0
        ),
      })
      .select("id")
      .single();

    if (productError || !product) {
      console.error("create product error:", productError);
      return { success: false, error: "Error al crear el producto" };
    }

    const productId = product.id as string;

    const featureRows = payload.features
      .filter((f) => f.title.trim() && f.description.trim())
      .map((f, index) => ({
        product_id: productId,
        title: f.title.trim(),
        description: f.description.trim(),
        position: index,
      }));

    if (featureRows.length) {
      const { error: featuresError } = await supabase
        .from("product_features")
        .insert(featureRows);
      if (featuresError) {
        console.error("features insert error:", featuresError);
        return {
          success: false,
          error: "Producto creado pero hubo un error guardando las características",
        };
      }
    }

    const imageRows = payload.images
      .filter((img) => img.url.trim())
      .map((img, index) => ({
        product_id: productId,
        image_url: img.url.trim(),
        alt_text: img.alt.trim() || `${payload.altText} - imagen ${index + 1}`,
        position: index,
      }));

    if (imageRows.length) {
      const { error: imagesError } = await supabase
        .from("product_images")
        .insert(imageRows);
      if (imagesError) {
        console.error("images insert error:", imagesError);
        return {
          success: false,
          error: "Producto creado pero hubo un error guardando la galería",
        };
      }
    }

    return { success: true, productId };
  } catch (err) {
    console.error("createProductWithRelations error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Error inesperado",
    };
  }
}

export async function listProductsForEditor(): Promise<{
  success: true;
  products: ProductListItem[];
} | {
  success: false;
  error: string;
}> {
  const { data, error } = await supabase
    .from("products")
    .select("id, name, slug, image_url, price_cents, categoria, tipo, availability")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("listProductsForEditor error:", error);
    return { success: false, error: "No se pudo cargar el listado de productos" };
  }

  return { success: true, products: (data ?? []) as ProductListItem[] };
}

export async function getProductForEditor(productId: string): Promise<{
  success: true;
  product: ProductEditorData;
} | {
  success: false;
  error: string;
}> {
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .maybeSingle();

  if (productError || !product) {
    console.error("getProductForEditor product error:", productError);
    return { success: false, error: "No se pudo cargar el producto seleccionado" };
  }

  const [featuresRes, imagesRes] = await Promise.all([
    supabase
      .from("product_features")
      .select("title, description, position")
      .eq("product_id", productId)
      .order("position", { ascending: true }),
    supabase
      .from("product_images")
      .select("image_url, alt_text, position")
      .eq("product_id", productId)
      .order("position", { ascending: true }),
  ]);

  const features = ((featuresRes.data ?? []) as ProductFeatureRow[]).map((f) => ({
    title: f.title ?? "",
    description: f.description ?? "",
  }));

  const images = ((imagesRes.data ?? []) as ProductImageRow[]).map((img) => ({
    url: img.image_url ?? "",
    alt: img.alt_text ?? "X",
  }));

  const parsedSizes = Array.isArray(product.sizes)
    ? (product.sizes as Array<{ size: string; stock: number }>)
    : [];

  return {
    success: true,
    product: {
      id: product.id,
      slug: product.slug ?? "",
      ref: product.ref ?? "",
      name: product.name ?? "",
      price: String(product.price_cents ?? ""),
      availability: product.availability ?? "",
      description: product.description ?? "",
      categoria: product.categoria ?? "",
      imageUrl: product.image_url ?? "",
      altText: product.alt_text ?? "X",
      tipo: product.tipo ?? "",
      sizes: parsedSizes.map((s) => ({
        size: String(s.size ?? ""),
        stock: Number(s.stock) || 0,
      })),
      features,
      images,
    },
  };
}

export async function updateProductWithRelations(
  productId: string,
  payload: CreateProductPayload
): Promise<CreateProductResult> {
  try {
    const priceCents = parsePriceToCents(payload.price);

    const { data: slugCollision } = await supabase
      .from("products")
      .select("id")
      .eq("slug", payload.slug)
      .neq("id", productId)
      .maybeSingle();

    if (slugCollision) {
      return { success: false, error: "Ya existe otro producto con ese slug" };
    }

    const { error: productError } = await supabase
      .from("products")
      .update({
        slug: payload.slug,
        ref: payload.ref || null,
        name: payload.name,
        description: payload.description || null,
        price_cents: priceCents,
        availability: payload.availability || null,
        categoria: payload.categoria || null,
        image_url: payload.imageUrl,
        alt_text: payload.altText,
        tipo: payload.tipo || null,
        sizes: (payload.sizes ?? []).filter(
          (s) => s.size.trim() && Number.isFinite(s.stock) && s.stock >= 0
        ),
      })
      .eq("id", productId);

    if (productError) {
      console.error("updateProductWithRelations product error:", productError);
      return { success: false, error: "Error al actualizar el producto" };
    }

    const { error: deleteFeaturesError } = await supabase
      .from("product_features")
      .delete()
      .eq("product_id", productId);

    if (deleteFeaturesError) {
      console.error("delete features error:", deleteFeaturesError);
      return { success: false, error: "No se pudieron actualizar las características" };
    }

    const featureRows = payload.features
      .filter((f) => f.title.trim() && f.description.trim())
      .map((f, index) => ({
        product_id: productId,
        title: f.title.trim(),
        description: f.description.trim(),
        position: index,
      }));

    if (featureRows.length) {
      const { error: featuresInsertError } = await supabase
        .from("product_features")
        .insert(featureRows);
      if (featuresInsertError) {
        console.error("insert features error:", featuresInsertError);
        return { success: false, error: "No se pudieron guardar las características" };
      }
    }

    const { error: deleteImagesError } = await supabase
      .from("product_images")
      .delete()
      .eq("product_id", productId);

    if (deleteImagesError) {
      console.error("delete images error:", deleteImagesError);
      return { success: false, error: "No se pudo actualizar la galería" };
    }

    const imageRows = payload.images
      .filter((img) => img.url.trim())
      .map((img, index) => ({
        product_id: productId,
        image_url: img.url.trim(),
        alt_text: img.alt.trim() || `${payload.altText} - imagen ${index + 1}`,
        position: index,
      }));

    if (imageRows.length) {
      const { error: imagesInsertError } = await supabase
        .from("product_images")
        .insert(imageRows);
      if (imagesInsertError) {
        console.error("insert images error:", imagesInsertError);
        return { success: false, error: "No se pudo guardar la galería" };
      }
    }

    return { success: true, productId };
  } catch (err) {
    console.error("updateProductWithRelations error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Error inesperado actualizando producto",
    };
  }
}

