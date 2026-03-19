"use client";

import { useRef, useEffect, useState } from "react";

const VIDEO_SRC =
  "https://uufwfagmbuncwbhtqseb.supabase.co/storage/v1/object/public/images/banner/shoebanner.mp4";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoAvailable, setVideoAvailable] = useState(true);

  return (
    <header className="relative px-4 sm:px-6 lg:px-24 py-16 sm:py-20 min-h-[360px] sm:min-h-[400px] overflow-hidden">
      {/* Fallback gradient — always rendered, hidden only when video is playing */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-secondary/70"
        aria-hidden
      />

      {/* Video de fondo */}
      {videoAvailable && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          crossOrigin="anonymous"
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden
          onError={() => setVideoAvailable(false)}
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>
      )}

      {/* Contenido */}
      <div className="relative z-10 max-w-4xl">
        <h1 className="font-headline text-4xl sm:text-6xl lg:text-8xl leading-none mb-8 text-white drop-shadow-md">
          Calzado <br />
          <span className="italic">Empresarial</span>
        </h1>
        <p className="text-white/90 max-w-md leading-relaxed font-light text-base sm:text-lg drop-shadow-sm">
          Una selección curada de siluetas corporativas diseñadas para el
          profesional moderno. Sin compromisos en forma ni función.
        </p>
      </div>
    </header>
  );
}
