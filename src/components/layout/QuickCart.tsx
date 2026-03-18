"use client";

import { ShoppingBag, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";
import { incrementQuantity, decrementQuantity } from "@/store";

interface QuickCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickCart({ isOpen, onClose }: QuickCartProps) {
  const items = useSelector((state: RootState) => state.cart.items);
  const isEmpty = items.length === 0;
  const dispatch = useDispatch();
  const router = useRouter();

  const formatCurrency = (value: number): string => {
    const formatted = new Intl.NumberFormat("es-CO").format(value);
    return `$${formatted}`;
  };

  const totalAmount = items.reduce((sum, item) => {
    const unit = Number(item.price.replace(/[^0-9.-]+/g, "")) || 0;
    return sum + unit * item.quantity;
  }, 0);

  const handleCheckoutClick = () => {
    onClose();
    router.push("/checkout");
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-55 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed right-0 top-0 h-screen w-96 bg-surface-container-lowest z-60 border-l border-outline-variant/30 flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-8 border-b border-outline-variant/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <h2 className="font-headline text-xl italic">Carrito rápido</h2>
            </div>
            <button
              onClick={onClose}
              className="font-label text-xs tracking-widest text-on-surface-variant hover:text-primary transition-colors"
              aria-label="Cerrar carrito"
            >
              CERRAR
            </button>
          </div>
          <p className="font-label text-[10px] tracking-widest text-on-surface-variant uppercase">
            Tu selección
          </p>
        </div>
        <div className="grow p-8 flex flex-col text-sm">
          {isEmpty ? (
            <div className="flex flex-col justify-center items-center text-center opacity-40 flex-1">
              <Package className="w-12 h-12 mb-4 text-on-surface-variant" />
              <p className="text-sm">Tu galería está vacía.</p>
            </div>
          ) : (
            <div className="space-y-4 overflow-y-auto">
              {items.map((item) => {
                const unit = Number(item.price.replace(/[^0-9.-]+/g, "")) || 0;
                const lineTotal = unit * item.quantity;
                const formattedTotal = isNaN(lineTotal)
                  ? item.price
                  : formatCurrency(lineTotal);
                const formattedUnit = isNaN(unit)
                  ? item.price
                  : formatCurrency(unit);

                return (
                  <div
                    key={`${item.slug}-${item.size}`}
                    className="flex items-center gap-4 border-b border-outline-variant/20 pb-3"
                  >
                    {item.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 object-cover bg-surface-container-highest"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-label text-xs tracking-[0.16em] uppercase">
                        {item.name}
                      </p>
                      <p className="font-label text-[10px] tracking-[0.18em] text-on-surface-variant mt-1">
                        Talla {item.size}
                      </p>
                      <div className="mt-2 inline-flex items-center border border-outline-variant/40">
                        <button
                          type="button"
                          className="w-6 h-6 flex items-center justify-center text-xs font-label hover:bg-surface-container-high transition-colors"
                          onClick={() =>
                            dispatch(
                              decrementQuantity({ slug: item.slug, size: item.size })
                            )
                          }
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-[10px] font-label tracking-[0.18em]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className={`w-6 h-6 flex items-center justify-center text-xs font-label hover:bg-surface-container-high transition-colors ${
                            item.maxQuantity != null &&
                            item.quantity >= item.maxQuantity
                              ? "opacity-40 cursor-not-allowed hover:bg-transparent"
                              : ""
                          }`}
                          disabled={
                            item.maxQuantity != null &&
                            item.quantity >= item.maxQuantity
                          }
                          onClick={() => {
                            if (
                              item.maxQuantity != null &&
                              item.quantity >= item.maxQuantity
                            ) {
                              return;
                            }
                            dispatch(
                              incrementQuantity({ slug: item.slug, size: item.size })
                            );
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-label text-[10px] tracking-[0.18em] text-on-surface-variant">
                        {formattedUnit}
                      </p>
                      <p className="font-label text-xs tracking-[0.16em]">
                        {formattedTotal}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="p-8 border-t border-outline-variant/20">
          {!isEmpty && (
            <div className="flex items-baseline justify-between mb-4">
              <span className="font-label text-[10px] tracking-[0.24em] text-on-surface-variant uppercase">
                Total
              </span>
              <span className="font-headline text-lg">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          )}
          <button
            type="button"
            onClick={handleCheckoutClick}
            className="w-full bg-primary text-on-primary py-5 font-label text-xs tracking-[0.3em] hover:bg-secondary transition-all duration-500"
          >
            FINALIZAR COMPRA
          </button>
        </div>
      </aside>
    </>
  );
}
