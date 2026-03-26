"use client";

import Script from "next/script";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  useCallback,
} from "react";
import {
  fetchPseFinancialInstitutions,
  fetchWompiMerchantAcceptance,
} from "@/app/actions/wompi";
import { getWompiBaseUrlPublic } from "@/lib/wompi/public";
import type { PseInstitution } from "@/app/actions/wompi";
import type { WompiPaymentMethodId } from "@/lib/wompi/payment-methods";
import { getWompiPaymentOption } from "@/lib/wompi/payment-methods";

export type WompiPaymentHandle = {
  getWompiSession: () => { sessionId: string | null; deviceId?: string };
  termsAccepted: () => boolean;
  getPseBankCode: () => string;
  getInstallments: () => number;
  getNequiPhone: () => string;
  tokenizeCard: () => Promise<string | null>;
};

type Props = {
  paymentMethod: WompiPaymentMethodId;
};

const WompiPaymentSection = forwardRef<WompiPaymentHandle, Props>(
  function WompiPaymentSection({ paymentMethod }, ref) {
    const CHECKOUT_DRAFT_KEY = "vierco_checkout_draft_v1";
    const publicKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY ?? "";
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [deviceId, setDeviceId] = useState<string | undefined>();
    const [wompiInitError, setWompiInitError] = useState<string | null>(null);

    const [termsPermalink, setTermsPermalink] = useState<string | null>(null);
    const [personalPermalink, setPersonalPermalink] = useState<string | null>(
      null
    );
    const [acceptEndUser, setAcceptEndUser] = useState(false);
    const [acceptPersonal, setAcceptPersonal] = useState(false);

    const [banks, setBanks] = useState<PseInstitution[]>([]);
    const [banksError, setBanksError] = useState<string | null>(null);
    const [pseBankCode, setPseBankCode] = useState("");

    const [nequiPhone, setNequiPhone] = useState("");

    const [cardNumber, setCardNumber] = useState("");
    const [cardCvc, setCardCvc] = useState("");
    const [cardExpMonth, setCardExpMonth] = useState("");
    const [cardExpYear, setCardExpYear] = useState("");
    const [cardHolder, setCardHolder] = useState("");
    const [installments, setInstallments] = useState(1);

    const option = getWompiPaymentOption(paymentMethod);

    // Restore only non-sensitive fields (e.g. PSE bank selection, Nequi phone, installments).
    useEffect(() => {
      try {
        const raw = localStorage.getItem(CHECKOUT_DRAFT_KEY);
        if (!raw) return;
        const draft = JSON.parse(raw) as {
          paymentSection?: {
            pseBankCode?: string;
            nequiPhone?: string;
            installments?: number;
          };
        };
        const ps = draft.paymentSection;
        if (paymentMethod === "PSE" && typeof ps?.pseBankCode === "string") {
          setPseBankCode(ps.pseBankCode);
        }
        if (paymentMethod === "NEQUI" && typeof ps?.nequiPhone === "string") {
          setNequiPhone(ps.nequiPhone);
        }
        if (paymentMethod === "CARD" && typeof ps?.installments === "number") {
          setInstallments(ps.installments);
        }
      } catch {
        // Ignore restore errors.
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paymentMethod]);
    const fingerprintStartedRef = useRef(false);
    const fingerprintSuccessRef = useRef(false);
    const prevPublicKeyRef = useRef<string | undefined>(undefined);

    const initWompiFingerprint = useCallback(() => {
      if (typeof window === "undefined" || fingerprintStartedRef.current) {
        return;
      }
      if (!window.$wompi?.initialize) {
        return;
      }
      fingerprintStartedRef.current = true;

      window.$wompi.initialize((data, error) => {
        if (error != null) {
          fingerprintStartedRef.current = false;
          setWompiInitError("No se pudo inicializar Wompi (fingerprint)");
          return;
        }
        try {
          const sid = data?.sessionId?.trim();
          if (!sid) {
            fingerprintStartedRef.current = false;
            setWompiInitError(
              "Wompi no devolvió sessionId. Revisa la llave pública y la consola del navegador."
            );
            return;
          }
          const dev =
            data?.deviceData?.deviceID ?? data?.deviceData?.deviceId ?? undefined;
          fingerprintSuccessRef.current = true;
          setSessionId(sid);
          setDeviceId(dev);
          setWompiInitError(null);
        } catch {
          fingerprintStartedRef.current = false;
          setWompiInitError("Error al leer la respuesta de Wompi JS.");
        }
      });
    }, []);

    /**
     * `Script` onLoad a veces corre antes de que el global exista; en SPA el script puede
     * ya estar en caché y onLoad no repetirse. Reintentamos hasta ver `$wompi`.
     */
    useEffect(() => {
      if (!publicKey) return;

      const keyChanged = prevPublicKeyRef.current !== publicKey;
      prevPublicKeyRef.current = publicKey;
      if (keyChanged) {
        fingerprintStartedRef.current = false;
        fingerprintSuccessRef.current = false;
        setSessionId(null);
        setDeviceId(undefined);
      }

      let cancelled = false;
      let attempts = 0;
      const maxAttempts = 600;

      const tick = () => {
        if (cancelled) return;
        if (typeof window !== "undefined" && window.$wompi?.initialize) {
          initWompiFingerprint();
          return;
        }
        attempts += 1;
        if (attempts < maxAttempts) {
          window.setTimeout(tick, 50);
        } else if (!cancelled && !fingerprintSuccessRef.current) {
          setWompiInitError(
            "No se cargó Wompi JS (fingerprint). Comprueba tu red, desactiva bloqueadores de anuncios y recarga la página."
          );
        }
      };

      tick();
      return () => {
        cancelled = true;
      };
    }, [publicKey, initWompiFingerprint]);

    useEffect(() => {
      let cancelled = false;
      (async () => {
        const res = await fetchWompiMerchantAcceptance();
        if (cancelled) return;
        if ("error" in res) {
          setTermsPermalink(null);
          setPersonalPermalink(null);
          return;
        }
        setTermsPermalink(res.termsPermalink);
        setPersonalPermalink(res.personalDataPermalink);
      })();
      return () => {
        cancelled = true;
      };
    }, []);

    useEffect(() => {
      if (paymentMethod !== "PSE") return;
      let cancelled = false;
      (async () => {
        const res = await fetchPseFinancialInstitutions();
        if (cancelled) return;
        if ("error" in res) {
          setBanksError(res.error);
          setBanks([]);
          return;
        }
        setBanksError(null);
        setBanks(res);
      })();
      return () => {
        cancelled = true;
      };
    }, [paymentMethod]);

    useImperativeHandle(ref, () => ({
      getWompiSession: () => ({ sessionId, deviceId }),
      termsAccepted: () => acceptEndUser && acceptPersonal,
      getPseBankCode: () => pseBankCode,
      getInstallments: () => installments,
      getNequiPhone: () => nequiPhone.replace(/\D/g, ""),
      tokenizeCard: async () => {
        const base = getWompiBaseUrlPublic();
        const number = cardNumber.replace(/\s/g, "");
        const expMonth = cardExpMonth.padStart(2, "0");
        const expYear = cardExpYear.replace(/\D/g, "").slice(-2);
        if (!number || !cardCvc || !expMonth || !expYear || !cardHolder.trim()) {
          return null;
        }
        const res = await fetch(`${base}/tokens/cards`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${publicKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            number,
            cvc: cardCvc,
            exp_month: expMonth,
            exp_year: expYear,
            card_holder: cardHolder.trim(),
          }),
        });
        const json = (await res.json()) as {
          data?: { id?: string };
          error?: { reason?: string };
        };
        if (!res.ok) {
          return null;
        }
        return json.data?.id ?? null;
      },
    }));

    if (!publicKey) {
      return (
        <div className="mt-6 p-4 border border-outline-variant/40 text-sm text-red-600">
          Falta{" "}
          <code className="font-mono text-xs">NEXT_PUBLIC_WOMPI_PUBLIC_KEY</code>{" "}
          en el entorno.
        </div>
      );
    }

    return (
      <>
        <Script
          id="wompi-js-lib"
          src="https://wompijs.wompi.com/libs/js/v1.js"
          strategy="afterInteractive"
          data-public-key={publicKey}
          onLoad={() => initWompiFingerprint()}
          onError={() =>
            setWompiInitError(
              "No se pudo descargar el script de Wompi. Revisa firewall o bloqueadores."
            )
          }
        />

        <div className="mt-8 space-y-6">
          <p className="font-label text-[10px] tracking-widest text-on-surface-variant uppercase">
            Pasarela Wompi
          </p>
          <p className="font-body text-xs text-on-surface-variant">
            Métodos según la{" "}
            <a
              href="https://docs.wompi.co/docs/colombia/metodos-de-pago/"
              className="underline text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              API de métodos de pago
            </a>{" "}
            de Wompi (Colombia). Incluye fingerprinting antifraude.
          </p>

          {option?.hint && (
            <p className="font-body text-xs text-primary/90 italic border-l-2 border-primary pl-3">
              {option.hint}
            </p>
          )}

          {!sessionId && !wompiInitError && (
            <p className="font-body text-xs text-on-surface-variant italic">
              Inicializando seguridad Wompi…
            </p>
          )}
          {wompiInitError && (
            <p className="font-body text-xs text-red-600">{wompiInitError}</p>
          )}
          {sessionId && (
            <p className="font-label text-[10px] text-primary">
              Sesión Wompi lista
            </p>
          )}

          {termsPermalink && personalPermalink && (
            <div className="space-y-3 pt-2 border-t border-outline-variant/20">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={acceptEndUser}
                  onChange={(e) => setAcceptEndUser(e.target.checked)}
                />
                <span className="font-body text-xs leading-relaxed">
                  Acepto los{" "}
                  <a
                    href={termsPermalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-primary"
                  >
                    términos y condiciones
                  </a>{" "}
                  de Wompi para usuarios finales.
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={acceptPersonal}
                  onChange={(e) => setAcceptPersonal(e.target.checked)}
                />
                <span className="font-body text-xs leading-relaxed">
                  Autorizo el{" "}
                  <a
                    href={personalPermalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-primary"
                  >
                    tratamiento de datos personales
                  </a>{" "}
                  según la política de Wompi.
                </span>
              </label>
            </div>
          )}

          {paymentMethod === "PSE" && (
            <div className="space-y-2 pt-2">
              <label className="block font-label text-[10px] tracking-widest text-on-surface-variant mb-1">
                BANCO PSE
              </label>
              {banksError && (
                <p className="text-xs text-red-600">{banksError}</p>
              )}
              <select
                className="w-full bg-transparent border border-outline-variant py-3 px-2 font-body text-sm focus:border-primary"
                value={pseBankCode}
                onChange={(e) => setPseBankCode(e.target.value)}
              >
                <option value="">Selecciona tu banco</option>
                {banks.map((b) => (
                  <option key={b.code} value={b.code}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {paymentMethod === "CARD" && (
            <div className="space-y-4 pt-2 border-t border-outline-variant/20">
              <p className="font-body text-xs text-on-surface-variant">
                Datos de tarjeta se envían solo a Wompi para obtener un token;
                no los almacenamos en nuestro servidor.
              </p>
              <div className="relative group">
                <label className="block font-label text-[10px] tracking-widest text-on-surface-variant mb-2">
                  TITULAR DE LA TARJETA
                </label>
                <input
                  type="text"
                  autoComplete="cc-name"
                  className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant py-3 px-0 font-body text-lg focus:border-primary"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                />
              </div>
              <div className="relative group">
                <label className="block font-label text-[10px] tracking-widest text-on-surface-variant mb-2">
                  NÚMERO DE TARJETA
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant py-3 px-0 font-body text-lg focus:border-primary"
                  value={cardNumber}
                  onChange={(e) =>
                    setCardNumber(e.target.value.replace(/[^\d\s]/g, ""))
                  }
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-label text-[10px] text-on-surface-variant mb-1">
                    MES
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={2}
                    className="w-full bg-transparent border-b border-outline-variant py-2 font-body text-sm"
                    placeholder="MM"
                    value={cardExpMonth}
                    onChange={(e) =>
                      setCardExpMonth(e.target.value.replace(/\D/g, "").slice(0, 2))
                    }
                  />
                </div>
                <div>
                  <label className="block font-label text-[10px] text-on-surface-variant mb-1">
                    AÑO
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={2}
                    className="w-full bg-transparent border-b border-outline-variant py-2 font-body text-sm"
                    placeholder="AA"
                    value={cardExpYear}
                    onChange={(e) =>
                      setCardExpYear(e.target.value.replace(/\D/g, "").slice(0, 2))
                    }
                  />
                </div>
                <div>
                  <label className="block font-label text-[10px] text-on-surface-variant mb-1">
                    CVC
                  </label>
                  <input
                    type="password"
                    autoComplete="cc-csc"
                    className="w-full bg-transparent border-b border-outline-variant py-2 font-body text-sm"
                    value={cardCvc}
                    onChange={(e) =>
                      setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 4))
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block font-label text-[10px] text-on-surface-variant mb-1">
                  CUOTAS
                </label>
                <select
                  className="w-full bg-transparent border border-outline-variant py-2 px-2 font-body text-sm"
                  value={installments}
                  onChange={(e) => setInstallments(Number(e.target.value))}
                >
                  {[1, 2, 3, 6, 12, 24, 36].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {paymentMethod === "NEQUI" && (
            <div className="space-y-2 pt-2 border-t border-outline-variant/20">
              <label className="block font-label text-[10px] tracking-widest text-on-surface-variant mb-1">
                NÚMERO NEQUI (10 DÍGITOS)
              </label>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                className="w-full bg-transparent border border-outline-variant py-3 px-2 font-body text-lg focus:border-primary"
                placeholder="3001234567"
                value={nequiPhone}
                onChange={(e) =>
                  setNequiPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
              />
              <p className="font-body text-xs text-on-surface-variant">
                Debe ser el celular registrado en Nequi. Recibirás la solicitud
                en la app para aceptar o rechazar.
              </p>
            </div>
          )}

          {paymentMethod === "BANCOLOMBIA_TRANSFER" && (
            <div className="pt-2 border-t border-outline-variant/20">
              <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                Serás redirigido al flujo de transferencia Bancolombia (Wompi)
                para completar el pago desde tu cuenta de ahorros o corriente.
              </p>
            </div>
          )}

          {paymentMethod === "BANCOLOMBIA_QR" && (
            <div className="pt-2 border-t border-outline-variant/20">
              <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                Tras confirmar, se generará un código QR para pagar con la app
                del banco (Bancolombia a la mano, Nequi u otras cuentas
                habilitadas). Solo personas naturales.
              </p>
            </div>
          )}

          {paymentMethod === "BANCOLOMBIA_COLLECT" && (
            <div className="pt-2 border-t border-outline-variant/20">
              <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                Recibirás convenio e intención de pago para pagar en efectivo en
                un corresponsal Bancolombia.
              </p>
            </div>
          )}

          {paymentMethod === "PCOL" && (
            <div className="pt-2 border-t border-outline-variant/20">
              <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                Redirección a Puntos Colombia para redimir puntos o combinar con
                otro medio de pago según el flujo de Wompi.
              </p>
            </div>
          )}

          {paymentMethod === "BANCOLOMBIA_BNPL" && (
            <div className="pt-2 border-t border-outline-variant/20">
              <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                Se usarán nombre, documento y teléfono del formulario para la
                experiencia BNPL (4 cuotas sin intereses, mínimo $100.000).
              </p>
            </div>
          )}

          {paymentMethod === "DAVIPLATA" && (
            <div className="pt-2 border-t border-outline-variant/20">
              <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                Se usará tu tipo y número de documento del formulario. Wompi
                puede enviarte un OTP por SMS para confirmar en la app Daviplata.
              </p>
            </div>
          )}

          {paymentMethod === "SU_PLUS" && (
            <div className="pt-2 border-t border-outline-variant/20">
              <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                Se usará tu documento del formulario. En la experiencia SU+ podrás
                elegir cuotas y confirmar con OTP.
              </p>
            </div>
          )}
        </div>
      </>
    );
  }
);

export default WompiPaymentSection;
