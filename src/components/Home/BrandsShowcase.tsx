import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { buildProductsUrl } from "@/lib/url";

/**
 * Biblioteca de marcas da curadoria.
 */
export async function BrandsShowcase() {
  const supabase = await createSupabaseServerClient();

  const [{ data: brands }, { data: actives }] = await Promise.all([
    supabase
      .from("brands")
      .select("id, slug, name, position")
      .eq("active", true)
      .order("position"),
    supabase.from("products").select("brand_id").eq("status", "active"),
  ]);

  const countByBrand = new Map<string, number>();
  for (const p of (actives ?? []) as { brand_id: string | null }[]) {
    if (p.brand_id) countByBrand.set(p.brand_id, (countByBrand.get(p.brand_id) ?? 0) + 1);
  }

  if (!brands || brands.length === 0) return null;

  return (
    <section className="bg-cream">
      <div className="mx-auto grid max-w-[92rem] gap-10 px-6 py-20 md:grid-cols-[0.82fr_1.18fr] md:items-start">
        <div className="md:sticky md:top-32">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sage-deep">
            biblioteca olfativa
          </p>
          <h2 className="mt-3 max-w-md font-display text-4xl leading-[1.02] text-ink sm:text-5xl">
            Marcas escolhidas com intenção.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-soft">
            Uma selecao de casas autorais, linhas decorativas e fragrancias para diferentes formas de habitar.
          </p>
          <Link
            href="/marcas"
            className="mt-7 inline-flex text-sm font-medium text-ink underline decoration-sage-deep/30 underline-offset-8 transition hover:text-sage-deep hover:decoration-sage-deep"
          >
            Ver todas as marcas
          </Link>
        </div>

        <div className="grid grid-cols-1 border-t border-cream-deep sm:grid-cols-2">
          {brands.map((b) => {
            const count = countByBrand.get(b.id) ?? 0;
            const available = count > 0;
            const content = (
              <>
                <span className="font-display text-2xl leading-tight text-ink transition group-hover:text-sage-deep">
                  {b.name}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-mute">
                  {available
                    ? `${count} ${count === 1 ? "produto" : "produtos"}`
                    : "Em breve"}
                </span>
              </>
            );

            if (!available) {
              return (
                <div
                  key={b.id}
                  className="flex min-h-28 flex-col justify-between border-b border-cream-deep px-1 py-5 opacity-55 sm:odd:border-r sm:odd:pr-6 sm:even:pl-6"
                  title="Em breve no catalogo"
                >
                  {content}
                </div>
              );
            }

            return (
              <Link
                key={b.id}
                href={buildProductsUrl({ marca: b.slug })}
                className="group flex min-h-28 flex-col justify-between border-b border-cream-deep px-1 py-5 transition hover:bg-cream-soft sm:odd:border-r sm:odd:pr-6 sm:even:pl-6"
              >
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
