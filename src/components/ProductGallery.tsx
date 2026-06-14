"use client";

import Image from "next/image";
import { useState } from "react";

type GalleryImage = { url: string; alt: string | null };

export function ProductGallery({ images, productName }: { images: GalleryImage[]; productName: string }) {
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
      <div className="relative aspect-square rounded-3xl bg-cream-soft border border-cream-deep overflow-hidden">
        <Image
          src={main.url}
          alt={main.alt ?? productName}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((img, i) => (
            <button
              key={img.url}
              type="button"
              onClick={() => setActive(i)}
              className={`relative aspect-square rounded-xl overflow-hidden border-2 transition ${
                i === active ? "border-coral" : "border-cream-deep hover:border-coral-soft"
              }`}
              aria-label={`Imagem ${i + 1}`}
            >
              <Image
                src={img.url}
                alt={img.alt ?? ""}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
