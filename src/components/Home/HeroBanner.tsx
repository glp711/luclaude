import Image from "next/image";
import Link from "next/link";
import { HERO } from "@/lib/home-content";

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-cream-soft border-b border-cream-deep/40">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-24 grid md:grid-cols-[1.05fr_1fr] gap-10 lg:gap-16 items-center">
        <div className="order-2 md:order-1">
          <p className="text-xs uppercase tracking-[0.18em] text-sage-deep">
            {HERO.eyebrow}
          </p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-ink">
            {HERO.title}
          </h1>
          <p className="mt-5 text-base sm:text-lg text-ink-soft max-w-lg leading-relaxed">
            {HERO.description}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={HERO.primaryCta.href}
              className="inline-flex items-center rounded-full bg-coral px-7 py-3 text-sm font-medium text-white shadow-sm hover:bg-coral-deep transition focus:outline-none focus-visible:ring-2 focus-visible:ring-coral-deep focus-visible:ring-offset-2 focus-visible:ring-offset-cream-soft"
            >
              {HERO.primaryCta.label}
            </Link>
            <Link
              href={HERO.secondaryCta.href}
              className="inline-flex items-center rounded-full border border-ink/20 px-6 py-3 text-sm font-medium text-ink hover:border-coral-deep hover:text-coral-deep transition focus:outline-none focus-visible:ring-2 focus-visible:ring-coral"
            >
              {HERO.secondaryCta.label}
            </Link>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <div className="relative aspect-[5/6] sm:aspect-square md:aspect-[5/6] lg:aspect-square w-full max-w-md mx-auto rounded-3xl overflow-hidden border border-cream-deep bg-coral-soft/30 shadow-sm">
            <Image
              src={HERO.imageSrc}
              alt={HERO.imageAlt}
              fill
              priority
              sizes="(max-width: 768px) 90vw, 45vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
