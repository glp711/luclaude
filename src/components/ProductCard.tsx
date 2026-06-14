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
  const hasPromo =
    product.compare_at_price_cents != null &&
    product.compare_at_price_cents > product.price_cents;

  return (
    <Link
      href={`/produtos/${product.slug}`}
      className="group rounded-2xl border border-cream-deep bg-cream-soft overflow-hidden transition hover:border-coral hover:shadow-[0_8px_24px_-12px_rgba(228,139,125,0.35)]"
    >
      <div className="aspect-square bg-cream relative overflow-hidden">
        {product.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.cover_url}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-mute text-sm">
            sem imagem
          </div>
        )}
        {hasPromo && (
          <span className="absolute left-3 top-3 rounded-full bg-coral-deep px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-white shadow-sm">
            Promoção
          </span>
        )}
        {outOfStock && (
          <span className="absolute right-3 top-3 rounded-full bg-ink/85 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-cream-soft shadow-sm">
            Esgotado
          </span>
        )}
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-display text-base leading-snug text-ink line-clamp-2 min-h-[2.6rem]">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2">
          {hasPromo && (
            <span className="text-xs text-ink-mute line-through">
              {formatBRL(product.compare_at_price_cents!)}
            </span>
          )}
          <span className="text-lg font-medium tabular-nums text-coral-deep">
            {formatBRL(product.price_cents)}
          </span>
        </div>
      </div>
    </Link>
  );
}
