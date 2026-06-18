/**
 * Conteudo configuravel da home (slides do hero, marquee, banners promo,
 * trio editorial, atalhos de categoria).
 *
 * Editar este arquivo para ajustar textos/imagens sem mexer no componente
 * visual.
 */
import { buildProductsUrl } from "@/lib/url";

export type HeroSlide = {
  /** Tema visual do slide — controla a cor dominante do gradient overlay. */
  theme: "warm" | "cool" | "earthy";
  eyebrow: string;
  title: string;
  /** Trecho do titulo destacado em coral. */
  titleAccent: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  imageSrc: string;
  imageAlt: string;
  /**
   * Posicao do recorte da imagem dentro do banner widescreen.
   * Foto vertical => normalmente "center 25%" pra mostrar rosto/topo.
   * Default: "center center".
   */
  imagePosition?: string;
};

export const HERO_SLIDES: HeroSlide[] = [
  {
    theme: "warm",
    eyebrow: "Marcas com assinatura",
    title: "11 marcas, um so",
    titleAccent: "lugar.",
    description:
      "M. Victoria, Maison Berger, Lenvie, Kailash, Dani Fernandes e outras marcas brasileiras e internacionais lado a lado, no nosso jeito.",
    primaryCta: { label: "Ver marcas", href: "/marcas" },
    secondaryCta: { label: "Explorar catalogo", href: "/produtos" },
    imageSrc: "/hero/universomarcas.jpg",
    imageAlt:
      "Difusor Maison Berger, vela M. Victoria, home spray Dani Fernandes e Lenvie em arranjo editorial",
    imagePosition: "center center",
  },
  {
    theme: "earthy",
    eyebrow: "Marca em destaque",
    title: "Dani Fernandes, um universo de",
    titleAccent: "perfume e aconchego.",
    description:
      "Aguas perfumadas, difusores e fragrancias que transformam a casa em um refugio delicado e acolhedor.",
    primaryCta: {
      label: "Ver marca",
      href: buildProductsUrl({ marca: "dani-fernandes" }),
    },
    secondaryCta: { label: "Explorar catalogo", href: "/produtos" },
    imageSrc: "/hero/danifernandes.jpg",
    imageAlt: "Agua perfumada e difusor Dani Fernandes em arranjo com flores rosa",
    imagePosition: "70% center",
  },
];

export const MARQUEE_ITEMS: string[] = [
  "Frete gratis acima de R$ 250",
  "Pix com 5% off",
  "Trocas em 7 dias",
  "Envio em 24h util",
  "Atendimento por WhatsApp",
  "Parcele em 3x sem juros",
];

export type PromoCard = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  imageSrc: string;
  /** Cor do overlay sobre a imagem. */
  tone: "coral" | "sage" | "ink";
};

export const PROMO_TRIO: PromoCard[] = [
  {
    eyebrow: "presentes",
    title: "Presentes que marcam",
    description: "Kits prontos pra entregar uma memoria.",
    href: buildProductsUrl({ categoria: "kits" }),
    imageSrc: "/founder/perfumesdeambientedecor-founder-gift.png",
    tone: "coral",
  },
  {
    eyebrow: "aromatize",
    title: "Toda a casa, com cheiro",
    description: "Difusor, home spray e vela pra cada canto.",
    href: buildProductsUrl({ categoria: "difusor-de-varetas" }),
    imageSrc: "/founder/perfumesdeambientedecor-founder-diffuser.png",
    tone: "sage",
  },
  {
    eyebrow: "ofertas",
    title: "Ofertas vigentes",
    description: "Selecao com desconto enquanto durar.",
    href: "/produtos?ofertas=1",
    imageSrc: "/founder/perfumesdeambientedecor-product-kit.png",
    tone: "ink",
  },
];

export type EditorialCard = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
  imageSrc: string;
  /** Lado da imagem. */
  imageSide: "left" | "right";
};

export const EDITORIAL_DUO: EditorialCard[] = [
  {
    eyebrow: "ambiente principal",
    title: "Sala e quarto com personalidade",
    description:
      "Difusores e home spray pra deixar memoria nos ambientes que voce mais vive.",
    ctaLabel: "Ver difusores",
    href: buildProductsUrl({ categoria: "difusor-de-varetas" }),
    imageSrc: "/founder/perfumesdeambientedecor-founder-card.png",
    imageSide: "left",
  },
  {
    eyebrow: "ritual diario",
    title: "Banheiro e cuidados",
    description:
      "Sabonete liquido e hidratante com a mesma assinatura olfativa do seu cantinho.",
    ctaLabel: "Ver sabonetes",
    href: buildProductsUrl({ categoria: "sabonete-liquido" }),
    imageSrc: "/founder/perfumesdeambientedecor-product-kit.png",
    imageSide: "right",
  },
];

export type Benefit = {
  iconKey: "shipping" | "secure" | "payment" | "support";
  title: string;
  description: string;
};

export const BENEFITS: Benefit[] = [
  {
    iconKey: "shipping",
    title: "Envio para todo o Brasil",
    description: "Acompanhe seu pedido com codigo de rastreio.",
  },
  {
    iconKey: "secure",
    title: "Pagamento seguro",
    description: "Processamento criptografado via Mercado Pago.",
  },
  {
    iconKey: "payment",
    title: "Parcelamento",
    description: "Cartao em ate 3x, Pix com confirmacao imediata.",
  },
  {
    iconKey: "support",
    title: "Atendimento personalizado",
    description: "Tire duvidas no WhatsApp, Instagram ou e-mail.",
  },
];

export type CategoryShortcut = {
  label: string;
  categorySlug: string;
};

export const CATEGORY_SHORTCUTS: CategoryShortcut[] = [
  { label: "Agua Perfumada", categorySlug: "agua-perfumada" },
  { label: "Home Spray", categorySlug: "home-spray" },
  { label: "Difusores", categorySlug: "difusor-de-varetas" },
  { label: "Essencias", categorySlug: "essencia-concentrada" },
  { label: "Sabonetes", categorySlug: "sabonete-liquido" },
  { label: "Velas", categorySlug: "vela-perfumada" },
  { label: "Corpo e Perfumaria", categorySlug: "body-splash" },
  { label: "Acessórios", categorySlug: "acessorios" },
];

/**
 * Mantido pra compatibilidade com componentes que ainda importam HERO direto.
 * Fonte: primeiro slide do HERO_SLIDES.
 */
export const HERO = HERO_SLIDES[0];
export const HERO_TRUST_STRIP = MARQUEE_ITEMS;
