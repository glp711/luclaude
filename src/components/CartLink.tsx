"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
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

  return (
    <Link
      href="/carrinho"
      className="relative inline-flex items-center gap-2 rounded-full border border-neutral-300 px-4 py-1.5 text-sm hover:bg-neutral-50"
    >
      <span>Carrinho</span>
      {mounted && totalItems > 0 && (
        <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-neutral-900 px-1.5 text-xs font-medium text-white">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
