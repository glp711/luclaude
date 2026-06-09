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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Produtos</h1>
          <p className="text-sm text-neutral-500">
            {count != null ? `${count} produto${count === 1 ? "" : "s"}` : "—"}
          </p>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-700"
        >
          Novo produto
        </Link>
      </div>

      <form className="flex flex-wrap items-end gap-3" action="/admin/produtos">
        <label className="flex flex-col">
          <span className="text-xs text-neutral-600">Buscar</span>
          <input
            name="q"
            defaultValue={q}
            placeholder="Nome do produto"
            className="mt-1 rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="flex flex-col">
          <span className="text-xs text-neutral-600">Status</span>
          <select
            name="status"
            defaultValue={status}
            className="mt-1 rounded-md border border-neutral-300 px-3 py-2 text-sm"
          >
            <option value="all">Todos</option>
            <option value="active">Ativos</option>
            <option value="draft">Rascunhos</option>
            <option value="archived">Arquivados</option>
          </select>
        </label>
        <button
          type="submit"
          className="rounded-md border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-100"
        >
          Filtrar
        </button>
      </form>

      {error ? (
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          Erro: {error.message}. Configurou o Supabase?{" "}
          <Link href="/admin" className="underline">
            Voltar
          </Link>
        </div>
      ) : !products || products.length === 0 ? (
        <div className="rounded-md border border-dashed border-neutral-300 bg-white p-12 text-center text-neutral-500">
          Nenhum produto. <Link href="/admin/produtos/novo" className="underline">Criar o primeiro</Link>{" "}
          ou rode <code className="text-neutral-700">npm run import:products</code>.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-white">
          <table className="min-w-full divide-y divide-neutral-200 text-sm">
            <thead className="bg-neutral-50 text-neutral-600">
              <tr>
                <Th>Nome</Th>
                <Th>SKU</Th>
                <Th className="text-right">Preço</Th>
                <Th className="text-right">Estoque</Th>
                <Th>Status</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50">
                  <Td>
                    <Link href={`/admin/produtos/${p.id}`} className="text-neutral-900 hover:underline">
                      {p.name}
                    </Link>
                  </Td>
                  <Td className="text-neutral-500">{p.sku ?? "—"}</Td>
                  <Td className="text-right tabular-nums">{formatBRL(p.price_cents)}</Td>
                  <Td className="text-right tabular-nums">
                    <span
                      className={
                        p.stock_quantity === 0
                          ? "text-red-600"
                          : p.stock_quantity <= 3
                          ? "text-amber-600"
                          : ""
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
                      className="text-sm text-neutral-600 hover:text-neutral-900"
                    >
                      Editar
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
    <th className={`px-4 py-2 text-left text-xs font-medium uppercase tracking-wide ${className ?? ""}`}>
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
      ? "bg-green-100 text-green-800"
      : status === "draft"
      ? "bg-neutral-200 text-neutral-700"
      : "bg-amber-100 text-amber-800";
  const label = status === "active" ? "Ativo" : status === "draft" ? "Rascunho" : "Arquivado";
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles}`}>{label}</span>
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
    <div className="flex items-center justify-between text-sm text-neutral-600">
      <span>
        Página {page} de {lastPage}
      </span>
      <div className="flex gap-2">
        {page > 1 && (
          <Link
            href={`/admin/produtos${qs(page - 1)}`}
            className="rounded-md border border-neutral-300 px-3 py-1 hover:bg-neutral-50"
          >
            Anterior
          </Link>
        )}
        {page < lastPage && (
          <Link
            href={`/admin/produtos${qs(page + 1)}`}
            className="rounded-md border border-neutral-300 px-3 py-1 hover:bg-neutral-50"
          >
            Próxima
          </Link>
        )}
      </div>
    </div>
  );
}
