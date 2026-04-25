import type { Metadata } from "next";
import QuotePageClient from "@/components/quotes/QuotePageClient";
import { getProductsFromDb } from "@/lib/products-db";

export const metadata: Metadata = {
  title: "Cotizaciones de Calzado Empresarial",
  description:
    "Solicita tu cotización de calzado empresarial Vierco con referencias, tallas y cantidades en un solo flujo.",
  alternates: {
    canonical: "https://viercocalzado.com/cotizaciones",
  },
};

export default async function CotizacionesPage() {
  const products = await getProductsFromDb();
  return <QuotePageClient products={products} />;
}
