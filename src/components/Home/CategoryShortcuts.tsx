import Image from "next/image";
import Link from "next/link";
import { CATEGORY_SHORTCUTS } from "@/lib/home-content";
import { buildProductsUrl } from "@/lib/url";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Atalhos editoriais por categoria com foto representativa de produto.
 */
export async function CategoryShortcuts() {
  const supabase = await createSupabaseServerClient();
  const slugs = CATEGORY_SHORTCUTS.map((c) => c.categorySlug);

  const { data: products } = await supabase
    .from("products")
    .select(
      "id, name, created_at, categories!inner(slug), product_images(url, position)"
    )
    .eq("status", "active")
    .in("categories.slug", slugs)
    .order("created_at", { ascending: false });

  type Row = {
    id: string;
    name: string;
    created_at: string;
    categories: { slug: string } | null;
    product_images: { url: string; position: number }[];
  };

  const imageByCategorySlug = new Map<string, { url: string; alt: string }>();
  for (const p of ((products ?? []) as unknown as Row[])) {
    const catSlug = p.categories?.slug;
    if (!catSlug || imageByCategorySlug.has(catSlug)) continue;
    const sorted = [...(p.product_images ?? [])].sort(
      (a, b) => a.position - b.position
    );
    const url = sorted[0]?.url;
    if (!url) continue;
    imageByCategorySlug.set(catSlug, { url, alt: p.name });
  }

  const visible = CATEGORY_SHORTCUTS.filter((c) =>
    imageByCategorySlug.has(c.categorySlug)
  );

  if (visible.length === 0) return null;

  const featureCategories = visible.slice(0, 3);
  const compactCategories = visible.slice(3);

  return (
    <section className="relative mx-auto max-w-[86rem] px-5 py-20 sm:px-8 sm:py-24 xl:px-0">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sage-deep">
            explorar por ritual
          </p>
          <h2 className="mt-3 max-w-2xl text-balance font-display text-4xl leading-[1.02] text-ink sm:text-5xl">
            Encontre pelo gesto que a casa pede.
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-ink-soft sm:text-base">
          Aromatizar, presentear, cuidar da pele ou renovar o ambiente: cada categoria entra como parte de um ritual.
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
        {featureCategories.map((c, index) => {
          const img = imageByCategorySlug.get(c.categorySlug)!;
          return (
            <li key={c.categorySlug}>
              <Link
                href={buildProductsUrl({ categoria: c.categorySlug })}
                className="group block overflow-hidden rounded-[8px] bg-ink shadow-sm shadow-ink/5 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-deep"
              >
                <div className="relative aspect-[4/5] overflow-hidden md:aspect-[3/4]">
                  <Image
                    src={img.url}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.045]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-ink/72 via-ink/12 to-transparent"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-cream-soft sm:p-7">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cream-soft/75">
                      0{index + 1}
                    </p>
                    <p className="mt-2 font-display text-3xl leading-[0.98] sm:text-4xl">
                      {c.label}
                    </p>
                    <span className="mt-4 inline-flex text-[11px] font-semibold uppercase tracking-[0.18em] text-cream-soft underline decoration-cream-soft/40 underline-offset-8 transition group-hover:decoration-cream-soft">
                      Entrar na categoria
                      <span aria-hidden="true" className="ml-1.5">
                        -&gt;
                      </span>
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {compactCategories.length > 0 && (
        <div className="mt-7 flex flex-wrap gap-2">
          {compactCategories.map((c) => (
            <Link
              key={c.categorySlug}
              href={buildProductsUrl({ categoria: c.categorySlug })}
              className="rounded-full border border-cream-deep bg-cream-soft px-4 py-2 text-sm text-ink-soft transition hover:border-sage-deep hover:text-sage-deep"
            >
              {c.label}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
