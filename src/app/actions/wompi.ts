"use server";

import { headers } from "next/headers";
import {
  createOrderRecord,
  type CartItem,
  type CustomerData,
  type ShippingAddress,
} from "@/app/actions/checkout";
import type { WompiPaymentMethodId } from "@/lib/wompi/payment-methods";
import {
  cartTotalPesos,
  cartTotalWompiAmountInCents,
} from "@/lib/wompi/amount";
import { getWompiApiBaseUrl, getWompiIntegritySecret, getWompiPrivateKey } from "@/lib/wompi/config";
import { wompiIntegritySignature } from "@/lib/wompi/signature";

export type { WompiPaymentMethodId } from "@/lib/wompi/payment-methods";

export type WompiMerchantAcceptance = {
  termsPermalink: string;
  personalDataPermalink: string;
};

export type PseInstitution = {
  name: string;
  code: string;
};

export type WompiCheckoutResult =
  | { success: true; orderId: string; redirectUrl: string }
  | { success: false; error: string };

function getPublicKey(): string | null {
  const k = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY;
  return k && k.length > 0 ? k : null;
}

function isSandboxPublicKey(): boolean {
  const k = getPublicKey();
  return k?.startsWith("pub_test_") ?? false;
}

async function getRequestBaseUrl(): Promise<string> {
  const env = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (env) return env;
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  if (host) return `${proto}://${host}`;
  return "http://localhost:3000";
}

async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "127.0.0.1";
  }
  return h.get("x-real-ip") ?? "127.0.0.1";
}

function buildPhoneForWompi(prefix: string, phone: string): string {
  const p = prefix.replace(/\D/g, "") || "57";
  const digits = phone.replace(/\D/g, "");
  return `${p}${digits}`;
}

function splitFullName(fullName: string): { name: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { name: "Cliente", lastName: "Cliente" };
  if (parts.length === 1) return { name: parts[0], lastName: parts[0] };
  return { name: parts[0], lastName: parts.slice(1).join(" ") };
}

/** yyyymmdd in America/Bogota (PSE reference_two). */
function colombiaDateYYYYMMDD(): string {
  const d = new Date();
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Bogota",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);
  const y = parts.find((p) => p.type === "year")?.value ?? "1970";
  const m = parts.find((p) => p.type === "month")?.value ?? "01";
  const day = parts.find((p) => p.type === "day")?.value ?? "01";
  return `${y}${m}${day}`;
}

function formatWompiTransactionError(status: number, json: unknown): string {
  const j = json as {
    error?: {
      type?: string;
      reason?: string;
      messages?: Record<string, string[] | string> | string[];
    };
  };
  const err = j.error;
  if (!err) return `Wompi respondió ${status}`;
  if (err.reason) return err.reason;
  const msgs = err.messages;
  if (Array.isArray(msgs)) return msgs.filter(Boolean).join(", ");
  if (msgs && typeof msgs === "object") {
    const parts: string[] = [];
    for (const [k, v] of Object.entries(msgs)) {
      const arr = Array.isArray(v) ? v : [String(v)];
      for (const m of arr) parts.push(`${k}: ${m}`);
    }
    if (parts.length > 0) return parts.join(" ");
  }
  return `Wompi respondió ${status}`;
}

export async function fetchWompiMerchantAcceptance(): Promise<
  WompiMerchantAcceptance | { error: string }
