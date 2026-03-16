"use client";

import { useState } from "react";
import TopNavBar from "@/components/layout/TopNavBar";
import QuickCart from "@/components/layout/QuickCart";
import Hero from "@/components/layout/Hero";
import FilterBar from "@/components/layout/FilterBar";
import ProductGrid from "@/components/ui/ProductGrid";
import Footer from "@/components/layout/Footer";

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-on-surface selection:bg-secondary selection:text-white">
      <TopNavBar onCartClick={() => setCartOpen((o) => !o)} />
      <QuickCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <main className="min-h-screen">
        <Hero />
        <FilterBar />
        <ProductGrid />
        <Footer />
      </main>
    </div>
  );
}
