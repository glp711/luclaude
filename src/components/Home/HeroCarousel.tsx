"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HERO_SLIDES } from "@/lib/home-content";
import { HeroSlide } from "@/components/Home/HeroSlide";

const ROTATE_MS = 7000;

export function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    if (HERO_SLIDES.length <= 1) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    timerRef.current = window.setInterval(
      () => setActive((i) => (i + 1) % HERO_SLIDES.length),
      ROTATE_MS
    );
  }, [clearTimer]);

  useEffect(() => {
    if (paused) {
      clearTimer();
      return;
    }
    startTimer();
    return clearTimer;
  }, [paused, startTimer, clearTimer]);

  const goTo = (idx: number) => {
    setActive(((idx % HERO_SLIDES.length) + HERO_SLIDES.length) % HERO_SLIDES.length);
    if (!paused) startTimer();
  };

  return (
    <section
      className="relative border-b border-cream-deep/50 bg-cream-soft"
      aria-label="Destaques da curadoria"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="relative h-[610px] overflow-hidden sm:h-[650px] lg:h-[640px]">
        <div
          className="flex h-full transition-transform duration-700 ease-out"
          style={{
            transform: `translateX(-${active * (100 / HERO_SLIDES.length)}%)`,
            width: `${HERO_SLIDES.length * 100}%`,
          }}
        >
          {HERO_SLIDES.map((slide, idx) => (
            <div
              key={idx}
              role="group"
              aria-roledescription="slide"
              aria-label={`${idx + 1} de ${HERO_SLIDES.length}`}
              aria-hidden={idx !== active}
              className="relative h-full flex-shrink-0"
              style={{ width: `${100 / HERO_SLIDES.length}%` }}
            >
              <HeroSlide slide={slide} priority={idx === 0} />
            </div>
          ))}
        </div>

        {HERO_SLIDES.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              aria-label="Slide anterior"
              className="absolute bottom-16 right-20 z-20 hidden h-11 w-11 items-center justify-center rounded-full border border-cream-deep bg-cream-soft/85 text-ink shadow-md shadow-ink/10 backdrop-blur transition hover:bg-cream-soft hover:text-coral-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-coral md:inline-flex"
            >
              <span aria-hidden="true" className="text-xl">
                ←
              </span>
            </button>
            <button
              type="button"
              onClick={() => goTo(active + 1)}
              aria-label="Próximo slide"
              className="absolute bottom-16 right-6 z-20 hidden h-11 w-11 items-center justify-center rounded-full border border-cream-deep bg-cream-soft/85 text-ink shadow-md shadow-ink/10 backdrop-blur transition hover:bg-cream-soft hover:text-coral-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-coral md:inline-flex"
            >
              <span aria-hidden="true" className="text-xl">
                →
              </span>
            </button>

            <div className="absolute bottom-4 right-5 z-20 flex items-center gap-2 lg:bottom-8 lg:right-10">
              {HERO_SLIDES.map((slide, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goTo(idx)}
                  aria-label={`Ir para slide ${idx + 1}: ${slide.title} ${slide.titleAccent}`}
                  aria-pressed={idx === active}
                  className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-cream-soft ${
                    idx === active
                      ? "w-10 bg-coral"
                      : "w-2 bg-ink/30 hover:bg-ink/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
