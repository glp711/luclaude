"use client";

import { useEffect, useRef, useState } from "react";
import { HeroSlide } from "@/components/Home/HeroSlide";
import { HERO_SLIDES } from "@/lib/home-content";

const ROTATE_MS = 5000;
const SWIPE_THRESHOLD = 42;

function normalizeSlide(index: number) {
  return ((index % HERO_SLIDES.length) + HERO_SLIDES.length) % HERO_SLIDES.length;
}

export function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const paused = hoverPaused || userPaused;

  useEffect(() => {
    if (HERO_SLIDES.length <= 1 || paused) return;

    const timeout = window.setTimeout(() => {
      setActive((current) => normalizeSlide(current + 1));
    }, ROTATE_MS);

    return () => window.clearTimeout(timeout);
  }, [active, paused]);

  const goTo = (index: number) => {
    setActive(normalizeSlide(index));
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    const touch = event.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLElement>) => {
    if (touchStartX.current == null || touchStartY.current == null) return;
    const touch = event.changedTouches[0];
    const diffX = touch.clientX - touchStartX.current;
    const diffY = touch.clientY - touchStartY.current;
    touchStartX.current = null;
    touchStartY.current = null;

    if (Math.abs(diffX) < SWIPE_THRESHOLD || Math.abs(diffX) < Math.abs(diffY)) return;
    goTo(active + (diffX < 0 ? 1 : -1));
  };

  if (HERO_SLIDES.length === 0) return null;

  return (
    <section
      className="relative border-b border-cream-deep/50 bg-cream-soft"
      aria-label="Destaques da curadoria"
      aria-roledescription="carousel"
      data-active-slide={active}
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => setHoverPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative h-[610px] overflow-hidden sm:h-[650px] lg:h-[640px]">
        <div
          className="flex h-full transition-transform duration-700 ease-out"
          style={{
            transform: `translate3d(-${active * (100 / HERO_SLIDES.length)}%, 0, 0)`,
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
              className="absolute left-3 top-1/2 z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-cream-deep bg-cream-soft/82 text-ink shadow-md shadow-ink/10 backdrop-blur transition hover:bg-cream-soft hover:text-coral-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-coral lg:left-6"
            >
              <span aria-hidden="true" className="text-xl leading-none">
                &lt;
              </span>
            </button>
            <button
              type="button"
              onClick={() => goTo(active + 1)}
              aria-label="Proximo slide"
              className="absolute right-3 top-1/2 z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-cream-deep bg-cream-soft/82 text-ink shadow-md shadow-ink/10 backdrop-blur transition hover:bg-cream-soft hover:text-coral-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-coral lg:right-6"
            >
              <span aria-hidden="true" className="text-xl leading-none">
                &gt;
              </span>
            </button>

            <div className="absolute bottom-4 left-5 z-20 flex items-center gap-2 lg:bottom-8 lg:left-10">
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

            <button
              type="button"
              onClick={() => setUserPaused((current) => !current)}
              aria-label={userPaused ? "Retomar banners automaticos" : "Pausar banners automaticos"}
              aria-pressed={userPaused}
              className="absolute bottom-3 right-4 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border border-cream-deep bg-cream-soft/82 text-ink-soft shadow-sm shadow-ink/10 backdrop-blur transition hover:text-coral-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-coral lg:bottom-7 lg:right-10"
            >
              {userPaused ? (
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                  <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
                </svg>
              )}
            </button>

            <div className="absolute inset-x-0 bottom-0 z-10 h-1 bg-ink/5">
              <div
                key={`${active}-${paused ? "paused" : "play"}`}
                className={paused ? "h-full bg-coral/45" : "h-full origin-left animate-hero-progress bg-coral"}
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
