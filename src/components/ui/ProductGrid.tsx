"use client";

import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/products";
import { CATALOG_SECTION_ID } from "@/lib/catalog-section";
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
    <section
      id={CATALOG_SECTION_ID}
      className="scroll-mt-6 px-4 py-10 sm:px-6 sm:py-14 lg:px-24 lg:py-16"
    >
      <div
        className={`grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-8 sm:gap-y-16 lg:grid-cols-3 lg:gap-x-12 lg:gap-y-24 transition-opacity duration-300 ease-out motion-reduce:transition-none ${
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

