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
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-light mb-8">Carrinho</h1>
      <CartContents catalog={catalog} />
    </main>
  );
}
