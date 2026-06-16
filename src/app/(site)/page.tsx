import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProductCard, type ProductCardData } from "@/components/ProductCard";

const iconClass = "h-6 w-6";
const PILLARS = [
  {
    title: "Curadoria pessoal",
    text: "Cada produto passa por uma curadoria cuidadosa antes de entrar no catálogo.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={iconClass} aria-hidden="true">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
        <path d="M2 21c0-3 1.85-5.36 5.08-6"/>
      </svg>
    ),
  },
  {
    title: "Envio em 24h",
    text: "Postamos no próximo dia útil. Você acompanha tudo por rastreio.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={iconClass} aria-hidden="true">
        <path d="M16 16V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>
        <path d="M16 8h3a2 2 0 0 1 1.8 1.1l1.2 2.4a2 2 0 0 1 .2.9V16a2 2 0 0 1-2 2h-1"/>
        <circle cx="9" cy="18" r="2"/>
        <circle cx="17" cy="18" r="2"/>
      </svg>
    ),
  },
  {
    title: "Trocas em 7 dias",
    text: "Pelo Código de Defesa do Consumidor — sem letrinha miúda.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={iconClass} aria-hidden="true">
        <path d="M3 12a9 9 0 0 1 15-6.7L21 8"/>
        <path d="M21 3v5h-5"/>
        <path d="M21 12a9 9 0 0 1-15 6.7L3 16"/>
        <path d="M3 21v-5h5"/>
      </svg>
    ),
  },
  {
    title: "Atendimento humano",
    text: "Dúvida? A gente responde no WhatsApp, e-mail ou Instagram.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={iconClass} aria-hidden="true">
        <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.5 8.5 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5z"/>
      </svg>
    ),
  },
] as const;

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

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "perfumes de ambiente decor",
    description: "Perfumaria de ambiente — difusores, sabonetes e home spray escolhidos a dedo.",
    url: baseUrl,
    logo: `${baseUrl}/logo-mark.svg`,
    sameAs: ["https://www.instagram.com/perfumesdeambientedecor/"],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
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
          {/* Foto da fundadora/produto */}
          <div
            className="relative aspect-[4/5] md:aspect-square rounded-3xl overflow-hidden bg-coral-soft/40 border border-cream-deep bg-cover bg-center"
            style={{ backgroundImage: "url(/founder/perfumesdeambientedecor-founder-diffuser.png)" }}
            role="img"
            aria-label="Fundadora da perfumes de ambiente decor apresentando difusor"
          >
            <div className="absolute inset-0 flex items-end p-6">
              <div className="rounded-2xl bg-cream-soft/95 px-5 py-4 shadow-sm max-w-xs backdrop-blur">

                <p className="font-display italic text-xl text-ink">- lu</p>
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

      {/* Por que perfumes de ambiente decor */}
      <section className="border-t border-cream-deep/40 bg-cream">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-sage-deep">o que faz diferente</p>
            <h2 className="mt-2 font-display text-4xl text-ink">Por que perfumes de ambiente decor</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {PILLARS.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl border border-cream-deep bg-cream-soft p-6 hover:border-coral-soft transition"
              >
                <div className="h-12 w-12 rounded-full bg-coral-soft/60 flex items-center justify-center mb-3 text-coral-deep">
                  {p.icon}
                </div>
                <h3 className="font-display text-xl text-ink">{p.title}</h3>
                <p className="mt-1 text-sm text-ink-soft leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sobre a fundadora */}
      <section className="bg-sage-soft/60 border-y border-sage-soft">
        <div className="mx-auto max-w-7xl px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div
            className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-cream-soft border border-cream-deep order-2 md:order-1 bg-cover bg-center"
            style={{ backgroundImage: "url(/founder/perfumesdeambientedecor-founder-gift.png)" }}
            role="img"
            aria-label="Fundadora da perfumes de ambiente decor montando presente"
          />

          <div className="order-1 md:order-2">
            <p className="text-xs uppercase tracking-widest text-sage-deep">conheça quem faz</p>
            <h2 className="mt-2 font-display text-4xl md:text-5xl text-ink">
              Atrás de cada frasco, a <em className="text-coral-deep">curadoria da marca</em>.
            </h2>
            <p className="mt-5 text-ink-soft leading-relaxed">
              Cada difusor, cada sabonete, cada home spray passa por uma curadoria cuidadosa antes de
              chegar até você. Não é uma loja qualquer — é bom gosto compartilhado em
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
