import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel interno - Editar productos",
  robots: {
    index: false,
    follow: false,
  },
};

export default function EditarProductosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
