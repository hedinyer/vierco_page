"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import TopNavBar from "@/components/layout/TopNavBar";
import QuickCart from "@/components/layout/QuickCart";
import Footer from "@/components/layout/Footer";

function CheckoutSuccessContent() {
  const router = useRouter();
  const [cartOpen, setCartOpen] = useState(false);
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const wompiTransactionId = searchParams.get("id");
  const wompiTxFallback = searchParams.get("wompi_tx");
  const wompiTxId = wompiTransactionId ?? wompiTxFallback;

  /** Las nuevas redirecciones de Wompi van a `/checkout`; esta ruta queda por enlaces antiguos. */
  useEffect(() => {
    if (!orderId || !wompiTxId) return;
    router.replace(
      `/checkout?order=${encodeURIComponent(orderId)}&id=${encodeURIComponent(wompiTxId)}`
    );
  }, [orderId, wompiTxId, router]);

  return (
    <div className="min-h-screen bg-background text-on-surface selection:bg-secondary selection:text-white">
      <TopNavBar onCartClick={() => setCartOpen((o) => !o)} />
      <QuickCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <main className="min-h-screen flex flex-col items-center justify-center px-6">
        {orderId && wompiTxId ? (
          <p className="font-body text-lg text-on-surface-variant mb-8 text-center max-w-md">
            Redirigiendo al checkout para confirmar tu pago…
          </p>
        ) : (
          <>
            <h1 className="font-headline text-4xl md:text-5xl italic font-extralight mb-6 text-center">
              Pedido registrado
            </h1>
            <p className="font-body text-lg text-on-surface-variant mb-8 text-center max-w-md">
              Si completaste el pago con Wompi, revisa el estado en tu correo o vuelve al
              checkout.
            </p>
            {orderId && (
              <p className="font-label text-xs tracking-widest text-on-surface-variant mb-12">
                Nº de pedido: {orderId}
              </p>
            )}
            <Link
              href="/checkout"
              className="font-label text-xs tracking-[0.2em] underline underline-offset-8 hover:text-secondary transition-colors mb-6"
            >
              Ir a checkout
            </Link>
            <Link
              href="/"
              className="font-label text-xs tracking-[0.2em] underline underline-offset-8 hover:text-secondary transition-colors"
            >
              Volver al catálogo
            </Link>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <span className="font-label text-xs tracking-widest text-on-surface-variant">
            Cargando...
          </span>
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
