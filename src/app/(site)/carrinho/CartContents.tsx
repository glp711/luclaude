"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { useCart } from "@/lib/cart/store";
import { formatBRL } from "@/lib/money";

type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  price_cents: number;
  stock_quantity: number;
  status: string;
  cover_url: string | null;
};

function useCartHydrated() {
  return useSyncExternalStore(
    (cb) => useCart.persist.onFinishHydration(cb),
    () => useCart.persist.hasHydrated(),
    () => false
  );
}

export function CartContents({ catalog }: { catalog: Record<string, CatalogProduct> }) {
  const hydrated = useCartHydrated();
  const items = useCart((s) => s.items);
  const update = useCart((s) => s.update);
  const remove = useCart((s) => s.remove);

  if (!hydrated) {
    return <div className="text-sm text-neutral-500">Carregando carrinho…</div>;
  }

  // Reconcilia carrinho: remove silenciosamente produtos inexistentes/inativos
  const valid = items.filter((i) => {
    const p = catalog[i.product_id];
    return p && p.status === "active";
  });

  // Notifica usuário se algo foi descartado
  const removedCount = items.length - valid.length;

  if (valid.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-neutral-300 bg-white p-12 text-center">
        <p className="text-neutral-600">Seu carrinho está vazio.</p>
        <Link
          href="/produtos"
          className="mt-4 inline-block rounded-md bg-neutral-900 px-5 py-2 text-sm text-white hover:bg-neutral-700"
        >
          Ver catálogo
        </Link>
        {removedCount > 0 && (
          <p className="mt-4 text-xs text-neutral-500">
            {removedCount} item{removedCount > 1 ? "s" : ""} indisponível{removedCount > 1 ? "is" : ""}{" "}
            removido{removedCount > 1 ? "s" : ""}.
          </p>
        )}
      </div>
    );
  }

  const subtotal = valid.reduce((s, i) => {
    const p = catalog[i.product_id]!;
    return s + p.price_cents * i.quantity;
  }, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
      <div className="space-y-3">
        {removedCount > 0 && (
          <div className="rounded-md bg-amber-50 px-4 py-2 text-sm text-amber-800">
            {removedCount} item{removedCount > 1 ? "s" : ""} não está mais disponível e foi removido.
          </div>
        )}
        {valid.map((i) => {
          const p = catalog[i.product_id]!;
          const lineTotal = p.price_cents * i.quantity;
          const exceedsStock = i.quantity > p.stock_quantity;
          return (
            <div key={i.product_id} className="flex gap-4 rounded-lg border bg-white p-4">
              <div className="h-24 w-24 flex-shrink-0 rounded-md bg-neutral-100 overflow-hidden">
                {p.cover_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.cover_url} alt={p.name} className="h-full w-full object-cover" />
                ) : null}
              </div>
              <div className="flex-1 space-y-1">
                <Link href={`/produtos/${p.slug}`} className="font-medium hover:underline">
                  {p.name}
                </Link>
                <div className="text-sm text-neutral-500 tabular-nums">{formatBRL(p.price_cents)}</div>
                {exceedsStock && (
                  <p className="text-xs text-amber-600">
                    Só {p.stock_quantity} em estoque
                  </p>
                )}
                <div className="flex items-center gap-3 pt-2">
                  <div className="flex items-center rounded-md border">
                    <button
                      onClick={() => update(i.product_id, i.quantity - 1)}
                      className="px-2 py-1 text-neutral-600 hover:text-neutral-900"
                      aria-label="Diminuir"
                    >
                      −
                    </button>
                    <span className="px-3 text-sm tabular-nums">{i.quantity}</span>
                    <button
                      onClick={() => update(i.product_id, i.quantity + 1)}
                      disabled={i.quantity >= 10 || i.quantity >= p.stock_quantity}
                      className="px-2 py-1 text-neutral-600 hover:text-neutral-900 disabled:text-neutral-300"
                      aria-label="Aumentar"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => remove(i.product_id)}
                    className="text-xs text-red-600 hover:text-red-800"
                  >
                    Remover
                  </button>
                </div>
              </div>
              <div className="text-right font-medium tabular-nums">{formatBRL(lineTotal)}</div>
            </div>
          );
        })}
      </div>

      <aside className="rounded-lg border bg-white p-5 h-fit lg:sticky lg:top-6 space-y-4">
        <h2 className="text-lg font-medium">Resumo</h2>
        <dl className="space-y-1 text-sm">
          <div className="flex justify-between">
            <dt className="text-neutral-600">Subtotal</dt>
            <dd className="tabular-nums">{formatBRL(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-neutral-600">Frete</dt>
            <dd className="text-neutral-500">calculado no checkout</dd>
          </div>
        </dl>
        <Link
          href="/checkout"
          className="block w-full rounded-md bg-neutral-900 py-3 text-center text-sm text-white hover:bg-neutral-700"
        >
          Finalizar compra
        </Link>
        <Link
          href="/produtos"
          className="block text-center text-sm text-neutral-600 hover:text-neutral-900"
        >
          Continuar comprando
        </Link>
      </aside>
    </div>
  );
}
