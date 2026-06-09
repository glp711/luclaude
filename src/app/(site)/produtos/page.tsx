import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProductCard, type ProductCardData } from "@/components/ProductCard";
import { SortSelect } from "@/components/SortSelect";

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

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-light">
          {categoryRow.data?.name ?? (q ? `Resultados para "${q}"` : "Catálogo")}
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          {count != null ? `${count} produto${count === 1 ? "" : "s"}` : ""}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
        <aside className="space-y-6">
          <div>
            <h2 className="text-xs font-medium uppercase tracking-wide text-neutral-500 mb-2">
              Categorias
            </h2>
            <ul className="space-y-1 text-sm">
              <li>
                <Link
                  href="/produtos"
                  className={!categoriaSlug ? "font-medium text-neutral-900" : "text-neutral-600 hover:text-neutral-900"}
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
                        ? "font-medium text-neutral-900"
                        : "text-neutral-600 hover:text-neutral-900"
                    }
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <form className="space-y-2" action="/produtos">
            <h2 className="text-xs font-medium uppercase tracking-wide text-neutral-500">
              Buscar
            </h2>
            {categoriaSlug && (
              <input type="hidden" name="categoria" value={categoriaSlug} />
            )}
            <input
              name="q"
              defaultValue={q}
              placeholder="Nome do produto"
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
            <button className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-50">
              Buscar
            </button>
          </form>
        </aside>

        <div className="space-y-4">
          <div className="flex items-center justify-end gap-2 text-sm">
            <label className="text-neutral-600">Ordenar:</label>
            <SortSelect current={sort} />
          </div>

          {cards.length === 0 ? (
            <div className="rounded-lg border border-dashed border-neutral-300 bg-white p-12 text-center text-neutral-500">
              Nenhum produto encontrado.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
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
    </main>
  );
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
    <div className="flex items-center justify-between text-sm text-neutral-600 pt-4">
      <span>
        Página {page} de {last}
      </span>
      <div className="flex gap-2">
        {page > 1 && (
          <Link
            href={`/produtos${qs(page - 1)}`}
            className="rounded-md border border-neutral-300 px-3 py-1 hover:bg-neutral-50"
          >
            Anterior
          </Link>
        )}
        {page < last && (
          <Link
            href={`/produtos${qs(page + 1)}`}
            className="rounded-md border border-neutral-300 px-3 py-1 hover:bg-neutral-50"
          >
            Próxima
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
