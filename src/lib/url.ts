/**
 * Utilitarios pra construir URLs filtradas do catalogo.
 * Usado por mega menu, drawer mobile, chips de filtro e paginacao.
 */

export type CatalogFilters = {
  categoria?: string | null;
  marca?: string | null;
  busca?: string | null;
  /** Ordenacao: "recent" (default), "price_asc", "price_desc", "name" */
  sort?: string | null;
  page?: number | null;
  /** Flag de oferta — preserva o link "Ofertas" do nav */
  ofertas?: boolean | null;
};

/**
 * Constroi URL absoluta (relativa ao site) pra /produtos com os filtros dados.
 * Omite parametros vazios e a flag de page=1.
 */
export function buildProductsUrl(filters: CatalogFilters): string {
  const params = new URLSearchParams();
  if (filters.categoria) params.set("categoria", filters.categoria);
  if (filters.marca) params.set("marca", filters.marca);
  if (filters.busca) params.set("busca", filters.busca);
  if (filters.sort && filters.sort !== "recent") params.set("sort", filters.sort);
  if (filters.page && filters.page > 1) params.set("page", String(filters.page));
  if (filters.ofertas) params.set("ofertas", "1");
  const qs = params.toString();
  return qs ? `/produtos?${qs}` : "/produtos";
}

/**
 * Constroi URL removendo uma chave especifica (usado nos chips de filtro).
 */
export function buildProductsUrlWithout(
  current: CatalogFilters,
  remove: keyof CatalogFilters
): string {
  return buildProductsUrl({ ...current, [remove]: null });
}

/**
 * Normaliza string pra slug: minusculas, sem acento, sem caractere especial,
 * espacos -> hifen.
 */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
