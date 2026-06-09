import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProductCard, type ProductCardData } from "@/components/ProductCard";

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();

  const { data: products } = await supabase
    .from("products")
    .select(
      "id, slug, name, price_cents, compare_at_price_cents, stock_quantity, product_images(url, position)"
    )
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(8);

  const featured: ProductCardData[] =
    (products ?? []).map((p: {
      id: string;
      slug: string;
      name: string;
      price_cents: number;
      compare_at_price_cents: number | null;
      stock_quantity: number;
      product_images: { url: string; position: number }[];
    }) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      price_cents: p.price_cents,
      compare_at_price_cents: p.compare_at_price_cents,
      stock_quantity: p.stock_quantity,
      cover_url: pickCover(p.product_images),
    }));

  return (
    <main>
      <section className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28 text-center">
          <h1 className="text-4xl md:text-6xl font-light tracking-tight">
            Aromas que ficam.
          </h1>
          <p className="mt-4 text-neutral-600 max-w-xl mx-auto">
            Difusores, sabonetes e home spray para sua casa virar memória.
          </p>
          <div className="mt-8">
            <Link
              href="/produtos"
              className="inline-block rounded-full bg-neutral-900 px-8 py-3 text-sm text-white hover:bg-neutral-700"
            >
              Ver catálogo
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl font-light">Novidades</h2>
          <Link href="/produtos" className="text-sm text-neutral-600 hover:text-neutral-900">
            Ver tudo →
          </Link>
        </div>

        {featured.length === 0 ? (
          <div className="rounded-lg border border-dashed border-neutral-300 bg-white p-12 text-center text-neutral-500">
            Catálogo em preparação. Volte em breve.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function pickCover(images: { url: string; position: number }[] | null | undefined): string | null {
  if (!images || images.length === 0) return null;
  const sorted = [...images].sort((a, b) => a.position - b.position);
  return sorted[0].url;
}
