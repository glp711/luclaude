import Image from "next/image";
import Link from "next/link";
import { CATEGORY_SHORTCUTS } from "@/lib/home-content";
import { buildProductsUrl } from "@/lib/url";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Atalhos por categoria com foto representativa de produto.
 *
 * Pra cada categoria configurada em CATEGORY_SHORTCUTS, pegamos o produto
 * ativo mais recente que tenha imagem e exibimos a thumb. Categorias sem
 * produto sao omitidas — mantem consistencia com o resto do site.
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

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="text-center mb-12">
        <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-sage-deep">
          <span aria-hidden="true" className="h-px w-8 bg-sage-deep/60" />
          o que você procura
          <span aria-hidden="true" className="h-px w-8 bg-sage-deep/60" />
        </p>
        <h2 className="mt-3 font-display text-4xl sm:text-5xl text-ink">
          Escolha por categoria
        </h2>
        <p className="mt-3 text-sm text-ink-soft max-w-md mx-auto">
          Começa pelo tipo de produto. Depois escolhe a marca e a fragrância.
        </p>
      </div>
      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {visible.map((c) => {
          const img = imageByCategorySlug.get(c.categorySlug)!;
          return (
            <li key={c.categorySlug}>
              <Link
                href={buildProductsUrl({ categoria: c.categorySlug })}
                className="group block overflow-hidden rounded-[8px] border border-cream-deep bg-cream-soft transition hover:border-coral focus:outline-none focus-visible:ring-2 focus-visible:ring-coral"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-coral-soft/20">
                  <Image
                    src={img.url}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.04]"
                  />
                  {/* Gradient overlay sutil pra legibilidade do label */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink/55 via-ink/20 to-transparent"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                    <p className="font-display text-lg sm:text-xl leading-tight text-cream-soft">
                      {c.label}
                    </p>
                    <span className="mt-1 inline-flex items-center text-[11px] uppercase tracking-widest text-cream-soft/85 group-hover:text-coral-soft transition">
                      Ver tudo
                      <span aria-hidden="true" className="ml-1.5">
                        →
                      </span>
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
