"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import TopNavBar from "@/components/layout/TopNavBar";
import QuickCart from "@/components/layout/QuickCart";
import Footer from "@/components/layout/Footer";

function CheckoutSuccessContent() {
  const [cartOpen, setCartOpen] = useState(false);
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");

  return (
    <div className="min-h-screen bg-background text-on-surface selection:bg-secondary selection:text-white">
      <TopNavBar onCartClick={() => setCartOpen((o) => !o)} />
      <QuickCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <main className="min-h-screen flex flex-col items-center justify-center px-6">
        <h1 className="font-headline text-4xl md:text-5xl italic font-extralight mb-6 text-center">
          Pedido confirmado
        </h1>
        <p className="font-body text-lg text-on-surface-variant mb-8 text-center max-w-md">
          Gracias por tu compra. Te hemos enviado un correo con los detalles de tu pedido.
        </p>
        {orderId && (
          <p className="font-label text-xs tracking-widest text-on-surface-variant mb-12">
            Nº de pedido: {orderId}
          </p>
        )}
        <Link
          href="/"
          className="font-label text-xs tracking-[0.2em] underline underline-offset-8 hover:text-secondary transition-colors"
        >
          Volver al catálogo
        </Link>
      </main>
      <Footer />
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="font-label text-xs tracking-widest text-on-surface-variant">Cargando...</span>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
