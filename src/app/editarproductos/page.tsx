"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import TopNavBar from "@/components/layout/TopNavBar";
import Footer from "@/components/layout/Footer";
import QuickCart from "@/components/layout/QuickCart";
import { supabase } from "@/lib/supabase";
import {
  getProductForEditor,
  listProductsForEditor,
  updateProductWithRelations,
  type CreateProductPayload,
} from "@/app/actions/products";

const EMPTY_FEATURE = { title: "", description: "" };
const AUTO_ALT_TEXT = "X";
const EMPTY_IMAGE = { url: "", alt: AUTO_ALT_TEXT };
const DEFAULT_SIZES = ["34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44"];

type ProductCard = {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  price_cents: number;
  categoria: string | null;
  tipo: string | null;
  availability: string | null;
};

const INITIAL_FORM: CreateProductPayload = {
  slug: "",
  ref: "",
  name: "",
  price: "",
  availability: "",
  description: "",
  categoria: "",
  imageUrl: "",
  altText: AUTO_ALT_TEXT,
  tipo: "",
  features: [{ ...EMPTY_FEATURE }, { ...EMPTY_FEATURE }, { ...EMPTY_FEATURE }],
  images: [{ ...EMPTY_IMAGE }, { ...EMPTY_IMAGE }, { ...EMPTY_IMAGE }],
  sizes: DEFAULT_SIZES.map((size) => ({ size, stock: 0 })),
};

