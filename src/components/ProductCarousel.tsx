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
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[46%] bg-[url('/patterns/floral-cream-editorial-2026-07-10.jpg')] bg-cover bg-center opacity-55 mix-blend-multiply lg:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-cream-soft via-cream-soft/96 to-cream-soft/72"
      />

      <div className="relative mx-auto max-w-[92rem] px-6 py-12 sm:py-16">
        <div className="mb-8 flex items-end justify-between gap-3">
          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-sage-deep">
              selecao essencial
            </p>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 className="flex items-center gap-2 text-xl font-semibold lowercase tracking-[-0.01em] text-ink sm:text-2xl">
                <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-ink" />
                {title}
              </h2>
              <span className="text-xl font-medium lowercase tracking-[-0.01em] text-ink-mute sm:text-2xl">
                {eyebrow}
              </span>
            </div>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink-soft">
              Poucas escolhas, boa presenca: fragrancias e presentes para entrar no catalogo sem pressa.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={viewAllHref}
              className="hidden text-sm font-medium text-ink underline decoration-sage-deep/30 underline-offset-8 transition hover:text-sage-deep hover:decoration-sage-deep sm:inline-block"
            >
              {viewAllLabel}
            </Link>
            <div className="hidden gap-2 md:flex">
              <button
                type="button"
                onClick={() => scroll("prev")}
                disabled={!canScrollPrev}
                aria-label="Anterior"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream-deep bg-cream text-ink transition hover:border-sage-deep hover:text-sage-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-deep disabled:cursor-not-allowed disabled:opacity-35"
              >
                <span aria-hidden="true">{"<"}</span>
              </button>
              <button
                type="button"
                onClick={() => scroll("next")}
                disabled={!canScrollNext}
                aria-label="Proximo"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream-deep bg-cream text-ink transition hover:border-sage-deep hover:text-sage-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-deep disabled:cursor-not-allowed disabled:opacity-35"
              >
                <span aria-hidden="true">{">"}</span>
              </button>
            </div>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="hide-scrollbar -mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-6 pb-2 sm:gap-7"
        >
          {products.map((p) => (
            <div
              key={p.id}
              className="w-[58%] flex-shrink-0 snap-start sm:w-[34%] lg:w-[18.5%]"
            >
              <ProductCard product={p} />
            </div>
          ))}
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
