import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { buildProductsUrl } from "@/lib/url";

export const metadata = {
  title: "Marcas",
  description:
    "Marcas brasileiras e internacionais de perfumaria de ambiente selecionadas a dedo.",
};

export default async function MarcasPage() {
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
    if (p.brand_id) {
      countByBrand.set(p.brand_id, (countByBrand.get(p.brand_id) ?? 0) + 1);
    }
  }

  const totalAtivas = (brands ?? []).filter(
    (b) => (countByBrand.get(b.id) ?? 0) > 0
  ).length;

  return (
    <main>
      {/* Hero — Explore nossas marcas */}
      <section className="relative overflow-hidden border-b border-cream-deep/60 bg-cream-soft">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, var(--color-coral) 0, transparent 40%), radial-gradient(circle at 80% 70%, var(--color-sage) 0, transparent 40%)",
          }}
        />
        <div className="relative mx-auto max-w-5xl px-6 py-20 md:py-24 text-center">
          <p className="text-xs uppercase tracking-widest text-sage-deep">curadoria</p>
          <h1 className="mt-3 font-display text-5xl md:text-7xl text-ink leading-tight">
            Explore nossas <em className="text-coral-deep not-italic">marcas</em>
          </h1>
          <p className="mt-5 text-ink-soft md:text-lg max-w-2xl mx-auto leading-relaxed">
            Selecionamos marcas brasileiras e internacionais reconhecidas pela qualidade
            das essencias e pelo cuidado em cada detalhe. Cada uma traz sua assinatura
            olfativa pro seu cantinho.
          </p>
          <p className="mt-6 text-xs uppercase tracking-widest text-sage-deep">
            {totalAtivas === 0
              ? `${(brands ?? []).length} marcas no catalogo`
              : `${totalAtivas} ${totalAtivas === 1 ? "marca disponivel" : "marcas disponiveis"} · ${(brands ?? []).length - totalAtivas} chegando`}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {(brands ?? []).map((b) => {
            const count = countByBrand.get(b.id) ?? 0;
            const available = count > 0;
            const href = available ? buildProductsUrl({ marca: b.slug }) : "#";
            const className = available
              ? "group relative rounded-2xl border border-cream-deep bg-cream-soft p-6 text-center hover:border-coral hover:bg-coral-soft/30 transition"
              : "group relative rounded-2xl border border-cream-deep/60 bg-cream/40 p-6 text-center cursor-not-allowed";

            const Card = (
              <>
                {!available && (
                  <span className="absolute top-3 right-3 rounded-full bg-sage-soft/80 px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-sage-deep">
                    Em breve
                  </span>
                )}
                <p
                  className={`font-display text-2xl transition ${
                    available
                      ? "text-ink group-hover:text-coral-deep"
                      : "text-ink-mute"
                  }`}
                >
                  {b.name}
                </p>
                <span
                  className={`mt-3 inline-block text-xs uppercase tracking-widest ${
                    available ? "text-sage-deep" : "text-ink-mute/70"
                  }`}
                >
                  {available
                    ? `Ver ${count} ${count === 1 ? "produto" : "produtos"} →`
                    : "Em curadoria"}
                </span>
              </>
            );

            return available ? (
              <Link key={b.id} href={href} className={className}>
                {Card}
              </Link>
            ) : (
              <div
                key={b.id}
                className={className}
                aria-disabled="true"
                title="Em breve no catalogo"
              >
                {Card}
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
