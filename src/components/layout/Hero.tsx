export default function Hero() {
  return (
    <header className="relative px-6 py-20 lg:px-24 min-h-[400px] overflow-hidden">
      {/* Video de fondo */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden
      >
        <source src="/2126786_Close_Up_Man_3840x2160.mp4" type="video/mp4" />
      </video>
      {/* Overlay para legibilidad del texto */}
      <div className="absolute inset-0 bg-primary/40" aria-hidden />
      {/* Contenido */}
      <div className="relative z-10 max-w-4xl">
        <h1 className="font-headline text-6xl lg:text-8xl leading-none mb-8 text-white drop-shadow-md">
          Calzado <br />
          <span className="italic">Empresarial</span>
        </h1>
        <p className="text-white/90 max-w-md leading-relaxed font-light text-lg drop-shadow-sm">
          Una selección curada de siluetas corporativas diseñadas para el profesional moderno. Sin compromisos en forma ni función.
        </p>
      </div>
    </header>
  );
}
