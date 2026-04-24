import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlugFromDb } from "@/lib/products-db";
import ProductPageClient from "@/components/product/ProductPageClient";

export const revalidate = 1800;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const products = await getProductsFromDb();
    return products.map((product) => ({ slug: product.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const product = await getProductBySlugFromDb(decodedSlug);

  if (!product) {
    return {
      title: "Producto no encontrado",
      robots: { index: false, follow: false },
    };
  }

  const canonical = `https://viercocalzado.com/product/${encodeURIComponent(product.slug)}`;
  const description =
    product.description?.trim() ||
    `${product.name} de Vierco. Calzado empresarial premium para equipos corporativos en Colombia.`;

  return {
    title: `${product.name} | Calzado Empresarial`,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${product.name} | Vierco`,
      description,
      url: canonical,
      type: "website",
      locale: "es_CO",
      images: [{ url: product.image, alt: product.alt || product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Vierco`,
      description,
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const product = await getProductBySlugFromDb(decodedSlug);

  if (!product) {
    notFound();
  }

  const canonical = `https://viercocalzado.com/product/${encodeURIComponent(product.slug)}`;
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description:
      product.description ||
      `${product.name} de Vierco, calzado empresarial para equipos corporativos.`,
    image: [product.image, ...(product.gallery ?? [])],
    sku: product.ref || product.slug,
    brand: {
      "@type": "Brand",
      name: "Vierco",
    },
    offers: {
      "@type": "Offer",
      url: canonical,
      priceCurrency: "COP",
      price: Number(product.price.replace(/[^0-9]/g, "")) || 0,
      availability:
        (product.availability || "").toLowerCase().includes("sin")
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductPageClient product={product} />
    </>
  );
}
