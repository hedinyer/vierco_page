"use client";

import { useEffect, useMemo, useRef } from "react";
import type { Product } from "@/lib/products";

interface FilterBarProps {
  products: Product[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

type FilterItem = {
  label: string;
  value: string | null; // null = todas
  count: number;
};

export default function FilterBar({
  products,
  selectedCategory,
  onCategoryChange,
}: FilterBarProps) {
  const filterRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const filters: FilterItem[] = useMemo(() => {
    const total = products.length;
    const countsByCategory = products.reduce<Record<string, number>>((acc, product) => {
      const raw = product.category || "";
      const key = raw.trim().toUpperCase();
      if (!key) return acc;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const categoryFilters: FilterItem[] = Object.entries(countsByCategory).map(
      ([category, count]) => ({
        label: category,
        value: category,
        count,
      })
    );

    return [
      { label: "TODAS LAS SERIES", value: null, count: total },
      ...categoryFilters,
    ];
  }, [products]);

  const activeIndex = useMemo(() => {
    const idx = filters.findIndex((f) => f.value === selectedCategory);
    return idx >= 0 ? idx : 0;
  }, [filters, selectedCategory]);

  const activeFilter = filters[activeIndex] ?? filters[0];

  useEffect(() => {
    const el = filterRefs.current[activeIndex];
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeIndex]);

  return (
    <div className="flex flex-col gap-5 border-b border-outline-variant/20 px-4 py-6 sm:flex-row sm:items-end sm:justify-between sm:gap-6 sm:px-6 sm:py-8 lg:px-24">
      <div className="hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto">
        <div className="flex flex-nowrap gap-7 whitespace-nowrap sm:gap-10">
        {filters.map((filter, i) => (
          <button
            key={filter.label}
            onClick={() => onCategoryChange(filter.value)}
            ref={(node) => {
              filterRefs.current[i] = node;
            }}
            className={`shrink-0 pb-1.5 pt-1 font-label text-[10px] tracking-widest transition-colors ${
              activeIndex === i
                ? "border-b border-primary text-primary"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            {filter.label}
            {filter.value && ` (${filter.count})`}
          </button>
        ))}
        </div>
      </div>
      <span className="font-label text-[10px] tracking-widest text-on-surface-variant text-center sm:text-left">
        {activeFilter.value
          ? `MOSTRANDO ${activeFilter.count} PRODUCTO${
              activeFilter.count === 1 ? "" : "S"
            } EN ${activeFilter.label}`
          : `MOSTRANDO ${activeFilter.count} PRODUCTO${
              activeFilter.count === 1 ? "" : "S"
            }`}
      </span>
    </div>
  );
}
