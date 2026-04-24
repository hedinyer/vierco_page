import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel interno - Cargar producto",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CargarProductoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
