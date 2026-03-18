"use client";

import { useRef, useEffect, useState } from "react";

const VIDEO_SRC = "/2126786_Close_Up_Man_3840x2160.mp4";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoAvailable, setVideoAvailable] = useState(false);

  useEffect(() => {
    // Probe whether the video file actually exists before showing the element.
    fetch(VIDEO_SRC, { method: "HEAD" })
      .then((res) => {
        if (res.ok) setVideoAvailable(true);
      })
      .catch(() => {});
  }, []);

  return (
    <header className="relative px-6 py-20 lg:px-24 min-h-[400px] overflow-hidden">
      {/* Fallback gradient — always rendered, hidden only when video is playing */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-secondary/70"
        aria-hidden
      />

      {/* Video de fondo — only mounted when the file is confirmed to exist */}
      {videoAvailable && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>
      )}

      {/* Overlay para legibilidad del texto */}
      <div className="absolute inset-0 bg-primary/40" aria-hidden />

      {/* Contenido */}
      <div className="relative z-10 max-w-4xl">
        <h1 className="font-headline text-6xl lg:text-8xl leading-none mb-8 text-white drop-shadow-md">
          Calzado <br />
          <span className="italic">Empresarial</span>
        </h1>
        <p className="text-white/90 max-w-md leading-relaxed font-light text-lg drop-shadow-sm">
          Una selección curada de siluetas corporativas diseñadas para el
          profesional moderno. Sin compromisos en forma ni función.
        </p>
      </div>
    </header>
  );
}
