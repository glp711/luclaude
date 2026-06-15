import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProductCard, type ProductCardData } from "@/components/ProductCard";
import { SortSelect } from "@/components/SortSelect";

export const metadata = {
  title: "Catálogo",
  description: "Difusores, sabonetes, home spray e mais — perfumaria de ambiente escolhida a dedo pela LU.",
};

const PAGE_SIZE = 24;

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; q?: string; page?: string; sort?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);
  const categoriaSlug = sp.categoria?.trim() ?? null;
  const q = sp.q?.trim() ?? "";
  const sort = sp.sort ?? "recent";

  const supabase = await createSupabaseServerClient();

  const [{ data: categories }, categoryRow] = await Promise.all([
    supabase.from("categories").select("id, slug, name").order("position"),
    categoriaSlug
      ? supabase.from("categories").select("id, name").eq("slug", categoriaSlug).maybeSingle()
      : Promise.resolve({ data: null }),
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
  if (q) query = query.ilike("name", `%${q}%`);

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

  const cards: ProductCardData[] =
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

  const title = categoryRow.data?.name ?? (q ? `Resultados para "${q}"` : "Catálogo");
  const subtitle = categoryRow.data?.name
    ? "Selecionados a dedo pra sua casa."
    : q
      ? "Veja o que encontramos pra você."
      : "Tudo o que a Lu trouxe pro seu cantinho.";

  return (
    <main>
      {/* Cabeçalho editorial */}
      <section className="bg-cream-soft border-b border-cream-deep/60">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
          <nav className="text-xs text-ink-mute mb-3 flex items-center gap-2" aria-label="breadcrumb">
            <Link href="/" className="hover:text-coral-deep transition">Início</Link>
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
          {(categoriaSlug || q) && (
            <div className="mt-5 flex flex-wrap gap-2">
              {categoriaSlug && (
                <FilterChip
                  label={categoryRow.data?.name ?? categoriaSlug}
                  removeHref={qWithout(sp, "categoria")}
                />
              )}
              {q && (
                <FilterChip label={`"${q}"`} removeHref={qWithout(sp, "q")} />
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
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10">
          {/* Sidebar */}
          <aside className="space-y-8">
            <div>
              <h2 className="text-xs font-medium uppercase tracking-widest text-sage-deep mb-3">
                Categorias
              </h2>
              <ul className="space-y-1.5 text-sm">
                <li>
                  <Link
                    href="/produtos"
                    className={
                      !categoriaSlug
                        ? "font-medium text-coral-deep"
                        : "text-ink-soft hover:text-coral-deep transition"
                    }
                  >
                    Todas
                  </Link>
                </li>
                {(categories ?? []).map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/produtos?categoria=${c.slug}`}
                      className={
                        categoriaSlug === c.slug
                          ? "font-medium text-coral-deep"
                          : "text-ink-soft hover:text-coral-deep transition"
                      }
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <form className="space-y-2" action="/produtos">
              <h2 className="text-xs font-medium uppercase tracking-widest text-sage-deep">
                Buscar
              </h2>
              {categoriaSlug && (
                <input type="hidden" name="categoria" value={categoriaSlug} />
              )}
              <input
                name="q"
                defaultValue={q}
                placeholder="Nome do produto"
                className="w-full rounded-full border border-cream-deep bg-cream-soft px-4 py-2 text-sm placeholder:text-ink-mute focus:outline-none focus:border-coral transition"
              />
              <button className="w-full rounded-full bg-ink px-4 py-2 text-sm text-cream-soft hover:bg-coral-deep transition">
                Buscar
              </button>
            </form>
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
                <p className="font-display text-2xl text-ink">Nada por aqui.</p>
                <p className="mt-2 text-sm text-ink-soft">
                  Tenta ajustar o filtro ou{" "}
                  <Link href="/produtos" className="text-coral-deep underline underline-offset-4">
                    ver tudo
                  </Link>
                  .
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5">
                {cards.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}

            {count != null && count > PAGE_SIZE && (
              <Pagination page={page} total={count} sp={sp} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function FilterChip({ label, removeHref }: { label: string; removeHref: string }) {
  return (
    <Link
      href={removeHref}
      className="group inline-flex items-center gap-1.5 rounded-full bg-coral-soft px-3 py-1 text-xs text-coral-deep hover:bg-coral hover:text-white transition"
    >
      <span>{label}</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-3 w-3">
        <path d="M6 6l12 12M18 6L6 18" />
      </svg>
    </Link>
  );
}

function qWithout(sp: { categoria?: string; q?: string; sort?: string }, removeKey: "categoria" | "q") {
  const u = new URLSearchParams();
  if (removeKey !== "categoria" && sp.categoria) u.set("categoria", sp.categoria);
  if (removeKey !== "q" && sp.q) u.set("q", sp.q);
  if (sp.sort && sp.sort !== "recent") u.set("sort", sp.sort);
  const s = u.toString();
  return s ? `/produtos?${s}` : "/produtos";
}

function Pagination({
  page,
  total,
  sp,
}: {
  page: number;
  total: number;
  sp: { categoria?: string; q?: string; sort?: string };
}) {
  const last = Math.ceil(total / PAGE_SIZE);
  const qs = (p: number) => {
    const u = new URLSearchParams();
    if (sp.categoria) u.set("categoria", sp.categoria);
    if (sp.q) u.set("q", sp.q);
    if (sp.sort && sp.sort !== "recent") u.set("sort", sp.sort);
    if (p > 1) u.set("page", String(p));
    const s = u.toString();
    return s ? `?${s}` : "";
  };
  return (
    <div className="flex items-center justify-between text-sm text-ink-soft pt-6 border-t border-cream-deep">
      <span>
        Página <strong className="text-ink">{page}</strong> de{" "}
        <strong className="text-ink">{last}</strong>
      </span>
      <div className="flex gap-2">
        {page > 1 && (
          <Link
            href={`/produtos${qs(page - 1)}`}
            className="rounded-full border border-cream-deep px-4 py-1.5 hover:bg-cream-soft hover:border-coral transition"
          >
            ← Anterior
          </Link>
        )}
        {page < last && (
          <Link
            href={`/produtos${qs(page + 1)}`}
            className="rounded-full bg-ink text-cream-soft px-4 py-1.5 hover:bg-coral-deep transition"
          >
            Próxima →
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
