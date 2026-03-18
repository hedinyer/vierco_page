"use client";

import { useMemo, useState } from "react";
import TopNavBar from "@/components/layout/TopNavBar";
import QuickCart from "@/components/layout/QuickCart";
import Hero from "@/components/layout/Hero";
import FilterBar from "@/components/layout/FilterBar";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/ui/ProductGrid";
import type { Product } from "@/lib/products";

interface HomeClientProps {
  products: Product[];
}

export default function HomeClient({ products }: HomeClientProps) {
  const [cartOpen, setCartOpen] = useState(false);
  const [tipoFilter, setTipoFilter] = useState<"Corporativo" | "Industrial" | null>("Corporativo");

  const visibleProducts = useMemo(() => {
    if (!tipoFilter) return products;
    return products.filter(
      (p) => p.tipo && p.tipo.toLowerCase() === tipoFilter.toLowerCase()
    );
  }, [products, tipoFilter]);

  return (
    <div className="min-h-screen bg-background text-on-surface selection:bg-secondary selection:text-white">
      <TopNavBar
        onCartClick={() => setCartOpen((o) => !o)}
        selectedTipo={tipoFilter}
        onTipoChange={setTipoFilter}
      />
      <QuickCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <main className="min-h-screen">
        <Hero />
        <FilterBar products={visibleProducts} />
        <ProductGrid products={visibleProducts} />
        <Footer />
      </main>
    </div>
  );
}
