"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import type { ProductTipo } from "@/lib/products";

interface TopNavBarProps {
  onCartClick: () => void;
  selectedTipo?: ProductTipo | null;
  onTipoChange?: (tipo: ProductTipo) => void;
}

export default function TopNavBar({
  onCartClick,
  selectedTipo,
  onTipoChange,
}: TopNavBarProps) {
  const pathname = usePathname();
  const cartCount = useSelector((state: RootState) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <nav className="sticky top-[env(safe-area-inset-top)] z-50 bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant/20 px-4 py-6 sm:px-6 lg:px-12">
      <div className="relative flex items-center justify-between">
        <Link
          href="/"
          className="relative z-10 flex items-center cursor-pointer"
          aria-label="Ir al inicio"
          onClick={handleLogoClick}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo_f.png"
            alt="Vierco"
            width={115}
            height={40}
            className="block h-10 w-[115px] object-contain"
          />
        </Link>
        {onTipoChange && (
          <div
            className="hidden md:flex items-end gap-10 absolute left-1/2 -translate-x-1/2"
            style={{ marginTop: -3, marginBottom: -3 }}
          >
            <button
              type="button"
              className={`relative pb-1 font-label text-xs tracking-[0.2em] transition-colors ${
                selectedTipo === "Hombre"
                  ? "text-secondary"
                  : "text-on-surface-variant/80 hover:text-secondary"
              }`}
              onClick={() => {
                if (selectedTipo === "Hombre") return;
                onTipoChange("Hombre");
              }}
            >
              HOMBRE
              {selectedTipo === "Hombre" && (
                <span className="pointer-events-none absolute inset-x-0 -bottom-0.5 h-[2px] bg-secondary" />
              )}
            </button>
            <button
              type="button"
              className={`relative pb-1 font-label text-xs tracking-[0.2em] transition-colors ${
                selectedTipo === "Mujer"
                  ? "text-secondary"
                  : "text-on-surface-variant/80 hover:text-secondary"
              }`}
              onClick={() => {
                if (selectedTipo === "Mujer") return;
                onTipoChange("Mujer");
              }}
            >
              MUJER
              {selectedTipo === "Mujer" && (
                <span className="pointer-events-none absolute inset-x-0 -bottom-0.5 h-[2px] bg-secondary" />
              )}
            </button>
            <button
              type="button"
              className={`relative pb-1 font-label text-xs tracking-[0.2em] transition-colors ${
                selectedTipo === "Industrial"
                  ? "text-secondary"
                  : "text-on-surface-variant/80 hover:text-secondary"
              }`}
              onClick={() => {
                if (selectedTipo === "Industrial") return;
                onTipoChange("Industrial");
              }}
            >
              INDUSTRIAL
              {selectedTipo === "Industrial" && (
                <span className="pointer-events-none absolute inset-x-0 -bottom-0.5 h-[2px] bg-secondary" />
              )}
            </button>
          </div>
        )}
        <div className="flex items-center gap-6">
          <button
            onClick={onCartClick}
            className="flex items-center gap-2 group"
            aria-label="Abrir carrito"
          >
            <span className="font-label text-xs tracking-[0.2em] group-hover:text-secondary transition-colors">
              CARRITO ({cartCount})
            </span>
            <ShoppingBag className="w-5 h-5 text-primary group-hover:text-secondary transition-colors" />
          </button>
        </div>
      </div>

      {/* Mobile tipo switcher (prevents overlap with other content) */}
      {onTipoChange && (
        <div className="mt-5 md:hidden">
          <div className="grid grid-cols-3 border border-outline-variant/30 bg-surface-container-lowest">
            <button
              type="button"
              className={`py-3 font-label text-[10px] tracking-[0.22em] uppercase transition-colors ${
                selectedTipo === "Hombre"
                  ? "bg-primary text-on-primary"
                  : "text-on-surface-variant hover:text-primary"
              }`}
              onClick={() => {
                if (selectedTipo === "Hombre") return;
                onTipoChange("Hombre");
              }}
            >
              Hombre
            </button>
            <button
              type="button"
              className={`py-3 font-label text-[10px] tracking-[0.22em] uppercase transition-colors ${
                selectedTipo === "Mujer"
                  ? "bg-primary text-on-primary"
                  : "text-on-surface-variant hover:text-primary"
              }`}
              onClick={() => {
                if (selectedTipo === "Mujer") return;
                onTipoChange("Mujer");
              }}
            >
              Mujer
            </button>
            <button
              type="button"
              className={`py-3 font-label text-[10px] tracking-[0.22em] uppercase transition-colors ${
                selectedTipo === "Industrial"
                  ? "bg-primary text-on-primary"
                  : "text-on-surface-variant hover:text-primary"
              }`}
              onClick={() => {
                if (selectedTipo === "Industrial") return;
                onTipoChange("Industrial");
              }}
            >
              Industrial
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
