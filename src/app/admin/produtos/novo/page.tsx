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
      <nav className="text-xs text-ink-mute flex items-center gap-2" aria-label="breadcrumb">
        <Link href="/admin" className="hover:text-coral-deep transition">Admin</Link>
        <span>/</span>
        <Link href="/admin/produtos" className="hover:text-coral-deep transition">Produtos</Link>
        <span>/</span>
        <span className="text-ink-soft">Novo</span>
      </nav>

      <div>
        <h1 className="font-display text-3xl text-ink">Novo produto</h1>
        <p className="text-sm text-ink-soft mt-0.5">
          Cria como rascunho e publica quando estiver pronto.
        </p>
      </div>

      <ProductForm
        action={createProduct}
        categories={categories ?? []}
        error={error ? decodeURIComponent(error) : undefined}
        submitLabel="Criar produto"
      />
    </div>
  );
}
