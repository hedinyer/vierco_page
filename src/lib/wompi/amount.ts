import { parsePriceToCents } from "@/lib/checkout/pricing";

/**
 * `parsePriceToCents` returns whole COP pesos (e.g. 95000 for $95.000 COP).
 * Wompi `amount_in_cents` is that value × 100 (e.g. 9500000 for $95.000 COP).
 * @see https://docs.wompi.co/docs/colombia/widget-checkout-web/#paso-5-parámetros-de-la-transacción
 */
export function copPesosToWompiAmountInCents(pesos: number): number {
  if (!Number.isFinite(pesos) || pesos <= 0) return 0;
  return Math.round(pesos * 100);
}

export function cartTotalPesos(items: Array<{ price: string; quantity: number }>): number {
  let pesos = 0;
  for (const item of items) {
    pesos += parsePriceToCents(item.price) * item.quantity;
  }
  return Math.round(pesos);
}

export function cartTotalWompiAmountInCents(
  items: Array<{ price: string; quantity: number }>
): number {
  return copPesosToWompiAmountInCents(cartTotalPesos(items));
}
