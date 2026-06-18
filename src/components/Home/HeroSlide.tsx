import Image from "next/image";
import Link from "next/link";
import type { HeroSlide as HeroSlideConfig } from "@/lib/home-content";

const THEME_TINT: Record<HeroSlideConfig["theme"], string> = {
  warm: "from-coral-soft/75",
  cool: "from-sage-soft/80",
  earthy: "from-cream-deep/80",
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
        sizes="100vw"
        className="object-cover lg:object-[center_center]"
        style={{ objectPosition: slide.imagePosition ?? "center" }}
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(250,244,233,0.94)_0%,rgba(250,244,233,0.82)_42%,rgba(250,244,233,0.28)_70%,rgba(250,244,233,0.08)_100%)] lg:bg-[linear-gradient(90deg,rgba(250,244,233,0.98)_0%,rgba(250,244,233,0.92)_34%,rgba(250,244,233,0.52)_52%,rgba(250,244,233,0.08)_72%,rgba(250,244,233,0)_100%)]"
      />
      <div
        aria-hidden="true"
        className={`absolute inset-0 bg-gradient-to-br ${THEME_TINT[slide.theme]} via-transparent to-transparent opacity-45`}
      />

      <div className="relative mx-auto flex h-full max-w-7xl items-center px-6 py-10 sm:px-10 lg:py-16">
        <div className="max-w-xl">
          <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-sage-deep">
            <span aria-hidden="true" className="h-px w-8 bg-sage-deep/60" />
            {slide.eyebrow}
          </p>

          <h1 className="mt-5 max-w-[11ch] font-display text-5xl leading-[0.98] text-ink sm:text-6xl lg:text-7xl">
            {slide.title}{" "}
            <em className="not-italic text-coral-deep">{slide.titleAccent}</em>
          </h1>

          <div className="mt-5 max-w-lg space-y-3 text-base leading-relaxed text-ink-soft sm:mt-6 sm:text-lg">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
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
              className="inline-flex items-center justify-center rounded-full border border-ink/15 bg-cream-soft/78 px-6 py-3.5 text-sm font-semibold text-ink shadow-sm shadow-ink/5 backdrop-blur transition hover:border-coral-deep hover:text-coral-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-coral"
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
