/**
 * Métodos disponibles en POST /transactions según Wompi Colombia.
 * @see https://docs.wompi.co/docs/colombia/metodos-de-pago/
 */
export type WompiPaymentMethodId =
  | "CARD"
  | "PSE"
  | "BANCOLOMBIA_TRANSFER"
  | "NEQUI"
  | "BANCOLOMBIA_QR"
  | "BANCOLOMBIA_COLLECT"
  | "PCOL"
  | "BANCOLOMBIA_BNPL"
  | "DAVIPLATA"
  | "SU_PLUS";

export type WompiPaymentOption = {
  id: WompiPaymentMethodId;
  label: string;
  shortLabel: string;
  group: string;
  hint?: string;
};

export const WOMPI_PAYMENT_OPTIONS: WompiPaymentOption[] = [
  {
    id: "CARD",
    group: "Tarjetas",
    shortLabel: "TARJETA",
    label: "Tarjeta de crédito o débito (Visa, Mastercard, Amex)",
  },
  {
    id: "PSE",
    group: "Bancos",
    shortLabel: "PSE",
    label: "PSE — cuenta de ahorros o corriente (cualquier banco)",
  },
  {
    id: "BANCOLOMBIA_TRANSFER",
    group: "Bancos",
    shortLabel: "TRANSF. BANCOLOMBIA",
    label: "Botón de transferencia Bancolombia",
  },
  {
    id: "NEQUI",
    group: "Billeteras",
    shortLabel: "NEQUI",
    label: "Nequi — pago desde la app",
  },
  {
    id: "DAVIPLATA",
    group: "Billeteras",
    shortLabel: "DAVIPLATA",
    label: "Daviplata",
  },
];

export function getWompiPaymentOption(
  id: WompiPaymentMethodId
): WompiPaymentOption | undefined {
  return WOMPI_PAYMENT_OPTIONS.find((o) => o.id === id);
}
