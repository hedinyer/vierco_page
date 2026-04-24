import HomeClient from "@/components/layout/HomeClient";
import { getProductsFromDb } from "@/lib/products-db";

export const revalidate = 900;

export const metadata = {
  title: "Calzado Empresarial y de Dotacion en Colombia",
  description:
    "Catalogo Vierco de calzado empresarial y zapatos de dotacion para equipos corporativos en Colombia.",
  alternates: {
    canonical: "https://viercocalzado.com",
  },
};

type HomeSearchParams = Promise<{ tipo?: string | string[] }> | undefined;

export default async function Home({
  searchParams,
}: {
  searchParams?: HomeSearchParams;
}) {
  const products = await getProductsFromDb();
  const sp = searchParams ? await searchParams : {};
  const raw = sp.tipo;
  const tipoParam = Array.isArray(raw) ? raw[0] : raw;

  return <HomeClient products={products} initialTipo={tipoParam} />;
}
