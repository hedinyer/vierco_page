"use client";

import { useState, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { addItem } from "@/store";

import type { ProductSize } from "@/lib/products";

interface ProductCardProps {
  slug: string;
  name: string;
  price: string;
  image: string;
  alt: string;
  sizes?: ProductSize[];
}

const ALL_SIZES = ["34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44"];

function getAvailableSizes(sizes?: ProductSize[]): string[] {
  if (!sizes?.length) return ALL_SIZES;
  return sizes
    .filter((s) => s && s.stock > 0)
    .map((s) => String(s.size ?? ""))
    .filter(Boolean)
    .sort((a, b) => ALL_SIZES.indexOf(a) - ALL_SIZES.indexOf(b));
}

export default function ProductCard({ slug, name, price, image, alt, sizes }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const availableSizes = getAvailableSizes(sizes);
  const isOutOfStock = availableSizes.length === 0;

  const numericPrice = Number(price.replace(/[^0-9.-]+/g, "")) || 0;
  const displayPrice = isNaN(numericPrice)
    ? price
    : `$${numericPrice.toLocaleString("es-CO", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}`;

  const handleSizeClick = (e: MouseEvent<HTMLButtonElement>, size: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSize(size);
  };

  const handleAddToCartClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedSize) {
      return;
    }
    dispatch(
      addItem({
        slug,
        name,
        price,
        size: selectedSize,
        image,
      })
    );
  };

  const handleCardClick = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("[data-quick-overlay]")) return;
    router.push(`/product/${encodeURIComponent(slug)}`);
  };

  return (
    <div className="group cursor-pointer block" onClick={handleCardClick}>
      <div className="relative aspect-4/3 bg-[#F7F7F7] flex items-center justify-center overflow-hidden mb-4 transition-all duration-700">
        <img
          alt={alt}
          className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
          src={image}
        />
        {/* Quick-Buy Matrix Overlay - clics aquí no navegan, solo seleccionan talla / añaden al carrito */}
        <div
          data-quick-overlay
          className="absolute inset-0 bg-white/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center p-6 text-center backdrop-blur-sm transition-opacity duration-500"
        >
          <p className="font-label text-[10px] tracking-[0.3em] mb-6">
            {isOutOfStock ? "AGOTADO" : "SELECCIONA TALLA"}
          </p>
          <div className="grid grid-cols-3 gap-2 w-full max-w-[240px]">
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
          <button
            type="button"
            onClick={handleAddToCartClick}
            disabled={!selectedSize || isOutOfStock}
            className={`mt-8 text-[10px] font-label tracking-[0.2em] underline underline-offset-8 decoration-1 transition-colors ${
              selectedSize && !isOutOfStock
                ? "text-secondary cursor-pointer hover:text-primary"
                : "text-on-surface-variant/40 cursor-not-allowed"
            }`}
          >
            {isOutOfStock ? "AGOTADO" : "AÑADIR AL CARRITO"}
          </button>
        </div>
      </div>
      <div className="mt-4 flex flex-col">
        <h3 className="font-headline text-xl mb-1">{name}</h3>
        <p className="font-label text-xs text-on-surface-variant tracking-wider">
          {displayPrice}
        </p>
      </div>
    </div>
  );
}
