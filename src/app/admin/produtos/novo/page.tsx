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
      <div>
        <h1 className="text-2xl font-semibold">Novo produto</h1>
        <p className="text-sm text-neutral-500">Crie um produto. Marque como ativo quando estiver pronto.</p>
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
