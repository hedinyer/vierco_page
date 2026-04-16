import Link from "next/link";
import { Facebook, Instagram } from "lucide-react";

const social = {
  facebook: "https://www.facebook.com/",
  instagram: "https://www.instagram.com/",
  whatsapp: "https://wa.me/",
} as const;

const policyLinks = [
  {
    href: "/politicas/cambios-y-devoluciones",
    label: "Políticas de Cambios y Devoluciones",
  },
  { href: "/politicas/privacidad", label: "Políticas de Privacidad" },
  { href: "/envios", label: "Envíos" },
] as const;

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 21a9 9 0 0 0 8.94-10.07 9 9 0 0 0-9.87-7.87 9 9 0 0 0-8.5 8.5 9 9 0 0 0 .65 3.73L3 21l4.71-1.24A9 9 0 0 0 12 21Z" />
      <path d="M9.5 9.5c.5-1 1.7-1.2 2.5-.7.4.2.7.6.9 1 .2.5-.1 1-.5 1.3-.3.2-.5.4-.5.7 0 .4.5.9 1.1 1.4 1.1.9 2 1.1 2.3.7.3-.4.8-.6 1.2-.4.5.2 1.5.7 1.7 1.2.2.6-.3 1.6-1.4 2.4-1 .7-2.3.8-3.9.1-1.9-.8-3.5-2.4-4.5-4.5-.9-1.8-.9-3.4-.1-4.4.3-.4.7-.7 1.1-.9Z" />
    </svg>
  );
}

const iconClass = "h-5 w-5 text-on-surface";

export default function Footer() {
  return (
    <footer className="border-t border-outline-variant/20 bg-white text-on-surface">
      <div className="mx-auto max-w-6xl px-6 py-12 lg:px-24">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16 md:items-start">
          <div>
            <h2 className="font-body text-lg font-bold tracking-tight">
              Siempre local
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-on-surface/85">
              Soñamos con un 100% hecho en Colombia; aunque es un camino largo,
              nuestros talleres y empresa se constituyen en Santander.
            </p>
            <div className="mt-6 flex items-center gap-5">
              <a
                href={social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-on-surface transition-opacity hover:opacity-70"
                aria-label="Facebook"
              >
                <Facebook className={iconClass} strokeWidth={1.5} />
              </a>
              <a
                href={social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-on-surface transition-opacity hover:opacity-70"
                aria-label="Instagram"
              >
                <Instagram className={iconClass} strokeWidth={1.5} />
              </a>
              <a
                href={social.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="text-on-surface transition-opacity hover:opacity-70"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon className={iconClass} />
              </a>
            </div>
          </div>

          <nav
            className="flex flex-col gap-3 md:items-end md:text-right"
            aria-label="Enlaces legales y envíos"
          >
            {policyLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-on-surface underline-offset-4 transition-colors hover:text-on-surface/80 hover:underline"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <p className="mt-12 font-label text-[10px] tracking-widest text-on-surface/70">
          © 2026 Vierco.
        </p>
      </div>
    </footer>
  );
}
