"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function CatalogMobileFilters({
  children,
  activeCount,
  resultLabel,
}: {
  children: React.ReactNode;
  activeCount: number;
  resultLabel?: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <div className="sticky top-[111px] z-20 -mx-4 border-y border-cream-deep bg-cream/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Abrir filtros do catalogo"
            aria-expanded={open}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-coral-soft bg-cream-soft px-4 text-sm font-semibold text-ink shadow-sm shadow-ink/5 transition hover:border-coral hover:text-coral-deep"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.8"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
            Filtros
            {activeCount > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-coral px-1.5 text-[11px] text-white">
                {activeCount}
              </span>
            )}
          </button>
          {resultLabel && (
            <p className="min-w-0 truncate text-right text-xs text-ink-soft">{resultLabel}</p>
          )}
        </div>
      </div>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            id="catalog-mobile-filters"
            role="dialog"
            aria-modal="true"
            aria-label="Filtros do catalogo"
            className="fixed inset-0 z-50 lg:hidden"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fechar filtros"
              className="absolute inset-0 bg-ink/45 backdrop-blur-sm"
            />
            <aside className="absolute bottom-0 left-0 top-0 flex w-[88%] max-w-sm flex-col bg-cream-soft shadow-2xl shadow-ink/25">
              <div className="flex items-center justify-between border-b border-cream-deep p-4">
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-sage-deep">catalogo</p>
                  <h2 className="font-display text-2xl text-ink">Filtros</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Fechar"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream-deep text-ink transition hover:border-coral hover:text-coral-deep"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">{children}</div>
            </aside>
          </div>,
          document.body
        )}
    </>
  );
}
