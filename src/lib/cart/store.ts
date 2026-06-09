"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  product_id: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  add: (product_id: string, qty?: number) => void;
  update: (product_id: string, qty: number) => void;
  remove: (product_id: string) => void;
  clear: () => void;
  totalItems: () => number;
};

const MAX_QTY = 10;

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (product_id, qty = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.product_id === product_id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product_id === product_id
                  ? { ...i, quantity: Math.min(MAX_QTY, i.quantity + qty) }
                  : i
              ),
            };
          }
          return { items: [...state.items, { product_id, quantity: Math.min(MAX_QTY, qty) }] };
        }),
      update: (product_id, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((i) => i.product_id !== product_id)
              : state.items.map((i) =>
                  i.product_id === product_id
                    ? { ...i, quantity: Math.min(MAX_QTY, qty) }
                    : i
                ),
        })),
      remove: (product_id) =>
        set((state) => ({ items: state.items.filter((i) => i.product_id !== product_id) })),
      clear: () => set({ items: [] }),
      totalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
    }),
    { name: "luperfumes_cart_v1" }
  )
);
