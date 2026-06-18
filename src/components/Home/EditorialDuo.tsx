import Image from "next/image";
import Link from "next/link";
import { EDITORIAL_DUO } from "@/lib/home-content";

/**
 * Dois banners editoriais largos lado-a-lado.
 *
 * Fonte: EDITORIAL_DUO em home-content.ts.
 * Cada card tem foto numa metade e texto+CTA na outra (alternando lados).
 */
export function EditorialDuo() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-14">
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {EDITORIAL_DUO.map((card) => {
          const imageLeft = card.imageSide === "left";
          return (
            <li key={card.title}>
              <Link
                href={card.href}
                className="group block rounded-3xl overflow-hidden border border-cream-deep bg-cream-soft hover:border-coral transition focus:outline-none focus-visible:ring-2 focus-visible:ring-coral"
              >
                <div className="grid grid-cols-[1fr_1.1fr] min-h-[260px] sm:min-h-[300px]">
                  {imageLeft && (
                    <div className="relative overflow-hidden bg-coral-soft/20">
                      <Image
                        src={card.imageSrc}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover transition duration-700 group-hover:scale-[1.05]"
                      />
                    </div>
                  )}
                  <div className="flex flex-col justify-center p-6 sm:p-8">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-sage-deep">
                      {card.eyebrow}
                    </p>
                    <h3 className="mt-2 font-display text-2xl sm:text-3xl text-ink leading-tight">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-sm text-ink-soft leading-relaxed">
                      {card.description}
                    </p>
                    <span className="mt-4 inline-flex items-center text-sm text-coral-deep">
                      {card.ctaLabel}
                      <span
                        aria-hidden="true"
                        className="ml-2 transition-transform group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </span>
                  </div>
                  {!imageLeft && (
                    <div className="relative overflow-hidden bg-coral-soft/20">
                      <Image
                        src={card.imageSrc}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover transition duration-700 group-hover:scale-[1.05]"
                      />
                    </div>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
