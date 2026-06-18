import { buildProductsUrl } from "@/lib/url";
import { BenefitsBar } from "@/components/Home/BenefitsBar";
import { BrandsShowcase } from "@/components/Home/BrandsShowcase";
import { CategoryShortcuts } from "@/components/Home/CategoryShortcuts";
import { CurationBanner } from "@/components/Home/CurationBanner";
import { EditorialDuo } from "@/components/Home/EditorialDuo";
import { FeaturedProducts } from "@/components/Home/FeaturedProducts";
import { HeroCarousel } from "@/components/Home/HeroCarousel";
import { MarqueeBar } from "@/components/Home/MarqueeBar";
import { PromoTrio } from "@/components/Home/PromoTrio";

const iconClass = "h-6 w-6";
const PILLARS = [
  {
    title: "Curadoria pessoal",
    text: "Cada produto passa por uma curadoria cuidadosa antes de entrar no catalogo.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={iconClass} aria-hidden="true">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6" />
      </svg>
    ),
  },
  {
    title: "Envio em 24h",
    text: "Postamos no proximo dia util. Voce acompanha tudo por rastreio.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={iconClass} aria-hidden="true">
        <path d="M16 16V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
        <path d="M16 8h3a2 2 0 0 1 1.8 1.1l1.2 2.4a2 2 0 0 1 .2.9V16a2 2 0 0 1-2 2h-1" />
        <circle cx="9" cy="18" r="2" />
        <circle cx="17" cy="18" r="2" />
      </svg>
    ),
  },
  {
    title: "Trocas em 7 dias",
    text: "Pelo Codigo de Defesa do Consumidor — sem letrinha miuda.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={iconClass} aria-hidden="true">
        <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
        <path d="M21 3v5h-5" />
        <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
        <path d="M3 21v-5h5" />
      </svg>
    ),
  },
  {
    title: "Atendimento humano",
    text: "Duvida? A gente responde no WhatsApp, e-mail ou Instagram.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={iconClass} aria-hidden="true">
        <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.5 8.5 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5z" />
      </svg>
    ),
  },
] as const;

export default async function HomePage() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "perfumes de ambiente decor",
    description:
      "Perfumaria de ambiente — difusores, sabonetes e home spray escolhidos a dedo.",
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

      {/* Marquee de avisos rolando, hero em carrossel */}
      <MarqueeBar />
      <HeroCarousel />

      {/* Beneficios + trio promo (3 jornadas) */}
      <BenefitsBar />
      <PromoTrio />

      {/* Atalhos por categoria (com foto) + marcas */}
      <CategoryShortcuts />
      <BrandsShowcase />

      {/* Mais queridos (premium) + banner editorial + lancamentos */}
      <FeaturedProducts
        kind="highlights"
        eyebrow="mais queridos"
        title="Os mais queridos"
        viewAllHref={buildProductsUrl({ sort: "price_desc" })}
        limit={12}
      />

      <CurationBanner />
      <EditorialDuo />

      <FeaturedProducts
        kind="recent"
        eyebrow="recem-chegados"
        title="Novidades"
        viewAllHref="/produtos"
        limit={12}
      />

      {/* Por que perfumes de ambiente decor */}
      <section className="border-t border-cream-deep/40 bg-cream">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-sage-deep">
              o que faz diferente
            </p>
            <h2 className="mt-2 font-display text-4xl text-ink">
              Por que perfumes de ambiente decor
            </h2>
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
    </main>
  );
}
