import HomeClient from "@/components/layout/HomeClient";
import { getProductsFromDb } from "@/lib/products-db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
