import Link from "next/link";

const cityLinks = [
  { href: "/zapato-dotacion/bucaramanga", label: "Zapato de dotacion en Bucaramanga" },
  { href: "/zapato-dotacion/bogota", label: "Zapato de dotacion en Bogota" },
  { href: "/zapato-dotacion/medellin", label: "Zapato de dotacion en Medellin" },
  { href: "/zapato-dotacion/barranquilla", label: "Zapato de dotacion en Barranquilla" },
];

export default function LocalSeoSection() {
  return (
    <section className="px-6 py-14 sm:px-6 lg:px-24 border-t border-outline-variant/20 bg-surface-container-lowest/40">
      <div className="mx-auto max-w-6xl">
        <p className="font-label text-[10px] tracking-[0.2em] uppercase text-secondary">
          Cobertura nacional
        </p>
        <h2 className="mt-3 font-headline text-3xl md:text-4xl text-on-surface">
          Zapatos de dotacion para empresas en Colombia
        </h2>
        <p className="mt-4 max-w-4xl text-sm md:text-base text-on-surface-variant leading-relaxed">
          En Vierco desarrollamos calzado empresarial con enfoque en imagen corporativa,
          comodidad y durabilidad para jornadas de trabajo exigentes. Atendemos
          requerimientos de dotacion en ciudades clave como Bucaramanga, Bogota,
          Medellin y Barranquilla.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {cityLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md border border-outline-variant/30 bg-background px-4 py-3 text-sm text-on-surface hover:border-secondary hover:text-secondary transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
