"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ProductCard, type ProductCardData } from "@/components/ProductCard";

/**
 * Carrossel horizontal de produtos com setas no desktop e scroll-snap no mobile.
 */
export function ProductCarousel({
  products,
  title,
  eyebrow,
  viewAllHref,
  viewAllLabel = "Ver tudo",
}: {
  products: ProductCardData[];
  title: string;
  eyebrow: string;
  viewAllHref: string;
  viewAllLabel?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [activePage, setActivePage] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  const getScrollStep = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return 0;
    const card = el.querySelector<HTMLElement>("[data-carousel-card]");
    if (!card) return Math.round(el.clientWidth * 0.75);
    const styles = window.getComputedStyle(el);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
    return Math.round(card.getBoundingClientRect().width + gap);
  }, []);

  const updateState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
    const step = Math.max(1, getScrollStep());
    const pages = Math.max(1, Math.ceil(maxScroll / step) + 1);
    setCanScrollPrev(el.scrollLeft > 4);
    setCanScrollNext(el.scrollLeft < maxScroll - 4);
    setPageCount(pages);
    setActivePage(Math.min(pages - 1, Math.round(el.scrollLeft / step)));
  }, [getScrollStep]);

  useEffect(() => {
    updateState();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateState, { passive: true });
    window.addEventListener("resize", updateState);
    const resizeObserver = new ResizeObserver(updateState);
    resizeObserver.observe(el);
    const timeout = window.setTimeout(updateState, 350);
    return () => {
      el.removeEventListener("scroll", updateState);
      window.removeEventListener("resize", updateState);
      resizeObserver.disconnect();
      window.clearTimeout(timeout);
    };
  }, [products.length, updateState]);

  const scroll = (dir: "prev" | "next") => {
    const el = scrollerRef.current;
    if (!el) return;
    const delta = getScrollStep();
    el.scrollBy({
      left: dir === "next" ? delta : -delta,
      behavior: "smooth",
    });
  };

  const goToPage = (index: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({
      left: getScrollStep() * index,
      behavior: "smooth",
    });
  };

  if (products.length === 0) return null;

  return (
    <section className="relative overflow-hidden border-b border-cream-deep/35 bg-cream-soft">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.65),transparent_34%),radial-gradient(circle_at_18%_75%,rgba(248,211,203,0.18),transparent_32%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[38%] bg-[url('/patterns/floral-cream-editorial-2026-07-10.jpg')] bg-cover bg-center opacity-20 mix-blend-multiply lg:block"
      />

      <div className="relative mx-auto max-w-[86rem] px-5 py-14 sm:px-8 sm:py-20 xl:px-0">
        <div className="mx-auto mb-11 max-w-3xl text-center">
          <div className="flex items-center justify-center gap-6">
            <span aria-hidden="true" className="hidden h-px w-40 bg-ink/28 sm:block" />
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-coral/45 bg-cream-soft text-coral-deep shadow-md shadow-ink/10">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8" aria-hidden="true">
                <path d="m4 8 4 3 4-6 4 6 4-3-2 10H6L4 8Z" />
                <path d="M7 21h10" />
              </svg>
            </span>
            <span aria-hidden="true" className="hidden h-px w-40 bg-ink/28 sm:block" />
          </div>
          <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.28em] text-sage-deep">
            selecao essencial
          </p>
          <h2 className="mt-3 font-display text-3xl uppercase tracking-[0.34em] text-ink sm:text-4xl xl:text-[2.65rem]">
            {title}
          </h2>
          {eyebrow && (
            <p className="mt-3 text-xs font-medium lowercase tracking-[0.16em] text-ink-mute">
              {eyebrow}
            </p>
          )}
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-20 bg-gradient-to-r from-cream-soft to-transparent lg:block" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-20 bg-gradient-to-l from-cream-soft to-transparent lg:block" />
          <div className="absolute -left-4 top-[43%] z-20 hidden lg:block xl:-left-16">
            <button
              type="button"
              onClick={() => scroll("prev")}
              disabled={!canScrollPrev}
              aria-label="Anterior"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-cream-deep bg-cream-soft/94 text-ink shadow-lg shadow-ink/10 backdrop-blur transition hover:-translate-x-0.5 hover:border-sage-deep hover:text-sage-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-deep disabled:cursor-not-allowed disabled:opacity-30 xl:h-14 xl:w-14"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
          </div>
          <div className="absolute -right-4 top-[43%] z-20 hidden lg:block xl:-right-16">
            <button
              type="button"
              onClick={() => scroll("next")}
              disabled={!canScrollNext}
              aria-label="Proximo"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-cream-deep bg-cream-soft/94 text-ink shadow-lg shadow-ink/10 backdrop-blur transition hover:translate-x-0.5 hover:border-sage-deep hover:text-sage-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-deep disabled:cursor-not-allowed disabled:opacity-30 xl:h-14 xl:w-14"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>

          <div
            ref={scrollerRef}
            className="hide-scrollbar -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-5 pb-2 sm:-mx-8 sm:gap-6 sm:px-8 lg:mx-0 lg:px-0 xl:gap-7"
          >
            {products.map((p, index) => (
              <div
                key={p.id}
                data-carousel-card
                className="w-[66%] flex-shrink-0 snap-start min-[440px]:w-[56%] sm:w-[36%] lg:w-[23.5%]"
              >
                <ProductCard product={p} rank={index + 1} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-5">
          {pageCount > 1 && (
            <div className="flex items-center justify-center gap-2" aria-label="Paginas do carrossel">
              {Array.from({ length: pageCount }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => goToPage(index)}
                  aria-label={`Ir para pagina ${index + 1}`}
                  aria-pressed={activePage === index}
                  className={`h-2 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-deep focus-visible:ring-offset-2 focus-visible:ring-offset-cream-soft ${
                    activePage === index ? "w-8 bg-sage-deep" : "w-2 bg-ink/24 hover:bg-ink/45"
                  }`}
                />
              ))}
            </div>
          )}

          <div className="text-center">
            <Link
              href={viewAllHref}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-ink underline decoration-sage-deep/30 underline-offset-8 transition hover:text-sage-deep hover:decoration-sage-deep"
            >
              {viewAllLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
