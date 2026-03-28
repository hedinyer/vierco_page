"use server";

import { createServerSupabaseClient } from "@/lib/supabase-server";
import { fetchWompiTransactionById } from "@/app/actions/wompi";

export type OrderPaymentSyncResult =
  | { success: true; paymentStatus: "PAID" | "REJECTED" | "PENDING" }
  | { success: false; error: string };

function referenceMatchesOrder(reference: string | null | undefined, orderId: string): boolean {
  if (!reference) return false;
  return reference.startsWith(`vierco-${orderId}-`);
}

/**
 * Lee el estado en Wompi y actualiza `orders.status` (PENDING → PAID o REJECTED).
 * Valida `reference` y `amount_in_cents` contra el pedido.
 */
export async function applyWompiResultToOrder(
  orderId: string,
  wompiTransactionId: string
): Promise<OrderPaymentSyncResult> {
  const sb = createServerSupabaseClient();

  const { data: order, error: orderErr } = await sb
    .from("orders")
    .select("id, total_cents, status")
    .eq("id", orderId)
    .single();

  if (orderErr || !order) {
    return { success: false, error: "Pedido no encontrado." };
  }

  if (order.status === "PAID") {
    return { success: true, paymentStatus: "PAID" };
  }
  if (order.status === "REJECTED") {
    return { success: true, paymentStatus: "REJECTED" };
  }

  const txRes = await fetchWompiTransactionById(wompiTransactionId);
  if (!txRes.success) {
    return { success: false, error: txRes.error };
  }

  const tx = txRes.data;
  const wompiStatus = (tx.status ?? "").toUpperCase();

  if (wompiStatus === "PENDING") {
    return { success: true, paymentStatus: "PENDING" };
  }

  const ref = tx.reference ?? null;
  if (!referenceMatchesOrder(ref, orderId)) {
    return {
      success: false,
      error: "La transacción no corresponde a este pedido.",
    };
  }

  const amount = tx.amount_in_cents;
  if (amount == null || typeof amount !== "number") {
    return { success: false, error: "Respuesta de Wompi sin monto válido." };
  }

  const expectedWompiAmount = Math.round(order.total_cents * 100);
  if (amount !== expectedWompiAmount) {
    return {
      success: false,
      error: "El monto de la transacción no coincide con el pedido.",
    };
  }

  if (wompiStatus === "APPROVED") {
    const { error: upErr } = await sb
      .from("orders")
      .update({ status: "PAID" })
      .eq("id", orderId)
      .eq("status", "PENDING");

    if (upErr) {
      return {
        success: false,
        error:
          upErr.message +
          " (¿falta SUPABASE_SERVICE_ROLE_KEY o política UPDATE en orders?)",
      };
    }
    return { success: true, paymentStatus: "PAID" };
  }

  if (wompiStatus === "DECLINED" || wompiStatus === "VOIDED" || wompiStatus === "ERROR") {
    const { error: upErr } = await sb
      .from("orders")
      .update({ status: "REJECTED" })
      .eq("id", orderId)
      .eq("status", "PENDING");

    if (upErr) {
      return {
        success: false,
        error:
          upErr.message +
          " (¿falta SUPABASE_SERVICE_ROLE_KEY o política UPDATE en orders?)",
      };
    }
    return { success: true, paymentStatus: "REJECTED" };
  }

  return {
    success: false,
    error: `Estado de transacción no manejado: ${wompiStatus || "vacío"}`,
  };
}
