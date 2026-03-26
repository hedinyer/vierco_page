"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import TopNavBar from "@/components/layout/TopNavBar";
import QuickCart from "@/components/layout/QuickCart";
import Footer from "@/components/layout/Footer";
import { useDispatch } from "react-redux";
import { clearCart } from "@/store";
import { fetchWompiTransactionStatus } from "@/app/actions/wompi";

const CHECKOUT_DRAFT_KEY = "vierco_checkout_draft_v1";

function CheckoutSuccessContent() {
  const [cartOpen, setCartOpen] = useState(false);
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  /** Wompi appends `id` to redirect-url after payment; informational only. */
  const wompiTransactionId = searchParams.get("id");
  const wompiTxFallback = searchParams.get("wompi_tx");
  const wompiTxId = wompiTransactionId ?? wompiTxFallback;

  const dispatch = useDispatch();
  const [txStatus, setTxStatus] = useState<string | null>(null);
  const [txStatusMessage, setTxStatusMessage] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!wompiTxId) return;
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    (async () => {
      const res = await fetchWompiTransactionStatus(wompiTxId);
      if (!res.success) {
        setTxStatus(null);
        setTxStatusMessage(res.error);
        return;
      }
      setTxStatus(res.status);
      setTxStatusMessage(res.statusMessage ?? null);

      if (res.status === "APPROVED") {
        try {
          localStorage.removeItem(CHECKOUT_DRAFT_KEY);
        } catch {
          // ignore
        }
        dispatch(clearCart());
      }
    })();
  }, [dispatch, wompiTxId]);

  return (
    <div className="min-h-screen bg-background text-on-surface selection:bg-secondary selection:text-white">
      <TopNavBar onCartClick={() => setCartOpen((o) => !o)} />
      <QuickCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <main className="min-h-screen flex flex-col items-center justify-center px-6">
        <h1 className="font-headline text-4xl md:text-5xl italic font-extralight mb-6 text-center">
          {txStatus === "APPROVED"
            ? "Pago confirmado"
            : "Procesando resultado del pago"}
        </h1>
        <p className="font-body text-lg text-on-surface-variant mb-8 text-center max-w-md">
          {txStatus === "APPROVED"
            ? "Gracias por tu compra. Te hemos enviado un correo con los detalles de tu pedido."
            : txStatus
              ? `El pago no se completó. Estado: ${txStatus}${txStatusMessage ? ` - ${txStatusMessage}` : ""}`
              : "Revisando el estado de tu transacción con Wompi."}
        </p>
        {(orderId || wompiTransactionId) && (
          <div className="font-label text-xs tracking-widest text-on-surface-variant mb-12 space-y-1 text-center">
            {orderId && <p>Nº de pedido: {orderId}</p>}
            {wompiTransactionId && (
              <p>Referencia Wompi: {wompiTransactionId}</p>
            )}
          </div>
        )}
        {txStatus !== "APPROVED" && (
          <Link
            href="/checkout"
            className="font-label text-xs tracking-[0.2em] underline underline-offset-8 hover:text-secondary transition-colors"
          >
            Volver a checkout (mantiene tus datos)
          </Link>
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
