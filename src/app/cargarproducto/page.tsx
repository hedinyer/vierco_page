"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TopNavBar from "@/components/layout/TopNavBar";
import Footer from "@/components/layout/Footer";
import {
  createProductWithRelations,
  type CreateProductPayload,
} from "@/app/actions/products";
import { supabase } from "@/lib/supabase";
import QuickCart from "@/components/layout/QuickCart";

const EMPTY_FEATURE = { title: "", description: "" };
const EMPTY_IMAGE = { url: "", alt: "" };
const DEFAULT_SIZES = ["34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44"];

export default function CargarProductoPage() {
  const router = useRouter();
  const [cartOpen, setCartOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [galleryFiles, setGalleryFiles] = useState<Array<File | null>>([
    null,
    null,
    null,
  ]);
  const [sizes, setSizes] = useState(
    DEFAULT_SIZES.map((size) => ({ size, stock: 0 }))
  );

  const [form, setForm] = useState<CreateProductPayload>({
    slug: "",
    ref: "",
    name: "",
    price: "",
    availability: "",
    description: "",
    categoria: "",
    imageUrl: "",
    altText: "",
    features: [
      { ...EMPTY_FEATURE, title: "CUMPLIMIENTO ISO" },
      { ...EMPTY_FEATURE, title: "ANTIDESLIZANTE" },
      { ...EMPTY_FEATURE, title: "MATERIAL" },
    ],
    images: [{ ...EMPTY_IMAGE }, { ...EMPTY_IMAGE }, { ...EMPTY_IMAGE }],
  });

  const handleChange = (field: keyof CreateProductPayload, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
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

  const handleImageChange = (index: number, field: "url" | "alt", value: string) => {
    setForm((prev) => {
      const images = [...prev.images];
      images[index] = { ...images[index], [field]: value };
      return { ...prev, images };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    let payload: CreateProductPayload = { ...form, sizes };

    try {
      if (imageFile) {
        setUploadingImage(true);
        const fileExt = imageFile.name.split(".").pop();
        const safeSlug = form.slug || form.name.toLowerCase().replace(/\s+/g, "-");
        const filePath = `products/${safeSlug}-${Date.now()}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from("images")
          .upload(filePath, imageFile);

        if (error || !data) {
          throw new Error("No se pudo subir la imagen al bucket");
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("images").getPublicUrl(data.path);

        payload = { ...payload, imageUrl: publicUrl };
      }

      // Subir imágenes de galería si se seleccionaron archivos
      const updatedImages = [...payload.images];
      for (let i = 0; i < galleryFiles.length; i++) {
        const file = galleryFiles[i];
        if (!file) continue;

        const fileExt = file.name.split(".").pop();
        const safeSlug = form.slug || form.name.toLowerCase().replace(/\s+/g, "-");
        const filePath = `products/gallery/${safeSlug}-g${i + 1}-${Date.now()}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from("images")
          .upload(filePath, file);

        if (error || !data) {
          throw new Error("No se pudo subir una imagen de la galería al bucket");
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("images").getPublicUrl(data.path);

        updatedImages[i] = {
          ...updatedImages[i],
          url: publicUrl,
        };
      }

      payload = { ...payload, images: updatedImages };
    } catch (err) {
      setIsSubmitting(false);
      setUploadingImage(false);
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Error al subir la imagen al bucket"
      );
      return;
    } finally {
      setUploadingImage(false);
    }

    const result = await createProductWithRelations(payload);
    setIsSubmitting(false);

    if (!result.success) {
      setSubmitError(result.error);
      return;
    }

    setSubmitSuccess("Producto creado correctamente");
    setForm((prev) => ({
      ...prev,
      slug: "",
      ref: "",
      name: "",
      price: "",
      availability: "",
      description: "",
      categoria: "",
      imageUrl: "",
      altText: "",
    }));
  };

  return (
    <div className="min-h-screen bg-background text-on-surface selection:bg-secondary selection:text-white">
      <TopNavBar onCartClick={() => setCartOpen((o) => !o)} />
      <QuickCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <main className="min-h-screen pt-[calc(88px+env(safe-area-inset-top))] pb-24 px-6 flex justify-center">
        <div className="w-full max-w-3xl">
          <header className="mb-16">
            <p className="font-label text-[10px] tracking-[0.3em] uppercase text-on-surface-variant mb-3">
              PANEL INTERNO
            </p>
            <h1 className="font-headline text-4xl md:text-5xl italic font-extralight">
              Cargar producto
            </h1>
            <p className="mt-4 font-body text-sm text-on-surface-variant max-w-xl">
              Este formulario envía los datos directamente a las tablas
              <span className="font-mono"> products</span>,
              <span className="font-mono"> product_features</span> y
              <span className="font-mono"> product_images</span> en Supabase (ver
              <span className="font-mono"> database.md</span>).
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-16">
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

            <section className="space-y-8">
              <h2 className="font-label text-xs tracking-[0.3em] uppercase">
                01 — Datos básicos
              </h2>
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
                    placeholder="Oxford Ejecutivo"
                    required
                  />
                </div>
                <div>
                  <label className="block font-label text-[10px] tracking-widest text-on-surface-variant mb-2">
                    REF
                  </label>
                  <input
                    type="text"
                    className="w-full bg-transparent border-b border-outline-variant py-3 px-0 font-body text-lg focus:border-primary transition-all"
                    value={form.ref}
                    onChange={(e) => handleChange("ref", e.target.value)}
                    placeholder="8829-X"
                  />
                </div>
              </div>
              <div>
                <label className="block font-label text-[10px] tracking-widest text-on-surface-variant mb-2">
                  DESCRIPCIÓN
                </label>
                <textarea
                  className="w-full bg-transparent border-b border-outline-variant py-3 px-0 font-body text-sm focus:border-primary transition-all min-h-[80px]"
                  value={form.description ?? ""}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Descripción larga del producto (opcional)"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block font-label text-[10px] tracking-widest text-on-surface-variant mb-2">
                    SLUG (URL)
                  </label>
                  <input
                    type="text"
                    className="w-full bg-transparent border-b border-outline-variant py-3 px-0 font-body text-lg focus:border-primary transition-all"
                    value={form.slug}
                    onChange={(e) => handleChange("slug", e.target.value)}
                    placeholder="oxford-ejecutivo"
                    required
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
                    placeholder="$450000"
                    required
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <label className="block font-label text-[10px] tracking-widest text-on-surface-variant mb-2">
                    DISPONIBILIDAD
                  </label>
                  <input
                    type="text"
                    className="w-full bg-transparent border-b border-outline-variant py-3 px-0 font-body text-lg focus:border-primary transition-all"
                    value={form.availability}
                    onChange={(e) => handleChange("availability", e.target.value)}
                    placeholder="En stock / Edición limitada"
                  />
                </div>
                <div>
                  <label className="block font-label text-[10px] tracking-widest text-on-surface-variant mb-2">
                    CATEGORÍA
                  </label>
                  <input
                    type="text"
                    className="w-full bg-transparent border-b border-outline-variant py-3 px-0 font-body text-lg focus:border-primary transition-all"
                    value={form.categoria ?? ""}
                    onChange={(e) => handleChange("categoria", e.target.value)}
                    placeholder="Ej: ZAPATO BUENO"
                  />
                </div>
                <div>
                  <label className="block font-label text-[10px] tracking-widest text-on-surface-variant mb-2">
                    TIPO
                  </label>
                  <select
                    className="w-full bg-transparent border-b border-outline-variant py-3 px-0 font-body text-sm focus:border-primary transition-all"
                    value={form.tipo ?? ""}
                    onChange={(e) => handleChange("tipo", e.target.value)}
                  >
                    <option value="">Sin tipo</option>
                    <option value="Corporativo">Corporativo</option>
                    <option value="Industrial">Industrial</option>
                  </select>
                </div>
              </div>
              <div className="space-y-4 pt-6 border-t border-outline-variant/20">
                <h3 className="font-label text-[10px] tracking-[0.3em] uppercase text-on-surface-variant">
                  TALLAS Y STOCK
                </h3>
                <p className="font-body text-xs text-on-surface-variant">
                  Define el stock disponible por talla. Si una talla queda en 0, se puede
                  interpretar como agotada.
                </p>
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
              </div>
            </section>

            <section className="space-y-8">
              <h2 className="font-label text-xs tracking-[0.3em] uppercase">
                02 — Imagen principal
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block font-label text-[10px] tracking-widest text-on-surface-variant mb-2">
                    SUBIR IMAGEN (bucket `images`)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      setImageFile(file);
                    }}
                    className="w-full text-[10px] font-label tracking-widest text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-none file:border file:border-outline-variant file:text-[10px] file:font-label file:uppercase file:tracking-[0.18em] file:bg-surface file:text-on-surface-variant hover:file:bg-surface-container transition-colors"
                  />
                  {imageFile && (
                    <p className="mt-2 font-body text-xs text-on-surface-variant">
                      Archivo seleccionado: <span className="font-mono">{imageFile.name}</span>
                    </p>
                  )}
                </div>
                <div>
                  <label className="block font-label text-[10px] tracking-widest text-on-surface-variant mb-2">
                    URL IMAGEN PRINCIPAL
                  </label>
                  <input
                    type="url"
                    className="w-full bg-transparent border-b border-outline-variant py-3 px-0 font-body text-lg focus:border-primary transition-all"
                    value={form.imageUrl}
                    onChange={(e) => handleChange("imageUrl", e.target.value)}
                    placeholder="https://..."
                    required={!imageFile}
                  />
                </div>
                <div>
                  <label className="block font-label text-[10px] tracking-widest text-on-surface-variant mb-2">
                    ALT TEXT
                  </label>
                  <input
                    type="text"
                    className="w-full bg-transparent border-b border-outline-variant py-3 px-0 font-body text-lg focus:border-primary transition-all"
                    value={form.altText}
                    onChange={(e) => handleChange("altText", e.target.value)}
                    placeholder="Oxford ejecutivo negro cuero pulido"
                    required
                  />
                </div>
              </div>
            </section>

            <section className="space-y-8">
              <h2 className="font-label text-xs tracking-[0.3em] uppercase">
                03 — Características (product_features)
              </h2>
              <div className="space-y-8">
                {form.features.map((feature, index) => (
                  <div key={index} className="space-y-3 border-b border-outline-variant/20 pb-4">
                    <div className="flex items-baseline justify-between gap-4">
                      <label className="font-label text-[10px] tracking-widest text-on-surface-variant">
                        TÍTULO #{index + 1}
                      </label>
                      <input
                        type="text"
                        className="flex-1 bg-transparent border-b border-outline-variant py-2 px-0 font-body text-sm focus:border-primary transition-all"
                        value={feature.title}
                        onChange={(e) =>
                          handleFeatureChange(index, "title", e.target.value)
                        }
                        placeholder="CUMPLIMIENTO ISO"
                      />
                    </div>
                    <textarea
                      className="w-full bg-transparent border-b border-outline-variant py-2 px-0 font-body text-sm focus:border-primary transition-all min-h-[60px]"
                      value={feature.description}
                      onChange={(e) =>
                        handleFeatureChange(index, "description", e.target.value)
                      }
                      placeholder="Descripción de la característica..."
                    />
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-8">
              <h2 className="font-label text-xs tracking-[0.3em] uppercase">
                04 — Galería (product_images)
              </h2>
              <p className="font-body text-xs text-on-surface-variant mb-2">
                Opcional. Deja vacío cualquier campo que no quieras usar.
              </p>
              <div className="space-y-6">
                {form.images.map((image, index) => (
                  <div key={index} className="space-y-3 border-b border-outline-variant/20 pb-4">
                    <label className="block font-label text-[10px] tracking-widest text-on-surface-variant">
                      IMAGEN #{index + 1}
                    </label>
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
                      className="w-full text-[10px] font-label tracking-widest text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-none file:border file:border-outline-variant file:text-[10px] file:font-label file:uppercase file:tracking-[0.18em] file:bg-surface file:text-on-surface-variant hover:file:bg-surface-container transition-colors"
                    />
                    {galleryFiles[index] && (
                      <p className="mt-1 font-body text-[11px] text-on-surface-variant">
                        Archivo seleccionado:{" "}
                        <span className="font-mono">
                          {galleryFiles[index]?.name}
                        </span>
                      </p>
                    )}
                    <input
                      type="url"
                      className="w-full bg-transparent border-b border-outline-variant py-2 px-0 font-body text-sm focus:border-primary transition-all"
                      value={image.url}
                      onChange={(e) =>
                        handleImageChange(index, "url", e.target.value)
                      }
                      placeholder="https://..."
                    />
                    <input
                      type="text"
                      className="w-full bg-transparent border-b border-outline-variant py-2 px-0 font-body text-sm focus:border-primary transition-all"
                      value={image.alt}
                      onChange={(e) =>
                        handleImageChange(index, "alt", e.target.value)
                      }
                      placeholder="Alt opcional"
                    />
                  </div>
                ))}
              </div>
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
                disabled={isSubmitting}
                className="px-10 h-[52px] bg-primary text-on-primary font-label text-[10px] tracking-[0.3em] uppercase hover:bg-secondary transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "GUARDANDO..." : "GUARDAR PRODUCTO"}
              </button>
            </section>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

