import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { buildProductsUrl } from "@/lib/url";

export const metadata = { title: "Marcas" };

export default async function MarcasPage() {
  const supabase = await createSupabaseServerClient();
  const { data: brands } = await supabase
    .from("brands")
    .select("id, slug, name")
    .eq("active", true)
    .order("name");

  return (
    <main>
      <section className="bg-cream-soft border-b border-cream-deep/60">
        <div className="mx-auto max-w-4xl px-6 py-14 text-center">
          <p className="text-xs uppercase tracking-widest text-sage-deep">curadoria</p>
          <h1 className="mt-2 font-display text-5xl md:text-6xl text-ink">
            Marcas
          </h1>
          <p className="mt-3 text-ink-soft max-w-xl mx-auto">
            Selecionamos marcas brasileiras e internacionais reconhecidas pela qualidade
            das essencias e pelo cuidado em cada detalhe.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {(brands ?? []).map((b) => (
            <Link
              key={b.id}
              href={buildProductsUrl({ marca: b.slug })}
              className="group rounded-2xl border border-cream-deep bg-cream-soft p-6 text-center hover:border-coral hover:bg-coral-soft/30 transition"
            >
              <p className="font-display text-2xl text-ink group-hover:text-coral-deep transition">
                {b.name}
              </p>
              <span className="mt-3 inline-block text-xs uppercase tracking-widest text-sage-deep">
                Ver catalogo →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
