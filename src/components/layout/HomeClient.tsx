"use client";

import { useEffect, useMemo, useState } from "react";
import TopNavBar from "@/components/layout/TopNavBar";
import QuickCart from "@/components/layout/QuickCart";
import Hero from "@/components/layout/Hero";
import FilterBar from "@/components/layout/FilterBar";
import LineaFilterBar from "@/components/layout/LineaFilterBar";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/ui/ProductGrid";
import type { Product, ProductLinea, ProductTipo } from "@/lib/products";

interface HomeClientProps {
  products: Product[];
}

export default function HomeClient({ products }: HomeClientProps) {
  const [cartOpen, setCartOpen] = useState(false);
  const [tipoFilter, setTipoFilter] = useState<ProductTipo>("Hombre");
  const [serieFilter, setSerieFilter] = useState<string | null>(null);
  const [lineaFilter, setLineaFilter] = useState<ProductLinea | null>(null);

  const isHombreMujer =
    tipoFilter === "Hombre" || tipoFilter === "Mujer";

  const visibleProducts = useMemo(() => {
    return products.filter(
      (p) => p.tipo && p.tipo.toLowerCase() === tipoFilter.toLowerCase()
    );
  }, [products, tipoFilter]);

  const gridProducts = useMemo(() => {
    if (isHombreMujer) {
      if (!lineaFilter) return visibleProducts;
      return visibleProducts.filter(
        (p) => (p.category || "").trim().toLowerCase() === lineaFilter
      );
    }
    if (!serieFilter) return visibleProducts;
    const key = serieFilter.trim().toUpperCase();
    return visibleProducts.filter(
      (p) => (p.category || "").trim().toUpperCase() === key
    );
  }, [visibleProducts, serieFilter, lineaFilter, isHombreMujer]);

  useEffect(() => {
    setSerieFilter(null);
    setLineaFilter(null);
  }, [tipoFilter]);

  useEffect(() => {
    if (serieFilter === null) return;
    const key = serieFilter.trim().toUpperCase();
    const stillValid = visibleProducts.some(
      (p) => (p.category || "").trim().toUpperCase() === key
    );
    if (!stillValid) setSerieFilter(null);
  }, [visibleProducts, serieFilter]);

  useEffect(() => {
    if (!isHombreMujer || lineaFilter === null) return;
    const stillValid = visibleProducts.some(
      (p) => (p.category || "").trim().toLowerCase() === lineaFilter
    );
    if (!stillValid) setLineaFilter(null);
  }, [visibleProducts, lineaFilter, isHombreMujer]);

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
        {isHombreMujer ? (
          <LineaFilterBar
            products={visibleProducts}
            selectedLinea={lineaFilter}
            onLineaChange={setLineaFilter}
          />
        ) : (
          <FilterBar
            products={visibleProducts}
            selectedCategory={serieFilter}
            onCategoryChange={setSerieFilter}
          />
        )}
        <ProductGrid products={gridProducts} />
        <Footer />
      </main>
    </div>
  );
}
