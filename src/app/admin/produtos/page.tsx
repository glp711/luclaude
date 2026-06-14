import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatBRL } from "@/lib/money";

const PAGE_SIZE = 50;

export default async function ProductsListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);
  const q = sp.q?.trim() ?? "";
  const status = sp.status ?? "all";

  const supabase = await createSupabaseServerClient();

  let query = supabase
    .from("products")
    .select("id, name, slug, price_cents, stock_quantity, status, sku", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  if (q) query = query.ilike("name", `%${q}%`);
  if (status !== "all") query = query.eq("status", status);

  const { data: products, count, error } = await query;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl text-ink">Produtos</h1>
          <p className="text-sm text-ink-soft mt-0.5">
            {count != null ? `${count} produto${count === 1 ? "" : "s"} no total` : "—"}
          </p>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="rounded-full bg-coral px-5 py-2.5 text-sm font-medium text-white hover:bg-coral-deep transition shadow-sm"
        >
          + Novo produto
        </Link>
      </div>

      <form className="flex flex-wrap items-end gap-3 rounded-2xl border border-cream-deep bg-cream-soft p-4" action="/admin/produtos">
        <label className="flex flex-col flex-1 min-w-[200px]">
          <span className="text-xs uppercase tracking-widest text-sage-deep">Buscar</span>
          <input
            name="q"
            defaultValue={q}
            placeholder="Nome do produto"
            className="mt-1 rounded-full border border-cream-deep bg-cream px-4 py-2 text-sm focus:border-coral focus:outline-none transition"
          />
        </label>
        <label className="flex flex-col">
          <span className="text-xs uppercase tracking-widest text-sage-deep">Status</span>
          <select
            name="status"
            defaultValue={status}
            className="mt-1 rounded-full border border-cream-deep bg-cream px-4 py-2 text-sm focus:border-coral focus:outline-none transition"
          >
            <option value="all">Todos</option>
            <option value="active">Ativos</option>
            <option value="draft">Rascunhos</option>
            <option value="archived">Arquivados</option>
          </select>
        </label>
        <button
          type="submit"
          className="rounded-full bg-ink text-cream-soft px-5 py-2 text-sm hover:bg-coral-deep transition"
        >
          Filtrar
        </button>
      </form>

      {error ? (
        <div className="rounded-2xl bg-coral-soft/50 border border-coral-soft px-4 py-3 text-sm text-coral-deep">
          Erro: {error.message}. Configurou o Supabase?{" "}
          <Link href="/admin" className="underline underline-offset-4">
            Voltar
          </Link>
        </div>
      ) : !products || products.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-cream-deep bg-cream-soft p-12 text-center text-ink-soft">
          Nenhum produto.{" "}
          <Link href="/admin/produtos/novo" className="text-coral-deep underline underline-offset-4">
            Criar o primeiro
          </Link>{" "}
          ou rode <code className="bg-cream px-1.5 py-0.5 rounded text-xs">npm run import:products</code>.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-cream-deep bg-cream-soft">
          <table className="min-w-full divide-y divide-cream-deep text-sm">
            <thead className="bg-cream text-sage-deep">
              <tr>
                <Th>Nome</Th>
                <Th>SKU</Th>
                <Th className="text-right">Preço</Th>
                <Th className="text-right">Estoque</Th>
                <Th>Status</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-deep/50">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-coral-soft/20 transition">
                  <Td>
                    <Link href={`/admin/produtos/${p.id}`} className="text-ink hover:text-coral-deep transition font-medium">
                      {p.name}
                    </Link>
                  </Td>
                  <Td className="text-ink-mute text-xs">{p.sku ?? "—"}</Td>
                  <Td className="text-right tabular-nums">{formatBRL(p.price_cents)}</Td>
                  <Td className="text-right tabular-nums">
                    <span
                      className={
                        p.stock_quantity === 0
                          ? "text-coral-deep font-medium"
                          : p.stock_quantity <= 3
                          ? "text-coral-deep"
                          : "text-ink"
                      }
                    >
                      {p.stock_quantity}
                    </span>
                  </Td>
                  <Td>
                    <StatusBadge status={p.status} />
                  </Td>
                  <Td>
                    <Link
                      href={`/admin/produtos/${p.id}`}
                      className="text-sm text-ink-soft hover:text-coral-deep transition"
                    >
                      Editar →
                    </Link>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {count != null && count > PAGE_SIZE && (
        <Pagination page={page} total={count} q={q} status={status} />
      )}
    </div>
  );
}

function Th({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-widest ${className ?? ""}`}>
      {children}
    </th>
  );
}

function Td({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 ${className ?? ""}`}>{children}</td>;
}

function StatusBadge({ status }: { status: string }) {
  const styles =
    status === "active"
      ? "bg-sage-soft text-ink"
      : status === "draft"
      ? "bg-cream-deep text-ink-soft"
      : "bg-coral-soft text-coral-deep";
  const label = status === "active" ? "Ativo" : status === "draft" ? "Rascunho" : "Arquivado";
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider ${styles}`}>{label}</span>
  );
}

function Pagination({
  page,
  total,
  q,
  status,
}: {
  page: number;
  total: number;
  q: string;
  status: string;
}) {
  const lastPage = Math.ceil(total / PAGE_SIZE);
  const qs = (p: number) => {
    const u = new URLSearchParams();
    if (q) u.set("q", q);
    if (status !== "all") u.set("status", status);
    if (p > 1) u.set("page", String(p));
    return u.toString() ? `?${u.toString()}` : "";
  };
  return (
    <div className="flex items-center justify-between text-sm text-ink-soft pt-2">
      <span>
        Página <strong className="text-ink">{page}</strong> de <strong className="text-ink">{lastPage}</strong>
      </span>
      <div className="flex gap-2">
        {page > 1 && (
          <Link
            href={`/admin/produtos${qs(page - 1)}`}
            className="rounded-full border border-cream-deep bg-cream px-4 py-1.5 hover:border-coral hover:text-coral-deep transition"
          >
            ← Anterior
          </Link>
        )}
        {page < lastPage && (
          <Link
            href={`/admin/produtos${qs(page + 1)}`}
            className="rounded-full bg-ink text-cream-soft px-4 py-1.5 hover:bg-coral-deep transition"
          >
            Próxima →
          </Link>
        )}
      </div>
    </div>
  );
}
