"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

interface TopNavBarProps {
  onCartClick: () => void;
}

export default function TopNavBar({ onCartClick }: TopNavBarProps) {
  const cartCount = useSelector((state: RootState) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  return (
    <nav className="sticky top-0 z-50 bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant/20 px-6 py-6 lg:px-12">
      <div className="relative flex items-center justify-between">
        <div className="flex items-end h-[23px] w-[399px] gap-[45px] mt-[-4px] mb-[-4px]">
          <Link href="/" className="flex items-end gap-3">
            <Image
              src="/logo_f.png"
              alt="Vierco"
              width={115}
              height={40}
              className="block h-10 w-[115px] object-contain p-0"
              style={{ marginTop: 0, marginBottom: 0 }}
              priority
            />
          </Link>
        </div>
        <div className="hidden md:flex items-end gap-8 absolute left-1/2 -translate-x-1/2" style={{ marginTop: -3, marginBottom: -3 }}>
          <a href="#" className="font-label text-xs tracking-[0.2em] hover:text-secondary transition-colors">
            CORPORATIVO
          </a>
          <a href="#" className="font-label text-xs tracking-[0.2em] hover:text-secondary transition-colors">
            INDUSTRIAL
          </a>
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
