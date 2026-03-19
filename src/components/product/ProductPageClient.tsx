"use client";

import Link from "next/link";
import { useState, MouseEvent } from "react";
import { useDispatch } from "react-redux";
import TopNavBar from "@/components/layout/TopNavBar";
import QuickCart from "@/components/layout/QuickCart";
import Footer from "@/components/layout/Footer";
import { addItem } from "@/store";
import type { Product } from "@/lib/products";

const ALL_SIZES = ["34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44"];

function getAvailableSizes(product: Product): string[] {
  if (!product.sizes?.length) return ALL_SIZES;
  return product.sizes
    .filter((s) => s.stock > 0)
    .map((s) => s.size)
    .sort((a, b) => ALL_SIZES.indexOf(a) - ALL_SIZES.indexOf(b));
}

export default function ProductPageClient({ product }: { product: Product }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const dispatch = useDispatch();
  const availableSizes = getAvailableSizes(product);
  const isOutOfStock = availableSizes.length === 0;

  const displayPrice = product?.price ?? "";

  const handleSizeClick = (e: MouseEvent<HTMLButtonElement>, size: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSize(size);
  };

  const handleAddToCartClick = () => {
    if (!product || !selectedSize) return;
    const stockForSize =
      product.sizes?.find((s) => String(s.size ?? "") === String(selectedSize))?.stock ??
      undefined;
    dispatch(
      addItem({
        slug: product.slug,
        name: product.name,
        price: product.price,
        size: selectedSize,
        image: product.image,
        maxQuantity: stockForSize,
      })
    );
    setCartOpen(true);
  };

  const galleryImages = product.gallery?.length
    ? [product.image, ...product.gallery]
    : [product.image, product.image, product.image];

  return (
    <div className="min-h-screen bg-background text-on-surface selection:bg-secondary selection:text-white">
      <TopNavBar onCartClick={() => setCartOpen((o) => !o)} />
      <QuickCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <main className="flex flex-col md:flex-row pt-[calc(88px+env(safe-area-inset-top))]">
        <section className="w-full md:w-1/2 relative px-6 md:px-16 lg:px-24">
          <div className="flex flex-col gap-10 pb-12 md:sticky md:top-[120px]">
            <div>
              <span className="font-label text-[10px] tracking-[0.4em] text-secondary uppercase mb-6 block">
                Ref. No. {product.ref}
              </span>
              <h1 className="font-headline text-[40px] md:text-[48px] leading-[1.1] text-primary max-w-md mb-12">
                {product.name}
              </h1>
              {product.description && (
                <p className="font-body text-sm text-on-surface-variant leading-relaxed max-w-md mb-8">
                  {product.description}
                </p>
              )}
              <div className="space-y-8 max-w-xs">
                {product.features.map((feature) => (
                  <div key={feature.title} className="border-l border-primary/20 pl-6">
                    <h3 className="font-label text-[13px] tracking-widest uppercase mb-2">
                      {feature.title}
                    </h3>
                    <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <p className="font-label text-[10px] tracking-[0.3em] mb-4">
                  {isOutOfStock ? "AGOTADO" : "SELECCIONA TALLA"}
                </p>
                <div className="grid grid-cols-3 gap-2 max-w-[280px]">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={(e) => handleSizeClick(e, size)}
                      className={`border py-3 text-[10px] font-label transition-colors ${
                        selectedSize === size
                          ? "bg-primary text-on-primary border-primary"
                          : "border-primary hover:bg-primary hover:text-on-primary"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <button
                type="button"
                onClick={handleAddToCartClick}
                disabled={!selectedSize || isOutOfStock}
                className={`w-full md:w-auto px-16 py-6 font-label text-xs tracking-[0.3em] uppercase transition-all focus:outline-none ${
                  selectedSize && !isOutOfStock
                    ? "bg-primary text-on-primary hover:bg-secondary cursor-pointer"
                    : "bg-surface-container-high text-on-surface-variant/60 cursor-not-allowed"
                }`}
              >
                {isOutOfStock ? "Agotado" : "Añadir al carrito"}
              </button>
              <div className="mt-4 flex gap-8 flex-wrap">
                <span className="font-headline text-2xl text-primary">
                  {displayPrice}
                </span>
                <span className="font-label text-[10px] self-center text-on-surface-variant uppercase tracking-tighter">
                  Disponibilidad: {product.availability ?? "En stock"}
                </span>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full md:w-1/2 bg-surface-container">
          <div className="flex flex-col gap-[2px]">
            {galleryImages.map((img, i) => (
              <div
                key={i}
                className="w-full aspect-4/5 bg-surface-container-highest overflow-hidden"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt={i === 0 ? product.alt : `${product.alt} - vista ${i + 1}`}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
