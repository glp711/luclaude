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
        <h1 className="font-display text-3xl text-ink">Categorias</h1>
        <p className="text-sm text-ink-soft mt-0.5">
          O slug é gerado automaticamente a partir do nome.
        </p>
      </div>

      <form
        action={createCategory}
        className="flex gap-2 rounded-2xl border border-cream-deep bg-cream-soft p-4"
      >
        <input
          name="name"
          required
          placeholder="Nova categoria"
          className="flex-1 rounded-full border border-cream-deep bg-cream px-4 py-2 text-sm focus:border-coral focus:outline-none transition"
        />
        <button className="rounded-full bg-coral px-5 py-2 text-sm font-medium text-white hover:bg-coral-deep transition">
          + Adicionar
        </button>
      </form>

      <div className="rounded-2xl border border-cream-deep bg-cream-soft divide-y divide-cream-deep/60">
        {(categories ?? []).map((c) => {
          const rename = renameCategory.bind(null, c.id);
          const remove = deleteCategory.bind(null, c.id);
          return (
            <div key={c.id} className="flex items-center gap-3 p-4 flex-wrap">
              <form action={rename} className="flex-1 flex gap-2 min-w-[200px]">
                <input
                  name="name"
                  defaultValue={c.name}
                  className="flex-1 rounded-full border border-cream-deep bg-cream px-3 py-1.5 text-sm focus:border-coral focus:outline-none transition"
                />
                <button className="rounded-full border border-cream-deep bg-cream px-4 py-1.5 text-sm hover:border-coral hover:text-coral-deep transition">
                  Salvar
                </button>
              </form>
              <span className="text-xs text-ink-mute font-mono bg-cream rounded-full px-2 py-0.5">
                {c.slug}
              </span>
              <form action={remove}>
                <button className="text-xs text-coral-deep hover:text-coral transition">
                  Excluir
                </button>
              </form>
            </div>
          );
        })}
        {(!categories || categories.length === 0) && (
          <p className="p-8 text-sm text-ink-soft text-center">Sem categorias ainda.</p>
        )}
      </div>
    </div>
  );
}
