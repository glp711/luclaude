import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { buildProductsUrl } from "@/lib/url";

/**
 * Bloco "Explore nossas marcas" para a home.
 *
 * Renderiza todas as marcas ativas como cards compactos. Marcas sem produto
 * ativo aparecem com selo "Em breve" e nao linkam pra catalogo vazio.
 *
 * Visual segue paleta cream/coral/sage do resto da home.
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
    <section className="border-t border-cream-deep/40 bg-cream-soft">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-sage-deep">curadoria</p>
            <h2 className="mt-2 font-display text-4xl text-ink">Explore nossas marcas</h2>
            <p className="mt-2 text-sm text-ink-soft max-w-xl">
              Marcas brasileiras e internacionais escolhidas a dedo. Clica em uma e vê
              tudo dela.
            </p>
          </div>
          <Link
            href="/marcas"
            className="self-start md:self-auto text-sm text-ink-soft hover:text-coral-deep transition"
          >
            Ver todas →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {brands.map((b) => {
            const count = countByBrand.get(b.id) ?? 0;
            const available = count > 0;
            if (available) {
              return (
                <Link
                  key={b.id}
                  href={buildProductsUrl({ marca: b.slug })}
                  className="group relative rounded-[8px] border border-cream-deep bg-cream p-4 text-center transition hover:border-coral hover:bg-coral-soft/30"
                >
                  <p className="font-display text-lg text-ink group-hover:text-coral-deep transition leading-tight">
                    {b.name}
                  </p>
                  <span className="mt-1.5 inline-block text-[10px] uppercase tracking-widest text-sage-deep">
                    {count} {count === 1 ? "produto" : "produtos"}
                  </span>
                </Link>
              );
            }
            return (
              <div
                key={b.id}
                className="relative rounded-[8px] border border-cream-deep/60 bg-cream/40 p-4 text-center"
                title="Em breve no catálogo"
              >
                <p className="font-display text-lg text-ink-mute leading-tight">
                  {b.name}
                </p>
                <span className="mt-1.5 inline-block text-[10px] uppercase tracking-widest text-ink-mute/70">
                  Em breve
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
