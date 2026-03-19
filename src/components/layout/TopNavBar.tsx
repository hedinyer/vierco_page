"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

interface TopNavBarProps {
  onCartClick: () => void;
  selectedTipo?: "Corporativo" | "Industrial" | null;
  onTipoChange?: (tipo: "Corporativo" | "Industrial" | null) => void;
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
    <nav className="sticky top-0 z-50 bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant/20 px-6 py-6 lg:px-12">
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
        <div
          className="hidden md:flex items-end gap-10 absolute left-1/2 -translate-x-1/2"
          style={{ marginTop: -3, marginBottom: -3 }}
        >
          <button
            type="button"
            className={`relative pb-1 font-label text-xs tracking-[0.2em] transition-colors ${
              selectedTipo === "Corporativo"
                ? "text-secondary"
                : "text-on-surface-variant/80 hover:text-secondary"
            }`}
            onClick={() => {
              if (selectedTipo === "Corporativo") return;
              onTipoChange?.("Corporativo");
            }}
          >
            CORPORATIVO
            {selectedTipo === "Corporativo" && (
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
              onTipoChange?.("Industrial");
            }}
          >
            INDUSTRIAL
            {selectedTipo === "Industrial" && (
              <span className="pointer-events-none absolute inset-x-0 -bottom-0.5 h-[2px] bg-secondary" />
            )}
          </button>
        </div>
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
    </nav>
  );
}
