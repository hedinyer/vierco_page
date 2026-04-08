import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSeoCityBySlug, seoCities } from "@/lib/seo-cities";

type CityPageProps = {
  params: Promise<{ city: string }>;
};

export function generateStaticParams() {
  return seoCities.map((city) => ({ city: city.slug }));
}

export async function generateMetadata({
  params,
}: CityPageProps): Promise<Metadata> {
  const { city } = await params;
  const cityData = getSeoCityBySlug(city);
  if (!cityData) return {};

  const title = `Zapato de Dotacion en ${cityData.name}`;
  const description = `Zapato de dotacion en ${cityData.name}. Calzado empresarial premium para equipos corporativos en ${cityData.department}. Diseno elegante, comodidad y durabilidad.`;
  const url = `https://viercocalzado.com/zapato-dotacion/${cityData.slug}`;

  return {
    title,
    description,
    keywords: [
      `zapato dotacion ${cityData.name.toLowerCase()}`,
      `zapatos de dotacion ${cityData.name.toLowerCase()}`,
      `calzado empresarial ${cityData.name.toLowerCase()}`,
      `calzado corporativo ${cityData.name.toLowerCase()}`,
      "dotacion empresarial colombia",
      "vierco",
    ],
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | Vierco`,
      description,
      url,
      type: "website",
      locale: "es_CO",
    },
  };
}

export default async function CitySeoPage({ params }: CityPageProps) {
  const { city } = await params;
  const cityData = getSeoCityBySlug(city);

  if (!cityData) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background text-on-surface px-6 py-16 md:px-12">
      <section className="mx-auto max-w-4xl space-y-6">
        <p className="font-label text-xs tracking-[0.24em] text-secondary uppercase">
          Vierco Calzado Empresarial
        </p>
        <h1 className="font-headline text-4xl md:text-5xl">
          Zapato de Dotacion en {cityData.name}
        </h1>
        <p className="text-base md:text-lg text-on-surface-variant">
          Calzado empresarial para equipos en {cityData.name}, {cityData.department}.
          Una seleccion curada de siluetas corporativas disenadas para el
          profesional moderno, sin compromisos en forma ni funcion.
        </p>
        <p className="text-base md:text-lg text-on-surface-variant">
          Si buscas zapatos de dotacion en {cityData.name}, en Vierco encuentras
          diseno elegante, comodidad para jornadas largas y materiales de alto
          desempeno para uso empresarial.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-on-primary transition-colors hover:opacity-90"
          >
            Ver todo el catalogo
          </Link>
        </div>
      </section>
    </main>
  );
}
