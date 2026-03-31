import { notFound } from "next/navigation";
import { getProductBySlugFromDb } from "@/lib/products-db";
import ProductPageClient from "@/components/product/ProductPageClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const product = await getProductBySlugFromDb(decodedSlug);

  if (!product) {
    notFound();
  }

  return <ProductPageClient product={product} />;
}
