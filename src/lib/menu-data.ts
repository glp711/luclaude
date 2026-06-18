import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  MENU_GROUPS,
  type BrandLink,
  type MenuGroup,
  type MenuType,
} from "@/lib/navigation";

/**
 * Monta a estrutura do mega menu a partir dos produtos cadastrados.
 *
 * Regras:
 *  - Iteramos `MENU_GROUPS` apenas pela ordem editorial dos grupos
 *    (slug, label, feature). Os tipos e marcas vem do DB.
 *  - Um TIPO so aparece se tiver >=1 marca com >=1 produto ativo.
 *  - Uma MARCA so aparece sob um tipo se tiver >=1 produto ativo daquele tipo.
 *  - GRUPOS sem tipos populados sao omitidos.
 *
 * Se a query falhar, devolvemos `MENU_GROUPS` estatico como fallback —
 * pior cenario: menu fica como antes, sem quebrar a navegacao.
 */
export async function getDynamicMenuGroups(): Promise<MenuGroup[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      "category_id, brand_id, categories(slug, name, group_slug, product_type_label, position), brands(slug, name, position)"
    )
    .eq("status", "active");

  if (error || !data) {
    console.error("[menu-data] falha buscando produtos:", error?.message);
    return MENU_GROUPS;
  }

  type Row = {
    category_id: string;
    brand_id: string | null;
    categories: {
      slug: string;
      name: string;
      group_slug: string | null;
      product_type_label: string | null;
      position: number;
    } | null;
    brands: { slug: string; name: string; position: number } | null;
  };

  // Estrutura: groupSlug -> catSlug -> brandSlug -> { name, position }
  const tree = new Map<
    string,
    Map<string, Map<string, { name: string; position: number }>>
  >();
  // catSlug -> info pra montar labels e ordenar
  const catInfo = new Map<
    string,
    { name: string; label: string; position: number; groupSlug: string }
  >();

  for (const row of data as unknown as Row[]) {
    const cat = row.categories;
    const brand = row.brands;
    if (!cat || !cat.group_slug || !brand) continue;

    catInfo.set(cat.slug, {
      name: cat.name,
      label: cat.product_type_label ?? cat.name,
      position: cat.position,
      groupSlug: cat.group_slug,
    });

    if (!tree.has(cat.group_slug)) tree.set(cat.group_slug, new Map());
    const cats = tree.get(cat.group_slug)!;
    if (!cats.has(cat.slug)) cats.set(cat.slug, new Map());
    cats.get(cat.slug)!.set(brand.slug, { name: brand.name, position: brand.position });
  }

  const result: MenuGroup[] = [];
  for (const meta of MENU_GROUPS) {
    const cats = tree.get(meta.slug);
    if (!cats || cats.size === 0) continue;

    const types: MenuType[] = [];
    const catEntries = [...cats.entries()]
      .map(([slug, brandsMap]) => ({ slug, info: catInfo.get(slug)!, brandsMap }))
      .sort(
        (a, b) =>
          a.info.position - b.info.position || a.info.label.localeCompare(b.info.label)
      );

    for (const { slug, info, brandsMap } of catEntries) {
      const brands: BrandLink[] = [...brandsMap.entries()]
        .sort(
          (a, b) =>
            a[1].position - b[1].position || a[1].name.localeCompare(b[1].name)
        )
        .map(([brandSlug, b]) => ({ slug: brandSlug, label: b.name }));

      if (brands.length === 0) continue;
      types.push({ categorySlug: slug, label: info.label, brands });
    }

    if (types.length === 0) continue;
    result.push({ slug: meta.slug, label: meta.label, types, feature: meta.feature });
  }

  return result;
}

/**
 * Itens do top-nav: grupos visiveis + links fixos ("Marcas", "Ofertas").
 */
export type NavItem =
  | { kind: "group"; slug: string; label: string }
  | { kind: "link"; slug: string; label: string; href: string };

export function buildNavItems(groups: MenuGroup[]): NavItem[] {
  return [
    ...groups.map<NavItem>((g) => ({ kind: "group", slug: g.slug, label: g.label })),
    { kind: "link", slug: "marcas", label: "Marcas", href: "/marcas" },
    { kind: "link", slug: "ofertas", label: "Ofertas", href: "/produtos?ofertas=1" },
  ];
}
