import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/guards";
import { CheckoutForm } from "./CheckoutForm";

export const metadata = { title: "Finalizar compra" };

type ProductForCheckout = {
  id: string;
  slug: string;
  name: string;
  price_cents: number;
  stock_quantity: number;
  status: string;
  product_images: { url: string; position: number }[];
};

export default async function CheckoutPage() {
  // Carrega catálogo pra o cliente revalidar (ele filtra o que está no localStorage)
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("products")
    .select("id, slug, name, price_cents, stock_quantity, status, product_images(url, position)")
    .eq("status", "active");

  const catalog = Object.fromEntries(
    (data ?? []).map((p: ProductForCheckout) => [
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
    ])
  );

  const user = await getCurrentUser();

  return (
    <main>
      <section className="bg-cream-soft border-b border-cream-deep/60">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <nav className="text-xs text-ink-mute mb-3 flex items-center gap-2" aria-label="breadcrumb">
            <Link href="/" className="hover:text-coral-deep transition">Início</Link>
            <span>/</span>
            <Link href="/carrinho" className="hover:text-coral-deep transition">Carrinho</Link>
            <span>/</span>
            <span className="text-ink-soft">Finalizar compra</span>
          </nav>
          <h1 className="font-display text-5xl text-ink">Finalizar compra</h1>
          <p className="mt-2 text-ink-soft">Preencha os dados e siga pro pagamento.</p>
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <CheckoutForm catalog={catalog} prefillEmail={user?.email ?? null} />
      </div>
    </main>
  );
}
