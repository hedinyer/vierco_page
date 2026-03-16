import ProductCard from "./ProductCard";
import { getProductsFromDb } from "@/lib/products-db";

export default async function ProductGrid() {
  const products = await getProductsFromDb();
  return (
    <section className="px-6 lg:px-24 py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-24 gap-x-12">
        {products.map((product) => (
          <ProductCard key={product.slug} {...product} />
        ))}
      </div>
    </section>
  );
}
