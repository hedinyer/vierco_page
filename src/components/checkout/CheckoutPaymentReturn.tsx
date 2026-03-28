"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { clearCart } from "@/store";
import { applyWompiResultToOrder } from "@/app/actions/order-payment";

const CHECKOUT_DRAFT_KEY = "vierco_checkout_draft_v1";

type ModalKind = "success" | "rejected" | "pending" | null;

/**
 * Cuando Wompi redirige a `/checkout?order=…&id=…`, sincroniza el pedido en Supabase
 * y muestra un modal según el resultado.
 */
export function CheckoutPaymentReturn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const orderId = searchParams.get("order");
  const txId = searchParams.get("id") ?? searchParams.get("wompi_tx");

  const [modal, setModal] = useState<ModalKind>(null);
  const [detail, setDetail] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const runOnceRef = useRef<string | null>(null);

  useEffect(() => {
    if (!orderId || !txId) return;

    const key = `${orderId}:${txId}`;
    if (runOnceRef.current === key) return;
    runOnceRef.current = key;

    let cancelled = false;

    (async () => {
      setProcessing(true);
      setModal(null);
      setDetail(null);

      try {
        let result = await applyWompiResultToOrder(orderId, txId);
        let attempts = 0;
        while (
          !cancelled &&
          result.success &&
          result.paymentStatus === "PENDING" &&
          attempts < 25
        ) {
          await new Promise((r) => setTimeout(r, 2000));
          result = await applyWompiResultToOrder(orderId, txId);
          attempts += 1;
        }

        if (cancelled) return;

        if (!result.success) {
          setDetail(result.error);
          setModal("rejected");
          return;
        }

        if (result.paymentStatus === "PAID") {
          try {
            localStorage.removeItem(CHECKOUT_DRAFT_KEY);
          } catch {
            // ignore
          }
          dispatch(clearCart());
          setModal("success");
          return;
        }

        if (result.paymentStatus === "REJECTED") {
          try {
            localStorage.removeItem(CHECKOUT_DRAFT_KEY);
          } catch {
            // ignore
          }
          setModal("rejected");
          return;
        }

        setDetail(
          "El pago sigue en proceso. Revisa tu correo o el panel de Wompi."
        );
        setModal("pending");
      } finally {
        if (!cancelled) setProcessing(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [dispatch, orderId, txId]);

  const goHome = () => {
    router.replace("/");
  };

  return (
    <>
      {processing && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center px-6"
          role="status"
          aria-live="polite"
        >
          <p className="font-body text-sm text-white text-center">
            Confirmando el resultado del pago con Wompi…
          </p>
        </div>
      )}

      {modal && (
        <div
          className="fixed inset-0 z-[101] flex items-center justify-center bg-black/60 px-6"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-w-md w-full bg-surface-container-low border border-outline-variant/30 p-8 shadow-xl">
            <h2 className="font-headline text-2xl italic mb-4 text-center">
              {modal === "success" && "Pago aprobado"}
              {modal === "rejected" && "Pago rechazado"}
              {modal === "pending" && "Pago pendiente"}
            </h2>
            <p className="font-body text-sm text-on-surface-variant text-center mb-6 leading-relaxed">
              {modal === "success" &&
                "Gracias por tu compra. Tu pedido quedó registrado como pagado."}
              {modal === "rejected" &&
                (detail ??
                  "El pago no se completó o fue rechazado. Puedes intentar de nuevo más tarde.")}
              {modal === "pending" && (detail ?? "")}
            </p>
            <button
              type="button"
              onClick={goHome}
              className="w-full h-12 bg-primary text-on-primary font-label text-xs tracking-[0.3em] uppercase hover:bg-secondary transition-colors"
            >
              Ir al inicio
            </button>
          </div>
        </div>
      )}
    </>
  );
}
