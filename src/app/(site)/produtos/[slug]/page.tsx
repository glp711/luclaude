import { notFound } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatBRL } from "@/lib/money";
import { AddToCartButton } from "@/components/AddToCartButton";

type ProductPageData = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price_cents: number;
  compare_at_price_cents: number | null;
  stock_quantity: number;
  category: { name: string; slug: string } | null;
  product_images: { url: string; alt: string | null; position: number }[];
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("products")
    .select("name, description")
    .eq("slug", slug)
    .eq("status", "active")
    .single();
  if (!data) return { title: "Produto não encontrado" };
  return {
    title: data.name,
    description: data.description ?? `${data.name} — Luperfumes.`,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: product } = await supabase
    .from("products")
    .select(
      "id, slug, name, description, price_cents, compare_at_price_cents, stock_quantity, category:categories(name, slug), product_images(url, alt, position)"
    )
    .eq("slug", slug)
    .eq("status", "active")
    .single<ProductPageData>();

  if (!product) notFound();

  const images = [...(product.product_images ?? [])].sort((a, b) => a.position - b.position);
  const cover = images[0];
  const hasPromo =
    product.compare_at_price_cents != null &&
    product.compare_at_price_cents > product.price_cents;
  const outOfStock = product.stock_quantity <= 0;

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <nav className="text-sm text-neutral-500 mb-6 space-x-2">
        <Link href="/" className="hover:text-neutral-900">Início</Link>
        <span>/</span>
        <Link href="/produtos" className="hover:text-neutral-900">Catálogo</Link>
        {product.category && (
          <>
            <span>/</span>
            <Link
              href={`/produtos?categoria=${product.category.slug}`}
              className="hover:text-neutral-900"
            >
              {product.category.name}
            </Link>
          </>
        )}
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-3">
          <div className="aspect-square rounded-lg bg-white border overflow-hidden">
            {cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={cover.url}
                alt={cover.alt ?? product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-neutral-300 text-sm">
                Sem imagem
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {images.map((img) => (
                <div
                  key={img.url}
                  className="aspect-square rounded-md bg-white border overflow-hidden"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt={img.alt ?? ""} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div>
            <h1 className="text-3xl font-light">{product.name}</h1>
            {product.category && (
              <p className="text-sm text-neutral-500 mt-1">{product.category.name}</p>
            )}
          </div>

          <div className="flex items-baseline gap-3">
            {hasPromo && (
              <span className="text-base text-neutral-400 line-through">
                {formatBRL(product.compare_at_price_cents!)}
              </span>
            )}
            <span className="text-3xl font-light tabular-nums">
              {formatBRL(product.price_cents)}
            </span>
          </div>

          {outOfStock ? (
            <p className="text-sm font-medium text-red-600">Produto esgotado</p>
          ) : product.stock_quantity <= 3 ? (
            <p className="text-sm text-amber-600">
              Últimas unidades — só {product.stock_quantity} em estoque
            </p>
          ) : null}

          <AddToCartButton productId={product.id} disabled={outOfStock} />

          {product.description && (
            <div className="pt-4 border-t">
              <h2 className="text-sm font-medium mb-2">Sobre o produto</h2>
              <p className="text-sm text-neutral-700 whitespace-pre-line">{product.description}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
