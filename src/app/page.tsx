import HomeClient from "@/components/layout/HomeClient";
import { getProductsFromDb } from "@/lib/products-db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const products = await getProductsFromDb();

  return <HomeClient products={products} />;
}
