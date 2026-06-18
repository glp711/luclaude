import Image from "next/image";
import Link from "next/link";
import type { HeroSlide as HeroSlideConfig } from "@/lib/home-content";

/**
 * Renderiza UM slide do hero como banner full-bleed.
 *
 * - Imagem ocupa toda a area do banner (object-cover).
 * - Gradient overlay mascarando a metade esquerda pra texto legivel.
 * - Texto + CTAs sobrepostos a esquerda (max-w-lg).
 * - Tema do gradient varia conforme `slide.theme`.
 *
 * Recebido pelo HeroCarousel, que coordena rotacao.
 */

const THEME_GRADIENT: Record<HeroSlideConfig["theme"], string> = {
  warm:
    "linear-gradient(90deg, rgba(245,236,220,0.92) 0%, rgba(245,236,220,0.65) 30%, rgba(245,236,220,0.15) 55%, transparent 80%)",
  cool:
    "linear-gradient(90deg, rgba(212,227,221,0.92) 0%, rgba(212,227,221,0.62) 30%, rgba(212,227,221,0.12) 55%, transparent 80%)",
  earthy:
    "linear-gradient(90deg, rgba(248,211,203,0.90) 0%, rgba(248,211,203,0.55) 28%, rgba(248,211,203,0.10) 52%, transparent 75%)",
};

export function HeroSlide({
  slide,
  priority,
}: {
  slide: HeroSlideConfig;
  priority?: boolean;
}) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <Image
        src={slide.imageSrc}
        alt={slide.imageAlt}
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: slide.imagePosition ?? "center" }}
      />
      {/* Gradient mascara texto a esquerda; full-cover no mobile */}
      <div
        aria-hidden="true"
        className="absolute inset-0 md:bg-none"
        style={{ background: THEME_GRADIENT[slide.theme] }}
      />
      {/* Em telas >= md, gradient personalizado por tema */}
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden md:block"
        style={{ background: THEME_GRADIENT[slide.theme] }}
      />

      <div className="relative h-full mx-auto max-w-7xl px-6 sm:px-10 flex items-center">
        <div className="max-w-lg sm:max-w-xl">
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-sage-deep">
            <span aria-hidden="true" className="h-px w-8 bg-sage-deep/60" />
            {slide.eyebrow}
          </p>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-7xl leading-[1.02] text-ink">
            {slide.title}{" "}
            <em className="not-italic text-coral-deep">{slide.titleAccent}</em>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-ink-soft max-w-md leading-relaxed">
            {slide.description}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href={slide.primaryCta.href}
              className="inline-flex items-center rounded-full bg-coral px-7 py-3.5 text-sm font-medium text-white shadow-md shadow-coral/25 hover:bg-coral-deep transition focus:outline-none focus-visible:ring-2 focus-visible:ring-coral-deep focus-visible:ring-offset-2 focus-visible:ring-offset-cream-soft"
            >
              {slide.primaryCta.label}
              <span aria-hidden="true" className="ml-2">
                →
              </span>
            </Link>
            <Link
              href={slide.secondaryCta.href}
              className="inline-flex items-center rounded-full bg-cream-soft/80 backdrop-blur px-6 py-3.5 text-sm font-medium text-ink border border-ink/10 hover:bg-cream-soft transition focus:outline-none focus-visible:ring-2 focus-visible:ring-coral"
            >
              {slide.secondaryCta.label}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
