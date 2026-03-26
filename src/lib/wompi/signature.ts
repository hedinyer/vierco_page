import { createHash } from "crypto";

/**
 * Integrity signature for Wompi transactions.
 * `amountInCents` must match the same unit as `amount_in_cents` in the API body (COP × 100).
 * @see https://docs.wompi.co/docs/colombia/widget-checkout-web/#paso-3-genera-una-firma-de-integridad
 */
export function wompiIntegritySignature(
  reference: string,
  amountInCents: number,
  currency: string,
  integritySecret: string
): string {
  const payload = `${reference}${amountInCents}${currency}${integritySecret}`;
  return createHash("sha256").update(payload, "utf8").digest("hex");
}
