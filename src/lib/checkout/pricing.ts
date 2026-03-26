/**
 * Parses a price string to whole COP pesos (integer).
 * Not Wompi “centavos”: for Wompi multiply by 100 (see `cartTotalWompiAmountInCents`).
 * Handles "450000", "450.000", "$450.000".
 */
export function parsePriceToCents(priceStr: string): number {
  const digitsOnly = priceStr.replace(/\D/g, "");
  const num = Number(digitsOnly);
  return Number.isFinite(num) ? Math.round(num) : 0;
}
