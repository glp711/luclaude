import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createCategory, deleteCategory, renameCategory } from "./actions";

export default async function CategoriesPage() {
  const supabase = await createSupabaseServerClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("position", { ascending: true })
    .order("name");

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold">Categorias</h1>
        <p className="text-sm text-neutral-500">Slug é gerado do nome automaticamente.</p>
      </div>

      <form action={createCategory} className="flex gap-2">
        <input
          name="name"
          required
          placeholder="Nova categoria"
          className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
        <button className="rounded-md bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-700">
          Adicionar
        </button>
      </form>

      <div className="rounded-lg border bg-white divide-y">
        {(categories ?? []).map((c) => {
          const rename = renameCategory.bind(null, c.id);
          const remove = deleteCategory.bind(null, c.id);
          return (
            <div key={c.id} className="flex items-center gap-3 p-3">
              <form action={rename} className="flex-1 flex gap-2">
                <input
                  name="name"
                  defaultValue={c.name}
                  className="flex-1 rounded-md border border-neutral-300 px-2 py-1 text-sm"
                />
                <button className="rounded-md border border-neutral-300 px-3 py-1 text-sm hover:bg-neutral-50">
                  Salvar
                </button>
              </form>
              <span className="text-xs text-neutral-500 font-mono">{c.slug}</span>
              <form action={remove}>
                <button className="text-xs text-red-600 hover:text-red-800">Excluir</button>
              </form>
            </div>
          );
        })}
        {(!categories || categories.length === 0) && (
          <p className="p-6 text-sm text-neutral-500 text-center">Sem categorias.</p>
        )}
      </div>
    </div>
  );
}
