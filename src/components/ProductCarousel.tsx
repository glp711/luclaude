"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ProductCard, type ProductCardData } from "@/components/ProductCard";

/**
 * Carrossel horizontal de produtos com setas (desktop) e scroll-snap (mobile).
 *
 * Recebe a lista pronta via prop — o fetch eh feito num server component pai
 * (ver FeaturedProducts.tsx).
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
    <section className="mx-auto max-w-7xl px-6 py-14">
      <div className="flex items-end justify-between gap-3 mb-7">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-sage-deep">
            {eyebrow}
          </p>
          <h2 className="mt-2 font-display text-4xl text-ink">{title}</h2>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={viewAllHref}
            className="hidden sm:inline-block text-sm text-ink-soft hover:text-coral-deep transition"
          >
            {viewAllLabel} →
          </Link>
          <div className="hidden md:flex gap-2">
            <button
              type="button"
              onClick={() => scroll("prev")}
              disabled={!canScrollPrev}
              aria-label="Anterior"
              className="h-10 w-10 rounded-full border border-cream-deep bg-cream-soft text-ink hover:border-coral hover:text-coral-deep disabled:opacity-40 disabled:cursor-not-allowed transition focus:outline-none focus-visible:ring-2 focus-visible:ring-coral inline-flex items-center justify-center"
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              type="button"
              onClick={() => scroll("next")}
              disabled={!canScrollNext}
              aria-label="Proximo"
              className="h-10 w-10 rounded-full border border-cream-deep bg-cream-soft text-ink hover:border-coral hover:text-coral-deep disabled:opacity-40 disabled:cursor-not-allowed transition focus:outline-none focus-visible:ring-2 focus-visible:ring-coral inline-flex items-center justify-center"
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="hide-scrollbar flex gap-4 sm:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory -mx-6 px-6 pb-2"
      >
        {products.map((p) => (
          <div
            key={p.id}
            className="snap-start flex-shrink-0 w-[68%] sm:w-[42%] lg:w-[23.5%]"
          >
            <ProductCard product={p} />
          </div>
        ))}
      </div>

      <div className="mt-6 sm:hidden text-center">
        <Link
          href={viewAllHref}
          className="text-sm text-ink-soft hover:text-coral-deep transition"
        >
          {viewAllLabel} →
        </Link>
      </div>
    </section>
  );
}
