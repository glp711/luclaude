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
        "rounded-md bg-neutral-900 px-5 py-2.5 text-sm text-white hover:bg-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-300"
      }
    >
      {disabled ? "Indisponível" : added ? "Adicionado ✓" : "Adicionar ao carrinho"}
    </button>
  );
}
