import Image from "next/image";
import Link from "next/link";
import { formatBRL } from "@/lib/money";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { buildProductsUrl } from "@/lib/url";

export const metadata = {
  title: "Marcas",
  description:
    "Marcas brasileiras e internacionais de perfumaria de ambiente selecionadas a dedo.",
  alternates: {
    canonical: "/marcas",
  },
  openGraph: {
    title: "Marcas de perfumes de ambiente",
    description:
      "Explore marcas como Dani Fernandes, M. Victoria, Lenvie, Maison Berger e Kailash em uma curadoria premium para casa.",
    url: "/marcas",
    images: [{ url: "/hero/universomarcas.jpg", alt: "Biblioteca de marcas da curadoria" }],
  },
};

type BrandRow = {
  id: string;
  slug: string;
  name: string;
  position: number;
};

type ProductPreviewRow = {
  id: string;
  slug: string;
  name: string;
  price_cents: number;
  brand_id: string | null;
  product_images: { url: string; position: number }[] | null;
  categories:
    | { slug: string; name: string; product_type_label: string | null }
    | { slug: string; name: string; product_type_label: string | null }[]
    | null;
};

const BRAND_COPY: Record<string, string> = {
  "dani-fernandes": "Assinatura floral, delicada e acolhedora para presentes e ambientes especiais.",
  "m-victoria": "Fragrancias elegantes com leitura decorativa e acabamento presenteavel.",
  lenvie: "Aromas de casa com sensacao limpa, sofisticada e contemporanea.",
  kailash: "Um universo sensorial ligado a bem-estar, banho e rituais do dia a dia.",
  "maison-berger": "Tradicao francesa em lampadas cataliticas, refis e cuidado com o ar.",
  "via-aroma": "Opcoes praticas para aromatizar a rotina com leveza.",
};

