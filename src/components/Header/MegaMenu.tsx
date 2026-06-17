"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MENU_GROUPS, NAV_ITEMS, type MenuGroup } from "@/lib/navigation";
import { buildProductsUrl } from "@/lib/url";

/**
 * Barra de navegacao principal com mega menu por grupo.
 *
 * Desktop:
 *  - Abre painel ao passar mouse OU receber foco
 *  - Mantem aberto enquanto cursor estiver dentro de qualquer parte (bridge invisivel)
 *  - Fecha ao ESC, click-fora ou navegar
 *  - ARIA: aria-expanded, aria-controls, aria-haspopup
 *
 * Mobile: este componente eh hidden lg:block — drawer separado lida com mobile.
 */
export function MegaMenu() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  // Timeout que permite mover o cursor entre item da nav e painel sem fechar
  const closeTimer = useRef<number | null>(null);

  const open = (slug: string) => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpenSlug(slug);
  };

  const scheduleClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenSlug(null), 120);
  };

  const closeNow = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = null;
    setOpenSlug(null);
  };

  // ESC fecha
  useEffect(() => {
    if (!openSlug) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeNow();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openSlug]);

  // Click fora fecha
  useEffect(() => {
    if (!openSlug) return;
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closeNow();
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [openSlug]);

  return (
    <div ref={containerRef} className="hidden lg:block relative">
      <nav
        aria-label="Navegacao principal"
        className="mx-auto max-w-7xl px-6 flex items-center justify-center gap-1"
        onMouseLeave={scheduleClose}
      >
        {NAV_ITEMS.map((item) => {
          if (item.kind === "link") {
            return (
              <Link
                key={item.slug}
                href={item.href}
                className="px-3 py-3 text-sm font-medium text-ink hover:text-coral-deep transition focus:outline-none focus-visible:ring-2 focus-visible:ring-coral"
                onFocus={closeNow}
              >
                {item.label}
              </Link>
            );
          }
          const group = MENU_GROUPS.find((g) => g.slug === item.slug);
          if (!group) return null;
          const isOpen = openSlug === item.slug;
          return (
            <div key={item.slug} className="relative">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-haspopup="true"
                aria-controls={`mega-panel-${item.slug}`}
                onMouseEnter={() => open(item.slug)}
                onFocus={() => open(item.slug)}
                onClick={() => (isOpen ? closeNow() : open(item.slug))}
                className={`px-3 py-3 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-coral ${
                  isOpen
                    ? "text-coral-deep"
                    : "text-ink hover:text-coral-deep"
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className="ml-1 inline-block translate-y-[-1px] text-[10px] text-ink-mute"
                >
                  ▾
                </span>
              </button>
            </div>
          );
        })}
      </nav>

      {/* Painel — overlay sutil + container */}
      {openSlug && (
        <div
          id={`mega-panel-${openSlug}`}
          role="region"
          aria-label={MENU_GROUPS.find((g) => g.slug === openSlug)?.label}
          className="absolute left-0 right-0 top-full z-40"
          onMouseEnter={() => open(openSlug)}
          onMouseLeave={scheduleClose}
        >
          {/* "Bridge" pra evitar fechamento ao mover entre botao e painel */}
          <div aria-hidden="true" className="h-2" />
          <MegaPanel
            group={MENU_GROUPS.find((g) => g.slug === openSlug)!}
            onNavigate={closeNow}
          />
        </div>
      )}
      {openSlug && (
        <div
          aria-hidden="true"
          className="fixed inset-0 top-[var(--header-height,180px)] z-30 bg-ink/10 pointer-events-none"
        />
      )}
    </div>
  );
}

function MegaPanel({
  group,
  onNavigate,
}: {
  group: MenuGroup;
  onNavigate: () => void;
}) {
  const hasFeature = !!group.feature;
  const cols = hasFeature ? "lg:grid-cols-[1fr_280px]" : "lg:grid-cols-1";
  return (
    <div className={`bg-cream-soft border-y border-cream-deep shadow-xl shadow-ink/5`}>
      <div className={`mx-auto max-w-7xl px-6 py-8 grid gap-8 ${cols}`}>
        <div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
            {group.types.map((type) => (
              <div key={type.categorySlug}>
                <Link
                  href={buildProductsUrl({ categoria: type.categorySlug })}
                  onClick={onNavigate}
                  className="block font-display text-lg text-ink hover:text-coral-deep transition"
                >
                  {type.label}
                </Link>
                <ul className="mt-2 space-y-1">
                  {type.brands.map((brand) => (
                    <li key={brand.slug}>
                      <Link
                        href={buildProductsUrl({
                          categoria: type.categorySlug,
                          marca: brand.slug,
                        })}
                        onClick={onNavigate}
                        className="text-sm text-ink-soft hover:text-coral-deep transition"
                      >
                        {brand.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href={buildProductsUrl({ categoria: type.categorySlug })}
                      onClick={onNavigate}
                      className="text-xs uppercase tracking-widest text-sage-deep hover:text-coral-deep transition"
                    >
                      Ver todos →
                    </Link>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </div>
        {group.feature && (
          <aside className="hidden lg:flex flex-col rounded-2xl bg-cream border border-cream-deep p-5">
            {group.feature.imageSrc && (
              <div
                className="aspect-[4/3] rounded-xl bg-cover bg-center mb-4 border border-cream-deep"
                style={{ backgroundImage: `url(${group.feature.imageSrc})` }}
                role="img"
                aria-label={group.feature.title}
              />
            )}
            {group.feature.eyebrow && (
              <p className="text-xs uppercase tracking-widest text-sage-deep">
                {group.feature.eyebrow}
              </p>
            )}
            <p className="mt-1 font-display text-xl text-ink">{group.feature.title}</p>
            {group.feature.description && (
              <p className="mt-1 text-sm text-ink-soft leading-relaxed">
                {group.feature.description}
              </p>
            )}
            <Link
              href={group.feature.ctaHref}
              onClick={onNavigate}
              className="mt-4 inline-flex items-center justify-center rounded-full bg-coral px-5 py-2.5 text-sm font-medium text-white hover:bg-coral-deep transition"
            >
              {group.feature.ctaLabel}
            </Link>
          </aside>
        )}
      </div>
    </div>
  );
}
