import type { Metadata, Viewport } from "next";
import { Newsreader, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import WhatsAppButton from "@/components/layout/WhatsAppButton";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-headline",
  display: "swap",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Vierco",
  url: "https://viercocalzado.com",
  logo: "https://viercocalzado.com/logo1.png",
  description:
    "Calzado empresarial y calzado de dotacion para equipos corporativos en Colombia.",
  sameAs: [],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Vierco",
  url: "https://viercocalzado.com",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://viercocalzado.com/?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export const metadata: Metadata = {
  metadataBase: new URL("https://viercocalzado.com"),
  title: {
    default: "Vierco | Calzado Empresarial de Élite",
    template: "%s | Vierco",
  },
  description:
    "Calzado Empresarial. Una seleccion curada de siluetas corporativas disenadas para el profesional moderno. Sin compromisos en forma ni funcion.",
  keywords: [
    "calzado empresarial",
    "zapato dotacion",
    "zapatos de dotacion",
    "zapatos empresariales",
    "calzado corporativo",
    "vierco",
    "colombia",
  ],
  alternates: {
    canonical: "https://viercocalzado.com",
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Vierco | Calzado Empresarial de Élite",
    description:
      "Calzado Empresarial. Una seleccion curada de siluetas corporativas disenadas para el profesional moderno.",
    url: "https://viercocalzado.com",
    siteName: "Vierco",
    locale: "es_CO",
    type: "website",
    images: [{ url: "/logo1.png", width: 512, height: 512, alt: "Logo Vierco" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vierco | Calzado Empresarial de Élite",
    description:
      "Calzado empresarial premium para profesionales modernos en Colombia.",
    images: ["/logo1.png"],
  },
  other: {
    "geo.region": "CO",
    "geo.placename": "Colombia",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${newsreader.variable} ${spaceGrotesk.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Providers>
          {children}
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  );
}