export default async function MarcasPage() {
  const supabase = await createSupabaseServerClient();

  const [{ data: brands }, { data: products }] = await Promise.all([
    supabase
      .from("brands")
      .select("id, slug, name, position")
      .eq("active", true)
      .order("position"),
    supabase
      .from("products")
      .select(
        "id, slug, name, price_cents, brand_id, product_images(url, position), categories(slug, name, product_type_label)"
      )
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(180),
  ]);

  const brandRows = ((brands ?? []) as BrandRow[]).sort((a, b) => a.position - b.position);
  const productRows = (products ?? []) as unknown as ProductPreviewRow[];
  const productsByBrand = new Map<string, ProductPreviewRow[]>();
  const categoriesByBrand = new Map<string, Map<string, { label: string; slug: string; count: number }>>();

  for (const product of productRows) {
    if (!product.brand_id) continue;
    if (!productsByBrand.has(product.brand_id)) productsByBrand.set(product.brand_id, []);
    productsByBrand.get(product.brand_id)!.push(product);

    const category = firstCategory(product.categories);
    if (!category) continue;
    if (!categoriesByBrand.has(product.brand_id)) categoriesByBrand.set(product.brand_id, new Map());
    const categoryMap = categoriesByBrand.get(product.brand_id)!;
    const existing = categoryMap.get(category.slug);
    categoryMap.set(category.slug, {
      slug: category.slug,
      label: category.product_type_label ?? category.name,
      count: (existing?.count ?? 0) + 1,
    });
  }

  const availableBrands = brandRows.filter((brand) => (productsByBrand.get(brand.id)?.length ?? 0) > 0);
  const totalProducts = productRows.length;
  const featured = availableBrands[0] ?? brandRows[0];
  const featuredProducts = featured ? productsByBrand.get(featured.id)?.slice(0, 3) ?? [] : [];

  return (
    <main className="bg-cream">
      <section className="border-b border-cream-deep bg-cream-soft">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-16">
          <div>
            <nav className="mb-4 flex items-center gap-2 text-xs text-ink-mute" aria-label="breadcrumb">
              <Link href="/" className="hover:text-coral-deep transition">Inicio</Link>
              <span>/</span>
              <span className="text-ink-soft">Marcas</span>
            </nav>
            <p className="text-xs uppercase tracking-widest text-sage-deep">curadoria premium</p>
            <h1 className="mt-3 font-display text-5xl leading-[0.95] text-ink sm:text-6xl lg:text-7xl">
              Explore por marca, descubra por sensacao.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft">
              A Perfumes de Ambiente Decor reune marcas selecionadas com olhar estetico,
              tecnica e respeito as materias-primas. Cada card abaixo abre uma selecao
              filtrada, pronta para comparar fragrancias, tipos e presentes.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/produtos"
                className="rounded-full bg-coral px-6 py-3 text-sm font-medium text-white hover:bg-coral-deep transition"
              >
                Explorar catalogo
              </Link>
              <a
                href="#lista-marcas"
                className="rounded-full border border-sage px-6 py-3 text-sm font-medium text-sage-deep hover:bg-sage-soft transition"
              >
                Ver marcas
              </a>
            </div>
          </div>

          <div className="rounded-[8px] border border-cream-deep bg-cream p-4 shadow-[0_18px_50px_rgba(45,41,36,0.08)]">
            <div className="grid gap-4 sm:grid-cols-[1fr_0.82fr]">
              <div className="rounded-[8px] bg-cream-soft p-5">
                <p className="text-xs uppercase tracking-widest text-sage-deep">em destaque</p>
                <h2 className="mt-2 font-display text-4xl text-ink">{featured?.name ?? "Marcas"}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {featured ? brandDescription(featured.slug) : "Selecao em curadoria."}
                </p>
                {featured && (
                  <Link
                    href={buildProductsUrl({ marca: featured.slug })}
                    className="mt-5 inline-flex rounded-full bg-ink px-5 py-2.5 text-sm text-cream-soft hover:bg-coral-deep transition"
                  >
                    Ver produtos da marca
                  </Link>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-1">
                {featuredProducts.length > 0 ? (
                  featuredProducts.map((product) => (
                    <MiniProduct key={product.id} product={product} />
                  ))
                ) : (
                  <div className="col-span-3 flex min-h-48 items-center justify-center rounded-[8px] border border-dashed border-cream-deep bg-cream-soft p-5 text-center text-sm text-ink-soft sm:col-span-1">
                    Produtos em curadoria.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-cream-deep bg-cream">
        <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto px-5 py-4 sm:px-6 hide-scrollbar">
          <Link
            href="/produtos"
            className="shrink-0 rounded-full border border-cream-deep bg-cream-soft px-4 py-2 text-xs font-medium uppercase tracking-widest text-ink-soft hover:border-coral hover:text-coral-deep transition"
          >
            Todas
          </Link>
          {availableBrands.map((brand) => (
            <Link
              key={brand.id}
              href={buildProductsUrl({ marca: brand.slug })}
              className="shrink-0 rounded-full border border-cream-deep bg-cream-soft px-4 py-2 text-xs font-medium uppercase tracking-widest text-ink-soft hover:border-coral hover:text-coral-deep transition"
            >
              {brand.name}
            </Link>
          ))}
        </div>
      </section>

      <section id="lista-marcas" className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:py-16">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-sage-deep">biblioteca de marcas</p>
            <h2 className="mt-2 font-display text-4xl text-ink sm:text-5xl">Escolha uma assinatura</h2>
          </div>
          <p className="max-w-md text-sm text-ink-soft">
            {availableBrands.length} marcas com produtos ativos, {totalProducts} itens em catalogo
            e novas curadorias entrando aos poucos.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {brandRows.map((brand) => {
            const previews = productsByBrand.get(brand.id)?.slice(0, 4) ?? [];
            const categories = Array.from(categoriesByBrand.get(brand.id)?.values() ?? [])
              .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
              .slice(0, 4);
            const count = productsByBrand.get(brand.id)?.length ?? 0;
            const available = count > 0;

            return (
              <article
                key={brand.id}
                className={`group rounded-[8px] border bg-cream-soft p-4 transition ${
                  available
                    ? "border-cream-deep hover:border-coral hover:shadow-xl hover:shadow-ink/10"
                    : "border-cream-deep/60 opacity-70"
                }`}
              >
                <div className="grid grid-cols-[112px_1fr] gap-4 sm:grid-cols-[132px_1fr]">
                  <ProductCollage products={previews} brandName={brand.name} />
                  <div className="min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-widest text-sage-deep">
                          {available ? `${count} ${count === 1 ? "produto" : "produtos"}` : "em breve"}
                        </p>
                        <h3 className="mt-1 font-display text-3xl leading-tight text-ink group-hover:text-coral-deep transition">
                          {brand.name}
                        </h3>
                      </div>
                    </div>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-soft">
                      {brandDescription(brand.slug)}
                    </p>

                    {categories.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {categories.map((category) => (
                          <Link
                            key={category.slug}
                            href={buildProductsUrl({ marca: brand.slug, categoria: category.slug })}
                            className="rounded-full bg-cream px-3 py-1 text-[11px] text-ink-soft hover:bg-coral-soft hover:text-coral-deep transition"
                          >
                            {category.label}
                          </Link>
                        ))}
                      </div>
                    )}

                    {available ? (
                      <Link
                        href={buildProductsUrl({ marca: brand.slug })}
                        className="mt-5 inline-flex rounded-full bg-coral px-5 py-2.5 text-sm font-medium text-white hover:bg-coral-deep transition"
                      >
                        Ver selecao
                      </Link>
                    ) : (
                      <span className="mt-5 inline-flex rounded-full border border-cream-deep px-5 py-2.5 text-sm text-ink-mute">
                        Em curadoria
                      </span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

function ProductCollage({
  products,
  brandName,
}: {
  products: ProductPreviewRow[];
  brandName: string;
}) {
  const first = products[0];
  const cover = first ? pickCover(first.product_images) : null;

  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-[8px] bg-cream">
      {cover ? (
        <Image
          src={cover}
          alt={`Produto ${brandName}`}
          fill
          sizes="132px"
          className="object-cover transition duration-700 group-hover:scale-[1.04]"
        />
      ) : (
        <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,var(--color-cream-soft),var(--color-cream-deep))] p-4 text-center font-display text-2xl text-coral-deep">
          {initials(brandName)}
        </div>
      )}
      {products.length > 1 && (
        <div className="absolute bottom-2 left-2 right-2 flex gap-1.5">
          {products.slice(1, 4).map((product) => {
            const image = pickCover(product.product_images);
            return (
              <div key={product.id} className="relative h-10 flex-1 overflow-hidden rounded bg-cream-soft ring-1 ring-cream">
                {image ? (
                  <Image src={image} alt="" fill sizes="44px" className="object-cover" />
                ) : (
                  <div className="h-full bg-cream-deep" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MiniProduct({ product }: { product: ProductPreviewRow }) {
  const cover = pickCover(product.product_images);

  return (
    <Link
      href={`/produtos/${product.slug}`}
      className="group/mini grid min-h-24 grid-rows-[1fr_auto] overflow-hidden rounded-[8px] border border-cream-deep bg-cream-soft sm:grid-cols-[82px_1fr] sm:grid-rows-1"
    >
      <div className="relative min-h-24 bg-cream">
        {cover ? (
          <Image
            src={cover}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 30vw, 100px"
            className="object-cover transition duration-700 group-hover/mini:scale-[1.04]"
          />
        ) : (
          <div className="h-full bg-cream-deep" />
        )}
      </div>
      <div className="hidden p-3 sm:block">
        <p className="line-clamp-2 text-sm font-medium text-ink group-hover/mini:text-coral-deep transition">
          {product.name}
        </p>
        <p className="mt-1 text-xs text-coral-deep">{formatBRL(product.price_cents)}</p>
      </div>
    </Link>
  );
}

function brandDescription(slug: string) {
  return (
    BRAND_COPY[slug] ??
    "Marca selecionada pela curadoria por sua qualidade, linguagem olfativa e potencial de transformar a casa em experiencia."
  );
}

function pickCover(images: { url: string; position: number }[] | null | undefined) {
  if (!images || images.length === 0) return null;
  return [...images].sort((a, b) => a.position - b.position)[0]?.url ?? null;
}

function firstCategory(
  category:
    | { slug: string; name: string; product_type_label: string | null }
    | { slug: string; name: string; product_type_label: string | null }[]
    | null
) {
  return Array.isArray(category) ? category[0] ?? null : category;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
