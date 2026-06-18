"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HERO_SLIDES } from "@/lib/home-content";
import { HeroSlide } from "@/components/Home/HeroSlide";

/**
 * Hero da home como banner full-bleed em carrossel.
 *
 * - Banner alto (480px mobile / 560px md / 620px lg) com imagem cobrindo
 *   toda a area.
 * - Setas circulares nas laterais (prev/next).
 * - Dots no canto inferior direito (estilo Carol Rosa).
 * - Auto-rotate a cada 7s; pausa ao hover/foco; reseta o timer quando o
 *   usuario navega manualmente (evita "vira ja" depois do clique).
 * - Respeita prefers-reduced-motion (sem auto-rotate).
 */
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
      className="relative bg-cream-soft border-b border-cream-deep/40"
      aria-label="Destaques da loja"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="relative h-[460px] sm:h-[520px] md:h-[580px] lg:h-[640px] overflow-hidden">
        {/* Trilho horizontal: cada slide ocupa 100% da largura; translateX
            move o conjunto. Crossfade vertical evitado pra nao sobrepor
            duas imagens durante a transicao. */}
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
            {/* Setas — desktop only */}
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              aria-label="Slide anterior"
              className="hidden md:inline-flex absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 z-20 h-12 w-12 items-center justify-center rounded-full bg-cream-soft/85 backdrop-blur text-ink shadow-md shadow-ink/10 hover:bg-cream-soft hover:text-coral-deep transition focus:outline-none focus-visible:ring-2 focus-visible:ring-coral"
            >
              <span aria-hidden="true" className="text-xl">
                ←
              </span>
            </button>
            <button
              type="button"
              onClick={() => goTo(active + 1)}
              aria-label="Proximo slide"
              className="hidden md:inline-flex absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 z-20 h-12 w-12 items-center justify-center rounded-full bg-cream-soft/85 backdrop-blur text-ink shadow-md shadow-ink/10 hover:bg-cream-soft hover:text-coral-deep transition focus:outline-none focus-visible:ring-2 focus-visible:ring-coral"
            >
              <span aria-hidden="true" className="text-xl">
                →
              </span>
            </button>

            {/* Dots — bottom right (estilo Carol Rosa) */}
            <div className="absolute bottom-6 right-6 lg:bottom-8 lg:right-10 z-20 flex items-center gap-2">
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
