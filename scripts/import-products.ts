/**
 * Importa o catálogo inicial (243 produtos) do xlsx para a tabela `products` no Supabase.
 *
 * Uso:
 *   npm run import:products
 *   npm run import:products -- "C:\\caminho\\custom.xlsx"
 *
 * Comportamento:
 *   - Importa todos como status='draft' (admin precisa publicar via SQL ou UI).
 *   - Categoriza por palavra-chave no nome (difusor → difusores, etc.).
 *   - Upsert por slug — re-rodar é idempotente.
 *
 * Para publicar tudo de uma vez após revisão (cuidado, mexe em produção):
 *   update public.products
 *      set status='active', stock_quantity=100, weight_g=300,
 *          width_cm=10, height_cm=20, length_cm=10
 *    where status='draft';
 */
import { config as loadEnv } from "dotenv";
loadEnv({ path: [".env.local", ".env"] });
import * as XLSX from "xlsx";
import { createClient } from "@supabase/supabase-js";
import { resolve } from "node:path";

const DEFAULT_XLSX = "data/produtos_dani_fernandes_243.xlsx";

function parsePriceToCents(input: unknown): number {
  if (typeof input === "number") return Math.round(input * 100);
  const text = String(input ?? "").trim();
  const cleaned = text.replace(/[R$\s]/g, "").replace(/\./g, "").replace(",", ".");
  const reais = Number.parseFloat(cleaned);
  if (Number.isNaN(reais)) throw new Error(`Preço inválido: "${text}"`);
  return Math.round(reais * 100);
}

function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function guessCategorySlug(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("kit")) return "kits";
  if (n.includes("creme")) return "cremes";
  if (n.includes("home spray") || n.includes("aromatizador de ambiente")) return "home-spray";
  if (n.includes("difusor") || n.includes("refil de difusor")) return "difusores";
  if (n.includes("sabonete")) return "sabonetes";
  if (n.includes("agua perfumada") || n.includes("água perfumada")) return "agua-perfumada";
  return "acessorios";
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRole) {
    throw new Error("Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY em .env.local");
  }
  const supabase = createClient(url, serviceRole, {
    auth: { persistSession: false },
  });

  const xlsxPath = resolve(process.argv[2] ?? DEFAULT_XLSX);
  console.log(`→ Lendo ${xlsxPath}`);
  const wb = XLSX.readFile(xlsxPath);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);
  console.log(`→ ${rows.length} linhas encontradas`);

  const { data: cats, error: catErr } = await supabase
    .from("categories")
    .select("id, slug");
  if (catErr) throw catErr;
  const catMap = new Map((cats ?? []).map((c) => [c.slug as string, c.id as string]));
  console.log(`→ ${catMap.size} categorias carregadas: ${[...catMap.keys()].join(", ")}`);

  let ok = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const row of rows) {
    const name = String(row["Produto"] ?? row["produto"] ?? row["nome"] ?? "").trim();
    const priceRaw = row["Preço"] ?? row["Pre?o"] ?? row["preco"] ?? row["price"];
    const sourceUrl = String(row["Link"] ?? row["link"] ?? "").trim() || null;

    if (!name || priceRaw == null) {
      skipped++;
      continue;
    }

    let price_cents: number;
    try {
      price_cents = parsePriceToCents(priceRaw);
    } catch (e) {
      errors.push(`"${name}": ${(e as Error).message}`);
      skipped++;
      continue;
    }

    const slug = slugify(name);
    const category_slug = guessCategorySlug(name);
    const category_id = catMap.get(category_slug) ?? null;

    const { error } = await supabase
      .from("products")
      .upsert(
        {
          slug,
          name,
          price_cents,
          status: "draft",
          stock_quantity: 0,
          category_id,
          source_url: sourceUrl,
        },
        { onConflict: "slug" }
      );

    if (error) {
      errors.push(`"${name}": ${error.message}`);
      skipped++;
    } else {
      ok++;
    }
  }

  console.log(`\n✓ Importados (upsert): ${ok}`);
  console.log(`✗ Ignorados: ${skipped}`);
  if (errors.length) {
    console.log(`\nErros (primeiros 10):`);
    for (const e of errors.slice(0, 10)) console.log(`  - ${e}`);
  }

  console.log(
    "\nPróximo passo: revise no Supabase Studio e publique com:\n" +
      "  update public.products\n" +
      "     set status='active', stock_quantity=100, weight_g=300,\n" +
      "         width_cm=10, height_cm=20, length_cm=10\n" +
      "   where status='draft';"
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
