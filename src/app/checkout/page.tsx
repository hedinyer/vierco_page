"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import type { RootState } from "@/store";
import { setCartItems } from "@/store";
import { createWompiCheckout } from "@/app/actions/wompi";
import TopNavBar from "@/components/layout/TopNavBar";
import QuickCart from "@/components/layout/QuickCart";
import Footer from "@/components/layout/Footer";
import WompiPaymentSection, {
  type WompiPaymentHandle,
} from "@/components/checkout/WompiPaymentSection";
import { CheckoutPaymentReturn } from "@/components/checkout/CheckoutPaymentReturn";
import { parsePriceToCents } from "@/lib/checkout/pricing";
import {
  WOMPI_PAYMENT_OPTIONS,
  type WompiPaymentMethodId,
  type WompiPaymentOption,
} from "@/lib/wompi/payment-methods";
import {
  COLOMBIA_DEPARTMENTS,
  getCitiesByDepartment,
} from "@/lib/colombia-locations";

const CHECKOUT_DRAFT_KEY = "vierco_checkout_draft_v1";
const AVAILABLE_METHODS = new Set(
  WOMPI_PAYMENT_OPTIONS.map((o) => o.id)
);

function digitCount(s: string): number {
  return s.replace(/\D/g, "").length;
}

function isValidEmail(s: string): boolean {
  const t = s.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t);
}

function FieldFilledMark({ ok }: { ok: boolean }) {
  if (!ok) return null;
  return (
    <span
      className="shrink-0 text-secondary text-lg leading-none select-none"
      aria-hidden
      title="Completo"
    >
      ✔️
    </span>
  );
}

