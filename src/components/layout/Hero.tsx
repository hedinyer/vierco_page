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

export default function Hero() {
  const [activeTextIndex, setActiveTextIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveTextIndex((prev) => (prev + 1) % HERO_TEXTS.length);
    }, 2600);

    return () => window.clearInterval(intervalId);
  }, []);

  const columns = [0, 1, 2].map((columnIndex) =>
    AMBIENT_IMAGES.filter((_, index) => index % 3 === columnIndex),
  );

  return (
    <header className="relative px-4 sm:px-6 lg:px-24 py-16 sm:py-20 min-h-[360px] sm:min-h-[400px] overflow-hidden">
      {/* Animated Pinterest-like image wall */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-0 grid grid-cols-3 gap-3 p-3 sm:gap-4 sm:p-4 opacity-70">
          {columns.map((column, columnIndex) => {
            const animatedColumn = [...column, ...column];
            const columnDirection =
              columnIndex === 1 ? "animate-column-down" : "animate-column-up";
            const durationSeconds =
              columnIndex === 0 ? 14 : columnIndex === 1 ? 18 : 16;

            return (
              <div key={columnIndex} className="relative h-full overflow-hidden">
                <div
                  className={`absolute left-0 right-0 top-0 ${columnDirection} space-y-3 sm:space-y-4`}
                  style={{
                    animationDuration: `${durationSeconds}s`,
                    animationPlayState: "running",
                  }}
                >
                  {animatedColumn.map((imagePath, imageIndex) => (
                    <div
                      key={`${imagePath}-${imageIndex}`}
                      className="relative w-full"
                    >
                      <img
                        src={encodeURI(imagePath)}
                        alt=""
                        className="block w-full h-auto rounded-xl"
                        loading={imageIndex < 3 ? "eager" : "lazy"}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contenido secuencial centrado */}
      <div className="relative z-10 min-h-[360px] sm:min-h-[400px] flex items-center justify-center">
        <div className="relative w-full h-32 sm:h-40 lg:h-44 flex items-center justify-center">
          <h1
            key={HERO_TEXTS[activeTextIndex]}
            className="hero-sequence-title text-center font-headline text-4xl sm:text-6xl lg:text-8xl leading-none text-black drop-shadow-md"
          >
            {HERO_TEXTS[activeTextIndex]}
          </h1>
        </div>
      </div>

      <style jsx>{`
        .animate-column-up,
        .animate-column-down {
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }

        .animate-column-up {
          animation-name: heroColumnUp;
          animation-duration: 16s;
        }

        .animate-column-down {
          animation-name: heroColumnDown;
          animation-duration: 16s;
        }

        .hero-sequence-title {
          animation: heroTextInOut 2.6s ease-in-out;
        }

        @keyframes heroColumnUp {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }

        @keyframes heroColumnDown {
          0% {
            transform: translateY(-50%);
          }
          100% {
            transform: translateY(0);
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
