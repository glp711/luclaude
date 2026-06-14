import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProductCard, type ProductCardData } from "@/components/ProductCard";

const CATEGORIES = [
  { slug: "difusores", name: "Difusores", desc: "Aroma que permanece, dia após dia." },
  { slug: "home-spray", name: "Home Spray", desc: "Um borrifo, um respiro de calma." },
  { slug: "sabonetes", name: "Sabonetes", desc: "Cuidado que abraça a pele." },
  { slug: "agua-perfumada", name: "Água Perfumada", desc: "Perfume leve pra tecidos e ambientes." },
  { slug: "cremes", name: "Cremes", desc: "Hidratação com perfume marcante." },
  { slug: "kits", name: "Kits", desc: "Presentes que viram lembrança." },
];

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();

  const { data: products } = await supabase
    .from("products")
    .select(
      "id, slug, name, price_cents, compare_at_price_cents, stock_quantity, product_images(url, position)"
    )
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(8);

  const featured: ProductCardData[] =
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
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-cream-soft">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-sage-soft px-3 py-1 text-xs text-ink-soft tracking-wide uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-sage-deep" />
              Perfumaria de ambiente
            </span>
            <h1 className="mt-5 font-display text-5xl md:text-7xl leading-[1.05] text-ink">
              Aromas que <em className="text-coral-deep">ficam</em>.
            </h1>
            <p className="mt-5 text-lg text-ink-soft max-w-md leading-relaxed">
              Difusores, sabonetes e home spray escolhidos a dedo pra sua casa virar
              lembrança boa.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <Link
                href="/produtos"
                className="inline-flex items-center rounded-full bg-coral px-7 py-3 text-sm font-medium text-white shadow-sm hover:bg-coral-deep transition"
              >
                Ver catálogo
              </Link>
              <Link
                href="/produtos?categoria=kits"
                className="inline-flex items-center text-sm text-ink-soft hover:text-coral-deep transition"
              >
                Explorar kits →
              </Link>
            </div>
          </div>
          {/* Espaço pra foto da LU — coloque public/lu-hero.jpg pra aparecer */}
          <div
            className="relative aspect-[4/5] md:aspect-square rounded-3xl overflow-hidden bg-coral-soft/40 border border-cream-deep bg-cover bg-center"
            style={{ backgroundImage: "url(/lu-hero.jpg)" }}
            role="img"
            aria-label="Lu, fundadora da Luperfumes"
          >
            <div className="absolute inset-0 flex items-end p-6">
              <div className="rounded-2xl bg-cream-soft/95 px-5 py-4 shadow-sm max-w-xs backdrop-blur">

                <p className="font-display italic text-lg text-ink">
                  &ldquo;Cada aroma escolhido como se fosse pra minha própria casa.&rdquo;
                </p>
                <p className="mt-1 text-xs uppercase tracking-wide text-ink-mute">— LU, fundadora</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-widest text-sage-deep">o que você procura</p>
          <h2 className="mt-2 font-display text-4xl text-ink">Categorias</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/produtos?categoria=${c.slug}`}
              className="group rounded-2xl bg-cream-soft border border-cream-deep p-5 hover:border-coral hover:bg-coral-soft/40 transition"
            >
              <div className="h-10 w-10 rounded-full bg-sage-soft flex items-center justify-center mb-3 group-hover:bg-coral-soft transition">
                <span className="h-2.5 w-2.5 rounded-full bg-sage-deep group-hover:bg-coral-deep transition" />
              </div>
              <h3 className="font-display text-xl text-ink leading-tight">{c.name}</h3>
              <p className="mt-1 text-xs text-ink-soft leading-relaxed">{c.desc}</p>
              <span className="mt-3 inline-block text-xs text-coral-deep">Ver →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Novidades */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-sage-deep">recém-chegados</p>
            <h2 className="mt-2 font-display text-4xl text-ink">Novidades</h2>
          </div>
          <Link
            href="/produtos"
            className="text-sm text-ink-soft hover:text-coral-deep transition"
          >
            Ver tudo →
          </Link>
        </div>

        {featured.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-cream-deep bg-cream-soft p-12 text-center text-ink-mute">
            Catálogo em preparação. Volte em breve.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Por que Luperfumes */}
      <section className="border-t border-cream-deep/40 bg-cream">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-sage-deep">o que faz diferente</p>
            <h2 className="mt-2 font-display text-4xl text-ink">Por que Luperfumes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: "🌿",
                title: "Curadoria pessoal",
                text: "Cada produto passa pelas mãos da LU antes de entrar no catálogo.",
              },
              {
                icon: "📦",
                title: "Envio em 24h",
                text: "Postamos no próximo dia útil. Você acompanha tudo por rastreio.",
              },
              {
                icon: "🔄",
                title: "Trocas em 7 dias",
                text: "Pelo Código de Defesa do Consumidor — sem letrinha miúda.",
              },
              {
                icon: "💬",
                title: "Atendimento humano",
                text: "Dúvida? A LU responde no WhatsApp, e-mail ou Instagram.",
              },
            ].map((p) => (
              <div
                key={p.title}
                className="rounded-2xl border border-cream-deep bg-cream-soft p-6 hover:border-coral-soft transition"
              >
                <div className="h-12 w-12 rounded-full bg-coral-soft/60 flex items-center justify-center text-xl mb-3">
                  {p.icon}
                </div>
                <h3 className="font-display text-xl text-ink">{p.title}</h3>
                <p className="mt-1 text-sm text-ink-soft leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sobre a LU — placeholder pra preencher com foto */}
      <section className="bg-sage-soft/60 border-y border-sage-soft">
        <div className="mx-auto max-w-7xl px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div
            className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-cream-soft border border-cream-deep order-2 md:order-1 bg-cover bg-center"
            style={{ backgroundImage: "url(/lu-sobre.jpg)" }}
            role="img"
            aria-label="Sobre a LU"
          />

          <div className="order-1 md:order-2">
            <p className="text-xs uppercase tracking-widest text-sage-deep">conheça quem faz</p>
            <h2 className="mt-2 font-display text-4xl md:text-5xl text-ink">
              Atrás de cada frasco, a <em className="text-coral-deep">LU</em>.
            </h2>
            <p className="mt-5 text-ink-soft leading-relaxed">
              Cada difusor, cada sabonete, cada home spray passa pelas mãos da LU antes de
              chegar até você. Não é uma loja qualquer — é o gosto dela compartilhado em
              forma de aroma.
            </p>
            <Link
              href="/sobre"
              className="mt-6 inline-flex items-center rounded-full border border-ink/20 px-6 py-2.5 text-sm text-ink hover:bg-ink hover:text-cream-soft transition"
            >
              Nossa história
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function pickCover(images: { url: string; position: number }[] | null | undefined): string | null {
  if (!images || images.length === 0) return null;
  const sorted = [...images].sort((a, b) => a.position - b.position);
  return sorted[0].url;
}
