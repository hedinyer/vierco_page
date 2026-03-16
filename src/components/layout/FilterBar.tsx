"use client";

import { useState } from "react";

const FILTERS = ["TODAS LAS SERIES", "OXFORDS", "DERBIS", "MOCASINES"];

export default function FilterBar() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="px-6 lg:px-24 py-8 flex justify-between items-end border-b border-outline-variant/20">
      <div className="flex gap-12 flex-wrap">
        {FILTERS.map((filter, i) => (
          <button
            key={filter}
            onClick={() => setActiveIndex(i)}
            className={`font-label text-[10px] tracking-widest pb-1 transition-colors ${
              activeIndex === i
                ? "border-b border-primary text-primary"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
      <span className="font-label text-[10px] tracking-widest text-on-surface-variant">
        MOSTRANDO 12 PRODUCTOS
      </span>
    </div>
  );
}
