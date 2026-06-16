import Link from "next/link";
import { ProductForm } from "../ProductForm";
import { createProduct } from "../actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function NewProductPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("position");

  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-mute" aria-label="breadcrumb">
        <Link href="/admin" className="hover:text-coral-deep transition">Admin</Link>
        <span>/</span>
        <Link href="/admin/produtos" className="hover:text-coral-deep transition">Produtos</Link>
        <span>/</span>
        <span className="text-ink-soft">Novo</span>
      </nav>

      <section className="rounded-[8px] bg-ink p-6 text-cream-soft shadow-xl shadow-ink/10 sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-coral">Cadastro de produto</p>
            <h1 className="mt-2 font-display text-5xl leading-none text-cream-soft sm:text-6xl">
              Novo produto
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-cream-deep">
              Preencha as informacoes em etapas. Deixe como rascunho enquanto estiver montando e publique quando o produto puder aparecer na loja.
            </p>
          </div>
          <Link
            href="/admin/guia"
            className="inline-flex rounded-full border border-cream-soft/25 px-5 py-2.5 text-sm font-semibold text-cream-soft transition hover:border-coral hover:text-coral"
          >
            Ver guia do admin
          </Link>
        </div>
      </section>

      <ProductForm
        action={createProduct}
        categories={categories ?? []}
        error={error ? decodeURIComponent(error) : undefined}
        submitLabel="Criar produto"
      />
    </div>
  );
}
