"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart/store";

export function AddToCartButton({
  productId,
  disabled,
  className,
}: {
  productId: string;
  disabled?: boolean;
  className?: string;
}) {
  const add = useCart((s) => s.add);
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        add(productId, 1);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
      }}
      className={
        className ??
        "rounded-full bg-coral px-7 py-3 text-sm font-medium text-white shadow-sm hover:bg-coral-deep transition disabled:cursor-not-allowed disabled:bg-cream-deep disabled:text-ink-mute"
      }
    >
      {disabled ? "Indisponível" : added ? "Adicionado ✓" : "Adicionar ao carrinho"}
    </button>
  );
}
