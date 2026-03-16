import { supabase } from "./supabase";
import type { Product } from "./products";
import { PRODUCTS, getProductBySlug, getProductByName } from "./products";

type DbProduct = {
  id: string;
  slug: string;
  ref: string | null;
  name: string;
  description: string | null;
  price_cents: number;
  availability: string | null;
  image_url: string;
  alt_text: string | null;
  sizes?: Array<{ size: string; stock: number }> | null;
};

type DbFeature = {
  id: string;
  product_id: string;
  title: string;
  description: string;
  position: number;
};

type DbImage = {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  position: number;
};

function formatPrice(priceCents: number): string {
  return `$${priceCents.toLocaleString("es-CO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

function toProduct(
  p: DbProduct,
  features: DbFeature[],
  images: DbImage[]
): Product {
  const gallery = images
    .sort((a, b) => a.position - b.position)
    .map((i) => i.image_url);
  let sizes: Array<{ size: string; stock: number }> | undefined;
  if (Array.isArray(p.sizes)) {
    sizes = p.sizes
      .filter((s) => s && (typeof s.size === "string" || typeof s.size === "number"))
      .map((s) => ({ size: String(s.size), stock: Number(s.stock) || 0 }));
  } else if (typeof p.sizes === "string") {
    try {
      const parsed = JSON.parse(p.sizes) as Array<{ size: string | number; stock: number }>;
      sizes = Array.isArray(parsed)
        ? parsed
          .filter((s) => s && (s.size != null || s.stock != null))
          .map((s) => ({ size: String(s.size ?? ""), stock: Number(s.stock) || 0 }))
        : undefined;
    } catch {
      sizes = undefined;
    }
  } else {
    sizes = undefined;
  }
  return {
    slug: p.slug,
    name: p.name,
    price: formatPrice(p.price_cents),
    ref: p.ref ?? "",
    image: p.image_url,
    alt: p.alt_text ?? p.name,
    gallery: gallery.length > 0 ? gallery : undefined,
    features: features
      .sort((a, b) => a.position - b.position)
      .map((f) => ({ title: f.title, description: f.description })),
    availability: p.availability ?? undefined,
    sizes,
  };
}

export async function getProductsFromDb(): Promise<Product[]> {
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: true });

  if (productsError) {
    console.error("products fetch error:", productsError);
    return PRODUCTS;
  }

  if (!products?.length) return PRODUCTS;

  const ids = products.map((p) => p.id);
  const [featuresRes, imagesRes] = await Promise.all([
    supabase.from("product_features").select("*").in("product_id", ids),
    supabase.from("product_images").select("*").in("product_id", ids),
  ]);

  const features = (featuresRes.data ?? []) as DbFeature[];
  const images = (imagesRes.data ?? []) as DbImage[];

  return products.map((p) => {
    const prodFeatures = features.filter((f) => f.product_id === p.id);
    const prodImages = images.filter((i) => i.product_id === p.id);
    return toProduct(p as DbProduct, prodFeatures, prodImages);
  });
}

export async function getProductByNameFromDb(name: string): Promise<Product | null> {
  const cleanName = name?.trim();
  if (!cleanName) return getProductByName(name) ?? null;

  const { data: product, error: productError } = await supabase
    .from("products")
    .select("*")
    .eq("name", cleanName)
    .maybeSingle();

  if (productError) {
    console.error("getProductByNameFromDb error:", productError);
    const allProducts = await getProductsFromDb();
    const found =
      allProducts.find((p) => p.name === cleanName) ??
      allProducts.find((p) => p.name.toLowerCase() === cleanName.toLowerCase());
    if (found) return found;
    return getProductByName(cleanName) ?? null;
  }

  if (!product) {
    const allProducts = await getProductsFromDb();
    const found =
      allProducts.find((p) => p.name === cleanName) ??
      allProducts.find((p) => p.name.toLowerCase() === cleanName.toLowerCase());
    if (found) return found;
    return getProductByName(cleanName) ?? null;
  }

  const [featuresRes, imagesRes] = await Promise.all([
    supabase.from("product_features").select("*").eq("product_id", product.id),
    supabase.from("product_images").select("*").eq("product_id", product.id),
  ]);

  const features = (featuresRes.data ?? []) as DbFeature[];
  const images = (imagesRes.data ?? []) as DbImage[];

  return toProduct(product as DbProduct, features, images);
}

export async function getProductBySlugFromDb(slug: string): Promise<Product | null> {
  const cleanSlug = slug?.trim();
  if (!cleanSlug) return getProductBySlug(slug) ?? null;

  const { data: product, error: productError } = await supabase
    .from("products")
    .select("*")
    .eq("slug", cleanSlug)
    .maybeSingle();

  if (productError) {
    console.error("getProductBySlugFromDb error:", productError);
    const allProducts = await getProductsFromDb();
    return allProducts.find((p) => p.slug === cleanSlug) ?? getProductBySlug(cleanSlug) ?? null;
  }

  if (!product) {
    const allProducts = await getProductsFromDb();
    return allProducts.find((p) => p.slug === cleanSlug) ?? getProductBySlug(cleanSlug) ?? null;
  }

  const [featuresRes, imagesRes] = await Promise.all([
    supabase.from("product_features").select("*").eq("product_id", product.id),
    supabase.from("product_images").select("*").eq("product_id", product.id),
  ]);

  const features = (featuresRes.data ?? []) as DbFeature[];
  const images = (imagesRes.data ?? []) as DbImage[];

  return toProduct(product as DbProduct, features, images);
}
