"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useCart } from "@/lib/cart/store";

function useCartHydrated() {
  return useSyncExternalStore(
    (cb) => useCart.persist.onFinishHydration(cb),
    () => useCart.persist.hasHydrated(),
    () => false
  );
}

export function CartLink() {
  const totalItems = useCart((s) => s.totalItems());
  const mounted = useCartHydrated();
  const [pulse, setPulse] = useState(false);
  const prevRef = useRef(totalItems);

  useEffect(() => {
    if (!mounted) return;
    const increased = totalItems > prevRef.current;
    prevRef.current = totalItems;
    if (!increased) return;
    setPulse(true);
    const id = window.setTimeout(() => setPulse(false), 400);
    return () => window.clearTimeout(id);
  }, [totalItems, mounted]);

  return (
    <Link
      href="/carrinho"
      className="relative inline-flex h-11 items-center gap-2 rounded-full border border-cream-deep bg-cream-soft px-4 text-sm font-medium text-ink shadow-sm shadow-ink/5 transition hover:border-coral hover:bg-coral-soft/40 xl:h-12 xl:px-5"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
        aria-hidden="true"
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
      <span className="hidden sm:inline">Carrinho</span>
      {mounted && totalItems > 0 && (
        <span
          className={`inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-coral px-1.5 text-xs font-medium text-white transition-transform ${
            pulse ? "scale-125" : "scale-100"
          }`}
        >
          {totalItems}
        </span>
      )}
    </Link>
  );
}
