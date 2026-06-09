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
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          <p className="text-sm text-neutral-500">Editar produto</p>
        </div>
        <div className="flex gap-2">
          {product.status !== "active" && (
            <form action={publishWithId}>
              <button className="rounded-md border border-green-600 px-3 py-1.5 text-sm text-green-700 hover:bg-green-50">
                Publicar
              </button>
            </form>
          )}
          {product.status !== "archived" && (
            <form action={archiveWithId}>
              <button className="rounded-md border border-amber-600 px-3 py-1.5 text-sm text-amber-700 hover:bg-amber-50">
                Arquivar
              </button>
            </form>
          )}
        </div>
      </div>

      {ok === "updated" && (
        <div className="rounded-md bg-green-50 px-4 py-2 text-sm text-green-800">Salvo.</div>
      )}
      {ok === "created" && (
        <div className="rounded-md bg-green-50 px-4 py-2 text-sm text-green-800">Criado.</div>
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
