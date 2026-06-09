import Link from "next/link";

type Category = { id: string; name: string };

export type ProductFormValues = {
  id?: string;
  name?: string;
  slug?: string;
  description?: string | null;
  price_cents?: number;
  compare_at_price_cents?: number | null;
  sku?: string | null;
  stock_quantity?: number;
  weight_g?: number | null;
  width_cm?: number | null;
  height_cm?: number | null;
  length_cm?: number | null;
  status?: "active" | "draft" | "archived";
  category_id?: string | null;
};

function centsToInput(cents: number | null | undefined): string {
  if (cents == null) return "";
  return (cents / 100).toFixed(2).replace(".", ",");
}

export function ProductForm({
  action,
  initial = {},
  categories,
  error,
  submitLabel = "Salvar",
}: {
  action: (fd: FormData) => Promise<void> | void;
  initial?: ProductFormValues;
  categories: Category[];
  error?: string;
  submitLabel?: string;
}) {
  return (
    <form action={action} className="space-y-6 max-w-3xl">
      {error && (
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <fieldset className="space-y-4">
        <legend className="text-sm font-medium text-neutral-700 mb-1">Básico</legend>

        <Field label="Nome *">
          <input name="name" required defaultValue={initial.name ?? ""} className={inputCls} />
        </Field>

        <Field label="Slug (deixe vazio para gerar do nome)" hint="kebab-case, único">
          <input name="slug" defaultValue={initial.slug ?? ""} className={inputCls} />
        </Field>

        <Field label="Descrição">
          <textarea
            name="description"
            rows={4}
            defaultValue={initial.description ?? ""}
            className={inputCls}
          />
        </Field>

        <Field label="Categoria">
          <select name="category_id" defaultValue={initial.category_id ?? ""} className={inputCls}>
            <option value="">— sem categoria —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </Field>

        <Field label="Status">
          <select name="status" defaultValue={initial.status ?? "draft"} className={inputCls}>
            <option value="draft">Rascunho</option>
            <option value="active">Ativo (visível na loja)</option>
            <option value="archived">Arquivado</option>
          </select>
        </Field>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-medium text-neutral-700 mb-1">Preço e estoque</legend>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Preço (R$) *" hint="ex.: 176,90">
            <input
              name="price"
              required
              inputMode="decimal"
              defaultValue={centsToInput(initial.price_cents)}
              className={inputCls}
            />
          </Field>
          <Field label='Preço "De" (R$)' hint="opcional, para promoção">
            <input
              name="compare_at_price"
              inputMode="decimal"
              defaultValue={centsToInput(initial.compare_at_price_cents)}
              className={inputCls}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="SKU">
            <input name="sku" defaultValue={initial.sku ?? ""} className={inputCls} />
          </Field>
          <Field label="Estoque *">
            <input
              name="stock_quantity"
              type="number"
              min={0}
              required
              defaultValue={initial.stock_quantity ?? 0}
              className={inputCls}
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-medium text-neutral-700 mb-1">Dimensões (para frete)</legend>

        <div className="grid grid-cols-4 gap-4">
          <Field label="Peso (g)">
            <input
              name="weight_g"
              type="number"
              min={0}
              defaultValue={initial.weight_g ?? ""}
              className={inputCls}
            />
          </Field>
          <Field label="Largura (cm)">
            <input
              name="width_cm"
              type="number"
              step="0.1"
              min={0}
              defaultValue={initial.width_cm ?? ""}
              className={inputCls}
            />
          </Field>
          <Field label="Altura (cm)">
            <input
              name="height_cm"
              type="number"
              step="0.1"
              min={0}
              defaultValue={initial.height_cm ?? ""}
              className={inputCls}
            />
          </Field>
          <Field label="Comprimento (cm)">
            <input
              name="length_cm"
              type="number"
              step="0.1"
              min={0}
              defaultValue={initial.length_cm ?? ""}
              className={inputCls}
            />
          </Field>
        </div>
      </fieldset>

      <div className="flex items-center gap-3 border-t pt-6">
        <button
          type="submit"
          className="rounded-md bg-neutral-900 px-5 py-2 text-sm text-white hover:bg-neutral-700"
        >
          {submitLabel}
        </button>
        <Link
          href="/admin/produtos"
          className="text-sm text-neutral-600 hover:text-neutral-900"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}

const inputCls =
  "mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm text-neutral-700">{label}</span>
      {hint && <span className="ml-2 text-xs text-neutral-500">{hint}</span>}
      {children}
    </label>
  );
}
