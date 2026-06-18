import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductCard, type ProductCardData } from "@/components/ProductCard";
import { ProductGallery } from "@/components/ProductGallery";
import { StickyBuyBar } from "@/components/StickyBuyBar";
import { formatBRL } from "@/lib/money";
import { absoluteUrl, SITE_BRAND_NAME, siteUrl, truncateDescription } from "@/lib/seo";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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
  brand: { name: string; slug: string } | null;
  product_images: { url: string; alt: string | null; position: number }[];
};

type MetadataProduct = {
  slug: string;
  name: string;
  description: string | null;
  product_images: { url: string; position: number }[] | null;
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
    .select("slug, name, description, product_images(url, position)")
    .eq("slug", slug)
    .eq("status", "active")
    .single<MetadataProduct>();

  if (!data) {
    return {
      title: "Produto nao encontrado",
      robots: { index: false, follow: false },
    };
  }

  const images = [...(data.product_images ?? [])].sort((a, b) => a.position - b.position);
  const description = truncateDescription(
    data.description ??
      `${data.name} da curadoria ${SITE_BRAND_NAME}. Perfume de ambiente selecionado para casa, presente e decoracao.`
  );
  const image = absoluteUrl(images[0]?.url);

  return {
    title: data.name,
    description,
    alternates: {
      canonical: `/produtos/${data.slug}`,
    },
    openGraph: {
      title: data.name,
      description,
      url: siteUrl(`/produtos/${data.slug}`),
      type: "website",
      images: image
        ? [{ url: image, alt: data.name }]
        : [{ url: "/hero/universomarcas.jpg", alt: data.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: data.name,
      description,
      images: image ? [image] : ["/hero/universomarcas.jpg"],
    },
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
      "id, slug, name, description, price_cents, compare_at_price_cents, stock_quantity, category_id, category:categories(name, slug), brand:brands(name, slug), product_images(url, alt, position)"
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
  const baseUrl = siteUrl().replace(/\/$/, "");
  const productDescription =
    product.description ?? `${product.name} - ${SITE_BRAND_NAME}, perfumaria de ambiente.`;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: productDescription,
    image: images.map((image) => absoluteUrl(image.url)).filter(Boolean),
    sku: product.id,
    brand: { "@type": "Brand", name: product.brand?.name ?? SITE_BRAND_NAME },
    category: product.category?.name,
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/produtos/${product.slug}`,
      priceCurrency: "BRL",
      price: (product.price_cents / 100).toFixed(2),
      availability: outOfStock
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: SITE_BRAND_NAME },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${baseUrl}/` },
      { "@type": "ListItem", position: 2, name: "Catalogo", item: `${baseUrl}/produtos` },
      ...(product.category
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: product.category.name,
              item: `${baseUrl}/produtos?categoria=${product.category.slug}`,
            },
          ]
        : []),
      {
        "@type": "ListItem",
        position: product.category ? 4 : 3,
        name: product.name,
        item: `${baseUrl}/produtos/${product.slug}`,
      },
    ],
  };

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
    related = (relatedRaw ?? []).map(
      (item: {
        id: string;
        slug: string;
        name: string;
        price_cents: number;
        compare_at_price_cents: number | null;
        stock_quantity: number;
        product_images: { url: string; position: number }[];
      }) => ({
        id: item.id,
        slug: item.slug,
        name: item.name,
        price_cents: item.price_cents,
        compare_at_price_cents: item.compare_at_price_cents,
        stock_quantity: item.stock_quantity,
        cover_url: pickCover(item.product_images),
      })
    );
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
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs text-ink-mute" aria-label="breadcrumb">
          <Link href="/" className="hover:text-coral-deep transition">Inicio</Link>
          <span>/</span>
          <Link href="/produtos" className="hover:text-coral-deep transition">Catalogo</Link>
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
          <span className="max-w-[40ch] truncate text-ink-soft">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <ProductGallery images={images} productName={product.name} />

          <div className="space-y-6">
            <div>
              {product.brand && (
                <Link
                  href={`/produtos?marca=${product.brand.slug}`}
                  className="text-xs uppercase tracking-widest text-sage-deep hover:text-coral-deep transition"
                >
                  {product.brand.name}
                </Link>
              )}
              <h1 className="mt-2 font-display text-4xl leading-tight text-ink md:text-5xl">
                {product.name}
              </h1>
              {product.category && (
                <Link
                  href={`/produtos?categoria=${product.category.slug}`}
                  className="mt-2 inline-flex text-xs text-ink-mute hover:text-coral-deep transition"
                >
                  {product.category.name}
                </Link>
              )}
            </div>

            <div className="flex items-baseline gap-3">
              {hasPromo && (
                <span className="text-lg text-ink-mute line-through tabular-nums">
                  {formatBRL(product.compare_at_price_cents!)}
                </span>
              )}
              <span className="font-display text-4xl tabular-nums text-coral-deep">
                {formatBRL(product.price_cents)}
              </span>
              {hasPromo && (
                <span className="rounded-full bg-coral-soft px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-coral-deep">
                  Promocao
                </span>
              )}
            </div>

            {outOfStock ? (
              <p className="text-sm font-medium text-coral-deep">
                Esgotado por enquanto. Volte em breve.
              </p>
            ) : product.stock_quantity <= 3 ? (
              <p className="text-sm text-coral-deep">
                Ultimas unidades - so {product.stock_quantity} em estoque.
              </p>
            ) : null}

            <AddToCartButton productId={product.id} disabled={outOfStock} />

            <div className="border-t border-cream-deep pt-5">
              <h2 className="mb-3 font-display text-2xl text-ink">Sobre o produto</h2>
              {product.description ? (
                <p className="whitespace-pre-line text-sm leading-relaxed text-ink-soft">
                  {product.description}
                </p>
              ) : (
                <p className="text-sm italic leading-relaxed text-ink-soft">
                  Aroma escolhido a dedo para deixar seu cantinho ainda mais aconchegante.
                  Em breve trazemos a descricao completa.
                </p>
              )}
            </div>

            <ul className="grid grid-cols-1 gap-3 border-t border-cream-deep pt-5 text-xs text-ink-soft sm:grid-cols-3">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-coral-deep">•</span>
                <span><strong className="text-ink">Frete pelos Correios</strong><br />calculado no checkout</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-coral-deep">•</span>
                <span><strong className="text-ink">Pix, cartao ou boleto</strong><br />parcele em ate 3x</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-coral-deep">•</span>
                <span><strong className="text-ink">Trocas em 7 dias</strong><br />pelo Codigo de Defesa do Consumidor</span>
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

      {related.length > 0 && (
        <section className="mt-16 border-t border-cream-deep bg-cream-soft">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="mb-10 text-center">
              <p className="text-xs uppercase tracking-widest text-sage-deep">voce tambem pode gostar</p>
              <h2 className="mt-2 font-display text-3xl text-ink md:text-4xl">
                Da mesma familia
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
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
