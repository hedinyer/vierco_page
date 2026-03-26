export function getWompiApiBaseUrl(): string {
  const pub = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY ?? "";
  if (pub.startsWith("pub_test_")) {
    return "https://sandbox.wompi.co/v1";
  }
  return "https://production.wompi.co/v1";
}

export function getWompiPrivateKey(): string | null {
  const k = process.env.WOMPI_PRIVATE_KEY;
  return k && k.length > 0 ? k : null;
}

export function getWompiIntegritySecret(): string | null {
  const k = process.env.WOMPI_INTEGRITY_SECRET;
  return k && k.length > 0 ? k : null;
}
