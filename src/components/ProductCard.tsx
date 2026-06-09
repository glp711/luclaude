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
      className="group rounded-lg border border-neutral-200 bg-white overflow-hidden transition hover:border-neutral-400 hover:shadow-sm"
    >
      <div className="aspect-square bg-neutral-100 relative overflow-hidden">
        {product.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.cover_url}
            alt={product.name}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-neutral-300 text-sm">
            sem imagem
          </div>
        )}
        {hasPromo && (
          <span className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-0.5 text-xs font-medium text-white">
            Promoção
          </span>
        )}
        {outOfStock && (
          <span className="absolute right-2 top-2 rounded-full bg-neutral-900/80 px-2 py-0.5 text-xs font-medium text-white">
            Esgotado
          </span>
        )}
      </div>
      <div className="p-4 space-y-1">
        <h3 className="text-sm text-neutral-800 line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
        <div className="flex items-baseline gap-2">
          {hasPromo && (
            <span className="text-xs text-neutral-400 line-through">
              {formatBRL(product.compare_at_price_cents!)}
            </span>
          )}
          <span className="text-base font-medium tabular-nums">
            {formatBRL(product.price_cents)}
          </span>
        </div>
      </div>
    </Link>
  );
}
