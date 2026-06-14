"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const LINKS = [
  { href: "/produtos", label: "Catálogo" },
  { href: "/produtos?categoria=difusores", label: "Difusores" },
  { href: "/produtos?categoria=home-spray", label: "Home Spray" },
  { href: "/produtos?categoria=sabonetes", label: "Sabonetes" },
  { href: "/produtos?categoria=agua-perfumada", label: "Água perfumada" },
  { href: "/produtos?categoria=kits", label: "Kits" },
];

const META = [
  { href: "/sobre", label: "Sobre a Lu" },
  { href: "/contato", label: "Contato" },
  { href: "/trocas-devolucoes", label: "Trocas e devoluções" },
];

export function MobileNav({ userArea }: { userArea: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  // Trava scroll quando aberto
  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border border-cream-deep bg-cream-soft text-ink hover:border-coral hover:text-coral-deep transition"
        aria-label="Abrir menu"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          className="h-5 w-5"
        >
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      {open && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink/30 backdrop-blur-sm"
            aria-label="Fechar menu"
          />
          {/* Painel */}
          <aside className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-cream-soft shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-cream-deep">
              <Link href="/" className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo-mark.svg" alt="" className="h-8 w-8" />
                <span className="font-display text-xl text-ink">
                  Lu<span className="text-coral-deep">perfumes</span>
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-cream-deep text-ink hover:border-coral hover:text-coral-deep transition"
                aria-label="Fechar"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" className="h-5 w-5">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <nav className="p-5 space-y-1">
              <p className="text-xs uppercase tracking-widest text-sage-deep mb-2">Navegar</p>
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={close}
                  className="block rounded-2xl px-4 py-3 text-ink hover:bg-coral-soft/30 hover:text-coral-deep transition"
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <nav className="px-5 pb-5 space-y-1">
              <p className="text-xs uppercase tracking-widest text-sage-deep mb-2">A Luperfumes</p>
              {META.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={close}
                  className="block rounded-2xl px-4 py-3 text-ink-soft hover:bg-coral-soft/30 hover:text-coral-deep transition text-sm"
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="p-5 border-t border-cream-deep">
              {userArea}
            </div>
          </aside>
        </div>,
        document.body
      )}
    </>
  );
}
