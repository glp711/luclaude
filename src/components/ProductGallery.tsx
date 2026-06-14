"use client";

import { useState } from "react";

type Image = { url: string; alt: string | null };

export function ProductGallery({ images, productName }: { images: Image[]; productName: string }) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-square rounded-3xl bg-cream-soft border border-cream-deep flex items-center justify-center text-ink-mute text-sm">
        Sem imagem
      </div>
    );
  }

  const main = images[active];

  return (
    <div className="space-y-3">
      <div className="aspect-square rounded-3xl bg-cream-soft border border-cream-deep overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={main.url}
          alt={main.alt ?? productName}
          className="h-full w-full object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((img, i) => (
            <button
              key={img.url}
              type="button"
              onClick={() => setActive(i)}
              className={`aspect-square rounded-xl overflow-hidden border-2 transition ${
                i === active ? "border-coral" : "border-cream-deep hover:border-coral-soft"
              }`}
              aria-label={`Imagem ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.alt ?? ""} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
