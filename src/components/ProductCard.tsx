import Image from "next/image";
import Link from "next/link";
import { formatBRL } from "@/lib/money";

export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  price_cents: number;
  compare_at_price_cents: number | null;
  stock_quantity: number;
  cover_url: string | null;
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const outOfStock = product.stock_quantity <= 0;
  const lowStock = !outOfStock && product.stock_quantity <= 3;
  const hasPromo =
    product.compare_at_price_cents != null &&
    product.compare_at_price_cents > product.price_cents;
  const discountPercent = hasPromo
    ? Math.round(
        ((product.compare_at_price_cents! - product.price_cents) /
          product.compare_at_price_cents!) *
          100
      )
    : 0;

  return (
    <Link
      href={`/produtos/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[8px] border border-cream-deep bg-cream-soft shadow-sm shadow-ink/5 transition hover:-translate-y-0.5 hover:border-coral hover:shadow-xl hover:shadow-ink/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-cream">
        {product.cover_url ? (
          <Image
            src={product.cover_url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition duration-700 group-hover:scale-[1.045]"
          />
        ) : (
          <ProductPlaceholder name={product.name} />
        )}

        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink/20 to-transparent opacity-0 transition group-hover:opacity-100"
        />

        <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
          {hasPromo && (
            <span className="w-fit rounded-full bg-coral-deep px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
              -{discountPercent}%
            </span>
          )}
          {lowStock && (
            <span className="w-fit rounded-full bg-cream-soft/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-coral-deep shadow-sm">
              Últimas {product.stock_quantity}
            </span>
          )}
        </div>

        {outOfStock && (
          <span className="absolute right-3 top-3 z-10 rounded-full bg-ink/85 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-cream-soft shadow-sm">
            Esgotado
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-lg leading-snug text-ink line-clamp-2 min-h-[3.05rem]">
          {product.name}
        </h3>

        <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          {hasPromo && (
            <span className="text-xs text-ink-mute line-through">
              {formatBRL(product.compare_at_price_cents!)}
            </span>
          )}
          <span className="text-xl font-semibold tabular-nums text-coral-deep">
            {formatBRL(product.price_cents)}
          </span>
        </div>

        <div className="mt-auto pt-4">
          <span className="inline-flex w-full items-center justify-center rounded-full border border-cream-deep bg-cream px-4 py-2 text-xs font-bold uppercase tracking-wide text-ink-soft transition group-hover:border-coral group-hover:bg-coral group-hover:text-white">
            Ver detalhes
          </span>
        </div>
      </div>
    </Link>
  );
}

function ProductPlaceholder({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <div className="flex h-full flex-col items-center justify-center bg-[radial-gradient(circle_at_30%_20%,var(--color-coral-soft),transparent_36%),linear-gradient(135deg,var(--color-cream-soft),var(--color-cream-deep))] p-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full border border-cream-deep bg-cream-soft/80 font-display text-3xl text-coral-deep shadow-sm">
        {initials || "pd"}
      </div>
      <p className="mt-4 max-w-[12rem] text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">
        Imagem em curadoria
      </p>
    </div>
  );
}
