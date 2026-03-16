/**
 * Seed products from src/lib/products.ts into Supabase.
 * Run: npx tsx scripts/seed-products.ts
 * Requires: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY in .env.local
 */
import { createClient } from "@supabase/supabase-js";
import { PRODUCTS } from "../src/lib/products";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!url || !key) {
  console.error("Missing env vars. Load .env.local first.");
  process.exit(1);
}

const supabase = createClient(url, key);

function parsePriceToCents(priceStr: string): number {
  const num = Number(priceStr.replace(/[^0-9.-]+/g, ""));
  return isNaN(num) ? 0 : Math.round(num);
}

async function seed() {
  for (const p of PRODUCTS) {
    const { data: existing } = await supabase
      .from("products")
      .select("id")
      .eq("slug", p.slug)
      .single();

    if (existing) {
      console.log(`Skip (exists): ${p.slug}`);
      continue;
    }

    const { data: product, error: productError } = await supabase
      .from("products")
      .insert({
        slug: p.slug,
        ref: p.ref || null,
        name: p.name,
        description: null,
        price_cents: parsePriceToCents(p.price),
        availability: p.availability || null,
        image_url: p.image,
        alt_text: p.alt,
      })
      .select("id")
      .single();

    if (productError || !product) {
      console.error(`Product insert error for ${p.slug}:`, productError);
      continue;
    }

    for (let i = 0; i < p.features.length; i++) {
      const f = p.features[i];
      await supabase.from("product_features").insert({
        product_id: product.id,
        title: f.title,
        description: f.description,
        position: i,
      });
    }

    if (p.gallery?.length) {
      for (let i = 0; i < p.gallery.length; i++) {
        await supabase.from("product_images").insert({
          product_id: product.id,
          image_url: p.gallery[i],
          alt_text: `${p.alt} - vista ${i + 2}`,
          position: i,
        });
      }
    }

    console.log(`Seeded: ${p.slug}`);
  }
  console.log("Done.");
}

seed().catch(console.error);
