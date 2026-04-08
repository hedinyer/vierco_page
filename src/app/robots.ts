import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://viercocalzado.com/sitemap.xml",
    host: "https://viercocalzado.com",
  };
}
