import Image from "next/image";
import Link from "next/link";
import type { HeroSlide as HeroSlideConfig } from "@/lib/home-content";

const THEME_TINT: Record<HeroSlideConfig["theme"], string> = {
  warm: "from-coral-soft/60",
  cool: "from-sage-soft/75",
  earthy: "from-sage-soft/65",
};

const THEME_MARK: Record<HeroSlideConfig["theme"], string> = {
  warm: "border-coral-soft/80 bg-coral-soft/22 text-coral-deep",
  cool: "border-sage/35 bg-sage-soft/38 text-sage-deep",
  earthy: "border-cream-deep/90 bg-cream-soft/42 text-sage-deep",
};

export function HeroSlide({
  slide,
  priority,
}: {
  slide: HeroSlideConfig;
  priority?: boolean;
}) {
  const paragraphs = Array.isArray(slide.description)
    ? slide.description
    : [slide.description];

  return (
    <div className="relative h-full w-full overflow-hidden bg-cream-soft">
      <Image
        src={slide.imageSrc}
        alt={slide.imageAlt}
        fill
        priority={priority}
        quality={95}
        unoptimized
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: slide.imagePosition ?? "center" }}
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(45,41,36,0)_0%,rgba(45,41,36,0.03)_28%,rgba(250,244,233,0.78)_58%,rgba(250,244,233,0.99)_100%)] lg:bg-[linear-gradient(90deg,rgba(250,244,233,0.98)_0%,rgba(250,244,233,0.9)_34%,rgba(250,244,233,0.46)_54%,rgba(250,244,233,0.06)_74%,rgba(250,244,233,0)_100%)]"
      />
      <div
        aria-hidden="true"
        className={`absolute inset-0 bg-gradient-to-br ${THEME_TINT[slide.theme]} via-transparent to-transparent opacity-25 lg:opacity-40`}
      />

      <BrandSideMark slide={slide} />

      <div className="relative mx-auto flex h-full max-w-7xl items-end px-5 pb-20 pt-8 sm:px-10 sm:pb-16 lg:items-center lg:py-16">
        <div className="max-w-xl">
          <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-sage-deep sm:text-[11px] sm:tracking-[0.22em]">
            <span aria-hidden="true" className="h-px w-6 bg-sage-deep/60 sm:w-8" />
            {slide.eyebrow}
          </p>

          <h1 className="mt-3 max-w-[13ch] text-balance font-display text-[2.28rem] leading-[1] text-ink min-[390px]:text-[2.55rem] sm:mt-5 sm:text-6xl lg:text-7xl">
            {slide.title}{" "}
            <em className="not-italic text-coral-deep">{slide.titleAccent}</em>
          </h1>

          <div className="mt-4 max-w-lg space-y-2 text-[0.92rem] leading-relaxed text-ink-soft sm:mt-6 sm:space-y-3 sm:text-lg">
            {paragraphs.map((paragraph, idx) => (
              <p key={paragraph} className={idx > 0 ? "hidden sm:block" : undefined}>
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2 sm:mt-8 sm:gap-3">
            <Link
              href={slide.primaryCta.href}
              className="inline-flex items-center justify-center rounded-full bg-sage-deep px-5 py-3 text-sm font-semibold text-cream-soft shadow-lg shadow-ink/10 transition hover:bg-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-deep focus-visible:ring-offset-2 focus-visible:ring-offset-cream-soft sm:px-7 sm:py-3.5"
            >
              {slide.primaryCta.label}
              <span aria-hidden="true" className="ml-2">
                -&gt;
              </span>
            </Link>
            <Link
              href={slide.secondaryCta.href}
              className="inline-flex items-center justify-center px-1 py-3 text-sm font-semibold text-ink underline decoration-sage-deep/40 underline-offset-8 transition hover:text-sage-deep hover:decoration-sage-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-deep focus-visible:ring-offset-2 focus-visible:ring-offset-cream-soft sm:px-2 sm:py-3.5"
            >
              {slide.secondaryCta.label}
            </Link>
          </div>
        </div>
      </div>

      {slide.imageCaption && (
        <p className="absolute bottom-5 left-6 right-6 hidden max-w-sm rounded-full border border-cream-soft/60 bg-cream-soft/84 px-4 py-2 text-center text-xs font-medium text-ink-soft shadow-lg shadow-ink/10 backdrop-blur lg:left-auto lg:right-24 lg:block">
          {slide.imageCaption}
        </p>
      )}
    </div>
  );
}

function BrandSideMark({ slide }: { slide: HeroSlideConfig }) {
  return (
    <aside
      aria-hidden="true"
      className="absolute left-14 top-[21%] z-10 hidden w-56 min-[1360px]:block 2xl:left-[5.6vw]"
    >
      <div className="relative">
        <div
          className={`relative overflow-hidden rounded-[8px] border px-5 py-6 shadow-xl shadow-ink/8 backdrop-blur-md ${THEME_MARK[slide.theme]}`}
        >
          <div className="absolute -right-9 -top-9 h-28 w-28 rounded-full border border-current/20" />
          <div className="absolute -bottom-12 left-8 h-32 w-32 rounded-full bg-cream-soft/34 blur-xl" />

          <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-ink-soft">
            marca curada
          </p>
          <div className="mt-5 flex items-center gap-4">
            <span className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full border border-current/24 bg-cream-soft/58 font-display text-4xl leading-none text-ink shadow-sm shadow-ink/8">
              {slide.brand.monogram}
            </span>
            <span className="h-px min-w-0 flex-1 bg-current/28" />
          </div>

          <p className="mt-5 font-display text-3xl leading-[0.92] text-ink">
            {slide.brand.name}
          </p>
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-current">
            {slide.brand.note}
          </p>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {slide.brand.details.map((detail) => (
              <span
                key={detail}
                className="rounded-full border border-current/18 bg-cream-soft/44 px-2.5 py-1 text-[10px] font-medium text-ink-soft"
              >
                {detail}
              </span>
            ))}
          </div>
        </div>

        <div className="absolute -left-5 top-7 h-28 w-px bg-sage-deep/30" />
        <div className="absolute -left-6 top-5 h-2.5 w-2.5 rounded-full bg-coral/80 shadow-sm shadow-ink/10" />
        <div className="absolute -left-6 top-40 h-2.5 w-2.5 rounded-full border border-sage-deep/40 bg-cream-soft" />
      </div>
    </aside>
  );
}
