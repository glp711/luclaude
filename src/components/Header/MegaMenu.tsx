"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { MenuGroup, MenuProductPreview, MenuType } from "@/lib/navigation";
import type { NavItem } from "@/lib/menu-data";
import { buildProductsUrl } from "@/lib/url";

export function MegaMenu({
  groups,
  navItems,
}: {
  groups: MenuGroup[];
  navItems: NavItem[];
}) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
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

  useEffect(() => {
    if (!openSlug) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeNow();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openSlug]);

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
        className="mx-auto flex max-w-[96rem] items-center justify-center gap-1.5 px-6 xl:px-10"
        onMouseLeave={scheduleClose}
      >
        {navItems.map((item) => {
          if (item.kind === "link") {
            return (
              <Link
                key={item.slug}
                href={item.href}
                className="rounded-full px-4 py-3.5 text-[15px] font-medium text-ink transition hover:bg-cream-soft hover:text-coral-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-coral xl:px-5"
                onFocus={closeNow}
              >
                {item.label}
              </Link>
            );
          }

          const group = groups.find((g) => g.slug === item.slug);
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
                className={`rounded-full px-4 py-3.5 text-[15px] font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-coral xl:px-5 ${
                  isOpen ? "bg-cream-soft text-coral-deep shadow-sm shadow-ink/5" : "text-ink hover:bg-cream-soft hover:text-coral-deep"
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className="ml-1.5 inline-block translate-y-[-1px] text-[10px] text-ink-mute"
                >
                  ▾
                </span>
              </button>
            </div>
          );
        })}
      </nav>

      {openSlug && (
        <div
          id={`mega-panel-${openSlug}`}
          role="region"
          aria-label={groups.find((g) => g.slug === openSlug)?.label}
          className="absolute left-0 right-0 top-full z-40"
          onMouseEnter={() => open(openSlug)}
          onMouseLeave={scheduleClose}
        >
          <div aria-hidden="true" className="h-2" />
          <MegaPanel
            key={openSlug}
            group={groups.find((g) => g.slug === openSlug)!}
            onNavigate={closeNow}
          />
        </div>
      )}

      {openSlug && (
        <div
          aria-hidden="true"
          className="fixed inset-0 top-[var(--header-height,180px)] z-30 bg-ink/10 pointer-events-none backdrop-blur-[1px]"
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
  const [activeSlug, setActiveSlug] = useState(group.types[0]?.categorySlug ?? "");

  const activeType = useMemo(
    () =>
      group.types.find((type) => type.categorySlug === activeSlug) ??
      group.types[0],
    [activeSlug, group.types]
  );

  const previews = activeType?.previews ?? [];

  return (
    <div className="border-y border-cream-deep bg-cream-soft shadow-xl shadow-ink/8">
      <div className="mx-auto grid max-w-[96rem] grid-cols-[minmax(0,0.72fr)_minmax(520px,1fr)] gap-12 px-8 py-9 xl:px-10">
        <div>
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-sage-deep">
            Escolha uma categoria
          </p>
          <div className="grid grid-cols-2 gap-x-8 gap-y-5">
            {group.types.map((type) => (
              <MenuTypeColumn
                key={type.categorySlug}
                type={type}
                active={activeType?.categorySlug === type.categorySlug}
                onHover={() => setActiveSlug(type.categorySlug)}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>

        <aside className="border-l border-cream-deep pl-8">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-coral-deep">
                Prévia dos produtos
              </p>
              <h3 className="mt-1 font-display text-4xl leading-tight text-ink">
                {activeType?.label ?? group.label}
              </h3>
            </div>
            {activeType && (
              <Link
                href={buildProductsUrl({ categoria: activeType.categorySlug })}
                onClick={onNavigate}
                className="text-xs font-semibold uppercase tracking-[0.2em] text-sage-deep underline decoration-sage-deep/30 underline-offset-8 transition hover:text-coral-deep hover:decoration-coral-deep"
              >
                Ver todos →
              </Link>
            )}
          </div>

          {previews.length > 0 ? (
            <div className="grid grid-cols-4 gap-4">
              {previews.map((product) => (
                <ProductPreviewCard
                  key={product.slug}
                  product={product}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[8px] border border-cream-deep bg-cream p-6 text-sm text-ink-soft">
              Passe por uma categoria para ver produtos da curadoria.
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function MenuTypeColumn({
  type,
  active,
  onHover,
  onNavigate,
}: {
  type: MenuType;
  active: boolean;
  onHover: () => void;
  onNavigate: () => void;
}) {
  return (
    <div
      onMouseEnter={onHover}
      onFocus={onHover}
      className={`rounded-[8px] border px-4 py-3.5 transition ${
        active
          ? "border-coral-soft bg-cream shadow-sm shadow-ink/5"
          : "border-transparent hover:border-cream-deep hover:bg-cream/60"
      }`}
    >
      <Link
        href={buildProductsUrl({ categoria: type.categorySlug })}
        onClick={onNavigate}
        className="block font-display text-xl leading-tight text-ink transition hover:text-coral-deep"
      >
        {type.label}
      </Link>
      <ul className="mt-2 space-y-1">
        {type.brands.slice(0, 4).map((brand) => (
          <li key={brand.slug}>
            <Link
              href={buildProductsUrl({
                categoria: type.categorySlug,
                marca: brand.slug,
              })}
              onClick={onNavigate}
              className="text-[15px] text-ink-soft transition hover:text-coral-deep"
            >
              {brand.label}
            </Link>
          </li>
        ))}
        {type.brands.length > 4 && (
          <li className="text-xs text-ink-mute">
            + {type.brands.length - 4} marcas
          </li>
        )}
      </ul>
    </div>
  );
}

function ProductPreviewCard({
  product,
  onNavigate,
}: {
  product: MenuProductPreview;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={`/produtos/${product.slug}`}
      onClick={onNavigate}
      className="group block overflow-hidden rounded-[8px] border border-cream-deep bg-cream transition hover:-translate-y-0.5 hover:border-coral hover:shadow-lg hover:shadow-ink/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral"
    >
      <div className="relative aspect-[4/5] bg-[radial-gradient(circle_at_50%_15%,rgba(250,244,233,0.98),rgba(235,224,204,0.74))]">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="150px"
            className="object-contain p-3 transition duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-3 text-center text-xs uppercase tracking-widest text-ink-mute">
            imagem em curadoria
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="line-clamp-2 min-h-[2.5rem] text-xs leading-snug text-ink">
          {product.name}
        </p>
        <p className="mt-2 text-sm font-semibold tabular-nums text-coral-deep">
          {formatBRL(product.priceCents)}
        </p>
      </div>
    </Link>
  );
}

function formatBRL(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}
