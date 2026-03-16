import type { Metadata } from "next";
import { Newsreader, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import WhatsAppButton from "@/components/layout/WhatsAppButton";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-headline",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Vierco | Calzado Empresarial de Élite",
  description: "Elegancia y profesionalismo en cada paso. Calzado empresarial de la más alta calidad.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${newsreader.variable} ${spaceGrotesk.variable} antialiased`}>
        <Providers>
          {children}
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  );
}
