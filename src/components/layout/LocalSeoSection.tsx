import { BadgeCheck, Leaf, Ruler, ShieldCheck } from "lucide-react";

const highlights = [
  {
    label: "Construyendo historia 2023",
    icon: BadgeCheck,
    iconLabel: "3",
    iconSubLabel: "años",
  },
  {
    label: "Atencion a los detalles",
    icon: ShieldCheck,
  },
  {
    label: "Ciclo productivo responsable",
    icon: Leaf,
  },
  {
    label: "Manufactura Colombiana",
    icon: Ruler,
  },
];

export default function LocalSeoSection() {
  return (
    <section className="px-6 py-14 sm:px-6 lg:px-24 border-t border-outline-variant/20 bg-surface-container-lowest/40">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-y-8 gap-x-6 md:grid-cols-4">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.label} className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-outline-variant/30 bg-background">
                  {item.iconLabel ? (
                    <span className="font-headline leading-none text-on-surface">
                      <span className="block text-3xl">{item.iconLabel}</span>
                      <span className="block text-[11px] uppercase tracking-[0.08em] text-on-surface-variant">
                        {item.iconSubLabel}
                      </span>
                    </span>
                  ) : (
                    <Icon className="h-7 w-7 text-on-surface" strokeWidth={1.9} />
                  )}
                </div>
                <p className="mt-4 font-body text-base font-semibold text-on-surface">
                  {item.label}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
