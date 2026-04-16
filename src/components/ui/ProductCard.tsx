"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

interface ProductCardProps {
  slug: string;
  name: string;
  price: string;
  image: string;
  alt: string;
  gallery?: string[];
  description?: string;
}

export default function ProductCard({
  slug,
  name,
  price,
  image,
  alt,
  gallery,
  description,
}: ProductCardProps) {
  const carouselImages = useMemo(() => {
    const fromGallery = (gallery ?? []).filter(Boolean);
    const all = [image, ...fromGallery];
    return Array.from(new Set(all));
  }, [gallery, image]);
  const [imageHovered, setImageHovered] = useState(false);
  const imageIndex = imageHovered && carouselImages.length > 1 ? 1 : 0;

  const displayPrice = price;

  const productUrl = `/product/${encodeURIComponent(slug)}`;

  return (
    <article className="flex flex-col bg-background px-1 pb-4 pt-2 sm:p-4 sm:pb-6 lg:p-6 lg:pb-8">
      <Link
        href={productUrl}
        className="group relative mb-4 block aspect-[4/5] w-full overflow-hidden bg-[#f7f7f7] transition-all duration-700 sm:mb-5 lg:mb-6"
        onMouseEnter={() => setImageHovered(true)}
        onMouseLeave={() => setImageHovered(false)}
        onTouchStart={() => setImageHovered(true)}
        onTouchEnd={() => setImageHovered(false)}
        onTouchCancel={() => setImageHovered(false)}
        aria-label={`Ver ${name}`}
      >
        <div className="absolute inset-0 z-10">
          <img
            alt={alt}
            className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105 group-active:scale-105"
            src={carouselImages[imageIndex] ?? image}
          />
        </div>
      </Link>

      <Link
        href={productUrl}
        className="group/info flex flex-col items-center text-center text-[12px] sm:text-[13px]"
      >
        <h3 className="font-label text-[12px] uppercase leading-[1.35] tracking-[0.15em] text-on-surface transition-colors group-hover/info:text-secondary sm:text-[13px] sm:tracking-[0.18em]">
          {name}
        </h3>
        <p className="mt-1.5 font-label text-[12px] tracking-[0.07em] text-on-surface-variant sm:mt-2 sm:text-[13px] sm:tracking-[0.08em]">
          {displayPrice}
        </p>
      </Link>
    </article>
  );
}
