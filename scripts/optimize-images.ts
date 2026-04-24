import { stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

type Target = {
  input: string;
  output: string;
  width: number;
  quality: number;
};

const targets: Target[] = [
  {
    input: "public/banner/FOTOS VARIAS (AMBIENTACIÓN DE LA PAGINA)/IMG_6812.jpg",
    output: "public/banner/FOTOS VARIAS (AMBIENTACIÓN DE LA PAGINA)/IMG_6812.webp",
    width: 1920,
    quality: 72,
  },
  {
    input: "public/banner/FOTOS VARIAS (AMBIENTACIÓN DE LA PAGINA)/IMG_7088.jpg",
    output: "public/banner/FOTOS VARIAS (AMBIENTACIÓN DE LA PAGINA)/IMG_7088.webp",
    width: 1920,
    quality: 72,
  },
  {
    input: "public/banner/FOTOS VARIAS (AMBIENTACIÓN DE LA PAGINA)/IMG_7162.jpg",
    output: "public/banner/FOTOS VARIAS (AMBIENTACIÓN DE LA PAGINA)/IMG_7162.webp",
    width: 1920,
    quality: 72,
  },
  {
    input: "public/banner/FOTOS VARIAS (AMBIENTACIÓN DE LA PAGINA)/IMG_7163.jpg",
    output: "public/banner/FOTOS VARIAS (AMBIENTACIÓN DE LA PAGINA)/IMG_7163.webp",
    width: 1920,
    quality: 72,
  },
  {
    input: "public/banner/FOTOS VARIAS (AMBIENTACIÓN DE LA PAGINA)/IMG_7176.jpg",
    output: "public/banner/FOTOS VARIAS (AMBIENTACIÓN DE LA PAGINA)/IMG_7176.webp",
    width: 1920,
    quality: 72,
  },
  {
    input: "public/banner/FOTOS VARIAS (AMBIENTACIÓN DE LA PAGINA)/IMG_7194.jpg",
    output: "public/banner/FOTOS VARIAS (AMBIENTACIÓN DE LA PAGINA)/IMG_7194.webp",
    width: 1920,
    quality: 72,
  },
  {
    input: "public/logo_f.png",
    output: "public/logo_f.webp",
    width: 460,
    quality: 80,
  },
];

function formatKb(bytes: number) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

async function optimizeOne(target: Target) {
  const absIn = path.resolve(target.input);
  const absOut = path.resolve(target.output);
  const before = (await stat(absIn)).size;

  await sharp(absIn)
    .rotate()
    .resize({ width: target.width, withoutEnlargement: true })
    .webp({ quality: target.quality, effort: 4 })
    .toFile(absOut);

  const after = (await stat(absOut)).size;
  const saved = before - after;
  const pct = before > 0 ? (saved / before) * 100 : 0;

  return {
    input: target.input,
    output: target.output,
    before,
    after,
    saved,
    pct,
  };
}

async function main() {
  let totalBefore = 0;
  let totalAfter = 0;

  for (const target of targets) {
    const result = await optimizeOne(target);
    totalBefore += result.before;
    totalAfter += result.after;

    console.log(
      `OK ${result.input} -> ${result.output} | ${formatKb(result.before)} -> ${formatKb(result.after)} (${result.pct.toFixed(1)}%)`
    );
  }

  const totalSaved = totalBefore - totalAfter;
  const totalPct = totalBefore > 0 ? (totalSaved / totalBefore) * 100 : 0;
  console.log(
    `TOTAL ${formatKb(totalBefore)} -> ${formatKb(totalAfter)} | ahorro ${formatKb(totalSaved)} (${totalPct.toFixed(1)}%)`
  );
}

main().catch((err) => {
  console.error("Error optimizando imagenes:", err);
  process.exitCode = 1;
});
