/**
 * Conteudo configuravel da home: hero, marquee, banners promo,
 * trio editorial e atalhos de categoria.
 *
 * Perfumes de Ambiente Decor e a marca da loja/curadoria.
 * Os produtos continuam com as marcas originais cadastradas no banco.
 */
import { buildProductsUrl } from "@/lib/url";

export type HeroSlide = {
  theme: "warm" | "cool" | "earthy";
  eyebrow: string;
  title: string;
  titleAccent: string;
  description: string | string[];
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  imageSrc: string;
  imageAlt: string;
  imageCaption?: string;
  imagePosition?: string;
};

export const HERO_SLIDES: HeroSlide[] = [
  {
    theme: "cool",
    eyebrow: "Marca em destaque",
    title: "Lenvie, casa com",
    titleAccent: "assinatura.",
    description: [
      "Difusores, home sprays, velas e refis para transformar fragrancia em presenca.",
      "Uma marca brasileira com leitura elegante, natural e sensorial para o ritual da casa.",
    ],
    primaryCta: {
      label: "Ver Lenvie",
      href: buildProductsUrl({ marca: "lenvie" }),
    },
    secondaryCta: {
      label: "Explorar difusores",
      href: buildProductsUrl({ categoria: "difusor-de-varetas", marca: "lenvie" }),
    },
    imageSrc: "/hero/lenvie-produtos-reais-hero-1920x800.jpg",
    imageAlt:
      "Produtos Lenvie com difusor, home spray, vela e refil em composicao floral suave",
    imageCaption: "Lenvie na curadoria Perfumes de Ambiente Decor.",
    imagePosition: "center center",
  },
  {
    theme: "earthy",
    eyebrow: "Marca em destaque",
    title: "Dani Fernandes, perfume e",
    titleAccent: "aconchego.",
    description: [
      "Aguas perfumadas, difusores e fragrancias delicadas para transformar a casa em refugio.",
      "Uma assinatura floral, suave e elegante dentro da nossa selecao de marcas.",
    ],
    primaryCta: {
      label: "Ver Dani Fernandes",
      href: buildProductsUrl({ marca: "dani-fernandes" }),
    },
    secondaryCta: {
      label: "Explorar difusores",
      href: buildProductsUrl({ categoria: "difusor-de-varetas" }),
    },
    imageSrc: "/hero/dani-fernandes-tenue-banner-2026-06-29.png",
    imageAlt: "Produtos Dani Fernandes Tenue com agua perfumada, home spray, vela e flores",
    imageCaption: "Dani Fernandes dentro da curadoria Perfumes de Ambiente Decor.",
    imagePosition: "center center",
  },
  {
    theme: "warm",
    eyebrow: "Perfume de Ambiente Decor - Desde 2020",
    title: "Um universo de aromas",
    titleAccent: "com curadoria.",
    description: [
      "Fragrancias, extratos e materias-primas selecionadas com olhar estetico, sensibilidade e respeito a arte de perfumar.",
      "Dani Fernandes, M. Victoria, Lenvie, Maison Berger, Kailash e outras marcas reunidas em um so lugar.",
      "Em cada frasco, uma historia. Em cada aroma, um gesto de arte.",
    ],
    primaryCta: { label: "Explorar catalogo", href: "/produtos" },
    secondaryCta: { label: "Ver marcas", href: "/marcas" },
    imageSrc: "/hero/universomarcas.jpg",
    imageAlt:
      "Selecao de difusores, vela e home spray de marcas diferentes reunidos em uma curadoria",
    imageCaption: "Marcas originais reunidas em uma curadoria de aromas para casa.",
    imagePosition: "center center",
  },
  {
    theme: "cool",
    eyebrow: "11 marcas, um so lugar",
    title: "Tecnica, emocao e",
    titleAccent: "memoria.",
    description: [
      "Uma curadoria olfativa feita com tecnica, emocao e memoria.",
      "A escolha nasce do encontro entre estetica, sensibilidade e respeito as materias-primas.",
    ],
    primaryCta: { label: "Ver marcas", href: "/marcas" },
    secondaryCta: { label: "Explorar catalogo", href: "/produtos" },
    imageSrc: "/hero/lu-curadoria-difusor.jpeg",
    imageAlt: "Lu avaliando um difusor em uma vitrine de curadoria olfativa",
    imageCaption: "Curadoria olfativa com olhar estetico e sensivel.",
    imagePosition: "center 42%",
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
  tone: "coral" | "sage" | "ink";
};

export const PROMO_TRIO: PromoCard[] = [
  {
    eyebrow: "presentes",
    title: "Presentes que marcam",
    description: "Kits prontos para entregar memoria, cuidado e presenca.",
    href: buildProductsUrl({ categoria: "kits" }),
    imageSrc: "/hero/lu-home-spray.jpeg",
    tone: "coral",
  },
  {
    eyebrow: "aromatize",
    title: "Lenvie para criar atmosfera",
    description: "Difusor, refil e home spray com presenca elegante no ambiente.",
    href: buildProductsUrl({ marca: "lenvie" }),
    imageSrc: "/hero/lenvie-agua-de-coco.jpeg",
    tone: "sage",
  },
  {
    eyebrow: "ofertas",
    title: "Achados da curadoria",
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
  imageSide: "left" | "right";
};

export const EDITORIAL_DUO: EditorialCard[] = [
  {
    eyebrow: "ambiente principal",
    title: "Lenvie: a casa como assinatura",
    description:
      "Fragrancias que entram no ambiente como gesto de cuidado, memoria e identidade.",
    ctaLabel: "Ver Lenvie",
    href: buildProductsUrl({ marca: "lenvie" }),
    imageSrc: "/hero/lenvie-ritual-assinatura.jpeg",
    imageSide: "left",
  },
  {
    eyebrow: "ritual diario",
    title: "Difusores, refis e presenca",
    description:
      "Opcoes para renovar a atmosfera da casa sem perder delicadeza visual.",
    ctaLabel: "Explorar difusores",
    href: buildProductsUrl({ categoria: "difusor-de-varetas", marca: "lenvie" }),
    imageSrc: "/hero/lenvie-vanilla-bloom.jpeg",
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
  { label: "Acessorios", categorySlug: "acessorios" },
];

export const HERO = HERO_SLIDES[0];
export const HERO_TRUST_STRIP = MARQUEE_ITEMS;
