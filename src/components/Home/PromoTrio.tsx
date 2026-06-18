import Image from "next/image";
import Link from "next/link";
import { PROMO_TRIO, type PromoCard } from "@/lib/home-content";

const TONE_OVERLAY: Record<PromoCard["tone"], string> = {
  coral: "from-coral-deep/85 via-coral-deep/40 to-transparent",
  sage: "from-sage-deep/85 via-sage-deep/40 to-transparent",
  ink: "from-ink/85 via-ink/40 to-transparent",
};

const TONE_EYEBROW: Record<PromoCard["tone"], string> = {
  coral: "text-coral-soft",
  sage: "text-sage-soft",
  ink: "text-cream-deep",
};

/**
 * Trio de banners promo — 3 cards imagem+texto com overlay.
 * Cada um leva pra uma jornada distinta (presentes / aromatize / ofertas).
 *
 * Fonte: PROMO_TRIO em home-content.ts.
 */
export function PromoTrio() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {PROMO_TRIO.map((card) => (
          <li key={card.title}>
            <Link
              href={card.href}
              className="group relative block rounded-3xl overflow-hidden border border-cream-deep bg-cream-soft hover:border-coral transition focus:outline-none focus-visible:ring-2 focus-visible:ring-coral aspect-[4/5] md:aspect-[5/6]"
            >
              <Image
                src={card.imageSrc}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition duration-700 group-hover:scale-[1.05]"
              />
              <div
                aria-hidden="true"
                className={`absolute inset-0 bg-gradient-to-t ${TONE_OVERLAY[card.tone]}`}
              />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7 text-cream-soft">
                <p
                  className={`text-[11px] uppercase tracking-[0.22em] ${TONE_EYEBROW[card.tone]}`}
                >
                  {card.eyebrow}
                </p>
                <h3 className="mt-2 font-display text-2xl sm:text-3xl leading-tight">
                  {card.title}
                </h3>
                <p className="mt-1.5 text-sm text-cream-soft/85 max-w-xs">
                  {card.description}
                </p>
                <span className="mt-4 inline-flex items-center text-xs uppercase tracking-widest text-cream-soft group-hover:text-coral-soft transition">
                  Ver agora
                  <span
                    aria-hidden="true"
                    className="ml-2 transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
