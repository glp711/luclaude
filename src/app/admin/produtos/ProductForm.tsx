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
    <form action={action} className="max-w-6xl space-y-6">
      {error && (
        <div className="rounded-[8px] border border-coral bg-coral-soft/60 px-5 py-4 text-sm font-semibold text-coral-deep">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <FormSection
            kicker="Etapa 1"
            title="Informacoes principais"
            description="Comece pelo nome e pela descricao. O slug pode ficar vazio que o sistema gera sozinho."
          >
            <Field label="Nome do produto" required hint="Aparece no catalogo e no pedido.">
              <input
                name="name"
                required
                defaultValue={initial.name ?? ""}
                placeholder="Ex.: Difusor Orquidea Negra 250ml"
                className={inputCls}
              />
            </Field>

            <Field label="Slug da URL" hint="Opcional. Use apenas letras, numeros e hifens.">
              <input
                name="slug"
                defaultValue={initial.slug ?? ""}
                placeholder="ex.: difusor-orquidea-negra-250ml"
                className={inputCls}
              />
            </Field>

            <Field label="Descricao do produto" hint="Explique aroma, uso, tamanho e ocasiao de presente.">
              <textarea
                name="description"
                rows={6}
                defaultValue={initial.description ?? ""}
                placeholder="Descreva o produto de forma simples para a cliente entender o que esta comprando."
                className={`${inputCls} min-h-[150px] rounded-[8px] py-3`}
              />
            </Field>
          </FormSection>

          <FormSection
            kicker="Etapa 2"
            title="Preco e estoque"
            description="Esses campos controlam venda, promocao e disponibilidade na loja."
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Preco de venda (R$)" required hint="Valor cobrado no checkout.">
                <input
                  name="price"
                  required
                  inputMode="decimal"
                  defaultValue={centsToInput(initial.price_cents)}
                  placeholder="176,90"
                  className={inputCls}
                />
              </Field>

              <Field label='Preco "de" (R$)' hint="Opcional. Mostra promocao quando for maior que o preco.">
                <input
                  name="compare_at_price"
                  inputMode="decimal"
                  defaultValue={centsToInput(initial.compare_at_price_cents)}
                  placeholder="199,90"
                  className={inputCls}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="SKU / codigo interno" hint="Opcional, ajuda no controle manual.">
                <input
                  name="sku"
                  defaultValue={initial.sku ?? ""}
                  placeholder="DIF-ORQ-250"
                  className={inputCls}
                />
              </Field>

              <Field label="Estoque" required hint="Quando chegar a zero, o produto fica sem estoque.">
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
          </FormSection>

          <FormSection
            kicker="Etapa 3"
            title="Frete e medidas"
            description="Peso e dimensoes ajudam o calculo de frete. Preencha pensando no produto ja embalado."
          >
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <Field label="Peso (g)">
                <input name="weight_g" type="number" min={0} defaultValue={initial.weight_g ?? ""} placeholder="500" className={inputCls} />
              </Field>
              <Field label="Largura (cm)">
                <input name="width_cm" type="number" step="0.1" min={0} defaultValue={initial.width_cm ?? ""} placeholder="12" className={inputCls} />
              </Field>
              <Field label="Altura (cm)">
                <input name="height_cm" type="number" step="0.1" min={0} defaultValue={initial.height_cm ?? ""} placeholder="18" className={inputCls} />
              </Field>
              <Field label="Comprimento (cm)">
                <input name="length_cm" type="number" step="0.1" min={0} defaultValue={initial.length_cm ?? ""} placeholder="20" className={inputCls} />
              </Field>
            </div>
          </FormSection>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-36 lg:self-start">
          <div className="rounded-[8px] border border-cream-deep bg-cream-soft p-5 shadow-sm">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-sage-deep">
              Publicacao
            </p>
            <div className="mt-4 space-y-4">
              <Field label="Status">
                <select name="status" defaultValue={initial.status ?? "draft"} className={inputCls}>
                  <option value="draft">Rascunho - escondido da loja</option>
                  <option value="active">Ativo - visivel na loja</option>
                  <option value="archived">Arquivado - fora da operacao</option>
                </select>
              </Field>

              <Field label="Categoria">
                <select name="category_id" defaultValue={initial.category_id ?? ""} className={inputCls}>
                  <option value="">Sem categoria</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </div>

          <div className="rounded-[8px] border border-ink bg-ink p-5 text-cream-soft shadow-lg">
            <p className="font-display text-2xl">Antes de salvar</p>
            <ul className="mt-4 space-y-2 text-sm leading-relaxed text-cream-deep">
              <li>Confira se o preco esta em reais, ex.: 176,90.</li>
              <li>Use rascunho enquanto faltar foto ou descricao.</li>
              <li>Preencha medidas para evitar erro no frete.</li>
            </ul>
          </div>

          <div className="rounded-[8px] border border-cream-deep bg-cream-soft p-5 shadow-sm">
            <button
              type="submit"
              className="w-full rounded-full bg-coral px-6 py-3 text-sm font-extrabold uppercase tracking-wide text-ink shadow-sm transition hover:bg-coral-soft"
            >
              {submitLabel}
            </button>
            <Link
              href="/admin/produtos"
              className="mt-3 flex w-full justify-center rounded-full border border-cream-deep bg-cream px-6 py-3 text-sm font-semibold text-ink-soft transition hover:border-coral hover:text-coral-deep"
            >
              Cancelar e voltar
            </Link>
          </div>
        </aside>
      </div>
    </form>
  );
}

const inputCls =
  "mt-2 block w-full rounded-[8px] border border-cream-deep bg-cream px-4 py-3 text-base text-ink shadow-inner shadow-cream-deep/30 transition placeholder:text-ink-mute focus:border-coral focus:bg-cream-soft focus:outline-none";

function FormSection({
  kicker,
  title,
  description,
  children,
}: {
  kicker: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[8px] border border-cream-deep bg-cream-soft p-5 shadow-sm sm:p-6">
      <div className="border-b border-cream-deep pb-4">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-sage-deep">{kicker}</p>
        <h2 className="mt-1 font-display text-3xl leading-tight text-ink">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{description}</p>
      </div>
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="text-sm font-extrabold uppercase tracking-[0.12em] text-ink">
          {label}
          {required ? " *" : ""}
        </span>
        {hint && <span className="text-xs font-medium text-ink-mute">{hint}</span>}
      </span>
      {children}
    </label>
  );
}