> {
  const pub = getPublicKey();
  if (!pub) {
    return { error: "Falta NEXT_PUBLIC_WOMPI_PUBLIC_KEY" };
  }
  const base = getWompiApiBaseUrl();
  const url = `${base}/merchants/${encodeURIComponent(pub)}`;
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${pub}` },
      cache: "no-store",
    });
    if (!res.ok) {
      return { error: "No se pudieron cargar los términos de Wompi" };
    }
    const json = (await res.json()) as {
      data?: {
        presigned_acceptance?: { permalink?: string };
        presigned_personal_data_auth?: { permalink?: string };
      };
    };
    const terms = json.data?.presigned_acceptance?.permalink;
    const personal = json.data?.presigned_personal_data_auth?.permalink;
    if (!terms || !personal) {
      return { error: "Respuesta de comercio Wompi incompleta" };
    }
    return { termsPermalink: terms, personalDataPermalink: personal };
  } catch {
    return { error: "Error de red al contactar Wompi" };
  }
}

export async function fetchPseFinancialInstitutions(): Promise<
  PseInstitution[] | { error: string }
> {
  const pub = getPublicKey();
  if (!pub) {
    return { error: "Falta NEXT_PUBLIC_WOMPI_PUBLIC_KEY" };
  }
  const base = getWompiApiBaseUrl();
  try {
    const res = await fetch(`${base}/pse/financial_institutions`, {
      headers: { Authorization: `Bearer ${pub}` },
      cache: "no-store",
    });
    if (!res.ok) {
      return { error: "No se pudo cargar la lista de bancos PSE" };
    }
    const json = (await res.json()) as {
      data?: Array<{
        financial_institution_code?: string;
        financial_institution_name?: string;
        code?: string;
        name?: string;
      }>;
    };
    const list = json.data ?? [];
    return list
      .map((b) => ({
        code:
          b.financial_institution_code ?? b.code ?? "",
        name:
          b.financial_institution_name ?? b.name ?? "",
      }))
      .filter(
        (b) =>
          b.code.length > 0 &&
          b.name.length > 0 &&
          b.code !== "0"
      );
  } catch {
    return { error: "Error de red al cargar bancos PSE" };
  }
}

async function fetchMerchantTokens(): Promise<
  | {
      acceptanceToken: string;
      acceptPersonalAuth: string;
    }
  | { error: string }
> {
  const pub = getPublicKey();
  if (!pub) {
    return { error: "Falta NEXT_PUBLIC_WOMPI_PUBLIC_KEY" };
  }
  const base = getWompiApiBaseUrl();
  const url = `${base}/merchants/${encodeURIComponent(pub)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${pub}` },
    cache: "no-store",
  });
  if (!res.ok) {
    return { error: "No se pudieron obtener tokens de aceptación" };
  }
  const json = (await res.json()) as {
    data?: {
      presigned_acceptance?: { acceptance_token?: string };
      presigned_personal_data_auth?: { acceptance_token?: string };
    };
  };
  const a = json.data?.presigned_acceptance?.acceptance_token;
  const p = json.data?.presigned_personal_data_auth?.acceptance_token;
  if (!a || !p) {
    return { error: "Tokens de aceptación inválidos" };
  }
  return { acceptanceToken: a, acceptPersonalAuth: p };
}

type TxExtra = {
  async_payment_url?: string;
  url?: string;
  business_agreement_code?: string;
  qr_image?: string;
};

async function resolveTransactionRedirect(
  txId: string,
  privateKey: string,
  base: string,
  method: WompiPaymentMethodId,
  successUrl: string
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  for (let i = 0; i < 75; i++) {
    const res = await fetch(`${base}/transactions/${encodeURIComponent(txId)}`, {
      headers: { Authorization: `Bearer ${privateKey}` },
      cache: "no-store",
    });
    if (!res.ok) {
      return { ok: false, error: "No se pudo consultar la transacción en Wompi" };
    }
    const json = (await res.json()) as {
      data?: {
        status?: string;
        status_message?: string | null;
        payment_method?: { extra?: TxExtra };
      };
    };
    const data = json.data;
    const extra = data?.payment_method?.extra;
    const entryUrl = extra?.async_payment_url ?? extra?.url;
    if (entryUrl) {
      return { ok: true, url: entryUrl };
    }

    const status = data?.status;
    if (method === "CARD" || method === "NEQUI") {
      if (status === "APPROVED") {
        return { ok: true, url: successUrl };
      }
      if (status === "DECLINED" || status === "ERROR") {
        return {
          ok: false,
          error: data?.status_message ?? "Pago rechazado o con error",
        };
      }
    }

    if (method === "BANCOLOMBIA_COLLECT" && extra?.business_agreement_code) {
      return {
        ok: true,
        url: `${successUrl}&wompi_tx=${encodeURIComponent(txId)}&collect=1`,
      };
    }

    if (method === "BANCOLOMBIA_QR" && extra?.qr_image) {
      return {
        ok: true,
        url: `${successUrl}&wompi_tx=${encodeURIComponent(txId)}&qr=1`,
      };
    }

    await new Promise((r) => setTimeout(r, 400));
  }

  if (method === "CARD" || method === "NEQUI") {
    return { ok: true, url: successUrl };
  }

  return {
    ok: false,
    error:
      "Tiempo de espera agotado: no se obtuvo URL de pago ni estado final. Reintenta.",
  };
}

export async function createWompiCheckout(params: {
  customerData: CustomerData;
  shippingAddress: ShippingAddress;
  paymentMethod: WompiPaymentMethodId;
  items: CartItem[];
  sessionId: string;
  deviceId?: string;
  termsAccepted: boolean;
  pseBankCode?: string;
  cardToken?: string;
  installments?: number;
  /** Nequi: 10 dígitos sin indicativo */
  nequiPhone?: string;
}): Promise<WompiCheckoutResult> {
  const privateKey = getWompiPrivateKey();
  const integritySecret = getWompiIntegritySecret();
  const pub = getPublicKey();

  if (!privateKey || !integritySecret || !pub) {
    return {
      success: false,
      error:
        "Configuración Wompi incompleta. Define WOMPI_PRIVATE_KEY, WOMPI_INTEGRITY_SECRET y NEXT_PUBLIC_WOMPI_PUBLIC_KEY.",
    };
  }

  if (!params.termsAccepted) {
    return { success: false, error: "Debes aceptar los términos y la autorización de datos personales." };
  }

  if (!params.sessionId?.trim()) {
    return { success: false, error: "Espera a que cargue la pasarela Wompi (sessionId)." };
  }

  const orderResult = await createOrderRecord(
    params.customerData,
    params.shippingAddress,
    params.paymentMethod,
    params.items
  );

  if (!orderResult.success) {
    return { success: false, error: orderResult.error };
  }

  const orderId = orderResult.orderId;
  const base = getWompiApiBaseUrl();
  const baseUrl = await getRequestBaseUrl();
  const clientIp = await getClientIp();
  const redirectUrl = `${baseUrl}/checkout/success?order=${encodeURIComponent(orderId)}`;

  const tokens = await fetchMerchantTokens();
  if ("error" in tokens) {
    return { success: false, error: tokens.error };
  }

  const subtotalPesos = cartTotalPesos(params.items);
  const amountInCents = cartTotalWompiAmountInCents(params.items);
  if (amountInCents <= 0 || subtotalPesos <= 0) {
    return { success: false, error: "El monto del pedido no es válido." };
  }

  if (params.paymentMethod === "BANCOLOMBIA_BNPL" && subtotalPesos < 100_000) {
    return {
      success: false,
      error: "BNPL Bancolombia requiere un monto mínimo de $100.000 COP.",
    };
  }

  if (params.paymentMethod === "SU_PLUS") {
    if (subtotalPesos < 35_000) {
      return {
        success: false,
        error: "SU+ Pay requiere un monto mínimo de $35.000 COP.",
      };
    }
    if (subtotalPesos > 5_000_000) {
      return {
        success: false,
        error: "SU+ Pay admite montos hasta $5.000.000 COP.",
      };
    }
  }

  const reference = `vierco-${orderId}-${Date.now()}`;
  const signature = wompiIntegritySignature(
    reference,
    amountInCents,
    "COP",
    integritySecret
  );

  const phone = buildPhoneForWompi(
    params.customerData.phoneNumberPrefix,
    params.customerData.phoneNumber
  );

  const customerDataPayload: Record<string, string> = {
    full_name: params.customerData.fullName,
    phone_number: phone.startsWith("+") ? phone : `+${phone}`,
  };
  if (params.deviceId) {
    customerDataPayload.device_id = params.deviceId;
  }

  const desc = `Pedido Vierco ${orderId}`.slice(0, 64);
  const descShort = `Pedido Vierco ${orderId}`.slice(0, 30);
  const { name: bnplName, lastName: bnplLast } = splitFullName(params.customerData.fullName);
  const phoneDigits = params.customerData.phoneNumber.replace(/\D/g, "");
  const bnplPhone = phoneDigits.slice(-10) || "3000000000";

  let payment_method: Record<string, unknown>;
  let payment_method_type: string;

  switch (params.paymentMethod) {
    case "PSE": {
      if (!params.pseBankCode) {
        return { success: false, error: "Selecciona un banco para PSE." };
      }
      payment_method_type = "PSE";
      payment_method = {
        type: "PSE",
        user_type: 0,
        user_legal_id_type: params.customerData.legalIdType,
        user_legal_id: params.customerData.legalId.replace(/\D/g, ""),
        financial_institution_code: params.pseBankCode,
        payment_description: desc,
        reference_one: clientIp,
        reference_two: colombiaDateYYYYMMDD(),
        reference_three: params.customerData.legalId.replace(/\D/g, ""),
      };
      break;
    }
    case "CARD": {
      if (!params.cardToken) {
        return { success: false, error: "Tokeniza la tarjeta antes de continuar." };
      }
      payment_method_type = "CARD";
      payment_method = {
        type: "CARD",
        token: params.cardToken,
        installments: params.installments && params.installments > 0 ? params.installments : 1,
      };
      break;
    }
    case "BANCOLOMBIA_TRANSFER": {
      payment_method_type = "BANCOLOMBIA_TRANSFER";
      payment_method = {
        type: "BANCOLOMBIA_TRANSFER",
        user_type: "PERSON",
        payment_description: desc,
        ecommerce_url: redirectUrl,
      };
      break;
    }
    case "NEQUI": {
      const n = params.nequiPhone?.replace(/\D/g, "") ?? "";
      if (n.length !== 10) {
        return { success: false, error: "Ingresa un número Nequi válido (10 dígitos)." };
      }
      payment_method_type = "NEQUI";
      payment_method = {
        type: "NEQUI",
        phone_number: n,
      };
      break;
    }
    case "BANCOLOMBIA_QR": {
      payment_method_type = "BANCOLOMBIA_QR";
      payment_method = {
        type: "BANCOLOMBIA_QR",
        payment_description: desc,
        ...(isSandboxPublicKey()
          ? { sandbox_status: "APPROVED" as const }
          : {}),
      };
      break;
    }
    case "BANCOLOMBIA_COLLECT": {
      payment_method_type = "BANCOLOMBIA_COLLECT";
      payment_method = { type: "BANCOLOMBIA_COLLECT" };
      break;
    }
    case "PCOL": {
      payment_method_type = "PCOL";
      payment_method = {
        type: "PCOL",
        ...(isSandboxPublicKey()
          ? { sandbox_status: "APPROVED_ONLY_POINTS" as const }
          : {}),
      };
      break;
    }
    case "BANCOLOMBIA_BNPL": {
      payment_method_type = "BANCOLOMBIA_BNPL";
      payment_method = {
        type: "BANCOLOMBIA_BNPL",
        name: bnplName.slice(0, 40),
        last_name: bnplLast.slice(0, 40),
        user_legal_id_type: params.customerData.legalIdType,
        user_legal_id: params.customerData.legalId.replace(/\D/g, ""),
        phone_number: bnplPhone,
        phone_code: "+57",
        redirect_url: redirectUrl,
        payment_description: descShort,
      };
      break;
    }
    case "DAVIPLATA": {
      payment_method_type = "DAVIPLATA";
      payment_method = {
        type: "DAVIPLATA",
        user_legal_id: params.customerData.legalId.replace(/\D/g, ""),
        user_legal_id_type: params.customerData.legalIdType,
        payment_description: descShort,
      };
      break;
    }
    case "SU_PLUS": {
      payment_method_type = "SU_PLUS";
      payment_method = {
        type: "SU_PLUS",
        user_legal_id_type: params.customerData.legalIdType,
        user_legal_id: params.customerData.legalId.replace(/\D/g, ""),
      };
      break;
    }
    default: {
      const _exhaustive: never = params.paymentMethod;
      return { success: false, error: `Método no soportado: ${_exhaustive}` };
    }
  }

  const body: Record<string, unknown> = {
    acceptance_token: tokens.acceptanceToken,
    accept_personal_auth: tokens.acceptPersonalAuth,
    amount_in_cents: amountInCents,
    currency: "COP",
    customer_email: params.customerData.email,
    reference,
    signature,
    session_id: params.sessionId,
    customer_data: customerDataPayload,
    payment_method,
    payment_method_type,
    redirect_url: redirectUrl,
    ip: clientIp,
  };

  const txRes = await fetch(`${base}/transactions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${privateKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const txJson = (await txRes.json()) as {
    error?: {
      reason?: string;
      messages?: Record<string, string[] | string> | string[];
    };
    data?: {
      id?: string;
      payment_method?: { extra?: TxExtra };
    };
  };

  if (!txRes.ok) {
    return {
      success: false,
      error: formatWompiTransactionError(txRes.status, txJson),
    };
  }

  const txId = txJson.data?.id;
  if (!txId) {
    return { success: false, error: "Wompi no devolvió id de transacción" };
  }

  const extra = txJson.data?.payment_method?.extra;
  let redirectUrlFinal = extra?.async_payment_url ?? extra?.url ?? null;

  if (!redirectUrlFinal) {
    const resolved = await resolveTransactionRedirect(
      txId,
      privateKey,
      base,
      params.paymentMethod,
      redirectUrl
    );
    if (!resolved.ok) {
      return { success: false, error: resolved.error };
    }
    redirectUrlFinal = resolved.url;
  }

  return { success: true, orderId, redirectUrl: redirectUrlFinal };
}

export async function fetchWompiTransactionStatus(
  transactionId: string
): Promise<
  | { success: true; status: string | null; statusMessage?: string | null }
  | { success: false; error: string }
> {
  const pub = getPublicKey();
  if (!pub) {
    return { success: false, error: "Falta NEXT_PUBLIC_WOMPI_PUBLIC_KEY" };
  }

  const base = getWompiApiBaseUrl();
  try {
    const res = await fetch(`${base}/transactions/${encodeURIComponent(transactionId)}`, {
      headers: { Authorization: `Bearer ${pub}` },
      cache: "no-store",
    });
    if (!res.ok) {
      return {
        success: false,
        error: `No se pudo consultar la transacción (${res.status})`,
      };
    }

    const json = (await res.json()) as {
      data?: {
        status?: string;
        status_message?: string | null;
        statusMessage?: string | null;
      };
    };

    const status = json.data?.status ?? null;
    const statusMessage = json.data?.status_message ?? json.data?.statusMessage ?? null;

    return { success: true, status, statusMessage };
  } catch {
    return { success: false, error: "Error de red al consultar la transacción" };
  }
}