export default function EditarProductosPage() {
  const router = useRouter();
  const [cartOpen, setCartOpen] = useState(false);
  const [products, setProducts] = useState<ProductCard[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingSelected, setLoadingSelected] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [galleryFiles, setGalleryFiles] = useState<Array<File | null>>([null, null, null]);
  const [form, setForm] = useState<CreateProductPayload>(INITIAL_FORM);
  const [sizes, setSizes] = useState(DEFAULT_SIZES.map((size) => ({ size, stock: 0 })));

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === selectedProductId) ?? null,
    [products, selectedProductId]
  );

  const getCategoriaOptions = (tipo?: string) => {
    if (tipo === "Hombre" || tipo === "Mujer") return ["Formal", "Tennis", "Sport"];
    if (tipo === "Industrial") return ["Seguridad"];
    return [];
  };

  const handleChange = (field: keyof CreateProductPayload, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTipoChange = (tipo: string) => {
    const allowedCategorias = getCategoriaOptions(tipo);
    setForm((prev) => ({
      ...prev,
      tipo,
      categoria: allowedCategorias.includes(prev.categoria ?? "") ? prev.categoria : "",
    }));
  };

  const handleFeatureChange = (
    index: number,
    field: "title" | "description",
    value: string
  ) => {
    setForm((prev) => {
      const features = [...prev.features];
      features[index] = { ...features[index], [field]: value };
      return { ...prev, features };
    });
  };

  const handleImageUrlChange = (index: number, value: string) => {
    setForm((prev) => {
      const images = [...prev.images];
      images[index] = { ...images[index], url: value, alt: AUTO_ALT_TEXT };
      return { ...prev, images };
    });
  };

  useEffect(() => {
    const loadProducts = async () => {
      setLoadingProducts(true);
      const result = await listProductsForEditor();
      setLoadingProducts(false);

      if (!result.success) {
        setSubmitError(result.error);
        return;
      }

      setProducts(result.products);
      if (result.products.length > 0) {
        setSelectedProductId(result.products[0].id);
      }
    };

    void loadProducts();
  }, []);

  useEffect(() => {
    const loadProduct = async () => {
      if (!selectedProductId) return;
      setLoadingSelected(true);
      setSubmitError(null);
      setSubmitSuccess(null);

      const result = await getProductForEditor(selectedProductId);
      setLoadingSelected(false);

      if (!result.success) {
        setSubmitError(result.error);
        return;
      }

      const nextFeatures = result.product.features.length
        ? result.product.features
        : [{ ...EMPTY_FEATURE }, { ...EMPTY_FEATURE }, { ...EMPTY_FEATURE }];
      while (nextFeatures.length < 3) nextFeatures.push({ ...EMPTY_FEATURE });

      const nextImages = result.product.images.length
        ? result.product.images
        : [{ ...EMPTY_IMAGE }, { ...EMPTY_IMAGE }, { ...EMPTY_IMAGE }];
      while (nextImages.length < 3) nextImages.push({ ...EMPTY_IMAGE });

      const normalizedSizes = DEFAULT_SIZES.map((size) => {
        const found = result.product.sizes.find((entry) => entry.size === size);
        return { size, stock: found?.stock ?? 0 };
      });

      setSizes(normalizedSizes);
      setGalleryFiles([null, null, null]);
      setImageFile(null);
      setForm({
        slug: result.product.slug,
        ref: result.product.ref,
        name: result.product.name,
        price: result.product.price,
        availability: result.product.availability,
        description: result.product.description,
        categoria: result.product.categoria,
        imageUrl: result.product.imageUrl,
        altText: AUTO_ALT_TEXT,
        tipo: result.product.tipo,
        features: nextFeatures.slice(0, 3),
        images: nextImages.slice(0, 3),
        sizes: normalizedSizes,
      });
    };

    void loadProduct();
  }, [selectedProductId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedProductId) {
      setSubmitError("Selecciona un producto para editar");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    let payload: CreateProductPayload = {
      ...form,
      altText: AUTO_ALT_TEXT,
      sizes,
      images: form.images.map((img) => ({ ...img, alt: AUTO_ALT_TEXT })),
    };

    try {
      if (imageFile) {
        setUploadingImage(true);
        const fileExt = imageFile.name.split(".").pop();
        const safeSlug = form.slug || form.name.toLowerCase().replace(/\s+/g, "-");
        const filePath = `products/${safeSlug}-${Date.now()}.${fileExt}`;

        const { data, error } = await supabase.storage.from("images").upload(filePath, imageFile);
        if (error || !data) throw new Error("No se pudo subir la imagen principal");

        const {
          data: { publicUrl },
        } = supabase.storage.from("images").getPublicUrl(data.path);
        payload = { ...payload, imageUrl: publicUrl };
      }

      const updatedImages = [...payload.images];
      for (let i = 0; i < galleryFiles.length; i++) {
        const file = galleryFiles[i];
        if (!file) continue;

        const fileExt = file.name.split(".").pop();
        const safeSlug = form.slug || form.name.toLowerCase().replace(/\s+/g, "-");
        const filePath = `products/gallery/${safeSlug}-g${i + 1}-${Date.now()}.${fileExt}`;

        const { data, error } = await supabase.storage.from("images").upload(filePath, file);
        if (error || !data) throw new Error("No se pudo subir una imagen de la galería");

        const {
          data: { publicUrl },
        } = supabase.storage.from("images").getPublicUrl(data.path);

        updatedImages[i] = {
          ...updatedImages[i],
          url: publicUrl,
          alt: AUTO_ALT_TEXT,
        };
      }

      payload = {
        ...payload,
        images: updatedImages.map((img) => ({ ...img, alt: AUTO_ALT_TEXT })),
      };
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Error al subir imágenes al bucket"
      );
      setIsSubmitting(false);
      setUploadingImage(false);
      return;
    } finally {
      setUploadingImage(false);
    }

    const result = await updateProductWithRelations(selectedProductId, payload);
    setIsSubmitting(false);

    if (!result.success) {
      setSubmitError(result.error);
      return;
    }

    setSubmitSuccess("Producto actualizado correctamente");
    setProducts((prev) =>
      prev.map((p) =>
        p.id === selectedProductId
          ? {
              ...p,
              name: payload.name,
              slug: payload.slug,
              image_url: payload.imageUrl,
              availability: payload.availability ?? null,
              categoria: payload.categoria ?? null,
              tipo: payload.tipo ?? null,
              price_cents: Number(payload.price.replace(/\D/g, "")) || p.price_cents,
            }
          : p
      )
    );
  };

  return (
    <div className="min-h-screen bg-background text-on-surface selection:bg-secondary selection:text-white">
      <TopNavBar onCartClick={() => setCartOpen((o) => !o)} />
      <QuickCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <main className="min-h-screen pt-[calc(88px+env(safe-area-inset-top))] pb-24 px-6 flex justify-center">
        <div className="w-full max-w-5xl">
          <header className="mb-12">
            <p className="font-label text-[10px] tracking-[0.3em] uppercase text-on-surface-variant mb-3">
              PANEL INTERNO
            </p>
            <h1 className="font-headline text-4xl md:text-5xl italic font-extralight">
              Editar productos
            </h1>
            <p className="mt-4 font-body text-sm text-on-surface-variant max-w-3xl">
              Selecciona un producto en las cards para editar sus datos en
              <span className="font-mono"> products</span>,
              <span className="font-mono"> product_features</span> y
              <span className="font-mono"> product_images</span>.
            </p>
          </header>

          <section className="mb-12">
            <h2 className="font-label text-xs tracking-[0.3em] uppercase mb-5">
              Productos existentes
            </h2>
            {loadingProducts ? (
              <p className="font-body text-sm text-on-surface-variant">Cargando productos...</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => setSelectedProductId(product.id)}
                    className={`text-left border p-3 transition-colors ${
                      selectedProductId === product.id
                        ? "border-primary bg-primary/5"
                        : "border-outline-variant hover:border-primary/50"
                    }`}
                  >
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      width={360}
                      height={144}
                      className="w-full h-36 object-cover mb-3 bg-surface"
                    />
                    <p className="font-label text-[10px] tracking-widest text-on-surface-variant">
                      {product.tipo || "SIN TIPO"} · {product.categoria || "SIN CATEGORÍA"}
                    </p>
                    <p className="font-body text-base mt-1">{product.name}</p>
                    <p className="font-body text-xs text-on-surface-variant mt-1">
                      {product.slug} · ${new Intl.NumberFormat("es-CO").format(product.price_cents)}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </section>

          {!selectedProduct ? (
            <p className="font-body text-sm text-on-surface-variant">
              No hay productos para editar.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-14">
              {submitError && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-500 font-body text-sm">
                  {submitError}
                </div>
              )}
              {submitSuccess && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-body text-sm">
                  {submitSuccess}
                </div>
              )}
              {loadingSelected && (
                <div className="p-4 bg-surface border border-outline-variant text-on-surface-variant font-body text-sm">
                  Cargando datos del producto...
                </div>
              )}

              <section className="space-y-8">
                <h2 className="font-label text-xs tracking-[0.3em] uppercase">01 — Datos básicos</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className="block font-label text-[10px] tracking-widest text-on-surface-variant mb-2">
                      NOMBRE
                    </label>
                    <input
                      type="text"
                      className="w-full bg-transparent border-b border-outline-variant py-3 px-0 font-body text-lg focus:border-primary transition-all"
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-label text-[10px] tracking-widest text-on-surface-variant mb-2">
                      SLUG
                    </label>
                    <input
                      type="text"
                      className="w-full bg-transparent border-b border-outline-variant py-3 px-0 font-body text-sm focus:border-primary transition-all"
                      value={form.slug}
                      onChange={(e) => handleChange("slug", e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className="block font-label text-[10px] tracking-widest text-on-surface-variant mb-2">
                      REF
                    </label>
                    <input
                      type="text"
                      className="w-full bg-transparent border-b border-outline-variant py-3 px-0 font-body text-sm focus:border-primary transition-all"
                      value={form.ref}
                      onChange={(e) => handleChange("ref", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block font-label text-[10px] tracking-widest text-on-surface-variant mb-2">
                      PRECIO (COP)
                    </label>
                    <input
                      type="text"
                      className="w-full bg-transparent border-b border-outline-variant py-3 px-0 font-body text-lg focus:border-primary transition-all"
                      value={form.price}
                      onChange={(e) => handleChange("price", e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-label text-[10px] tracking-widest text-on-surface-variant mb-2">
                    DESCRIPCIÓN
                  </label>
                  <textarea
                    className="w-full bg-transparent border-b border-outline-variant py-3 px-0 font-body text-sm focus:border-primary transition-all min-h-[90px]"
                    value={form.description ?? ""}
                    onChange={(e) => handleChange("description", e.target.value)}
                  />
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                  <div>
                    <label className="block font-label text-[10px] tracking-widest text-on-surface-variant mb-2">
                      DISPONIBILIDAD
                    </label>
                    <select
                      className="w-full bg-transparent border-b border-outline-variant py-3 px-0 font-body text-sm focus:border-primary transition-all"
                      value={form.availability}
                      onChange={(e) => handleChange("availability", e.target.value)}
                    >
                      <option value="">Selecciona disponibilidad</option>
                      <option value="En stock">En stock</option>
                      <option value="Sin stock">Sin stock</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-label text-[10px] tracking-widest text-on-surface-variant mb-2">
                      TIPO
                    </label>
                    <select
                      className="w-full bg-transparent border-b border-outline-variant py-3 px-0 font-body text-sm focus:border-primary transition-all"
                      value={form.tipo ?? ""}
                      onChange={(e) => handleTipoChange(e.target.value)}
                    >
                      <option value="">Sin tipo</option>
                      <option value="Hombre">Hombre</option>
                      <option value="Mujer">Mujer</option>
                      <option value="Industrial">Industrial</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-label text-[10px] tracking-widest text-on-surface-variant mb-2">
                      CATEGORÍA
                    </label>
                    <select
                      className="w-full bg-transparent border-b border-outline-variant py-3 px-0 font-body text-sm focus:border-primary transition-all"
                      value={form.categoria ?? ""}
                      onChange={(e) => handleChange("categoria", e.target.value)}
                      disabled={!form.tipo}
                    >
                      <option value="">
                        {!form.tipo ? "Selecciona tipo primero" : "Selecciona categoría"}
                      </option>
                      {getCategoriaOptions(form.tipo).map((categoria) => (
                        <option key={categoria} value={categoria}>
                          {categoria}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              <section className="space-y-6 pt-6 border-t border-outline-variant/20">
                <h3 className="font-label text-[10px] tracking-[0.3em] uppercase text-on-surface-variant">
                  TALLAS Y STOCK
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                  {sizes.map((entry, index) => (
                    <div key={entry.size} className="space-y-2">
                      <label className="block font-label text-[10px] tracking-widest text-on-surface-variant text-center">
                        {entry.size}
                      </label>
                      <input
                        type="number"
                        min={0}
                        className="w-full bg-transparent border-b border-outline-variant py-1 px-0 font-body text-sm text-center focus:border-primary transition-all"
                        value={entry.stock}
                        onChange={(e) => {
                          const value = Number(e.target.value.replace(/[^0-9]/g, "")) || 0;
                          setSizes((prev) => {
                            const next = [...prev];
                            next[index] = { ...next[index], stock: value };
                            return next;
                          });
                        }}
                      />
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-8">
                <h2 className="font-label text-xs tracking-[0.3em] uppercase">02 — Imagen principal</h2>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                  className="w-full text-[10px] font-label tracking-widest text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:border file:border-outline-variant file:text-[10px] file:font-label file:uppercase file:tracking-[0.18em] file:bg-surface file:text-on-surface-variant"
                />
                <input
                  type="url"
                  className="w-full bg-transparent border-b border-outline-variant py-3 px-0 font-body text-sm focus:border-primary transition-all"
                  value={form.imageUrl}
                  onChange={(e) => handleChange("imageUrl", e.target.value)}
                  placeholder="https://..."
                  required={!imageFile}
                />
              </section>

              <section className="space-y-8">
                <h2 className="font-label text-xs tracking-[0.3em] uppercase">
                  03 — Características (product_features)
                </h2>
                {form.features.map((feature, index) => (
                  <div key={index} className="space-y-3 border-b border-outline-variant/20 pb-4">
                    <input
                      type="text"
                      className="w-full bg-transparent border-b border-outline-variant py-2 px-0 font-body text-sm focus:border-primary transition-all"
                      value={feature.title}
                      onChange={(e) => handleFeatureChange(index, "title", e.target.value)}
                      placeholder={`Título #${index + 1}`}
                    />
                    <textarea
                      className="w-full bg-transparent border-b border-outline-variant py-2 px-0 font-body text-sm focus:border-primary transition-all min-h-[60px]"
                      value={feature.description}
                      onChange={(e) => handleFeatureChange(index, "description", e.target.value)}
                      placeholder="Descripción de la característica..."
                    />
                  </div>
                ))}
              </section>

              <section className="space-y-8">
                <h2 className="font-label text-xs tracking-[0.3em] uppercase">
                  04 — Galería (product_images)
                </h2>
                {form.images.map((image, index) => (
                  <div key={index} className="space-y-3 border-b border-outline-variant/20 pb-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        setGalleryFiles((prev) => {
                          const next = [...prev];
                          next[index] = file;
                          return next;
                        });
                      }}
                      className="w-full text-[10px] font-label tracking-widest text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:border file:border-outline-variant file:text-[10px] file:font-label file:uppercase file:tracking-[0.18em] file:bg-surface file:text-on-surface-variant"
                    />
                    <input
                      type="url"
                      className="w-full bg-transparent border-b border-outline-variant py-2 px-0 font-body text-sm focus:border-primary transition-all"
                      value={image.url}
                      onChange={(e) => handleImageUrlChange(index, e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                ))}
              </section>

              <section className="pt-4 border-t border-outline-variant/30 flex justify-between items-center gap-4">
                <button
                  type="button"
                  className="font-label text-[10px] tracking-[0.3em] uppercase underline underline-offset-8 text-on-surface-variant hover:text-primary transition-colors"
                  onClick={() => router.push("/")}
                >
                  VOLVER AL CATÁLOGO
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || uploadingImage || loadingSelected}
                  className="px-10 h-[52px] bg-primary text-on-primary font-label text-[10px] tracking-[0.3em] uppercase hover:bg-secondary transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "ACTUALIZANDO..." : "GUARDAR CAMBIOS"}
                </button>
              </section>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
