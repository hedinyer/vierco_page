"use client";

import { useEffect, useMemo, useRef, useState, MouseEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import TopNavBar from "@/components/layout/TopNavBar";
import QuickCart from "@/components/layout/QuickCart";
import Footer from "@/components/layout/Footer";
import { addItem } from "@/store";
import { tipoFromProduct, type Product, type ProductTipo } from "@/lib/products";

const ALL_SIZES = ["34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44"];

function getAvailableSizes(product: Product): string[] {
  if (!product.sizes?.length) return ALL_SIZES;
  return product.sizes
    .filter((s) => s.stock > 0)
    .map((s) => s.size)
    .sort((a, b) => ALL_SIZES.indexOf(a) - ALL_SIZES.indexOf(b));
}

export default function ProductPageClient({ product }: { product: Product }) {
  const router = useRouter();
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navTipo: ProductTipo = tipoFromProduct(product);

  const handleNavTipoChange = (tipo: ProductTipo) => {
    router.push(`/?tipo=${encodeURIComponent(tipo)}`);
  };
  const availableSizes = getAvailableSizes(product);
  const isOutOfStock = availableSizes.length === 0;

  const displayPrice = product?.price ?? "";

  const handleSizeClick = (e: MouseEvent<HTMLButtonElement>, size: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSize(size);
  };

  const handleAddToCartClick = () => {
    if (!product || !selectedSize) return;
    const stockForSize =
      product.sizes?.find((s) => String(s.size ?? "") === String(selectedSize))?.stock ??
      undefined;
    dispatch(
      addItem({
        slug: product.slug,
        name: product.name,
        price: product.price,
        size: selectedSize,
        image: product.image,
        maxQuantity: stockForSize,
      })
    );
    setCartOpen(true);
  };

  const galleryImages = useMemo(() => {
    const list = product.gallery?.length
      ? [product.image, ...product.gallery]
      : [product.image];
    return list.filter((url, i, arr) => url && arr.indexOf(url) === i);
  }, [product]);

  const desktopGalleryClass =
    galleryImages.length === 1
      ? "hidden md:grid md:grid-cols-1 md:gap-[2px]"
      : "hidden md:grid md:grid-cols-2 md:gap-[2px]";

  const [mobileSlide, setMobileSlide] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    setMobileSlide(0);
  }, [product.slug]);

  const mobileGoPrev = () => {
    if (galleryImages.length < 2) return;
    setMobileSlide(
      (i) => (i - 1 + galleryImages.length) % galleryImages.length,
    );
  };
  const mobileGoNext = () => {
    if (galleryImages.length < 2) return;
    setMobileSlide((i) => (i + 1) % galleryImages.length);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface selection:bg-secondary selection:text-white">
      <TopNavBar
        onCartClick={() => setCartOpen((o) => !o)}
        selectedTipo={navTipo}
        onTipoChange={handleNavTipoChange}
      />
      <QuickCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <main className="mx-auto flex w-full max-w-[1560px] flex-col pt-[calc(env(safe-area-inset-top)+1rem)] md:flex-row md:items-start md:gap-8 md:pt-[calc(88px+env(safe-area-inset-top))] lg:gap-10">
        {/* Galería a la izquierda (~2/3), imágenes en paralelo en desktop */}
        <section className="w-full bg-surface-container md:w-[60%] md:min-w-0 lg:w-[62%]">
          {/* Móvil: carrusel */}
          <div className="relative md:hidden">
            <div className="overflow-hidden">
              <div
                className="flex touch-manipulation transition-transform duration-300 ease-out motion-reduce:transition-none"
                style={{ transform: `translateX(-${mobileSlide * 100}%)` }}
                onTouchStart={(e) => {
                  touchStartX.current = e.touches[0]?.clientX ?? null;
                }}
                onTouchEnd={(e) => {
                  const start = touchStartX.current;
                  touchStartX.current = null;
                  if (start == null || galleryImages.length < 2) return;
                  const end = e.changedTouches[0]?.clientX;
                  if (end == null) return;
                  const d = end - start;
                  if (d > 48) mobileGoPrev();
                  else if (d < -48) mobileGoNext();
                }}
              >
                {galleryImages.map((img, i) => (
                  <div
                    key={`m-${img}-${i}`}
                    className="aspect-[4/5] max-h-[68vh] w-full min-w-full shrink-0 overflow-hidden bg-surface-container-highest"
                  >
                    <img
                      src={img}
                      alt={
                        i === 0
                          ? product.alt
                          : `${product.alt} — vista ${i + 1}`
                      }
                      className="h-full w-full object-cover object-center py-0 my-0"
                      draggable={false}
                    />
                  </div>
                ))}
              </div>
            </div>
            {galleryImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={mobileGoPrev}
                  aria-label="Foto anterior"
                  className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-outline-variant/35 bg-surface-container-lowest/95 text-primary shadow-sm backdrop-blur-sm"
                >
                  <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  onClick={mobileGoNext}
                  aria-label="Foto siguiente"
                  className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-outline-variant/35 bg-surface-container-lowest/95 text-primary shadow-sm backdrop-blur-sm"
                >
                  <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
                </button>
                <div
                  className="flex justify-center gap-2 py-3"
                  aria-label="Seleccionar foto"
                  role="tablist"
                >
                  {galleryImages.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      role="tab"
                      aria-selected={mobileSlide === i}
                      aria-label={`Foto ${i + 1} de ${galleryImages.length}`}
                      onClick={() => setMobileSlide(i)}
                      className={`h-1.5 rounded-full transition-all duration-200 ${
                        mobileSlide === i
                          ? "w-7 bg-primary"
                          : "w-1.5 bg-outline-variant"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Desktop: rejilla */}
          <div className={desktopGalleryClass}>
            {galleryImages.map((img, i) => (
              <div
                key={`d-${img}-${i}`}
                className="aspect-[4/5] w-full overflow-hidden bg-surface-container-highest"
              >
                <img
                  src={img}
                  alt={i === 0 ? product.alt : `${product.alt} — vista ${i + 1}`}
                  className="h-full w-full object-cover py-0 my-0"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Datos del producto a la derecha (~1/3) */}
        <section className="w-full md:w-[40%] md:max-w-[560px] md:flex-shrink-0 lg:w-[38%]">
          <div className="flex flex-col gap-6 px-4 pb-12 pt-6 sm:px-6 md:sticky md:top-[96px] md:gap-8 md:px-8 md:pb-16 md:pt-8 lg:px-10">
            <div>
              <span className="font-label mb-4 block text-[10px] uppercase tracking-[0.35em] text-secondary">
                Ref. No. {product.ref}
              </span>
              <h1 className="font-headline mb-3 text-[28px] leading-[1.12] text-primary sm:text-[30px] md:mb-4 md:text-[40px]">
                {product.name}
              </h1>
              <p className="font-headline text-[22px] text-primary sm:text-2xl md:text-[26px]">
                {displayPrice}
              </p>
            </div>

            <div>
              <p className="font-label mb-3 text-[10px] tracking-[0.28em] text-on-surface-variant">
                {isOutOfStock ? "AGOTADO" : "TALLA"}
              </p>
              <div className="flex flex-wrap gap-x-1.5 gap-y-2">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={(e) => handleSizeClick(e, size)}
                    className={`min-h-11 min-w-[2.75rem] px-2.5 py-2 font-label text-sm transition-colors md:text-xs ${
                      selectedSize === size
                        ? "border-b-2 border-primary text-primary"
                        : "border-b-2 border-transparent text-on-surface-variant hover:text-primary"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {product.description && (
              <p className="font-body max-w-md text-[15px] leading-relaxed text-on-surface-variant md:text-sm">
                {product.description}
              </p>
            )}

            <div className="max-w-md space-y-6">
              {product.features.map((feature) => (
                <div key={feature.title} className="border-l border-primary/20 pl-5">
                  <h3 className="font-label mb-1.5 text-[11px] uppercase tracking-widest md:text-[12px]">
                    {feature.title}
                  </h3>
                  <p className="font-body text-[15px] leading-relaxed text-on-surface-variant md:text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="sticky bottom-3 z-10 -mx-1 space-y-3 bg-background/95 px-1 py-2 backdrop-blur-sm md:static md:mx-0 md:space-y-4 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-0">
              <button
                type="button"
                onClick={handleAddToCartClick}
                disabled={!selectedSize || isOutOfStock}
                className={`min-h-12 w-full border border-primary py-3.5 font-label text-[11px] uppercase tracking-[0.22em] transition-all focus:outline-none md:py-4 md:text-xs md:tracking-[0.28em] ${
                  selectedSize && !isOutOfStock
                    ? "cursor-pointer bg-surface-container-lowest text-primary hover:bg-primary hover:text-on-primary"
                    : "cursor-not-allowed border-outline-variant bg-surface-container-high text-on-surface-variant/50"
                }`}
              >
                {isOutOfStock ? "Agotado" : "Añadir al carrito"}
              </button>
              <p className="font-label text-[10px] uppercase tracking-tighter text-on-surface-variant">
                Disponibilidad: {product.availability ?? "En stock"}
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
