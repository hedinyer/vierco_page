"use client";
import { useEffect, useState } from "react";

const AMBIENT_IMAGES = [
  "/banner/FOTOS VARIAS (AMBIENTACIÓN DE LA PAGINA)/IMG_6812.jpg",
  "/banner/FOTOS VARIAS (AMBIENTACIÓN DE LA PAGINA)/IMG_7088.jpg",
  "/banner/FOTOS VARIAS (AMBIENTACIÓN DE LA PAGINA)/IMG_7162.jpg",
  "/banner/FOTOS VARIAS (AMBIENTACIÓN DE LA PAGINA)/IMG_7163.jpg",
  "/banner/FOTOS VARIAS (AMBIENTACIÓN DE LA PAGINA)/IMG_7176.jpg",
  "/banner/FOTOS VARIAS (AMBIENTACIÓN DE LA PAGINA)/IMG_7194.jpg",
];

const HERO_TEXTS = [
  "Calzado Empresarial",
  "Estilo Ejecutivo",
  "Comodidad Profesional",
  "Imagen Corporativa",
];

function splitHeadline(text: string): { first: string; rest: string } {
  const i = text.indexOf(" ");
  if (i === -1) return { first: text, rest: "" };
  return { first: text.slice(0, i), rest: text.slice(i + 1) };
}

export default function Hero() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setTick((prev) => prev + 1);
    }, 2600);

    return () => window.clearInterval(intervalId);
  }, []);

  const textIndex = tick % HERO_TEXTS.length;
  const imageIndex = tick % AMBIENT_IMAGES.length;
  const currentImage = AMBIENT_IMAGES[imageIndex];
  const headline = splitHeadline(HERO_TEXTS[textIndex]);

  return (
    <header className="relative px-4 sm:px-6 lg:px-24 py-16 sm:py-20 min-h-[360px] sm:min-h-[400px] overflow-hidden">
      {/* Una sola imagen a la vez, misma ventana que el hero */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-0 p-3 sm:p-4 lg:p-6 opacity-90">
          <div className="relative h-full min-h-0 w-full overflow-hidden rounded-2xl bg-white/40 shadow-sm ring-1 ring-black/[0.06] dark:bg-white/10">
            <img
              key={currentImage}
              src={encodeURI(currentImage)}
              alt=""
              className="hero-single-image absolute inset-0 h-full w-full object-cover object-center"
              loading={imageIndex === 0 ? "eager" : "lazy"}
              decoding="async"
            />
          </div>
        </div>
      </div>

      {/* Contenido secuencial centrado */}
      <div className="relative z-10 min-h-[360px] sm:min-h-[400px] flex items-center justify-center">
        <div className="relative flex w-full min-h-[9rem] sm:min-h-[11rem] lg:min-h-[12rem] items-center justify-center px-2">
          <h1
            key={HERO_TEXTS[textIndex]}
            className="hero-sequence-title text-center leading-[1.02]"
          >
            <span className="hero-banner-line1 block font-headline font-light uppercase tracking-[0.18em] text-white sm:tracking-[0.22em]">
              {headline.first}
            </span>
            {headline.rest ? (
              <span className="hero-banner-line2 font-body mt-1.5 block text-3xl font-bold uppercase tracking-[0.12em] text-[#f0c4bf] sm:mt-2 sm:text-5xl sm:tracking-[0.14em] lg:text-7xl lg:tracking-[0.16em]">
                {headline.rest}
              </span>
            ) : null}
          </h1>
        </div>
      </div>

      <style jsx>{`
        .hero-single-image {
          animation: heroImageFade 0.55s ease-out;
        }

        .hero-sequence-title {
          animation: heroTextInOut 2.6s ease-in-out;
        }

        .hero-banner-line1 {
          font-size: clamp(1.35rem, 4.5vw, 2.75rem);
          text-shadow:
            0 1px 2px rgba(0, 0, 0, 0.85),
            0 4px 28px rgba(0, 0, 0, 0.55);
        }

        .hero-banner-line2 {
          text-shadow:
            0 1px 2px rgba(0, 0, 0, 0.75),
            0 3px 22px rgba(0, 0, 0, 0.45);
        }

        @keyframes heroImageFade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes heroTextInOut {
          0% {
            opacity: 0;
            transform: translateY(18px) scale(0.98);
          }
          20% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          75% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-14px) scale(1.02);
          }
        }
      `}</style>
    </header>
  );
}
