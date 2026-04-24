import type { MetadataRoute } from "next";
import { seoCities } from "@/lib/seo-cities";
import { getProductsFromDb } from "@/lib/products-db";

const baseUrl = "https://viercocalzado.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cityPages: MetadataRoute.Sitemap = seoCities.map((city) => ({
    url: `${baseUrl}/zapato-dotacion/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  let productPages: MetadataRoute.Sitemap = [];
  try {
    const products = await getProductsFromDb();
    productPages = products.map((product) => ({
      url: `${baseUrl}/product/${encodeURIComponent(product.slug)}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch {
    productPages = [];
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/zapato-dotacion`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.95,
    },
    ...cityPages,
    ...productPages,
  ];
}
