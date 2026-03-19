"use client";

import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/products";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  const [renderProducts, setRenderProducts] = useState<Product[]>(products);
  const [isFading, setIsFading] = useState(false);

  const productsKey = useMemo(() => products.map((p) => p.slug).join("|"), [products]);

  useEffect(() => {
    // Fade out, swap items, then fade back in.
    const raf = window.requestAnimationFrame(() => setIsFading(true));
    const t = window.setTimeout(() => {
      setRenderProducts(products);
      window.requestAnimationFrame(() => setIsFading(false));
    }, 160);
    return () => {
      window.clearTimeout(t);
      window.cancelAnimationFrame(raf);
    };
  }, [productsKey, products]);

  return (
    <section className="px-6 lg:px-24 py-16">
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-24 gap-x-12 transition-opacity duration-300 ease-out motion-reduce:transition-none ${
          isFading ? "opacity-0" : "opacity-100"
        }`}
      >
        {renderProducts.map((product) => {
          const { ref: _productRef, ...productProps } = product;
          return <ProductCard key={product.slug} {...productProps} />;
        })}
      </div>
    </section>
  );
}

