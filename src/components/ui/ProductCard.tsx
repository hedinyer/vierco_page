"use client";

import { useEffect, useState, MouseEvent } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { addItem } from "@/store";

import type { ProductSize } from "@/lib/products";

interface ProductCardProps {
  slug: string;
  name: string;
  price: string;
  image: string;
  alt: string;
  description?: string;
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

export default function ProductCard({
  slug,
  name,
  price,
  image,
  alt,
  description,
  sizes,
}: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [supportsHover, setSupportsHover] = useState(false);
  const [quickBuyOpen, setQuickBuyOpen] = useState(false);
  const dispatch = useDispatch();
  const availableSizes = getAvailableSizes(sizes);
  const isOutOfStock = availableSizes.length === 0;

  const displayPrice = price;

  useEffect(() => {
    // On touch devices, :hover doesn't work reliably—enable tap-to-open quick buy.
    if (typeof window === "undefined") return;
    const mql = window.matchMedia?.("(hover: hover) and (pointer: fine)");
    const apply = () => setSupportsHover(Boolean(mql?.matches));
    apply();
    if (!mql?.addEventListener) return;
    mql.addEventListener("change", apply);
    return () => mql.removeEventListener("change", apply);
  }, []);

  const handleSizeClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const size = e.currentTarget.dataset.size!;
    setSelectedSize(size);
  };

  const handleAddToCartClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedSize) return;
    const stockForSize =
      sizes?.find((s) => String(s.size ?? "") === String(selectedSize))?.stock ?? undefined;
    dispatch(
      addItem({
        slug,
        name,
        price,
        size: selectedSize,
        image,
        maxQuantity: stockForSize,
      })
    );
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1500);
    // Close overlay after adding on touch devices.
    if (!supportsHover) setQuickBuyOpen(false);
  };

  const productUrl = `/product/${encodeURIComponent(slug)}`;

  return (
    <div className="flex flex-col border border-outline-variant/20 rounded-lg overflow-hidden">
      {/* Image area with hover overlay */}
      <div
        className="group relative aspect-4/3 bg-[#F7F7F7] flex items-center justify-center overflow-hidden mb-4 transition-all duration-700"
        onClick={() => {
          // Allow click/tap to open quick buy on all devices (more reliable than hover-only UX).
          setQuickBuyOpen(true);
        }}
        onMouseLeave={() => {
          // On hover devices, don't "stick" the overlay open when the cursor leaves the card.
          if (supportsHover) setQuickBuyOpen(false);
        }}
      >
        {/* Clickable image link — navigates to product page. Disables pointer events on hover so overlay receives clicks */}
        <Link
          href={productUrl}
          className={`absolute inset-0 z-10 ${
            supportsHover
              ? quickBuyOpen
                ? "pointer-events-none"
                : "group-hover:pointer-events-none"
              : quickBuyOpen
              ? "pointer-events-none"
              : ""
          }`}
        >
          <img
            alt={alt}
            className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
            src={image}
          />
        </Link>

        {/* Quick-Buy Overlay — sits above the link, captures clicks on hover */}
        <div
          className={`absolute inset-0 z-20 bg-white/85 flex flex-col items-center justify-center p-6 text-center backdrop-blur-sm transition-opacity duration-500 ${
            quickBuyOpen
              ? "opacity-100 pointer-events-auto"
              : supportsHover
              ? "opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          {quickBuyOpen && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setQuickBuyOpen(false);
              }}
              className="absolute top-3 right-3 font-label text-[10px] tracking-[0.2em] text-on-surface-variant hover:text-primary transition-colors"
              aria-label="Cerrar selección de talla"
            >
              CERRAR
            </button>
          )}
          <p className="font-label text-[10px] tracking-[0.3em] mb-6">
            {isOutOfStock ? "AGOTADO" : "SELECCIONA TALLA"}
          </p>
          <div className="grid grid-cols-3 gap-2 w-full max-w-[240px]">
            {availableSizes.map((size) => (
              <button
                key={size}
                type="button"
                data-size={size}
                onClick={handleSizeClick}
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
            {addedFeedback
              ? "✓ AÑADIDO"
              : isOutOfStock
              ? "AGOTADO"
              : "AÑADIR AL CARRITO"}
          </button>
        </div>
      </div>

      {/* Product info — also links to product page */}
      <Link href={productUrl} className="mt-4 flex flex-col group/info px-4 pb-4">
        <h3 className="font-headline text-xl mb-1 group-hover/info:text-secondary transition-colors">
          {name}
        </h3>
        {description && (
          <p className="font-body text-xs text-on-surface-variant mb-2 line-clamp-2">
            {description}
          </p>
        )}
        <p className="font-label text-xs text-on-surface-variant tracking-wider">{displayPrice}</p>
      </Link>
    </div>
  );
}
