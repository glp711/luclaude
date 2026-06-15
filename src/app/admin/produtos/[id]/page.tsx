import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductForm } from "../ProductForm";
import { updateProduct, archiveProduct, publishProduct } from "../actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; ok?: string }>;
}) {
  const { id } = await params;
  const { error, ok } = await searchParams;

  const supabase = await createSupabaseServerClient();
  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase
      .from("products")
      .select(
        "id, name, slug, description, price_cents, compare_at_price_cents, sku, stock_quantity, weight_g, width_cm, height_cm, length_cm, status, category_id"
      )
      .eq("id", id)
      .single(),
    supabase.from("categories").select("id, name").order("position"),
  ]);

  if (!product) notFound();

  const updateWithId = updateProduct.bind(null, id);
  const archiveWithId = archiveProduct.bind(null, id);
  const publishWithId = publishProduct.bind(null, id);

  return (
    <div className="space-y-6">
      <nav className="text-xs text-ink-mute flex items-center gap-2" aria-label="breadcrumb">
        <Link href="/admin" className="hover:text-coral-deep transition">Admin</Link>
        <span>/</span>
        <Link href="/admin/produtos" className="hover:text-coral-deep transition">Produtos</Link>
        <span>/</span>
        <span className="text-ink-soft truncate max-w-[30ch]">{product.name}</span>
      </nav>

      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl text-ink">{product.name}</h1>
          <p className="text-sm text-ink-soft mt-0.5">
            <StatusPill status={product.status} /> ·{" "}
            <Link
              href={`/produtos/${product.slug}`}
              target="_blank"
              className="hover:text-coral-deep transition"
            >
              ver na loja ↗
            </Link>
          </p>
        </div>
        <div className="flex gap-2">
          {product.status !== "active" && (
            <form action={publishWithId}>
              <button className="rounded-full border border-sage-deep px-4 py-1.5 text-sm text-sage-deep hover:bg-sage-soft transition">
                ✓ Publicar
              </button>
            </form>
          )}
          {product.status !== "archived" && (
            <form action={archiveWithId}>
              <button className="rounded-full border border-cream-deep px-4 py-1.5 text-sm text-ink-soft hover:border-coral hover:text-coral-deep transition">
                Arquivar
              </button>
            </form>
          )}
        </div>
      </div>

      {ok === "updated" && (
        <div className="rounded-2xl bg-sage-soft/60 border border-sage-soft px-4 py-2.5 text-sm text-ink">
          ✓ Alterações salvas.
        </div>
      )}
      {ok === "created" && (
        <div className="rounded-2xl bg-sage-soft/60 border border-sage-soft px-4 py-2.5 text-sm text-ink">
          ✓ Produto criado.
        </div>
      )}

      <ProductForm
        action={updateWithId}
        initial={product}
        categories={categories ?? []}
        error={error ? decodeURIComponent(error) : undefined}
        submitLabel="Salvar alterações"
      />
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles =
    status === "active"
      ? "bg-sage-soft text-ink"
      : status === "draft"
      ? "bg-cream-deep text-ink-soft"
      : "bg-coral-soft text-coral-deep";
  const label = status === "active" ? "Ativo" : status === "draft" ? "Rascunho" : "Arquivado";
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider ${styles}`}>
      {label}
    </span>
  );
}
