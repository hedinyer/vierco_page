"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, ChevronDown, FileText, Plus, Trash2 } from "lucide-react";
import TopNavBar from "@/components/layout/TopNavBar";
import Footer from "@/components/layout/Footer";
import type { Product } from "@/lib/products";
import Image from "next/image";

type QuoteTipo = "Hombre" | "Mujer";

interface QuotePageClientProps {
  products: Product[];
}

interface QuoteLine {
  id: string;
  tipo: QuoteTipo;
  slug: string;
  size: string;
  quantity: number;
}

interface ClientData {
  name: string;
  company: string;
  phone: string;
  email: string;
}

interface QuoteSummaryItem {
  tipo: QuoteTipo;
  ref: string;
  name: string;
  size: string;
  quantity: number;
  image: string;
  slug: string;
}

function defaultLine(): QuoteLine {
  return {
    id: crypto.randomUUID(),
    tipo: "Hombre",
    slug: "",
    size: "",
    quantity: 1,
  };
}

function normalizeTipo(value: string | undefined): QuoteTipo | null {
  const clean = (value ?? "").trim().toLowerCase();
  if (clean === "hombre") return "Hombre";
  if (clean === "mujer") return "Mujer";
  return null;
}

function formatQuoteDate() {
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date());
}

async function imageUrlToDataUrl(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const blob = await response.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("No se pudo leer la imagen"));
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export default function QuotePageClient({ products }: QuotePageClientProps) {
  const [lines, setLines] = useState<QuoteLine[]>([defaultLine()]);
  const [openReferenceId, setOpenReferenceId] = useState<string | null>(null);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showSuccessState, setShowSuccessState] = useState(false);
  const [clientData, setClientData] = useState<ClientData>({
    name: "",
    company: "",
    phone: "",
    email: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const productByTipo = useMemo(() => {
    return products.reduce<Record<QuoteTipo, Product[]>>(
      (acc, product) => {
        const tipo = normalizeTipo(product.tipo);
        if (!tipo) return acc;
        acc[tipo].push(product);
        return acc;
      },
      { Hombre: [], Mujer: [] }
    );
  }, [products]);

  const productBySlug = useMemo(() => {
    return new Map(products.map((p) => [p.slug, p]));
  }, [products]);

  const updateLine = (id: string, partial: Partial<QuoteLine>) => {
    setLines((prev) =>
      prev.map((line) => {
        if (line.id !== id) return line;
        const next = { ...line, ...partial };
        if (partial.tipo && partial.tipo !== line.tipo) {
          next.slug = "";
          next.size = "";
        }
        if (partial.slug && partial.slug !== line.slug) {
          next.size = "";
        }
        return next;
      })
    );
  };

  const addLine = () => setLines((prev) => [...prev, defaultLine()]);
  const removeLine = (id: string) =>
    setLines((prev) => (prev.length === 1 ? prev : prev.filter((line) => line.id !== id)));

  const openClientModal = () => {
    const hasValidLine = lines.some((line) => line.slug && line.size && line.quantity > 0);
    if (!hasValidLine) {
      setError("Agrega al menos una referencia con talla y cantidad.");
      return;
    }
    setError(null);
    setShowSuccessState(false);
    setShowClientModal(true);
  };

  const buildSummary = () => {
    return lines
      .filter((line) => line.slug && line.size && line.quantity > 0)
      .map((line) => {
        const product = productBySlug.get(line.slug);
        if (!product) return null;
        return {
          tipo: line.tipo,
          ref: product.ref || product.slug,
          name: product.name,
          size: line.size,
          quantity: line.quantity,
          image: product.image,
          slug: product.slug,
        } as QuoteSummaryItem;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  };

  const generateAndSend = async () => {
    if (!clientData.name.trim() || !clientData.phone.trim() || !clientData.email.trim()) {
      setError("Completa nombre, teléfono/WhatsApp y correo para continuar.");
      return;
    }

    const summary = buildSummary();
    if (summary.length === 0) {
      setError("No hay ítems válidos para cotizar.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 14;
      let y = margin;

      const summaryWithImages = await Promise.all(
        summary.map(async (item) => ({
          ...item,
          imageDataUrl: await imageUrlToDataUrl(item.image),
        }))
      );

      doc.setFillColor(36, 61, 54);
      doc.rect(0, 0, pageWidth, 34, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("COTIZACION VIERCO", margin, 14);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("Solicitud empresarial de calzado", margin, 20);
      doc.text(`Fecha: ${formatQuoteDate()}`, margin, 26);

      y = 42;
      doc.setTextColor(28, 30, 30);
      doc.setDrawColor(205, 214, 205);
      doc.setFillColor(247, 249, 247);
      doc.roundedRect(margin, y, pageWidth - margin * 2, 38, 1.5, 1.5, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("Datos del cliente", margin + 4, y + 7);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Nombre: ${clientData.name}`, margin + 4, y + 14);
      doc.text(`Empresa: ${clientData.company.trim() || "No aplica"}`, margin + 4, y + 20);
      doc.text(`Telefono / WhatsApp: ${clientData.phone}`, margin + 4, y + 26);
      doc.text(`Correo: ${clientData.email}`, margin + 4, y + 32);

      y += 48;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Productos solicitados", margin, y);
      y += 6;

      summaryWithImages.forEach((item, index) => {
        const itemHeight = 34;
        if (y + itemHeight > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }

        doc.setDrawColor(220, 225, 220);
        doc.setFillColor(252, 252, 252);
        doc.roundedRect(margin, y, pageWidth - margin * 2, itemHeight, 1.2, 1.2, "FD");

        if (item.imageDataUrl) {
          try {
            const format = item.imageDataUrl.includes("image/png") ? "PNG" : "JPEG";
            doc.addImage(item.imageDataUrl, format, margin + 2, y + 2, 30, 30);
          } catch {
            // Si la imagen no es compatible, mantenemos el documento sin romper.
          }
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10.5);
        doc.text(`${index + 1}. ${item.name}`, margin + 36, y + 8);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        doc.text(`Referencia: ${item.ref}`, margin + 36, y + 14);
        doc.text(`Linea: ${item.tipo}`, margin + 36, y + 19.5);
        doc.text(`Talla: ${item.size}`, margin + 36, y + 25);
        doc.text(`Cantidad: ${item.quantity}`, margin + 36, y + 30.5);

        y += itemHeight + 4;
      });

      doc.setFontSize(8.5);
      doc.setTextColor(110, 110, 110);
      doc.text(
        "Documento generado automaticamente desde viercocalzado.com",
        margin,
        pageHeight - 8
      );

      const fileName = `cotizacion-vierco-${Date.now()}.pdf`;
      const fileBlob = doc.output("blob");
      const fileUrl = URL.createObjectURL(fileBlob);
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(fileUrl);

      const response = await fetch("/api/quotes/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client: clientData,
          items: summary.map((item) => ({
            tipo: item.tipo,
            ref: item.ref,
            name: item.name,
            size: item.size,
            quantity: item.quantity,
            slug: item.slug,
          })),
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || "No se pudo enviar por correo");
      }

      setShowSuccessState(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "No fue posible enviar la cotización.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface selection:bg-secondary selection:text-white">
      <TopNavBar onCartClick={() => null} />
      <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-10">
        <section className="border border-outline-variant/40 bg-surface-container-lowest p-6 sm:p-8">
          <p className="font-label text-[10px] tracking-[0.26em] text-on-surface-variant uppercase">
            Cotizaciones
          </p>
          <h1 className="mt-3 font-headline text-3xl italic sm:text-4xl">
            Solicita tu cotización empresarial
          </h1>
          <p className="mt-4 max-w-3xl text-sm text-on-surface-variant">
            Selecciona referencias de calzado para hombre o mujer, define tallas y cantidades.
            Al finalizar, te pediremos tus datos para generar el PDF y enviarlo por WhatsApp a
            Vierco.
          </p>
        </section>

        <section className="mt-8 space-y-5">
          {lines.map((line, index) => {
            const availableProducts = productByTipo[line.tipo];
            const selectedProduct = productBySlug.get(line.slug);
            const sizes = selectedProduct?.sizes?.map((s) => s.size) ?? [];
            return (
              <article
                key={line.id}
                className="border border-outline-variant/30 bg-surface-container-lowest p-5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <p className="font-label text-[11px] tracking-[0.22em] uppercase text-on-surface-variant">
                    Referencia #{index + 1}
                  </p>
                  {lines.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLine(line.id)}
                      className="inline-flex items-center gap-2 text-xs text-on-surface-variant transition-colors hover:text-primary"
                    >
                      <Trash2 className="h-4 w-4" />
                      Eliminar
                    </button>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                  <label className="space-y-2 text-xs">
                    <span className="font-label tracking-[0.2em] uppercase text-on-surface-variant">
                      Línea
                    </span>
                    <select
                      className="w-full border border-outline-variant/50 bg-white px-3 py-3 text-sm outline-none focus:border-primary"
                      value={line.tipo}
                      onChange={(e) => updateLine(line.id, { tipo: e.target.value as QuoteTipo })}
                    >
                      <option value="Hombre">Hombre</option>
                      <option value="Mujer">Mujer</option>
                    </select>
                  </label>

                  <div className="space-y-2 text-xs md:col-span-2">
                    <span className="font-label tracking-[0.2em] uppercase text-on-surface-variant">
                      Referencia
                    </span>
                    <div className="relative">
                      <button
                        type="button"
                        className="flex w-full items-center justify-between border border-outline-variant/50 bg-white px-3 py-3 text-left text-sm outline-none transition-colors hover:border-primary"
                        onClick={() =>
                          setOpenReferenceId((prev) => (prev === line.id ? null : line.id))
                        }
                      >
                        {selectedProduct ? (
                          <span className="flex min-w-0 items-center gap-3">
                            <Image
                              src={selectedProduct.image}
                              alt={selectedProduct.alt || selectedProduct.name}
                              width={80}
                              height={80}
                              unoptimized
                              className="h-20 w-20 shrink-0 object-cover"
                            />
                            <span className="truncate">
                              {selectedProduct.ref ? `Ref ${selectedProduct.ref} - ` : ""}
                              {selectedProduct.name}
                            </span>
                          </span>
                        ) : (
                          <span className="text-on-surface-variant">Selecciona una referencia</span>
                        )}
                        <ChevronDown className="h-4 w-4 shrink-0 text-on-surface-variant" />
                      </button>

                      {openReferenceId === line.id && (
                        <div className="absolute z-30 mt-1 max-h-72 w-full overflow-y-auto border border-outline-variant/60 bg-white shadow-lg">
                          {availableProducts.map((product) => (
                            <button
                              key={product.slug}
                              type="button"
                              className="flex w-full items-center gap-3 border-b border-outline-variant/20 px-3 py-2 text-left text-sm transition-colors last:border-b-0 hover:bg-surface-container-highest"
                              onClick={() => {
                                updateLine(line.id, { slug: product.slug });
                                setOpenReferenceId(null);
                              }}
                            >
                              <Image
                                src={product.image}
                                alt={product.alt || product.name}
                                width={80}
                                height={80}
                                unoptimized
                                className="h-20 w-20 shrink-0 object-cover"
                              />
                              <span className="min-w-0 truncate">
                                {product.ref ? `Ref ${product.ref} - ` : ""}
                                {product.name}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <label className="space-y-2 text-xs">
                    <span className="font-label tracking-[0.2em] uppercase text-on-surface-variant">
                      Talla
                    </span>
                    <select
                      className="w-full border border-outline-variant/50 bg-white px-3 py-3 text-sm outline-none focus:border-primary disabled:opacity-60"
                      value={line.size}
                      onChange={(e) => updateLine(line.id, { size: e.target.value })}
                      disabled={!line.slug}
                    >
                      <option value="">Selecciona talla</option>
                      {sizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="mt-4 max-w-[180px]">
                  <label className="space-y-2 text-xs">
                    <span className="font-label tracking-[0.2em] uppercase text-on-surface-variant">
                      Unidades
                    </span>
                    <input
                      min={1}
                      type="number"
                      value={line.quantity}
                      onChange={(e) =>
                        updateLine(line.id, { quantity: Math.max(1, Number(e.target.value) || 1) })
                      }
                      className="w-full border border-outline-variant/50 bg-white px-3 py-3 text-sm outline-none focus:border-primary"
                    />
                  </label>
                </div>
              </article>
            );
          })}
        </section>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={addLine}
            className="inline-flex items-center gap-2 border border-outline px-5 py-3 font-label text-xs tracking-[0.2em] uppercase transition-colors hover:border-primary hover:text-primary"
          >
            <Plus className="h-4 w-4" />
            Agregar referencia
          </button>
          <button
            type="button"
            onClick={openClientModal}
            className="inline-flex items-center gap-2 bg-primary px-6 py-3 font-label text-xs tracking-[0.24em] text-on-primary uppercase transition-colors hover:bg-secondary"
          >
            <FileText className="h-4 w-4" />
            Solicitar cotización
          </button>
        </div>

        {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
      </main>
      <Footer />

      {showClientModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-xl border border-outline-variant/30 bg-surface-container-lowest p-6 sm:p-8">
            {!showSuccessState ? (
              <>
                <h2 className="font-headline text-2xl italic">Datos del cliente</h2>
                <p className="mt-2 text-sm text-on-surface-variant">
                  Usaremos esta información para generar y enviar la cotización por correo.
                </p>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Nombre del cliente"
                    className="border border-outline-variant/50 bg-white px-3 py-3 text-sm outline-none focus:border-primary sm:col-span-2"
                    value={clientData.name}
                    onChange={(e) => setClientData((prev) => ({ ...prev, name: e.target.value }))}
                  />
                  <input
                    type="text"
                    placeholder="Empresa (opcional)"
                    className="border border-outline-variant/50 bg-white px-3 py-3 text-sm outline-none focus:border-primary sm:col-span-2"
                    value={clientData.company}
                    onChange={(e) => setClientData((prev) => ({ ...prev, company: e.target.value }))}
                  />
                  <input
                    type="tel"
                    placeholder="Teléfono o WhatsApp"
                    className="border border-outline-variant/50 bg-white px-3 py-3 text-sm outline-none focus:border-primary"
                    value={clientData.phone}
                    onChange={(e) => setClientData((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                  <input
                    type="email"
                    placeholder="Correo electrónico"
                    className="border border-outline-variant/50 bg-white px-3 py-3 text-sm outline-none focus:border-primary"
                    value={clientData.email}
                    onChange={(e) => setClientData((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>

                <div className="mt-6 flex flex-wrap justify-end gap-3">
                  <button
                    type="button"
                    className="border border-outline px-4 py-2 font-label text-xs tracking-[0.2em] uppercase"
                    onClick={() => setShowClientModal(false)}
                    disabled={submitting}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="bg-primary px-5 py-2 font-label text-xs tracking-[0.2em] text-on-primary uppercase transition-colors hover:bg-secondary disabled:opacity-65"
                    onClick={generateAndSend}
                    disabled={submitting}
                  >
                    {submitting ? "Enviando..." : "Confirmar y enviar"}
                  </button>
                </div>
              </>
            ) : (
              <div className="py-8 text-center">
                <CheckCircle2 className="mx-auto h-16 w-16 text-[#2e7d32]" />
                <h3 className="mt-4 font-headline text-3xl italic">Solicitud enviada</h3>
                <p className="mx-auto mt-3 max-w-md text-sm text-on-surface-variant">
                  En breve lo contactaremos por WhatsApp y/o correo electrónico.
                </p>
                <button
                  type="button"
                  className="mt-6 bg-primary px-5 py-2 font-label text-xs tracking-[0.2em] text-on-primary uppercase transition-colors hover:bg-secondary"
                  onClick={() => {
                    setShowClientModal(false);
                    setShowSuccessState(false);
                  }}
                >
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
