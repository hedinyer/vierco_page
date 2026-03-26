/** Client-safe Wompi API base URL (mirrors server logic in `config.ts`). */
export function getWompiBaseUrlPublic(): string {
  const pub = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY ?? "";
  if (pub.startsWith("pub_test_")) {
    return "https://sandbox.wompi.co/v1";
  }
  return "https://production.wompi.co/v1";
}
