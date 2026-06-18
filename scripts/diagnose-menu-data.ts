/**
 * Diagnostico: estado das tabelas brands, categories e products
 * Para validar se migration 0004 foi rodada e como o menu dinamico vai
 * ficar com os dados atuais.
 *
 * Uso: npx tsx scripts/diagnose-menu-data.ts
 */
import { config as loadEnv } from "dotenv";
loadEnv({ path: [".env.local", ".env"] });
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Faltam NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY no .env.local");
  process.exit(1);
}

const supa = createClient(url, key, { auth: { persistSession: false } });

async function main() {
  console.log("\n=== 1. BRANDS ===");
  const { data: brands, error: bErr } = await supa
    .from("brands")
    .select("slug, name, position, active")
    .order("position");
  if (bErr) {
    console.error("ERRO ao buscar brands:", bErr.message);
    console.error("→ Provavel: migration 0004 NAO rodou.");
    return;
  }
  console.table(brands);

  console.log("\n=== 2. CATEGORIES (com group_slug) ===");
  const { data: cats, error: cErr } = await supa
    .from("categories")
    .select("slug, name, group_slug, product_type_label, position")
    .order("group_slug", { ascending: true })
    .order("position");
  if (cErr) {
    console.error("ERRO:", cErr.message);
    return;
  }
  console.table(cats);

  console.log("\n=== 3. PRODUTOS POR (CATEGORIA, MARCA) ===");
  const { data: prods, error: pErr } = await supa
    .from("products")
    .select("category_id, brand_id, status, categories!inner(slug), brands(slug)")
    .eq("status", "active");
  if (pErr) {
    console.error("ERRO:", pErr.message);
    return;
  }

  const matrix = new Map<string, number>();
  for (const p of prods ?? []) {
    const catSlug = (p as unknown as { categories: { slug: string } | null }).categories?.slug ?? "?";
    const brandSlug = (p as unknown as { brands: { slug: string } | null }).brands?.slug ?? "(sem marca)";
    const key = `${catSlug} | ${brandSlug}`;
    matrix.set(key, (matrix.get(key) ?? 0) + 1);
  }
  const rows = [...matrix.entries()]
    .map(([k, count]) => {
      const [cat, brand] = k.split(" | ");
      return { categoria: cat, marca: brand, produtos: count };
    })
    .sort(
      (a, b) =>
        a.categoria.localeCompare(b.categoria) ||
        a.marca.localeCompare(b.marca)
    );
  console.table(rows);

  console.log("\n=== 4. RESUMO ===");
  const totalActive = (prods ?? []).length;
  const semMarca = (prods ?? []).filter(
    (p) => !(p as unknown as { brands: unknown }).brands
  ).length;
  console.log(`Total de produtos ativos: ${totalActive}`);
  console.log(`Produtos ativos sem brand_id: ${semMarca}`);
  console.log(`Categorias com >=1 produto ativo: ${new Set(rows.map((r) => r.categoria)).size}`);
  console.log(`Marcas com >=1 produto ativo: ${new Set(rows.map((r) => r.marca)).size - (rows.some((r) => r.marca === "(sem marca)") ? 1 : 0)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
