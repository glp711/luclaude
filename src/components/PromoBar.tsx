"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

const MESSAGES = [
  "✨ Frete grátis em compras acima de R$ 250 — Brasil inteiro",
  "💳 Parcele em até 3x sem juros no cartão",
  "🌿 Difusores que perfumam por meses, não dias",
];

const STORAGE_KEY = "luperfumes:promo-dismissed-v1";

function subscribeStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getDismissed(): boolean {
  if (typeof window === "undefined") return true; // tratado como "não mostrar" no SSR
  return !!localStorage.getItem(STORAGE_KEY);
}

function getServerDismissed(): boolean {
  return true;
}

export function PromoBar() {
  const dismissed = useSyncExternalStore(subscribeStorage, getDismissed, getServerDismissed);
  const [index, setIndex] = useState(0);

  // Rotaciona mensagens a cada 5s
  useEffect(() => {
    if (dismissed) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
    }, 5000);
    return () => clearInterval(id);
  }, [dismissed]);

  if (dismissed) return null;

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    // storage event não dispara na mesma aba; força a re-leitura
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div className="bg-sage-deep text-cream-soft text-xs sm:text-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-2 flex items-center justify-center gap-3 relative">
        <span className="text-center font-medium tracking-wide transition-opacity">
          {MESSAGES[index]}
        </span>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Fechar"
          className="absolute right-3 sm:right-6 text-cream-soft/80 hover:text-cream-soft transition"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
