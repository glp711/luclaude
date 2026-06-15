import { notFound } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatBRL } from "@/lib/money";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductCard, type ProductCardData } from "@/components/ProductCard";
import { StickyBuyBar } from "@/components/StickyBuyBar";

type ProductPageData = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price_cents: number;
  compare_at_price_cents: number | null;
  stock_quantity: number;
  category_id: string | null;
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
    description: data.description ?? `${data.name} — Luperfumes, perfumaria de ambiente.`,
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
      "id, slug, name, description, price_cents, compare_at_price_cents, stock_quantity, category_id, category:categories(name, slug), product_images(url, alt, position)"
    )
    .eq("slug", slug)
    .eq("status", "active")
    .single<ProductPageData>();

  if (!product) notFound();

  const images = [...(product.product_images ?? [])].sort((a, b) => a.position - b.position);
  const hasPromo =
    product.compare_at_price_cents != null &&
    product.compare_at_price_cents > product.price_cents;
  const outOfStock = product.stock_quantity <= 0;

  // JSON-LD pra Google Rich Results / Google Shopping
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description:
      product.description ?? `${product.name} — Luperfumes, perfumaria de ambiente.`,
    image: images.map((i) => i.url),
    sku: product.id,
    brand: { "@type": "Brand", name: "Luperfumes" },
    category: product.category?.name,
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/produtos/${product.slug}`,
      priceCurrency: "BRL",
      price: (product.price_cents / 100).toFixed(2),
      availability: outOfStock
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "Luperfumes" },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: `${baseUrl}/` },
      { "@type": "ListItem", position: 2, name: "Catálogo", item: `${baseUrl}/produtos` },
      ...(product.category
        ? [{
            "@type": "ListItem",
            position: 3,
            name: product.category.name,
            item: `${baseUrl}/produtos?categoria=${product.category.slug}`,
          }]
        : []),
      {
        "@type": "ListItem",
        position: product.category ? 4 : 3,
        name: product.name,
        item: `${baseUrl}/produtos/${product.slug}`,
      },
    ],
  };

  // Sugestões: outros da mesma categoria
  let related: ProductCardData[] = [];
  if (product.category_id) {
    const { data: relatedRaw } = await supabase
      .from("products")
      .select(
        "id, slug, name, price_cents, compare_at_price_cents, stock_quantity, product_images(url, position)"
      )
      .eq("status", "active")
      .eq("category_id", product.category_id)
      .neq("id", product.id)
      .limit(4);
    related = (relatedRaw ?? []).map((p: {
      id: string; slug: string; name: string; price_cents: number;
      compare_at_price_cents: number | null; stock_quantity: number;
      product_images: { url: string; position: number }[];
    }) => ({
      id: p.id, slug: p.slug, name: p.name,
      price_cents: p.price_cents,
      compare_at_price_cents: p.compare_at_price_cents,
      stock_quantity: p.stock_quantity,
      cover_url: pickCover(p.product_images),
    }));
  }

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="mx-auto max-w-7xl px-6 py-8">
        <nav className="text-xs text-ink-mute mb-6 flex flex-wrap items-center gap-2" aria-label="breadcrumb">
          <Link href="/" className="hover:text-coral-deep transition">Início</Link>
          <span>/</span>
          <Link href="/produtos" className="hover:text-coral-deep transition">Catálogo</Link>
          {product.category && (
            <>
              <span>/</span>
              <Link
                href={`/produtos?categoria=${product.category.slug}`}
                className="hover:text-coral-deep transition"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-ink-soft truncate max-w-[40ch]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <ProductGallery images={images} productName={product.name} />

          <div className="space-y-6">
            <div>
              {product.category && (
                <Link
                  href={`/produtos?categoria=${product.category.slug}`}
                  className="text-xs uppercase tracking-widest text-sage-deep hover:text-coral-deep transition"
                >
                  {product.category.name}
                </Link>
              )}
              <h1 className="mt-2 font-display text-4xl md:text-5xl leading-tight text-ink">
                {product.name}
              </h1>
            </div>

            <div className="flex items-baseline gap-3">
              {hasPromo && (
                <span className="text-lg text-ink-mute line-through tabular-nums">
                  {formatBRL(product.compare_at_price_cents!)}
                </span>
              )}
              <span className="font-display text-4xl text-coral-deep tabular-nums">
                {formatBRL(product.price_cents)}
              </span>
              {hasPromo && (
                <span className="rounded-full bg-coral-soft px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-coral-deep font-medium">
                  Promoção
                </span>
              )}
            </div>

            {outOfStock ? (
              <p className="text-sm font-medium text-coral-deep">
                😔 Esgotado por enquanto. Volte em breve.
              </p>
            ) : product.stock_quantity <= 3 ? (
              <p className="text-sm text-coral-deep">
                ⚡ Últimas unidades — só {product.stock_quantity} em estoque.
              </p>
            ) : null}

            <AddToCartButton productId={product.id} disabled={outOfStock} />

            <div className="pt-5 border-t border-cream-deep">
              <h2 className="font-display text-2xl text-ink mb-3">Sobre o produto</h2>
              {product.description ? (
                <p className="text-sm text-ink-soft whitespace-pre-line leading-relaxed">
                  {product.description}
                </p>
              ) : (
                <p className="text-sm text-ink-soft italic leading-relaxed">
                  Aroma escolhido a dedo pela LU pra deixar seu cantinho ainda mais aconchegante.
                  Em breve trazemos a descrição completa.
                </p>
              )}
            </div>

            {/* Benefícios da loja */}
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5 border-t border-cream-deep text-xs text-ink-soft">
              <li className="flex items-start gap-2">
                <span className="text-coral-deep mt-0.5">●</span>
                <span><strong className="text-ink">Frete pelos Correios</strong><br />calculado no checkout</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-coral-deep mt-0.5">●</span>
                <span><strong className="text-ink">Pix, cartão ou boleto</strong><br />parcele em até 3x</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-coral-deep mt-0.5">●</span>
                <span><strong className="text-ink">Trocas em 7 dias</strong><br />pelo Código de Defesa do Consumidor</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <StickyBuyBar
        productId={product.id}
        productName={product.name}
        priceCents={product.price_cents}
        outOfStock={outOfStock}
      />

      {/* Relacionados */}
      {related.length > 0 && (
        <section className="bg-cream-soft border-t border-cream-deep mt-16">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="text-center mb-10">
              <p className="text-xs uppercase tracking-widest text-sage-deep">você também pode gostar</p>
              <h2 className="mt-2 font-display text-3xl md:text-4xl text-ink">
                Da mesma família
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

function pickCover(images: { url: string; position: number }[] | null | undefined): string | null {
  if (!images || images.length === 0) return null;
  return [...images].sort((a, b) => a.position - b.position)[0].url;
}
