import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CartContents } from "./CartContents";

export const metadata = { title: "Carrinho" };

type ProductForCart = {
  id: string;
  slug: string;
  name: string;
  price_cents: number;
  stock_quantity: number;
  status: string;
  product_images: { url: string; position: number }[];
};

export default async function CarrinhoPage() {
  // Carrinho vive no localStorage; o servidor não sabe quais produtos estão lá.
  // Buscamos tudo que poderia estar no carrinho: produtos ativos com imagens.
  // Cliente filtra pelo store + revalida preço atual.
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("products")
    .select("id, slug, name, price_cents, stock_quantity, status, product_images(url, position)")
    .in("status", ["active", "draft", "archived"]);

  const productsByIdEntries = (data ?? []).map((p: ProductForCart) => [
    p.id,
    {
      id: p.id,
      slug: p.slug,
      name: p.name,
      price_cents: p.price_cents,
      stock_quantity: p.stock_quantity,
      status: p.status,
      cover_url:
        [...(p.product_images ?? [])].sort((a, b) => a.position - b.position)[0]?.url ?? null,
    },
  ] as const);
  const catalog = Object.fromEntries(productsByIdEntries);

  return (
    <main>
      <section className="bg-cream-soft border-b border-cream-deep/60">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <nav className="text-xs text-ink-mute mb-3 flex items-center gap-2" aria-label="breadcrumb">
            <Link href="/" className="hover:text-coral-deep transition">Início</Link>
            <span>/</span>
            <span className="text-ink-soft">Carrinho</span>
          </nav>
          <h1 className="font-display text-5xl text-ink">Seu carrinho</h1>
          <p className="mt-2 text-ink-soft">Revise os itens e siga pro checkout.</p>
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <CartContents catalog={catalog} />
      </div>
    </main>
  );
}
