"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { MenuGroup, MenuType } from "@/lib/navigation";
import type { NavItem } from "@/lib/menu-data";
import { buildProductsUrl } from "@/lib/url";

/**
 * Drawer mobile com acordeao em 3 niveis:
 *   Grupo  →  Tipo  →  Marcas
 *
 * Comportamento:
 *  - Trava scroll do body quando aberto
 *  - Fecha ao navegar (link onClick)
 *  - ESC fecha
 *  - Click no backdrop fecha
 *  - Apenas um grupo / um tipo aberto por vez (acordeao)
 *  - Foco volta pro botao trigger ao fechar
 */
export function MobileMenuDrawer({
  userArea,
  groups,
  navItems,
}: {
  userArea: React.ReactNode;
  groups: MenuGroup[];
  navItems: NavItem[];
}) {
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [openType, setOpenType] = useState<string | null>(null);

  const close = () => {
    setOpen(false);
    setOpenGroup(null);
    setOpenType(null);
  };

  // Scroll lock
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  // ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
        aria-label="Abrir menu"
        className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream-deep bg-cream-soft text-ink hover:border-coral hover:text-coral-deep transition"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      {open && typeof document !== "undefined" &&
        createPortal(
          <div
            id="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-50 lg:hidden"
          >
            <button
              type="button"
              onClick={close}
              aria-label="Fechar menu"
              className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            />
            <aside className="absolute right-0 top-0 bottom-0 w-[94%] max-w-md bg-cream-soft shadow-xl flex flex-col">
              {/* Cabecalho */}
              <div className="flex items-center justify-between p-4 border-b border-cream-deep">
                <Link
                  href="/"
                  onClick={close}
                  className="flex items-center gap-2 min-w-0"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logo-mark.svg" alt="" className="h-8 w-8 flex-shrink-0" />
                  <span className="font-display text-lg text-ink truncate">
                    perfumes de ambiente <span className="text-coral-deep">decor</span>
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Fechar"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream-deep text-ink hover:border-coral hover:text-coral-deep transition"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>

              {/* Lista de grupos com acordeao */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="mb-5 rounded-[8px] border border-cream-deep bg-cream p-3">
                  <p className="px-1 text-[11px] uppercase tracking-widest text-sage-deep">
                    explorar
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Link
                      href="/produtos"
                      onClick={close}
                      className="rounded-full bg-coral px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-coral-deep transition"
                    >
                      Catalogo
                    </Link>
                    <Link
                      href="/marcas"
                      onClick={close}
                      className="rounded-full border border-sage px-4 py-2.5 text-center text-sm font-medium text-sage-deep hover:bg-sage-soft transition"
                    >
                      Marcas
                    </Link>
                    <Link
                      href="/produtos?ofertas=1"
                      onClick={close}
                      className="col-span-2 rounded-full border border-cream-deep bg-cream-soft px-4 py-2.5 text-center text-sm text-ink-soft hover:border-coral hover:text-coral-deep transition"
                    >
                      Ver ofertas e achadinhos
                    </Link>
                  </div>
                </div>
                <p className="mb-2 px-2 text-[11px] uppercase tracking-widest text-sage-deep">
                  navegar por tipo
                </p>
                <nav aria-label="Navegacao mobile" className="space-y-1">
                  {navItems.map((item) => {
                    if (item.kind === "link") {
                      return (
                        <Link
                          key={item.slug}
                          href={item.href}
                          onClick={close}
                          className="block rounded-2xl px-4 py-3 text-base font-medium text-ink hover:bg-coral-soft/30 hover:text-coral-deep transition"
                        >
                          {item.label}
                        </Link>
                      );
                    }
                    const group = groups.find((g) => g.slug === item.slug);
                    if (!group) return null;
                    return (
                      <AccordionGroup
                        key={group.slug}
                        group={group}
                        isOpen={openGroup === group.slug}
                        onToggle={() => {
                          setOpenType(null);
                          setOpenGroup((s) => (s === group.slug ? null : group.slug));
                        }}
                        openTypeSlug={openType}
                        onToggleType={(slug) =>
                          setOpenType((s) => (s === slug ? null : slug))
                        }
                        onNavigate={close}
                      />
                    );
                  })}
                </nav>
              </div>

              {/* Rodape: area do usuario */}
              <div className="p-4 border-t border-cream-deep">{userArea}</div>
            </aside>
          </div>,
          document.body
        )}
    </>
  );
}

function AccordionGroup({
  group,
  isOpen,
  onToggle,
  openTypeSlug,
  onToggleType,
  onNavigate,
}: {
  group: MenuGroup;
  isOpen: boolean;
  onToggle: () => void;
  openTypeSlug: string | null;
  onToggleType: (slug: string) => void;
  onNavigate: () => void;
}) {
  return (
    <div className="rounded-2xl overflow-hidden">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={`m-group-${group.slug}`}
        onClick={onToggle}
        className={`flex w-full items-center justify-between px-4 py-3 text-base font-medium transition ${
          isOpen ? "bg-coral-soft/40 text-coral-deep" : "text-ink hover:bg-coral-soft/20"
        }`}
      >
        <span>{group.label}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {isOpen && (
        <div id={`m-group-${group.slug}`} className="px-2 py-2 space-y-1">
          {group.types.map((type) => (
            <AccordionType
              key={type.categorySlug}
              type={type}
              isOpen={openTypeSlug === type.categorySlug}
              onToggle={() => onToggleType(type.categorySlug)}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AccordionType({
  type,
  isOpen,
  onToggle,
  onNavigate,
}: {
  type: MenuType;
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  return (
    <div className="rounded-xl overflow-hidden">
      <div className="flex items-center">
        <Link
          href={buildProductsUrl({ categoria: type.categorySlug })}
          onClick={onNavigate}
          className="flex-1 px-4 py-2 text-sm text-ink hover:text-coral-deep transition"
        >
          {type.label}
        </Link>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={`m-type-${type.categorySlug}`}
          onClick={onToggle}
          aria-label={`Mostrar marcas de ${type.label}`}
          className="px-3 py-2 text-ink-mute hover:text-coral-deep transition"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </div>
      {isOpen && (
        <ul id={`m-type-${type.categorySlug}`} className="pl-4 pr-2 pb-2 space-y-1">
          {type.brands.map((brand) => (
            <li key={brand.slug}>
              <Link
                href={buildProductsUrl({
                  categoria: type.categorySlug,
                  marca: brand.slug,
                })}
                onClick={onNavigate}
                className="block px-3 py-1.5 text-xs text-ink-soft hover:text-coral-deep transition"
              >
                {brand.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
