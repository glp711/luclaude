import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProductCarousel } from "@/components/ProductCarousel";
import type { ProductCardData } from "@/components/ProductCard";

/**
 * Server wrapper que busca produtos por criterio e renderiza num carrossel.
 *
 * Criterios:
 *  - "recent": ultimos 12 ativos (mais recente primeiro)
 *  - "offers": com compare_at_price_cents preenchido (em promocao)
 *  - "highlights": amostra premium — maior preco entre ativos
 */
type Kind = "recent" | "offers" | "highlights";

export async function FeaturedProducts({
  kind,
  title,
  eyebrow,
  viewAllHref,
  viewAllLabel,
  limit = 12,
}: {
  kind: Kind;
  title: string;
  eyebrow: string;
  viewAllHref: string;
  viewAllLabel?: string;
  limit?: number;
}) {
  const supabase = await createSupabaseServerClient();

  let query = supabase
    .from("products")
    .select(
      "id, slug, name, price_cents, compare_at_price_cents, stock_quantity, product_images(url, position)"
    )
    .eq("status", "active")
    .limit(limit);

  switch (kind) {
    case "recent":
      query = query.order("created_at", { ascending: false });
      break;
    case "offers":
      query = query
        .not("compare_at_price_cents", "is", null)
        .order("price_cents", { ascending: true });
      break;
    case "highlights":
      query = query.order("price_cents", { ascending: false });
      break;
  }

  const { data } = await query;

  const products: ProductCardData[] = ((data ?? []) as {
    id: string;
    slug: string;
    name: string;
    price_cents: number;
    compare_at_price_cents: number | null;
    stock_quantity: number;
    product_images: { url: string; position: number }[];
  }[]).map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    price_cents: p.price_cents,
    compare_at_price_cents: p.compare_at_price_cents,
    stock_quantity: p.stock_quantity,
    cover_url: pickCover(p.product_images),
  }));

  if (products.length === 0) return null;

  return (
    <ProductCarousel
      products={products}
      title={title}
      eyebrow={eyebrow}
      viewAllHref={viewAllHref}
      viewAllLabel={viewAllLabel}
    />
  );
}

function pickCover(images: { url: string; position: number }[] | null | undefined): string | null {
  if (!images || images.length === 0) return null;
  return [...images].sort((a, b) => a.position - b.position)[0].url;
}
