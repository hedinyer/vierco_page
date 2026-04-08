import type { MetadataRoute } from "next";
import { seoCities } from "@/lib/seo-cities";

const baseUrl = "https://viercocalzado.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const cityPages: MetadataRoute.Sitemap = seoCities.map((city) => ({
    url: `${baseUrl}/zapato-dotacion/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...cityPages,
  ];
}
