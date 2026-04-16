"use client";

import { Instagram } from "lucide-react";

const instagramPosts = [
  {
    reelUrl: "https://www.instagram.com/reel/DDQXVOuxj95/",
    embedUrl: "https://www.instagram.com/reel/DDQXVOuxj95/embed",
  },
  {
    reelUrl: "https://www.instagram.com/reel/DIwJe0Dx9OL/",
    embedUrl: "https://www.instagram.com/reel/DIwJe0Dx9OL/embed",
  },
  {
    reelUrl: "https://www.instagram.com/reel/DJsrFeUxBF3/",
    embedUrl: "https://www.instagram.com/reel/DJsrFeUxBF3/embed",
  },
  {
    reelUrl: "https://www.instagram.com/reel/DKNeq0FxMZS/",
    embedUrl: "https://www.instagram.com/reel/DKNeq0FxMZS/embed",
  },
];

export default function InstagramShowcase() {
  return (
    <section className="px-6 py-6 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <a
          href="https://www.instagram.com/vierco/"
          target="_blank"
          rel="noopener noreferrer"
          className="mb-5 inline-flex items-center gap-2 font-label text-[11px] font-semibold uppercase tracking-[0.26em] text-on-surface transition-opacity hover:opacity-70"
        >
          <Instagram className="h-4 w-4" strokeWidth={1.8} />
          Siguenos en Instagram
        </a>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {instagramPosts.map((post) => (
            <article
              key={post.reelUrl}
              className="h-[430px] overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-high sm:h-[460px] lg:h-[520px]"
            >
              <iframe
                src={post.embedUrl}
                title="Reel de Instagram Vierco"
                className="h-[520px] w-full sm:h-[560px] lg:h-[620px]"
                loading="lazy"
                scrolling="no"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                allowFullScreen
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
