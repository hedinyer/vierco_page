import HomeClient from "@/components/layout/HomeClient";
import { getProductsFromDb } from "@/lib/products-db";

export default async function Home() {
  const products = await getProductsFromDb();

  return <HomeClient products={products} />;
}
