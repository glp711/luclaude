"use client";

import { useEffect, useState } from "react";
import { formatBRL } from "@/lib/money";
import { AddToCartButton } from "./AddToCartButton";

export function StickyBuyBar({
  productId,
  productName,
  priceCents,
  outOfStock,
}: {
  productId: string;
  productName: string;
  priceCents: number;
  outOfStock: boolean;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        // Mostra depois que rolou ~500px (saiu do above-the-fold)
        setVisible(window.scrollY > 500);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 lg:hidden border-t border-cream-deep bg-cream-soft/95 backdrop-blur transition-transform ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!visible}
    >
      <div className="mx-auto max-w-3xl px-4 py-3 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-ink-mute truncate">{productName}</p>
          <p className="font-display text-lg text-coral-deep leading-tight tabular-nums">
            {formatBRL(priceCents)}
          </p>
        </div>
        <AddToCartButton
          productId={productId}
          disabled={outOfStock}
          className="rounded-full bg-coral px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-coral-deep transition disabled:cursor-not-allowed disabled:bg-cream-deep disabled:text-ink-mute"
        />
      </div>
    </div>
  );
}
