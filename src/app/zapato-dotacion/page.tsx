import Link from "next/link";
import { seoCities } from "@/lib/seo-cities";

export const metadata = {
  title: "Calzado de Dotacion por Ciudad",
  description:
    "Encuentra calzado de dotacion y calzado empresarial de Vierco por ciudad en Colombia: Bucaramanga, Bogota, Medellin y Barranquilla.",
  alternates: {
    canonical: "https://viercocalzado.com/zapato-dotacion",
  },
};

export default function DotacionHubPage() {
  return (
    <main className="min-h-screen bg-background text-on-surface px-6 py-16 md:px-12">
      <section className="mx-auto max-w-5xl space-y-6">
        <p className="font-label text-xs tracking-[0.22em] text-secondary uppercase">
          Vierco Colombia
        </p>
        <h1 className="font-headline text-4xl md:text-5xl">
          Calzado de Dotacion por Ciudad
        </h1>
        <p className="text-base md:text-lg text-on-surface-variant">
          Explora nuestras paginas locales para empresas que buscan calzado de
          dotacion, zapatos de dotacion y calzado empresarial en ciudades
          principales de Colombia.
        </p>

        <div className="grid gap-3 sm:grid-cols-2 pt-2">
          {seoCities
            .filter((city) => city.slug !== "barranquila")
            .map((city) => (
              <Link
                key={city.slug}
                href={`/zapato-dotacion/${city.slug}`}
                className="rounded-md border border-outline-variant/30 bg-background px-4 py-3 text-sm text-on-surface hover:border-secondary hover:text-secondary transition-colors"
              >
                Calzado dotacion {city.name}
              </Link>
            ))}
        </div>
      </section>
    </main>
  );
}
