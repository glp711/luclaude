/**
 * Conteúdo configurável da home: hero, marquee, banners promo,
 * trio editorial e atalhos de categoria.
 *
 * Perfumes de Ambiente Décor é a marca da loja/curadoria.
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
    theme: "warm",
    eyebrow: "Perfume de Ambiente Décor · Desde 2020",
    title: "Um universo de aromas",
    titleAccent: "com curadoria.",
    description: [
      "Fragrâncias, extratos e matérias-primas selecionadas com olhar estético, sensibilidade e respeito à arte de perfumar.",
      "Dani Fernandes, M. Victoria, Lenvie, Maison Berger, Kailash e outras marcas reunidas em um só lugar.",
      "Em cada frasco, uma história. Em cada aroma, um gesto de arte.",
    ],
    primaryCta: { label: "Explorar catálogo", href: "/produtos" },
    secondaryCta: { label: "Ver marcas", href: "/marcas" },
    imageSrc: "/hero/universomarcas.jpg",
    imageAlt:
      "Seleção de difusores, vela e home spray de marcas diferentes reunidos em uma curadoria",
    imageCaption: "Marcas originais reunidas em uma curadoria de aromas para casa.",
    imagePosition: "center center",
  },
  {
    theme: "earthy",
    eyebrow: "Marca em destaque",
    title: "Dani Fernandes, perfume e",
    titleAccent: "aconchego.",
    description: [
      "Águas perfumadas, difusores e fragrâncias delicadas para transformar a casa em refúgio.",
      "Uma assinatura floral, suave e elegante dentro da nossa seleção de marcas.",
    ],
    primaryCta: {
      label: "Ver Dani Fernandes",
      href: buildProductsUrl({ marca: "dani-fernandes" }),
    },
    secondaryCta: { label: "Explorar difusores", href: buildProductsUrl({ categoria: "difusor-de-varetas" }) },
    imageSrc: "/hero/danifernandes.jpg",
    imageAlt: "Produtos Dani Fernandes com difusor, água perfumada e flores",
    imageCaption: "Dani Fernandes dentro da curadoria Perfumes de Ambiente Décor.",
    imagePosition: "center center",
  },
  {
    theme: "cool",
    eyebrow: "11 marcas, um só lugar",
    title: "Técnica, emoção e",
    titleAccent: "memória.",
    description: [
      "Uma curadoria olfativa feita com técnica, emoção e memória.",
      "A escolha nasce do encontro entre estética, sensibilidade e respeito às matérias-primas.",
    ],
    primaryCta: { label: "Ver marcas", href: "/marcas" },
    secondaryCta: { label: "Explorar catálogo", href: "/produtos" },
    imageSrc: "/hero/lu-curadoria-difusor.jpeg",
    imageAlt: "Lu avaliando um difusor em uma vitrine de curadoria olfativa",
    imageCaption: "Curadoria olfativa com olhar estético e sensível.",
    imagePosition: "center 42%",
  },
];

export const MARQUEE_ITEMS: string[] = [
  "Frete grátis acima de R$ 250",
  "Pix com 5% off",
  "Trocas em 7 dias",
  "Envio em 24h útil",
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
    description: "Kits prontos para entregar memória, cuidado e presença.",
    href: buildProductsUrl({ categoria: "kits" }),
    imageSrc: "/hero/lu-home-spray.jpeg",
    tone: "coral",
  },
  {
    eyebrow: "aromatize",
    title: "Toda a casa, com assinatura",
    description: "Difusor, home spray e vela para criar atmosfera.",
    href: buildProductsUrl({ categoria: "difusor-de-varetas" }),
    imageSrc: "/hero/detalhe-materia-prima.jpeg",
    tone: "sage",
  },
  {
    eyebrow: "ofertas",
    title: "Achados da curadoria",
    description: "Seleção com desconto enquanto durar.",
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
    title: "Sala e quarto com personalidade",
    description:
      "Difusores e home spray para deixar memória nos ambientes que você mais vive.",
    ctaLabel: "Ver difusores",
    href: buildProductsUrl({ categoria: "difusor-de-varetas" }),
    imageSrc: "/hero/lu-curadoria-difusor.jpeg",
    imageSide: "left",
  },
  {
    eyebrow: "ritual diário",
    title: "Banheiro e cuidados",
    description:
      "Sabonete líquido e hidratante com a mesma delicadeza olfativa do seu cantinho.",
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
    description: "Acompanhe seu pedido com código de rastreio.",
  },
  {
    iconKey: "secure",
    title: "Pagamento seguro",
    description: "Processamento criptografado via Mercado Pago.",
  },
  {
    iconKey: "payment",
    title: "Parcelamento",
    description: "Cartão em até 3x, Pix com confirmação imediata.",
  },
  {
    iconKey: "support",
    title: "Atendimento personalizado",
    description: "Tire dúvidas no WhatsApp, Instagram ou e-mail.",
  },
];

export type CategoryShortcut = {
  label: string;
  categorySlug: string;
};

export const CATEGORY_SHORTCUTS: CategoryShortcut[] = [
  { label: "Água Perfumada", categorySlug: "agua-perfumada" },
  { label: "Home Spray", categorySlug: "home-spray" },
  { label: "Difusores", categorySlug: "difusor-de-varetas" },
  { label: "Essências", categorySlug: "essencia-concentrada" },
  { label: "Sabonetes", categorySlug: "sabonete-liquido" },
  { label: "Velas", categorySlug: "vela-perfumada" },
  { label: "Corpo e Perfumaria", categorySlug: "body-splash" },
  { label: "Acessórios", categorySlug: "acessorios" },
];

export const HERO = HERO_SLIDES[0];
export const HERO_TRUST_STRIP = MARQUEE_ITEMS;
