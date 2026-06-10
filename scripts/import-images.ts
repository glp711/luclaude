/**
 * Baixa a imagem principal de cada produto a partir do `source_url` (página
 * original no danifernandes.com.br), sobe pro Supabase Storage (bucket
 * `product-images`) e registra em `product_images` (position 0).
 *
 * Uso:
 *   npm run import:images
 *
 * Comportamento:
 *   - Pula produtos que já têm imagem em `product_images` — re-rodar é idempotente.
 *   - Extrai o og:image da página e tenta a variante 1024px do CDN Nuvemshop
 *     antes de cair pro tamanho original (640px).
 *   - Falhas individuais não abortam o lote; saem listadas no resumo final.
 */
import { config as loadEnv } from "dotenv";
loadEnv({ path: [".env.local", ".env"] });

import { createClient } from "@supabase/supabase-js";

const BUCKET = "product-images";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) luperfumes-importer";
const DELAY_MS = 350;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchOgImage(pageUrl: string): Promise<string | null> {
  const res = await fetch(pageUrl, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`página HTTP ${res.status}`);
  const html = await res.text();
  const m = html.match(/<meta property="og:image" content="([^"]+)"/);
  if (!m) return null;
  // CDN da Nuvemshop serve http:// no og:image; força https.
  return m[1].replace(/^http:\/\//, "https://");
}

async function downloadImage(url: string): Promise<{ bytes: ArrayBuffer; contentType: string } | null> {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) return null;
  return {
    bytes: await res.arrayBuffer(),
    contentType: res.headers.get("content-type") ?? "image/webp",
  };
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRole) {
    throw new Error("Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY em .env.local");
  }
  const supabase = createClient(url, serviceRole, { auth: { persistSession: false } });

  const { data: products, error: prodErr } = await supabase
    .from("products")
    .select("id, slug, name, source_url")
    .not("source_url", "is", null)
    .order("slug");
  if (prodErr) throw prodErr;

  const { data: existing, error: imgErr } = await supabase
    .from("product_images")
    .select("product_id");
  if (imgErr) throw imgErr;
  const hasImage = new Set((existing ?? []).map((r) => r.product_id as string));

  const pending = (products ?? []).filter((p) => !hasImage.has(p.id));
  console.log(`→ ${products?.length ?? 0} produtos com source_url; ${pending.length} sem imagem`);

  let ok = 0;
  const errors: string[] = [];

  for (const [i, p] of pending.entries()) {
    try {
      const ogImage = await fetchOgImage(p.source_url as string);
      if (!ogImage) throw new Error("og:image não encontrado");

      // Nuvemshop: "...-640-0.webp" → variante maior "...-1024-1024.webp"
      const hiRes = ogImage.replace(/-640-0(\.\w+)$/, "-1024-1024$1");
      let img = hiRes !== ogImage ? await downloadImage(hiRes) : null;
      img ??= await downloadImage(ogImage);
      if (!img) throw new Error("download da imagem falhou");

      const ext = (ogImage.match(/\.(\w+)$/)?.[1] ?? "webp").toLowerCase();
      const path = `products/${p.slug}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, img.bytes, { contentType: img.contentType, upsert: true });
      if (upErr) throw new Error(`upload: ${upErr.message}`);

      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);

      const { error: insErr } = await supabase
        .from("product_images")
        .insert({ product_id: p.id, url: pub.publicUrl, alt: p.name, position: 0 });
      if (insErr) throw new Error(`insert: ${insErr.message}`);

      ok++;
    } catch (e) {
      errors.push(`"${p.slug}": ${(e as Error).message}`);
    }
    if ((i + 1) % 20 === 0) console.log(`  … ${i + 1}/${pending.length} (ok=${ok}, erros=${errors.length})`);
    await sleep(DELAY_MS);
  }

  console.log(`\n✓ Imagens importadas: ${ok}`);
  console.log(`✗ Falhas: ${errors.length}`);
  if (errors.length) {
    console.log(`\nErros:`);
    for (const e of errors) console.log(`  - ${e}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
