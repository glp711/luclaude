import { buildProductsUrl } from "@/lib/url";
import { SITE_BRAND_NAME, SITE_DESCRIPTION, SOCIAL_LINKS, siteUrl } from "@/lib/seo";
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
    text: "Cada marca entra pela combinacao entre tecnica, estetica e memoria olfativa.",
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
    text: "Pelo Codigo de Defesa do Consumidor, com orientacao clara no atendimento.",
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
  const baseUrl = siteUrl().replace(/\/$/, "");
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: SITE_BRAND_NAME,
    description: SITE_DESCRIPTION,
    url: baseUrl,
    logo: `${baseUrl}/logo-mark.svg`,
    sameAs: SOCIAL_LINKS,
  };
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_BRAND_NAME,
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/produtos?busca={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />

      <MarqueeBar />
      <HeroCarousel />

      <FeaturedProducts
        kind="highlights"
        eyebrow="sets"
        title="best sellers"
        viewAllHref={buildProductsUrl({ sort: "price_desc" })}
        viewAllLabel="Explorar catalogo"
        limit={8}
      />

      <BenefitsBar />
      <CategoryShortcuts />
      <BrandsShowcase />
      <PromoTrio />
      <CurationBanner />
      <EditorialDuo />

      <section className="border-t border-cream-deep/40 bg-cream">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-sage-deep">
              o que faz diferente
            </p>
            <h2 className="mt-2 font-display text-4xl text-ink">
              Por que perfumes de ambiente decor
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((p) => (
              <div
                key={p.title}
                className="rounded-[8px] border border-cream-deep bg-cream-soft p-6 shadow-sm shadow-ink/5 transition hover:border-coral-soft"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-coral-soft/60 text-coral-deep">
                  {p.icon}
                </div>
                <h3 className="font-display text-xl text-ink">{p.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
