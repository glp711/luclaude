/**
 * Conteudo configuravel da primeira secao da home (banner, beneficios, atalhos).
 *
 * Editar este arquivo para ajustar textos sem mexer no componente visual.
 */
import { buildProductsUrl } from "@/lib/url";

export const HERO = {
  eyebrow: "Curadoria de aromas",
  title: "Perfume sua casa. Crie novas memorias.",
  description:
    "Fragrancias escolhidas para transformar cada ambiente — difusores, sabonetes, velas e essencias selecionadas com cuidado.",
  primaryCta: {
    label: "Explorar fragrancias",
    href: "/produtos",
  },
  secondaryCta: {
    label: "Conhecer novidades",
    href: buildProductsUrl({ sort: "recent" }),
  },
  imageSrc: "/founder/perfumesdeambientedecor-founder-diffuser.png",
  imageAlt: "Difusor de ambiente em destaque",
};

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
];
