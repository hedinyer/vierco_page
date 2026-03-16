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
  imageUrl: string;
  altText: string;
  features: FeatureInput[];
  images: ImageInput[];
  sizes?: SizeInput[];
};

export type CreateProductResult =
  | { success: true; productId: string }
  | { success: false; error: string };

function parsePriceToCents(priceStr: string): number {
  const num = Number(priceStr.replace(/[^0-9.-]+/g, "")); // "$450000" -> 450000
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
        description: null,
        price_cents: priceCents,
        availability: payload.availability || null,
        image_url: payload.imageUrl,
        alt_text: payload.altText,
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

