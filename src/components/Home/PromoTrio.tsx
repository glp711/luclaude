import Image from "next/image";
import Link from "next/link";
import { PROMO_TRIO, type PromoCard } from "@/lib/home-content";

const TONE_OVERLAY: Record<PromoCard["tone"], string> = {
  coral: "from-coral-deep/80 via-coral-deep/20 to-transparent",
  sage: "from-sage-deep/82 via-sage-deep/22 to-transparent",
  ink: "from-ink/82 via-ink/28 to-transparent",
};

/**
 * Paineis editoriais de entrada para jornadas da loja.
 */
export function PromoTrio() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-[92rem] px-6 py-16 sm:py-20">
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {PROMO_TRIO.map((card) => (
            <li key={card.title}>
              <Link
                href={card.href}
                className="group relative block overflow-hidden rounded-[8px] bg-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-deep"
              >
                <div className="relative aspect-[4/5] md:aspect-[3/4]">
                  <Image
                    src={card.imageSrc}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.045]"
                  />
                  <div
                    aria-hidden="true"
                    className={`absolute inset-0 bg-gradient-to-t ${TONE_OVERLAY[card.tone]}`}
                  />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-cream-soft sm:p-7">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cream-soft/70">
                      {card.eyebrow}
                    </p>
                    <h3 className="mt-2 max-w-xs font-display text-4xl leading-[0.95] sm:text-5xl">
                      {card.title}
                    </h3>
                    <p className="mt-3 max-w-xs text-sm leading-relaxed text-cream-soft/82">
                      {card.description}
                    </p>
                    <span className="mt-5 inline-flex text-[11px] font-semibold uppercase tracking-[0.18em] text-cream-soft underline decoration-cream-soft/35 underline-offset-8 transition group-hover:decoration-cream-soft">
                      Ver agora
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
