"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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

  const updateState = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollPrev(el.scrollLeft > 4);
    setCanScrollNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateState();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateState, { passive: true });
    window.addEventListener("resize", updateState);
    return () => {
      el.removeEventListener("scroll", updateState);
      window.removeEventListener("resize", updateState);
    };
  }, [products.length]);

  const scroll = (dir: "prev" | "next") => {
    const el = scrollerRef.current;
    if (!el) return;
    const delta = Math.round(el.clientWidth * 0.85);
    el.scrollBy({
      left: dir === "next" ? delta : -delta,
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

      <div className="relative mx-auto max-w-[92rem] px-6 py-14 sm:py-20">
        <div className="mx-auto mb-12 max-w-3xl text-center">
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
          <h2 className="mt-3 font-display text-3xl uppercase tracking-[0.34em] text-ink sm:text-4xl">
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
          <div className="absolute left-0 top-[39%] z-20 hidden -translate-x-1/2 lg:block">
            <button
              type="button"
              onClick={() => scroll("prev")}
              disabled={!canScrollPrev}
              aria-label="Anterior"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-cream-deep bg-cream-soft/92 text-ink shadow-md shadow-ink/10 backdrop-blur transition hover:border-sage-deep hover:text-sage-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-deep disabled:cursor-not-allowed disabled:opacity-35"
            >
              <span aria-hidden="true">{"<"}</span>
            </button>
          </div>
          <div className="absolute right-0 top-[39%] z-20 hidden translate-x-1/2 lg:block">
            <button
              type="button"
              onClick={() => scroll("next")}
              disabled={!canScrollNext}
              aria-label="Proximo"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-cream-deep bg-cream-soft/92 text-ink shadow-md shadow-ink/10 backdrop-blur transition hover:border-sage-deep hover:text-sage-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-deep disabled:cursor-not-allowed disabled:opacity-35"
            >
              <span aria-hidden="true">{">"}</span>
            </button>
          </div>

          <div className="mb-5 flex items-center justify-end">
            <Link
              href={viewAllHref}
              className="hidden text-sm font-medium text-ink underline decoration-sage-deep/30 underline-offset-8 transition hover:text-sage-deep hover:decoration-sage-deep sm:inline-block"
            >
              {viewAllLabel}
            </Link>
          </div>

          <div
            ref={scrollerRef}
            className="hide-scrollbar -mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-6 pb-2 sm:gap-7 lg:mx-0 lg:px-0"
          >
            {products.map((p, index) => (
              <div
                key={p.id}
                className="w-[58%] flex-shrink-0 snap-start sm:w-[34%] lg:w-[22.5%]"
              >
                <ProductCard product={p} rank={index + 1} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href={viewAllHref}
            className="text-sm font-medium text-ink underline decoration-sage-deep/30 underline-offset-8 transition hover:text-sage-deep"
          >
            {viewAllLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
