"use client";

import { useEffect, useMemo, useRef } from "react";
import type { Product, ProductLinea } from "@/lib/products";

interface LineaFilterBarProps {
  products: Product[];
  selectedLinea: ProductLinea | null;
  onLineaChange: (linea: ProductLinea | null) => void;
}

const ITEMS: Array<{ label: string; value: ProductLinea | null }> = [
  { label: "VER TODOS", value: null },
  { label: "FORMAL", value: "formal" },
  { label: "TENNIS", value: "tennis" },
  { label: "SPORT", value: "sport" },
];

export default function LineaFilterBar({
  products,
  selectedLinea,
  onLineaChange,
}: LineaFilterBarProps) {
  const filterRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const counts = useMemo(() => {
    const total = products.length;
    let formal = 0;
    let tennis = 0;
    let sport = 0;
    for (const p of products) {
      const c = (p.category || "").trim().toLowerCase();
      if (c === "formal") formal += 1;
      else if (c === "tennis") tennis += 1;
      else if (c === "sport") sport += 1;
    }
    return { total, formal, tennis, sport };
  }, [products]);

  const countFor = (value: ProductLinea | null): number => {
    if (value === null) return counts.total;
    if (value === "formal") return counts.formal;
    if (value === "tennis") return counts.tennis;
    return counts.sport;
  };

  const activeIndex = useMemo(() => {
    const idx = ITEMS.findIndex((item) => item.value === selectedLinea);
    return idx >= 0 ? idx : 0;
  }, [selectedLinea]);

  const active = ITEMS[activeIndex] ?? ITEMS[0];
  const activeCount = countFor(active.value);

  useEffect(() => {
    const el = filterRefs.current[activeIndex];
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeIndex]);

  return (
    <div className="px-4 sm:px-6 lg:px-24 py-8 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 border-b border-outline-variant/20">
      <div className="hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto">
        <div className="flex gap-10 flex-nowrap whitespace-nowrap">
          {ITEMS.map((item, i) => (
            <button
              key={item.label}
              type="button"
              onClick={() => onLineaChange(item.value)}
              ref={(node) => {
                filterRefs.current[i] = node;
              }}
              className={`shrink-0 font-label text-[10px] tracking-widest pb-1 transition-colors ${
                activeIndex === i
                  ? "border-b border-primary text-primary"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              {item.label}
              {item.value && ` (${countFor(item.value)})`}
            </button>
          ))}
        </div>
      </div>
      <span className="font-label text-[10px] tracking-widest text-on-surface-variant text-center sm:text-left">
        {active.value
          ? `MOSTRANDO ${activeCount} PRODUCTO${activeCount === 1 ? "" : "S"} EN ${active.label}`
          : `MOSTRANDO ${activeCount} PRODUCTO${activeCount === 1 ? "" : "S"}`}
      </span>
    </div>
  );
}
