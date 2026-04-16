"use client";

import { useMemo } from "react";
import { CATALOG_SECTION_ID } from "@/lib/catalog-section";
import type { Product, ProductLinea } from "@/lib/products";

interface LineaFilterBarProps {
  products: Product[];
  selectedLinea: ProductLinea | null;
  onLineaChange: (linea: ProductLinea | null) => void;
}

const ITEMS: Array<{ label: string; value: ProductLinea }> = [
  { label: "FORMAL", value: "formal" },
  { label: "TENNIS", value: "tennis" },
  { label: "SPORT", value: "sport" },
];

function categoryKey(p: Product): string {
  return (p.category || "").trim().toLowerCase();
}

/** Primer producto de la línea (orden del catálogo) para imagen de portada. */
function coverProduct(products: Product[], linea: ProductLinea): Product | null {
  return products.find((p) => categoryKey(p) === linea) ?? null;
}

export default function LineaFilterBar({
  products,
  selectedLinea,
  onLineaChange,
}: LineaFilterBarProps) {
  const counts = useMemo(() => {
    const total = products.length;
    let formal = 0;
    let tennis = 0;
    let sport = 0;
    for (const p of products) {
      const c = categoryKey(p);
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

  const activeCount = countFor(selectedLinea);
  const activeLineLabel = ITEMS.find((item) => item.value === selectedLinea)
    ?.label;

  const scrollToCatalog = () => {
    requestAnimationFrame(() => {
      document
        .getElementById(CATALOG_SECTION_ID)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const handleSelect = (value: ProductLinea | null) => {
    onLineaChange(value);
    scrollToCatalog();
  };

  return (
    <div className="border-b border-outline-variant/20">
      <div className="mx-auto w-full max-w-[1200px] px-4 pb-5 pt-6 sm:px-6 sm:pb-6 sm:pt-8 lg:px-24">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
          {ITEMS.map((item) => {
            const selected = item.value === selectedLinea;
            const count = countFor(item.value);
            const hero = coverProduct(products, item.value);
            const hasProducts = count > 0;
            const showCover = Boolean(hero?.image);

            return (
              <button
                key={item.label}
                type="button"
                aria-pressed={selected}
                onClick={() => handleSelect(item.value)}
                className={`group relative aspect-[5/6] w-full overflow-hidden bg-surface-container text-left outline-none transition-[box-shadow,opacity] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:aspect-[5/6] ${
                  selected
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                    : "ring-1 ring-outline-variant/30 hover:ring-primary/40"
                } ${!hasProducts ? "opacity-75" : ""}`}
              >
                {showCover ? (
                  <img
                    src={hero!.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                ) : (
                  <div
                    className="absolute inset-0 bg-surface-container-high"
                    aria-hidden
                  />
                )}

                <div
                  className="absolute inset-x-0 bottom-0 h-[36%] bg-gradient-to-t from-white via-white/75 to-transparent"
                  aria-hidden
                />

                <div className="absolute bottom-0 right-0 p-2.5 text-right sm:p-2.5">
                  <span className="font-body text-[11px] font-bold uppercase tracking-[0.07em] text-primary sm:text-[11px]">
                    {item.label}
                  </span>
                  <span className="mt-0.5 block font-label text-[8px] font-medium uppercase tracking-[0.09em] text-on-surface-variant sm:text-[8px]">
                    VER TODO
                    {count > 0 ? ` · ${count}` : ""}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <p className="px-4 pb-7 font-label text-[10px] tracking-widest text-on-surface-variant sm:px-6 sm:pb-8 lg:px-24">
        {selectedLinea && activeLineLabel
          ? `Mostrando ${activeCount} producto${activeCount === 1 ? "" : "s"} en ${activeLineLabel}`
          : `Mostrando ${activeCount} producto${activeCount === 1 ? "" : "s"}`}
      </p>
    </div>
  );
}
