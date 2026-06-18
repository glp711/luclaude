import Image from "next/image";
import Link from "next/link";
import type { HeroSlide as HeroSlideConfig } from "@/lib/home-content";

const THEME_SURFACE: Record<HeroSlideConfig["theme"], string> = {
  warm:
    "bg-[linear-gradient(135deg,var(--color-cream-soft)_0%,#fff9f1_48%,var(--color-coral-soft)_130%)]",
  cool:
    "bg-[linear-gradient(135deg,var(--color-cream-soft)_0%,#fbf7ef_45%,var(--color-sage-soft)_125%)]",
  earthy:
    "bg-[linear-gradient(135deg,var(--color-cream)_0%,#fff8ed_45%,var(--color-cream-deep)_125%)]",
};

const THEME_HALO: Record<HeroSlideConfig["theme"], string> = {
  warm: "bg-coral-soft/65",
  cool: "bg-sage-soft/80",
  earthy: "bg-cream-deep/80",
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
    <div className={`relative h-full w-full overflow-hidden ${THEME_SURFACE[slide.theme]}`}>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cream-deep to-transparent"
      />
      <div
        aria-hidden="true"
        className={`absolute -right-24 top-16 h-80 w-80 rounded-full blur-3xl ${THEME_HALO[slide.theme]}`}
      />
      <div
        aria-hidden="true"
        className="absolute -left-28 bottom-8 h-64 w-64 rounded-full bg-sage-soft/45 blur-3xl"
      />

      <div className="relative mx-auto grid h-full max-w-7xl grid-rows-[auto_1fr] gap-6 px-6 py-8 sm:gap-8 sm:px-10 sm:py-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(420px,1fr)] lg:grid-rows-1 lg:items-center lg:gap-14 lg:py-16">
        <div className="relative z-10 flex flex-col justify-center">
          <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-sage-deep">
            <span aria-hidden="true" className="h-px w-8 bg-sage-deep/60" />
            {slide.eyebrow}
          </p>

          <h1 className="mt-5 max-w-[11ch] font-display text-[2.85rem] leading-[0.98] text-ink sm:text-6xl lg:text-7xl">
            {slide.title}{" "}
            <em className="not-italic text-coral-deep">{slide.titleAccent}</em>
          </h1>

          <div className="mt-5 max-w-xl space-y-3 text-[0.98rem] leading-relaxed text-ink-soft sm:mt-6 sm:text-lg">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3 sm:mt-8">
            <Link
              href={slide.primaryCta.href}
              className="inline-flex items-center justify-center rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-cream-soft shadow-lg shadow-ink/10 transition hover:bg-coral-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-coral-deep focus-visible:ring-offset-2 focus-visible:ring-offset-cream-soft"
            >
              {slide.primaryCta.label}
              <span aria-hidden="true" className="ml-2">
                →
              </span>
            </Link>
            <Link
              href={slide.secondaryCta.href}
              className="inline-flex items-center justify-center rounded-full border border-ink/15 bg-cream-soft/80 px-6 py-3.5 text-sm font-semibold text-ink shadow-sm shadow-ink/5 backdrop-blur transition hover:border-coral-deep hover:text-coral-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-coral"
            >
              {slide.secondaryCta.label}
            </Link>
          </div>

          <dl className="mt-9 hidden max-w-md grid-cols-3 gap-3 text-center sm:grid sm:text-left">
            {[
              ["11", "marcas"],
              ["2020", "desde"],
              ["100%", "curadoria"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-[8px] border border-cream-deep/80 bg-cream-soft/70 px-3 py-3 shadow-sm shadow-ink/5"
              >
                <dt className="font-display text-2xl leading-none text-coral-deep">
                  {value}
                </dt>
                <dd className="mt-1 text-[10px] uppercase tracking-[0.16em] text-ink-soft">
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative min-h-[260px] sm:min-h-[360px] lg:h-[560px]">
          <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-[8px] border border-cream-deep bg-cream-soft/70" />
          <div className="relative h-full overflow-hidden rounded-[8px] border border-cream-deep bg-cream shadow-2xl shadow-ink/12">
            <Image
              src={slide.imageSrc}
              alt={slide.imageAlt}
              fill
              priority={priority}
              sizes="(max-width: 1024px) 100vw, 48vw"
              className="object-cover"
              style={{ objectPosition: slide.imagePosition ?? "center" }}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-ink/24 via-transparent to-cream-soft/8"
            />
            {slide.imageCaption && (
              <p className="absolute bottom-4 left-4 right-4 rounded-full border border-cream-soft/60 bg-cream-soft/86 px-4 py-2 text-center text-xs font-medium text-ink-soft shadow-lg shadow-ink/10 backdrop-blur">
                {slide.imageCaption}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
