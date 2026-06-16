"use client";

import Image from "next/image";
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
    return (
      <div className="rounded-3xl border border-dashed border-cream-deep bg-cream-soft p-12 text-center text-ink-mute">
        Carregando carrinho…
      </div>
    );
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
      <div className="rounded-3xl border border-dashed border-cream-deep bg-cream-soft p-16 text-center">
        <div className="mx-auto h-16 w-16 rounded-full bg-coral-soft flex items-center justify-center mb-4">
          <span className="text-2xl">🛒</span>
        </div>
        <p className="font-display text-3xl text-ink">Carrinho vazio</p>
        <p className="mt-2 text-sm text-ink-soft max-w-sm mx-auto">
          Que tal dar uma olhada no catálogo? A perfumes de ambiente decor separou difusores, sabonetes e home sprays cheios de carinho.
        </p>
        <Link
          href="/produtos"
          className="mt-6 inline-block rounded-full bg-coral px-7 py-3 text-sm font-medium text-white hover:bg-coral-deep transition"
        >
          Ver catálogo
        </Link>
        {removedCount > 0 && (
          <p className="mt-6 text-xs text-ink-mute">
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
  const itemCount = valid.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
      <div className="space-y-3">
        {removedCount > 0 && (
          <div className="rounded-2xl bg-coral-soft/50 border border-coral-soft px-4 py-3 text-sm text-coral-deep">
            {removedCount} item{removedCount > 1 ? "s" : ""} não está mais disponível e foi removido.
          </div>
        )}
        {valid.map((i) => {
          const p = catalog[i.product_id]!;
          const lineTotal = p.price_cents * i.quantity;
          const exceedsStock = i.quantity > p.stock_quantity;
          return (
            <div
              key={i.product_id}
              className="flex gap-4 rounded-2xl border border-cream-deep bg-cream-soft p-4 hover:border-coral-soft transition"
            >
              <Link
                href={`/produtos/${p.slug}`}
                className="relative h-28 w-28 flex-shrink-0 rounded-xl bg-cream overflow-hidden"
              >
                {p.cover_url ? (
                  <Image
                    src={p.cover_url}
                    alt={p.name}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                ) : null}
              </Link>
              <div className="flex-1 min-w-0 space-y-1">
                <Link
                  href={`/produtos/${p.slug}`}
                  className="font-display text-lg leading-tight text-ink hover:text-coral-deep transition line-clamp-2"
                >
                  {p.name}
                </Link>
                <div className="text-sm text-ink-soft tabular-nums">{formatBRL(p.price_cents)}</div>
                {exceedsStock && (
                  <p className="text-xs text-coral-deep">
                    ⚠ Só {p.stock_quantity} em estoque
                  </p>
                )}
                <div className="flex items-center gap-3 pt-2">
                  <div className="flex items-center rounded-full border border-cream-deep bg-cream">
                    <button
                      onClick={() => update(i.product_id, i.quantity - 1)}
                      className="px-3 py-1 text-ink-soft hover:text-coral-deep transition"
                      aria-label="Diminuir"
                    >
                      −
                    </button>
                    <span className="px-3 text-sm tabular-nums">{i.quantity}</span>
                    <button
                      onClick={() => update(i.product_id, i.quantity + 1)}
                      disabled={i.quantity >= 10 || i.quantity >= p.stock_quantity}
                      className="px-3 py-1 text-ink-soft hover:text-coral-deep transition disabled:text-cream-deep"
                      aria-label="Aumentar"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => remove(i.product_id)}
                    className="text-xs text-ink-mute hover:text-coral-deep transition"
                  >
                    Remover
                  </button>
                </div>
              </div>
              <div className="text-right font-display text-xl tabular-nums text-coral-deep">
                {formatBRL(lineTotal)}
              </div>
            </div>
          );
        })}
      </div>

      <aside className="rounded-2xl border border-cream-deep bg-cream-soft p-6 h-fit lg:sticky lg:top-24 space-y-4">
        <h2 className="font-display text-2xl text-ink">Resumo</h2>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-soft">Itens</dt>
            <dd className="tabular-nums">{itemCount}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-soft">Subtotal</dt>
            <dd className="tabular-nums">{formatBRL(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-soft">Frete</dt>
            <dd className="text-ink-mute italic text-xs">calculado no checkout</dd>
          </div>
          <div className="pt-3 border-t border-cream-deep flex justify-between items-baseline">
            <dt className="font-display text-lg text-ink">Total</dt>
            <dd className="font-display text-2xl text-coral-deep tabular-nums">{formatBRL(subtotal)}</dd>
          </div>
        </dl>
        <Link
          href="/checkout"
          className="block w-full rounded-full bg-coral py-3 text-center text-sm font-medium text-white hover:bg-coral-deep transition shadow-sm"
        >
          Finalizar compra
        </Link>
        <Link
          href="/produtos"
          className="block text-center text-sm text-ink-soft hover:text-coral-deep transition"
        >
          ← Continuar comprando
        </Link>
        <div className="pt-3 border-t border-cream-deep text-xs text-ink-mute space-y-1.5">
          <p className="flex items-center gap-2"><span className="text-sage-deep">●</span> Pix, cartão ou boleto</p>
          <p className="flex items-center gap-2"><span className="text-sage-deep">●</span> Trocas em até 7 dias</p>
          <p className="flex items-center gap-2"><span className="text-sage-deep">●</span> Envio pelos Correios e Jadlog</p>
        </div>
      </aside>
    </div>
  );
}
