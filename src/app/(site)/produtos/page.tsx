import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProductCard, type ProductCardData } from "@/components/ProductCard";
import { SortSelect } from "@/components/SortSelect";
import { buildProductsUrl, buildProductsUrlWithout, type CatalogFilters } from "@/lib/url";

export const metadata = {
  title: "Catálogo",
  description: "Difusores, sabonetes, home spray e mais — perfumaria de ambiente escolhida a dedo.",
};

const PAGE_SIZE = 24;

type SearchParams = {
  categoria?: string;
  marca?: string;
  busca?: string;
  q?: string; // back-compat: ?q= usado por versoes anteriores
  page?: string;
  sort?: string;
  ofertas?: string;
};

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);
  const categoriaSlug = sp.categoria?.trim() || null;
  const marcaSlug = sp.marca?.trim() || null;
  const busca = (sp.busca ?? sp.q)?.trim() ?? "";
  const sort = sp.sort ?? "recent";
  const onlyOffers = sp.ofertas === "1";

  const supabase = await createSupabaseServerClient();

  const [{ data: brands }, { data: categories }, { data: activeCategoryRows }, categoryRow, brandRow] = await Promise.all([
    supabase.from("brands").select("id, slug, name").eq("active", true).order("position"),
    supabase
      .from("categories")
      .select("id, slug, name, group_slug, position")
      .order("position")
      .order("name"),
    supabase.from("products").select("category_id").eq("status", "active"),
    categoriaSlug
      ? supabase
          .from("categories")
          .select("id, name, group_slug, product_type_label")
          .eq("slug", categoriaSlug)
          .maybeSingle()
      : Promise.resolve({ data: null as null | { id: string; name: string; group_slug: string | null; product_type_label: string | null } }),
    marcaSlug
      ? supabase.from("brands").select("id, name").eq("slug", marcaSlug).maybeSingle()
      : Promise.resolve({ data: null as null | { id: string; name: string } }),
  ]);

  let query = supabase
    .from("products")
    .select(
      "id, slug, name, price_cents, compare_at_price_cents, stock_quantity, product_images(url, position)",
      { count: "exact" }
    )
    .eq("status", "active")
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  if (categoryRow.data?.id) query = query.eq("category_id", categoryRow.data.id);
  if (brandRow.data?.id) query = query.eq("brand_id", brandRow.data.id);
  if (busca) query = query.ilike("name", `%${busca}%`);
  if (onlyOffers) query = query.not("compare_at_price_cents", "is", null);

  switch (sort) {
    case "price_asc":
      query = query.order("price_cents", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price_cents", { ascending: false });
      break;
    case "name":
      query = query.order("name", { ascending: true });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data: products, count } = await query;

  const cards: ProductCardData[] = (products ?? []).map(
    (p: {
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
    })
  );

  const title = buildTitle({
    categoryName: categoryRow.data?.name,
    brandName: brandRow.data?.name,
    busca,
    onlyOffers,
  });

  const subtitle = buildSubtitle({
    categoryName: categoryRow.data?.name,
    brandName: brandRow.data?.name,
    busca,
    onlyOffers,
  });

  const currentFilters: CatalogFilters = {
    categoria: categoriaSlug,
    marca: marcaSlug,
    busca: busca || null,
    sort: sort === "recent" ? null : sort,
    ofertas: onlyOffers || null,
  };

  const countByCategory = new Map<string, number>();
  for (const row of (activeCategoryRows ?? []) as { category_id: string | null }[]) {
    if (row.category_id) {
      countByCategory.set(row.category_id, (countByCategory.get(row.category_id) ?? 0) + 1);
    }
  }
  const totalActiveProducts = Array.from(countByCategory.values()).reduce((sum, value) => sum + value, 0);
  const visibleCategories = ((categories ?? []) as {
    id: string;
    slug: string;
    name: string;
    group_slug: string | null;
    position: number;
  }[])
    .filter((category) => (countByCategory.get(category.id) ?? 0) > 0)
    .sort((a, b) => {
      const aGroup = a.group_slug ?? "zz";
      const bGroup = b.group_slug ?? "zz";
      return aGroup.localeCompare(bGroup) || a.position - b.position || a.name.localeCompare(b.name);
    });

  return (
    <main>
      {/* Cabecalho editorial */}
      <section className="bg-cream-soft border-b border-cream-deep/60">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
          <nav className="text-xs text-ink-mute mb-3 flex items-center gap-2" aria-label="breadcrumb">
            <Link href="/" className="hover:text-coral-deep transition">Inicio</Link>
            <span>/</span>
            <span className="text-ink-soft">{title}</span>
          </nav>
          <h1 className="font-display text-5xl md:text-6xl text-ink">{title}</h1>
          <p className="mt-2 text-ink-soft">{subtitle}</p>
          {count != null && (
            <p className="mt-4 text-xs uppercase tracking-widest text-sage-deep">
              {count} {count === 1 ? "produto" : "produtos"}
            </p>
          )}
          {(categoriaSlug || marcaSlug || busca || onlyOffers) && (
            <div className="mt-5 flex flex-wrap gap-2">
              {categoriaSlug && (
                <FilterChip
                  label={categoryRow.data?.name ?? categoriaSlug}
                  removeHref={buildProductsUrlWithout(currentFilters, "categoria")}
                />
              )}
              {marcaSlug && (
                <FilterChip
                  label={brandRow.data?.name ?? marcaSlug}
                  removeHref={buildProductsUrlWithout(currentFilters, "marca")}
                />
              )}
              {busca && (
                <FilterChip
                  label={`"${busca}"`}
                  removeHref={buildProductsUrlWithout(currentFilters, "busca")}
                />
              )}
              {onlyOffers && (
                <FilterChip
                  label="Ofertas"
                  removeHref={buildProductsUrlWithout(currentFilters, "ofertas")}
                />
              )}
              <Link
                href="/produtos"
                className="text-xs text-ink-mute hover:text-coral-deep transition self-center underline underline-offset-4"
              >
                limpar todos
              </Link>
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10">
          {/* Sidebar */}
          <aside className="space-y-8">
            <form className="rounded-[8px] border border-cream-deep bg-cream-soft p-4 shadow-sm space-y-3" action="/produtos">
              <h2 className="text-xs font-bold uppercase tracking-widest text-sage-deep">
                Buscar
              </h2>
              {categoriaSlug && <input type="hidden" name="categoria" value={categoriaSlug} />}
              {marcaSlug && <input type="hidden" name="marca" value={marcaSlug} />}
              {onlyOffers && <input type="hidden" name="ofertas" value="1" />}
              <input
                name="busca"
                defaultValue={busca}
                placeholder="Nome do produto"
                className="w-full rounded-full border border-cream-deep bg-cream-soft px-4 py-2 text-sm placeholder:text-ink-mute focus:outline-none focus:border-coral transition"
              />
              <button className="w-full rounded-full bg-ink px-4 py-2 text-sm text-cream-soft hover:bg-coral-deep transition">
                Buscar
              </button>
            </form>

            <div className="rounded-[8px] border border-cream-deep bg-cream-soft p-4 shadow-sm">
              <h2 className="text-xs font-bold uppercase tracking-widest text-sage-deep mb-3">
                Categorias
              </h2>
              <ul className="space-y-1.5 text-sm">
                <li>
                  <Link
                    href={buildProductsUrl({ ...currentFilters, categoria: null })}
                    className={
                      !categoriaSlug
                        ? "flex items-center justify-between rounded-full bg-coral-soft px-3 py-2 font-semibold text-coral-deep"
                        : "flex items-center justify-between rounded-full px-3 py-2 text-ink-soft hover:bg-cream hover:text-coral-deep transition"
                    }
                  >
                    <span>Todas</span>
                    <span className="text-xs">{totalActiveProducts}</span>
                  </Link>
                </li>
                {visibleCategories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={buildProductsUrl({ ...currentFilters, categoria: category.slug })}
                      className={
                        categoriaSlug === category.slug
                          ? "flex items-center justify-between rounded-full bg-coral-soft px-3 py-2 font-semibold text-coral-deep"
                          : "flex items-center justify-between rounded-full px-3 py-2 text-ink-soft hover:bg-cream hover:text-coral-deep transition"
                      }
                    >
                      <span>{category.name}</span>
                      <span className="text-xs">{countByCategory.get(category.id) ?? 0}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[8px] border border-cream-deep bg-cream-soft p-4 shadow-sm">
              <h2 className="text-xs font-bold uppercase tracking-widest text-sage-deep mb-3">
                Marcas
              </h2>
              <ul className="space-y-1.5 text-sm">
                <li>
                  <Link
                    href={buildProductsUrl({ ...currentFilters, marca: null })}
                    className={
                      !marcaSlug
                        ? "block rounded-full bg-coral-soft px-3 py-2 font-semibold text-coral-deep"
                        : "block rounded-full px-3 py-2 text-ink-soft hover:bg-cream hover:text-coral-deep transition"
                    }
                  >
                    Todas as marcas
                  </Link>
                </li>
                {(brands ?? []).map((b) => (
                  <li key={b.id}>
                    <Link
                      href={buildProductsUrl({ ...currentFilters, marca: b.slug })}
                      className={
                        marcaSlug === b.slug
                          ? "block rounded-full bg-coral-soft px-3 py-2 font-semibold text-coral-deep"
                          : "block rounded-full px-3 py-2 text-ink-soft hover:bg-cream hover:text-coral-deep transition"
                      }
                    >
                      {b.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href={buildProductsUrl({ ...currentFilters, ofertas: true })}
              className="block rounded-[8px] border border-coral bg-coral-soft/60 p-4 text-sm transition hover:bg-coral-soft"
            >
              <span className="block text-xs font-bold uppercase tracking-widest text-coral-deep">
                Achadinhos
              </span>
              <span className="mt-1 block font-display text-2xl leading-tight text-ink">
                Ver ofertas
              </span>
              <span className="mt-2 block text-xs text-ink-soft">
                Produtos com preço promocional no catálogo.
              </span>
            </Link>
          </aside>

          {/* Lista */}
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm text-ink-soft">
                {count != null && (
                  <span>
                    Mostrando{" "}
                    <strong className="text-ink">{cards.length}</strong> de{" "}
                    <strong className="text-ink">{count}</strong>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <label className="text-ink-soft">Ordenar:</label>
                <SortSelect current={sort} />
              </div>
            </div>

            {cards.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-cream-deep bg-cream-soft p-16 text-center">
                <p className="font-display text-2xl text-ink">Nada por aqui ainda.</p>
                <p className="mt-2 text-sm text-ink-soft max-w-md mx-auto">
                  {marcaSlug
                    ? "Estamos preparando o catálogo desta marca. Em breve mais produtos por aqui."
                    : "Tenta ajustar o filtro ou "}
                  {!marcaSlug && (
                    <Link href="/produtos" className="text-coral-deep underline underline-offset-4">
                      ver tudo
                    </Link>
                  )}
                  {!marcaSlug && "."}
                </p>
                {marcaSlug && (
                  <Link
                    href="/produtos"
                    className="mt-5 inline-block rounded-full bg-coral px-6 py-2.5 text-sm font-medium text-white hover:bg-coral-deep transition"
                  >
                    Ver catálogo completo
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5">
                {cards.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}

            {count != null && count > PAGE_SIZE && (
              <Pagination
                page={page}
                total={count}
                currentFilters={currentFilters}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function buildTitle(input: {
  categoryName?: string | null;
  brandName?: string | null;
  busca: string;
  onlyOffers: boolean;
}): string {
  if (input.categoryName && input.brandName)
    return `${input.categoryName} · ${input.brandName}`;
  if (input.categoryName) return input.categoryName;
  if (input.brandName) return input.brandName;
  if (input.busca) return `Resultados para "${input.busca}"`;
  if (input.onlyOffers) return "Ofertas";
  return "Catálogo";
}

function buildSubtitle(input: {
  categoryName?: string | null;
  brandName?: string | null;
  busca: string;
  onlyOffers: boolean;
}): string {
  if (input.categoryName || input.brandName) return "Selecionados com curadoria.";
  if (input.busca) return "Veja o que encontramos pra voce.";
  if (input.onlyOffers) return "Ofertas vigentes no catálogo.";
  return "Tudo o que a curadoria trouxe pro seu cantinho.";
}

function FilterChip({ label, removeHref }: { label: string; removeHref: string }) {
  return (
    <Link
      href={removeHref}
      className="group inline-flex items-center gap-1.5 rounded-full bg-coral-soft px-3 py-1 text-xs text-coral-deep hover:bg-coral hover:text-white transition"
    >
      <span>{label}</span>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="h-3 w-3"
        aria-hidden="true"
      >
        <path d="M6 6l12 12M18 6L6 18" />
      </svg>
    </Link>
  );
}

function Pagination({
  page,
  total,
  currentFilters,
}: {
  page: number;
  total: number;
  currentFilters: CatalogFilters;
}) {
  const last = Math.ceil(total / PAGE_SIZE);
  return (
    <div className="flex items-center justify-between text-sm text-ink-soft pt-6 border-t border-cream-deep">
      <span>
        Pagina <strong className="text-ink">{page}</strong> de{" "}
        <strong className="text-ink">{last}</strong>
      </span>
      <div className="flex gap-2">
        {page > 1 && (
          <Link
            href={buildProductsUrl({ ...currentFilters, page: page - 1 })}
            className="rounded-full border border-cream-deep px-4 py-1.5 hover:bg-cream-soft hover:border-coral transition"
          >
            ← Anterior
          </Link>
        )}
        {page < last && (
          <Link
            href={buildProductsUrl({ ...currentFilters, page: page + 1 })}
            className="rounded-full bg-ink text-cream-soft px-4 py-1.5 hover:bg-coral-deep transition"
          >
            Proxima →
          </Link>
        )}
      </div>
    </div>
  );
}

function pickCover(images: { url: string; position: number }[] | null | undefined): string | null {
  if (!images || images.length === 0) return null;
  return [...images].sort((a, b) => a.position - b.position)[0].url;
}
