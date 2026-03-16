"use client";

import { useState } from "react";
import Link from "next/link";
import TopNavBar from "@/components/layout/TopNavBar";
import QuickCart from "@/components/layout/QuickCart";

export default function ProductNotFoundView() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-on-surface selection:bg-secondary selection:text-white">
      <TopNavBar onCartClick={() => setCartOpen((o) => !o)} />
      <QuickCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <main className="min-h-screen flex flex-col items-center justify-center px-6">
        <h1 className="font-headline text-3xl mb-4">Producto no encontrado</h1>
        <Link
          href="/"
          className="font-label text-xs tracking-[0.2em] underline underline-offset-8 hover:text-secondary transition-colors"
        >
          Volver al catálogo
        </Link>
      </main>
    </div>
  );
}
