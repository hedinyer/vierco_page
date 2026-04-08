export type SeoCity = {
  slug: string;
  name: string;
  department: string;
};

export const seoCities: SeoCity[] = [
  { slug: "bucaramanga", name: "Bucaramanga", department: "Santander" },
  { slug: "bogota", name: "Bogota", department: "Cundinamarca" },
  { slug: "medellin", name: "Medellin", department: "Antioquia" },
  { slug: "barranquilla", name: "Barranquilla", department: "Atlantico" },
  { slug: "barranquila", name: "Barranquilla", department: "Atlantico" },
];

export function getSeoCityBySlug(slug: string): SeoCity | undefined {
  return seoCities.find((city) => city.slug === slug);
}
