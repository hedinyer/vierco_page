"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";
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
  const isProductPage = pathname?.startsWith("/product/");
  const cartCount = useSelector((state: RootState) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleTipoClick = (tipo: ProductTipo) => {
    if (!onTipoChange) return;
    if (!isProductPage && selectedTipo === tipo) return;
    onTipoChange(tipo);
  };

  return (
    <nav className="sticky top-[env(safe-area-inset-top)] z-50 border-b border-white/10 bg-[#243d36] px-4 py-6 text-white sm:px-6 lg:px-12">
      <div className="relative flex items-center justify-between">
        <Link
          href="/"
          className="relative z-10 flex items-center cursor-pointer"
          aria-label="Ir al inicio"
          onClick={handleLogoClick}
        >
          <Image
            src="/logo_f.webp"
            alt="Vierco"
            width={115}
            height={40}
            className="block h-10 w-[115px] object-contain brightness-0 invert"
            priority
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
                  ? "text-white"
                  : "text-white/55 hover:text-white/90"
              }`}
              onClick={() => handleTipoClick("Hombre")}
            >
              HOMBRE
              {selectedTipo === "Hombre" && (
                <span className="pointer-events-none absolute inset-x-0 -bottom-0.5 h-[2px] bg-[#c9d5c8]" />
              )}
            </button>
            <button
              type="button"
              className={`relative pb-1 font-label text-xs tracking-[0.2em] transition-colors ${
                selectedTipo === "Mujer"
                  ? "text-white"
                  : "text-white/55 hover:text-white/90"
              }`}
              onClick={() => handleTipoClick("Mujer")}
            >
              MUJER
              {selectedTipo === "Mujer" && (
                <span className="pointer-events-none absolute inset-x-0 -bottom-0.5 h-[2px] bg-[#c9d5c8]" />
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
            <span className="font-label text-xs tracking-[0.2em] text-white/90 transition-colors group-hover:text-white">
              CARRITO ({cartCount})
            </span>
            <ShoppingBag className="h-5 w-5 text-white/90 transition-colors group-hover:text-white" />
          </button>
        </div>
      </div>

      {/* Mobile tipo switcher (prevents overlap with other content) */}
      {onTipoChange && (
        <div className="mt-5 md:hidden">
          <div className="grid grid-cols-2 border border-white/15 bg-black/15">
            <button
              type="button"
              className={`py-3 font-label text-[10px] tracking-[0.22em] uppercase transition-colors ${
                selectedTipo === "Hombre"
                  ? "bg-white/20 text-white"
                  : "text-white/60 hover:text-white"
              }`}
              onClick={() => handleTipoClick("Hombre")}
            >
              Hombre
            </button>
            <button
              type="button"
              className={`py-3 font-label text-[10px] tracking-[0.22em] uppercase transition-colors ${
                selectedTipo === "Mujer"
                  ? "bg-white/20 text-white"
                  : "text-white/60 hover:text-white"
              }`}
              onClick={() => handleTipoClick("Mujer")}
            >
              Mujer
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