export default function CheckoutPage() {
  const wompiRef = useRef<WompiPaymentHandle>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const [customerData, setCustomerData] = useState({
    email: "",
    fullName: "",
    phoneNumber: "",
    phoneNumberPrefix: "+57",
    legalId: "",
    legalIdType: "CC",
  });
  const [shippingAddress, setShippingAddress] = useState({
    addressLine1: "",
    city: "",
    phoneNumber: "",
    region: "",
    country: "CO",
  });
  const [paymentMethod, setPaymentMethod] =
    useState<WompiPaymentMethodId>("PSE");

  const items = useSelector((state: RootState) => state.cart.items);
  const isEmpty = items.length === 0;

  // Restore cart + form state if user comes back after cancel/failure.
  // We only restore when the cart is currently empty to avoid overwriting a new cart.
  useEffect(() => {
    if (!isEmpty) return;
    try {
      const raw = localStorage.getItem(CHECKOUT_DRAFT_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw) as {
        cartItems?: typeof items;
        customerData?: typeof customerData;
        shippingAddress?: typeof shippingAddress;
        paymentMethod?: WompiPaymentMethodId;
      };
      if (!draft?.cartItems || !Array.isArray(draft.cartItems)) return;
      dispatch(setCartItems(draft.cartItems));
      if (draft.customerData) setCustomerData(draft.customerData);
      if (draft.shippingAddress) setShippingAddress(draft.shippingAddress);
      if (draft.paymentMethod && AVAILABLE_METHODS.has(draft.paymentMethod)) {
        setPaymentMethod(draft.paymentMethod);
      } else {
        setPaymentMethod("PSE");
      }
    } catch {
      // Ignore restore errors; user will proceed normally.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEmpty]);

  const subtotal = items.reduce((sum, item) => {
    const unit = Number(item.price.replace(/[^0-9.-]+/g, "")) || 0;
    return sum + unit * item.quantity;
  }, 0);

  /** Whole COP pesos (same as `parsePriceToCents` × qty); not Wompi centavos. */
  const subtotalPesos = items.reduce(
    (sum, item) =>
      sum + parsePriceToCents(item.price) * item.quantity,
    0
  );

  const paymentGroups = useMemo(() => {
    const map = new Map<string, WompiPaymentOption[]>();
    for (const opt of WOMPI_PAYMENT_OPTIONS) {
      const list = map.get(opt.group) ?? [];
      list.push(opt);
      map.set(opt.group, list);
    }
    return Array.from(map.entries());
  }, []);

  const citiesInSelectedDepartment = useMemo(
    () => getCitiesByDepartment(shippingAddress.region),
    [shippingAddress.region]
  );

  useEffect(() => {
    if (!shippingAddress.region || !shippingAddress.city) return;
    const list = getCitiesByDepartment(shippingAddress.region);
    if (!list.includes(shippingAddress.city)) {
      setShippingAddress((p) => ({ ...p, city: "" }));
    }
  }, [shippingAddress.region, shippingAddress.city]);

  const fieldComplete = useMemo(
    () => ({
      fullName: customerData.fullName.trim().length >= 2,
      email: isValidEmail(customerData.email),
      phoneNumber: digitCount(customerData.phoneNumber) >= 10,
      legalId: customerData.legalId.trim().length >= 5,
      addressLine1: shippingAddress.addressLine1.trim().length >= 5,
      city: shippingAddress.city.trim().length > 0,
      region: shippingAddress.region.trim().length > 0,
      shippingPhone: digitCount(shippingAddress.phoneNumber) >= 10,
    }),
    [customerData, shippingAddress]
  );

  const formComplete =
    !isEmpty &&
    fieldComplete.fullName &&
    fieldComplete.email &&
    fieldComplete.phoneNumber &&
    fieldComplete.legalId &&
    fieldComplete.addressLine1 &&
    fieldComplete.city &&
    fieldComplete.region &&
    fieldComplete.shippingPhone;

  const formatCurrency = (value: number): string => {
    // Si el valor viene sin miles (ej: 50) lo interpretamos como 50.000
    const normalized = value < 1000 ? value * 1000 : value;
    const formatted = new Intl.NumberFormat("es-CO").format(normalized);
    return `$${formatted}`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isEmpty || !formComplete) return;

    const wompi = wompiRef.current;
    if (!wompi) {
      setSubmitError("Pasarela de pago no disponible.");
      return;
    }

    const { sessionId, deviceId } = wompi.getWompiSession();
    if (!sessionId) {
      setSubmitError(
        "Espera a que cargue la pasarela Wompi (fingerprint / sessionId)."
      );
      return;
    }

    if (!wompi.termsAccepted()) {
      setSubmitError(
        "Debes aceptar los términos y la autorización de datos personales de Wompi."
      );
      return;
    }

    if (paymentMethod === "PSE" && !wompi.getPseBankCode()) {
      setSubmitError("Selecciona un banco para pagar con PSE.");
      return;
    }

    if (paymentMethod === "NEQUI") {
      const n = wompi.getNequiPhone();
      if (n.length !== 10) {
        setSubmitError(
          "Ingresa un número Nequi válido (10 dígitos, sin indicativo)."
        );
        return;
      }
    }

    if (paymentMethod === "BANCOLOMBIA_BNPL" && subtotalPesos < 100_000) {
      setSubmitError(
        "BNPL Bancolombia requiere un total mínimo de $100.000 COP."
      );
      return;
    }

    if (
      paymentMethod === "SU_PLUS" &&
      (subtotalPesos < 35_000 || subtotalPesos > 5_000_000)
    ) {
      setSubmitError(
        "SU+ Pay requiere un total entre $35.000 y $5.000.000 COP."
      );
      return;
    }

    let cardToken: string | undefined;
    if (paymentMethod === "CARD") {
      const tok = await wompi.tokenizeCard();
      if (!tok) {
        setSubmitError(
          "No se pudo tokenizar la tarjeta. Revisa número, fechas y CVC."
        );
        return;
      }
      cardToken = tok;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const result = await createWompiCheckout({
      customerData: {
        email: customerData.email,
        fullName: customerData.fullName,
        phoneNumber: customerData.phoneNumber,
        phoneNumberPrefix: customerData.phoneNumberPrefix,
        legalId: customerData.legalId,
        legalIdType: customerData.legalIdType,
      },
      shippingAddress: {
        addressLine1: shippingAddress.addressLine1,
        city: shippingAddress.city,
        phoneNumber: shippingAddress.phoneNumber,
        region: shippingAddress.region,
        country: shippingAddress.country,
      },
      paymentMethod,
      items,
      sessionId,
      deviceId,
      termsAccepted: true,
      pseBankCode:
        paymentMethod === "PSE" ? wompi.getPseBankCode() : undefined,
      cardToken,
      installments:
        paymentMethod === "CARD" ? wompi.getInstallments() : undefined,
      nequiPhone:
        paymentMethod === "NEQUI" ? wompi.getNequiPhone() : undefined,
    });

    setIsSubmitting(false);

    if (result.success) {
      // Keep cart + form if the user cancels. We clear only after we confirm APPROVED on the success page.
      try {
        const wompi = wompiRef.current;
        const draft = {
          savedAt: Date.now(),
          cartItems: items,
          customerData,
          shippingAddress,
          paymentMethod,
          paymentSection: wompi
            ? {
                pseBankCode: wompi.getPseBankCode(),
                nequiPhone: wompi.getNequiPhone(),
                installments: wompi.getInstallments(),
              }
            : undefined,
        };
        localStorage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify(draft));
      } catch {
        // Best-effort persistence.
      }
      window.location.href = result.redirectUrl;
    } else {
      setSubmitError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface selection:bg-secondary selection:text-white">
      <Suspense fallback={null}>
        <CheckoutPaymentReturn />
      </Suspense>
      <TopNavBar onCartClick={() => setCartOpen((o) => !o)} />
      <QuickCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      <main className="min-h-screen">
        <div className="max-w-[600px] mx-auto my-[160px] px-6">
          {/* Editorial Header */}
          <header className="mb-24 text-center">
            <h1 className="font-headline text-6xl italic font-extralight mb-4">
              Finalizar compra
            </h1>
            <p className="font-label text-xs tracking-[0.3em] uppercase text-on-surface-variant">
              Orden de compra v1.0
            </p>
          </header>

          <form className="space-y-20" onSubmit={handleSubmit}>
            {/* Section 1: Buyer & Entity Details */}
            <section>
              <div className="flex items-baseline justify-between mb-12 border-b border-outline-variant/30 pb-4">
                <h2 className="font-label text-sm tracking-widest font-bold">
                  01 — DATOS DEL COMPRADOR
                </h2>
                <span className="font-label text-[10px] text-on-surface-variant uppercase">
                  Campos obligatorios
                </span>
              </div>
              <div className="space-y-12">
                {/* Buyer (customerData) */}
                <div className="grid grid-cols-1 gap-10">
                  <div className="relative group">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <label className="block font-label text-[10px] tracking-widest text-on-surface-variant mb-0">
                        NOMBRE COMPLETO DEL COMPRADOR
                      </label>
                      <FieldFilledMark ok={fieldComplete.fullName} />
                    </div>
                    <input
                      type="text"
                      className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant py-3 px-0 font-body text-lg focus:border-primary transition-all placeholder:text-outline-variant/50"
                      placeholder="Ej: Lola Flores"
                      value={customerData.fullName}
                      onChange={(e) =>
                        setCustomerData((prev) => ({
                          ...prev,
                          fullName: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="relative group">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <label className="block font-label text-[10px] tracking-widest text-on-surface-variant mb-0">
                        EMAIL
                      </label>
                      <FieldFilledMark ok={fieldComplete.email} />
                    </div>
                    <input
                      type="email"
                      className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant py-3 px-0 font-body text-lg focus:border-primary transition-all placeholder:text-outline-variant/50"
                      placeholder="lola@gmail.com"
                      value={customerData.email}
                      onChange={(e) =>
                        setCustomerData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="relative group">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <label className="block font-label text-[10px] tracking-widest text-on-surface-variant mb-0">
                        TELÉFONO
                      </label>
                      <FieldFilledMark ok={fieldComplete.phoneNumber} />
                    </div>
                    <input
                      type="tel"
                      className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant py-3 px-0 font-body text-lg focus:border-primary transition-all placeholder:text-outline-variant/50"
                      placeholder="3040777777"
                      value={customerData.phoneNumber}
                      onChange={(e) =>
                        setCustomerData((prev) => ({
                          ...prev,
                          phoneNumber: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="grid grid-cols-[140px,1fr] gap-4 items-end">
                    <div className="relative group">
                      <label className="block font-label text-[10px] tracking-widest text-on-surface-variant mb-2">
                        TIPO DE DOCUMENTO
                      </label>
                      <select
                        className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant py-3 px-0 font-body text-sm focus:border-primary transition-all"
                        value={customerData.legalIdType}
                        onChange={(e) =>
                          setCustomerData((prev) => ({
                            ...prev,
                            legalIdType: e.target.value,
                          }))
                        }
                      >
                        <option value="CC">CC</option>
                        <option value="NIT">NIT</option>
                        <option value="CE">CE</option>
                        <option value="PASSPORT">PASAPORTE</option>
                      </select>
                    </div>
                    <div className="relative group">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <label className="block font-label text-[10px] tracking-widest text-on-surface-variant mb-0">
                          NÚMERO DE DOCUMENTO
                        </label>
                        <FieldFilledMark ok={fieldComplete.legalId} />
                      </div>
                      <input
                        type="text"
                        className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant py-3 px-0 font-body text-lg focus:border-primary transition-all placeholder:text-outline-variant/50"
                        placeholder="123456789"
                        value={customerData.legalId}
                        onChange={(e) =>
                          setCustomerData((prev) => ({
                            ...prev,
                            legalId: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Company / entity removed per request */}

                {/* Shipping (shippingAddress) */}
                <div className="pt-8 border-t border-outline-variant/20 space-y-10">
                  <p className="font-label text-[10px] tracking-widest text-on-surface-variant uppercase">
                    DIRECCIÓN DE ENVÍO
                  </p>
                  <div className="relative group">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <label className="block font-label text-[10px] tracking-widest text-on-surface-variant mb-0">
                        DIRECCIÓN
                      </label>
                      <FieldFilledMark ok={fieldComplete.addressLine1} />
                    </div>
                    <input
                      type="text"
                      className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant py-3 px-0 font-body text-lg focus:border-primary transition-all placeholder:text-outline-variant/50"
                      placeholder="Calle 123 # 4-5"
                      value={shippingAddress.addressLine1}
                      onChange={(e) =>
                        setShippingAddress((prev) => ({
                          ...prev,
                          addressLine1: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="relative group">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <label className="block font-label text-[10px] tracking-widest text-on-surface-variant mb-0">
                          DEPARTAMENTO
                        </label>
                        <FieldFilledMark ok={fieldComplete.region} />
                      </div>
                      <select
                        className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant py-3 px-0 font-body text-sm focus:border-primary transition-all"
                        value={shippingAddress.region}
                        onChange={(e) =>
                          setShippingAddress((prev) => ({
                            ...prev,
                            region: e.target.value,
                            city: "",
                          }))
                        }
                      >
                        <option value="">Selecciona departamento</option>
                        {COLOMBIA_DEPARTMENTS.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="relative group">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <label className="block font-label text-[10px] tracking-widest text-on-surface-variant mb-0">
                          CIUDAD O MUNICIPIO
                        </label>
                        <FieldFilledMark ok={fieldComplete.city} />
                      </div>
                      <select
                        className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant py-3 px-0 font-body text-sm focus:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        value={shippingAddress.city}
                        disabled={!shippingAddress.region}
                        onChange={(e) =>
                          setShippingAddress((prev) => ({
                            ...prev,
                            city: e.target.value,
                          }))
                        }
                      >
                        <option value="">
                          {shippingAddress.region
                            ? "Selecciona ciudad o municipio"
                            : "Primero elige un departamento"}
                        </option>
                        {citiesInSelectedDepartment.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="relative group">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <label className="block font-label text-[10px] tracking-widest text-on-surface-variant mb-0">
                        TELÉFONO DE ENVÍO
                      </label>
                      <FieldFilledMark ok={fieldComplete.shippingPhone} />
                    </div>
                    <input
                      type="tel"
                      className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant py-3 px-0 font-body text-lg focus:border-primary transition-all placeholder:text-outline-variant/50"
                      placeholder="3019444444"
                      value={shippingAddress.phoneNumber}
                      onChange={(e) =>
                        setShippingAddress((prev) => ({
                          ...prev,
                          phoneNumber: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Payment Methodology */}
            <section>
              <div className="flex items-baseline justify-between mb-12 border-b border-outline-variant/30 pb-4">
                <h2 className="font-label text-sm tracking-widest font-bold">
                  02 — MÉTODO DE PAGO
                </h2>
                <span className="font-label text-[10px] text-on-surface-variant uppercase">
                  Selecciona método
                </span>
              </div>

              <div className="space-y-3">
                <label className="block font-label text-[10px] tracking-widest text-on-surface-variant">
                  MÉTODO (API WOMPI)
                </label>
                <select
                  className="w-full bg-surface-container-low border border-outline-variant/30 py-4 px-3 font-body text-sm focus:border-primary focus:outline-none"
                  value={paymentMethod}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value as WompiPaymentMethodId)
                  }
                >
                  {paymentGroups.map(([groupName, opts]) => (
                    <optgroup key={groupName} label={groupName}>
                      {opts.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <WompiPaymentSection ref={wompiRef} paymentMethod={paymentMethod} />
            </section>

            {/* Section 3: Order Summary & Action */}
            <section className="pt-12">
              <div className="mb-10 border-b border-outline-variant/30 pb-4 flex items-baseline justify-between">
                <h2 className="font-label text-sm tracking-widest font-bold">
                  03 — RESUMEN DEL PEDIDO
                </h2>
                <span className="font-label text-[10px] text-on-surface-variant uppercase">
                  {isEmpty ? "Sin productos" : `${items.length} productos`}
                </span>
              </div>

              {submitError && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-600 font-body text-sm">
                  {submitError}
                </div>
              )}
              {!isEmpty && (
                <div className="space-y-6 mb-10">
                  {items.map((item) => {
                    const unit = Number(item.price.replace(/[^0-9.-]+/g, "")) || 0;
                    const lineTotal = unit * item.quantity;
                    const formattedLineTotal = isNaN(lineTotal)
                      ? item.price
                      : formatCurrency(lineTotal);
                    const formattedUnit = isNaN(unit)
                      ? item.price
                      : formatCurrency(unit);

                    return (
                      <div
                        key={`${item.slug}-${item.size}`}
                        className="flex gap-4 border-b border-outline-variant/20 pb-4"
                      >
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover bg-surface-container-highest"
                            width={64}
                            height={64}
                            sizes="64px"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex justify-between gap-4">
                            <div>
                              <p className="font-label text-xs tracking-[0.16em] uppercase">
                                {item.name}
                              </p>
                              <p className="font-label text-[10px] tracking-[0.18em] text-on-surface-variant mt-1">
                                Talla {item.size} • Cant. {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-label text-[10px] tracking-[0.18em] text-on-surface-variant">
                                {formattedUnit}
                              </p>
                              <p className="font-label text-xs tracking-[0.16em]">
                                {formattedLineTotal}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex flex-col gap-6 mb-16">
                <div className="flex justify-between items-center">
                  <span className="font-label text-xs tracking-widest text-on-surface-variant uppercase">
                    Subtotal
                  </span>
                  <span className="font-body text-lg">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-4">
                  <span className="font-label text-xs tracking-widest text-on-surface-variant uppercase shrink-0">
                    Costo de envío
                  </span>
                  <span className="font-body text-sm sm:text-base text-on-surface-variant text-right">
                    A cargo del comprador
                  </span>
                </div>
                <div className="flex justify-between items-center pt-6 border-t border-outline-variant/20">
                  <span className="font-label text-sm tracking-widest font-bold uppercase">
                    Total del pedido
                  </span>
                  <span className="font-headline text-3xl font-bold">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
              </div>
              <button
                type="submit"
                className="w-full h-[56px] bg-primary text-on-primary font-label text-xs tracking-[0.4em] uppercase hover:bg-secondary transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isEmpty || isSubmitting || !formComplete}
              >
                {isSubmitting ? "PROCESANDO..." : "CONFIRMAR PEDIDO"}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <p className="mt-8 text-center font-label text-[10px] text-on-surface-variant tracking-widest">
                PAGO CON WOMPI • TRANSACCIÓN CIFRADA
              </p>
            </section>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

