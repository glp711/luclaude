/**
 * Configuracao centralizada do mega menu.
 *
 * Estrutura: GRUPO (item da nav) → TIPOS (colunas do painel) → MARCAS (links).
 *
 * Os slugs aqui batem com:
 *   - `categories.slug` no Supabase (migration 0004)
 *   - `brands.slug` no Supabase (migration 0004)
 *
 * Editar este arquivo para alterar a navegacao — os componentes
 * (MegaMenu desktop e Drawer mobile) consomem desta unica fonte.
 */

export type BrandLink = {
  /** Slug usado em /produtos?marca=... */
  slug: string;
  /** Nome visivel no menu */
  label: string;
};

export type MenuType = {
  /** Slug da categoria (tipo de produto). Usado em /produtos?categoria=... */
  categorySlug: string;
  /** Nome visivel do tipo (ex.: "Difusor de Varetas") */
  label: string;
  /** Marcas que oferecem este tipo (links no painel) */
  brands: BrandLink[];
};

export type MenuGroup = {
  /** Slug usado no DOM (id do painel, links) */
  slug: string;
  /** Label que aparece na barra de navegacao */
  label: string;
  /** Tipos de produto que compoem o grupo (colunas no painel) */
  types: MenuType[];
  /** Bloco opcional de destaque na lateral do painel (campanha/produto/imagem) */
  feature?: MenuFeature;
};

export type MenuFeature = {
  eyebrow?: string;
  title: string;
  description?: string;
  ctaLabel: string;
  ctaHref: string;
  /** Imagem opcional (caminho absoluto a partir de /public). */
  imageSrc?: string;
};

const M_VICTORIA: BrandLink = { slug: "m-victoria", label: "M. Victoria" };
const KAILASH: BrandLink = { slug: "kailash", label: "Kailash" };
const LENVIE: BrandLink = { slug: "lenvie", label: "Lenvie" };
const DANI_FERNANDES: BrandLink = { slug: "dani-fernandes", label: "Dani Fernandes" };
const DOCE_AROMA: BrandLink = { slug: "doce-aroma", label: "Doce Aroma" };
const CHANTREE: BrandLink = { slug: "chantree", label: "Chantree" };
const VIA_AROMA: BrandLink = { slug: "via-aroma", label: "Via Aroma" };
const BUBAS: BrandLink = { slug: "bubas", label: "Bubas" };
const LA_FLORENTINA: BrandLink = { slug: "la-florentina", label: "La Florentina" };
const MAISON_BERGER: BrandLink = { slug: "maison-berger", label: "Maison Berger" };
const SIX_SENSES: BrandLink = { slug: "six-senses", label: "Six Senses" };

export const ALL_BRANDS: BrandLink[] = [
  M_VICTORIA,
  KAILASH,
  LENVIE,
  DANI_FERNANDES,
  DOCE_AROMA,
  CHANTREE,
  VIA_AROMA,
  BUBAS,
  LA_FLORENTINA,
  MAISON_BERGER,
  SIX_SENSES,
];

export const MENU_GROUPS: MenuGroup[] = [
  {
    slug: "aromatizacao",
    label: "Aromatizacao",
    types: [
      {
        categorySlug: "agua-perfumada",
        label: "Agua Perfumada",
        brands: [M_VICTORIA, KAILASH, LENVIE, DANI_FERNANDES, DOCE_AROMA, CHANTREE],
      },
      {
        categorySlug: "home-spray",
        label: "Home Spray",
        brands: [M_VICTORIA, KAILASH, LENVIE, DANI_FERNANDES, DOCE_AROMA, CHANTREE],
      },
      {
        categorySlug: "sachet-perfumado",
        label: "Sache Perfumado",
        brands: [KAILASH],
      },
      {
        categorySlug: "essencia-concentrada",
        label: "Essencia Concentrada",
        brands: [LENVIE, M_VICTORIA, BUBAS, VIA_AROMA],
      },
      {
        categorySlug: "aroma-para-carro",
        label: "Aroma para Carro",
        brands: [MAISON_BERGER, BUBAS],
      },
      {
        categorySlug: "gesso-perfumado",
        label: "Gesso Perfumado",
        brands: [DANI_FERNANDES, DOCE_AROMA, M_VICTORIA],
      },
      {
        categorySlug: "monograma",
        label: "Monograma",
        brands: [M_VICTORIA],
      },
    ],
  },
  {
    slug: "difusores",
    label: "Difusores",
    types: [
      {
        categorySlug: "difusor-de-varetas",
        label: "Difusor de Varetas",
        brands: [
          M_VICTORIA,
          KAILASH,
          LENVIE,
          DANI_FERNANDES,
          DOCE_AROMA,
          VIA_AROMA,
          CHANTREE,
        ],
      },
      {
        categorySlug: "refil-para-difusor-de-varetas",
        label: "Refil para Difusor de Varetas",
        brands: [LENVIE, DANI_FERNANDES, M_VICTORIA, KAILASH, DOCE_AROMA],
      },
      {
        categorySlug: "difusor-eletrico",
        label: "Difusor Eletrico",
        brands: [M_VICTORIA, VIA_AROMA],
      },
    ],
  },
  {
    slug: "sabonetes",
    label: "Sabonetes",
    types: [
      {
        categorySlug: "sabonete-liquido",
        label: "Sabonete Liquido",
        brands: [
          M_VICTORIA,
          KAILASH,
          LENVIE,
          DANI_FERNANDES,
          DOCE_AROMA,
          VIA_AROMA,
          LA_FLORENTINA,
          CHANTREE,
        ],
      },
      {
        categorySlug: "sabonete-em-barra",
        label: "Sabonete em Barra",
        brands: [LA_FLORENTINA, KAILASH],
      },
      {
        categorySlug: "refil-de-sabonete-liquido",
        label: "Refil de Sabonete Liquido",
        brands: [M_VICTORIA, LENVIE],
      },
      {
        categorySlug: "sabonete-espumador",
        label: "Sabonete Espumador",
        brands: [DANI_FERNANDES],
      },
      {
        categorySlug: "refil-de-sabonete-espumador",
        label: "Refil de Sabonete Espumador",
        brands: [DANI_FERNANDES],
      },
    ],
  },
  {
    slug: "velas-e-aromas",
    label: "Velas e Aromas",
    types: [
      {
        categorySlug: "vela-perfumada",
        label: "Vela Perfumada",
        brands: [LENVIE, DANI_FERNANDES, KAILASH],
      },
      {
        categorySlug: "cera-perfumada",
        label: "Cera Perfumada",
        brands: [SIX_SENSES, LENVIE],
      },
      {
        categorySlug: "luminaria-aromatica",
        label: "Luminaria Aromatica",
        brands: [SIX_SENSES],
      },
    ],
  },
  {
    slug: "corpo-e-perfumaria",
    label: "Corpo e Perfumaria",
    types: [
      {
        categorySlug: "hidratantes",
        label: "Hidratantes",
        brands: [DANI_FERNANDES, CHANTREE, LENVIE],
      },
      {
        categorySlug: "body-splash",
        label: "Body Splash",
        brands: [DANI_FERNANDES, LENVIE],
      },
      {
        categorySlug: "parfum",
        label: "Parfum",
        brands: [DANI_FERNANDES],
      },
    ],
  },
  {
    slug: "maison-berger",
    label: "Maison Berger",
    types: [
      {
        categorySlug: "lampe-berger",
        label: "Lampe Berger",
        brands: [MAISON_BERGER],
      },
      {
        categorySlug: "refil-para-lampe-berger",
        label: "Refil para Lampe Berger",
        brands: [MAISON_BERGER],
      },
    ],
  },
  {
    slug: "acessorios",
    label: "Acessórios",
    types: [
      {
        categorySlug: "acessorios",
        label: "Acessórios",
        brands: [DANI_FERNANDES],
      },
    ],
  },
];

/**
 * Itens principais da barra de navegacao.
 * "Marcas" e "Ofertas" sao links diretos (sem painel).
 */
export type NavItem =
  | { kind: "group"; slug: string; label: string }
  | { kind: "link"; slug: string; label: string; href: string };

export const NAV_ITEMS: NavItem[] = [
  ...MENU_GROUPS.map<NavItem>((g) => ({ kind: "group", slug: g.slug, label: g.label })),
  { kind: "link", slug: "marcas", label: "Marcas", href: "/marcas" },
  { kind: "link", slug: "ofertas", label: "Ofertas", href: "/produtos?ofertas=1" },
];

export function getGroupBySlug(slug: string): MenuGroup | undefined {
  return MENU_GROUPS.find((g) => g.slug === slug);
}
