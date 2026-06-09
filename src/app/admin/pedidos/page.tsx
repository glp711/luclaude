import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatBRL } from "@/lib/money";

const PAGE_SIZE = 50;

const STATUS_LABEL: Record<string, string> = {
  pending: "Aguardando pagamento",
  paid: "Pago",
  preparing: "Preparando",
  shipped: "Enviado",
  delivered: "Entregue",
  canceled: "Cancelado",
  refunded: "Reembolsado",
};

export default async function OrdersListPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);
  const status = sp.status ?? "all";

  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("orders")
    .select("id, order_number, status, total_cents, customer_id, guest_email, created_at, tracking_code", {
      count: "exact",
    })
    .order("created_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  if (status !== "all") query = query.eq("status", status);

  const { data: orders, count, error } = await query;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Pedidos</h1>
          <p className="text-sm text-neutral-500">
            {count != null ? `${count} pedido${count === 1 ? "" : "s"}` : "—"}
          </p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <StatusTab label="Todos" value="all" active={status} count={null} />
        {Object.entries(STATUS_LABEL).map(([k, label]) => (
          <StatusTab key={k} label={label} value={k} active={status} count={null} />
        ))}
      </div>

      {error ? (
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          Erro: {error.message}
        </div>
      ) : !orders || orders.length === 0 ? (
        <div className="rounded-md border border-dashed border-neutral-300 bg-white p-12 text-center text-neutral-500">
          Nenhum pedido {status !== "all" ? `com status "${STATUS_LABEL[status] ?? status}"` : ""}.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-white">
          <table className="min-w-full divide-y divide-neutral-200 text-sm">
            <thead className="bg-neutral-50 text-neutral-600">
              <tr>
                <Th>#</Th>
                <Th>Cliente</Th>
                <Th>Status</Th>
                <Th>Rastreio</Th>
                <Th className="text-right">Total</Th>
                <Th>Data</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-neutral-50">
                  <Td className="font-mono">#{o.order_number}</Td>
                  <Td>{o.guest_email ?? o.customer_id?.slice(0, 8) ?? "—"}</Td>
                  <Td>
                    <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs">
                      {STATUS_LABEL[o.status] ?? o.status}
                    </span>
                  </Td>
                  <Td className="font-mono text-xs">{o.tracking_code ?? "—"}</Td>
                  <Td className="text-right tabular-nums">{formatBRL(o.total_cents)}</Td>
                  <Td className="text-neutral-500">{new Date(o.created_at).toLocaleString("pt-BR")}</Td>
                  <Td>
                    <Link href={`/admin/pedidos/${o.id}`} className="text-neutral-600 hover:text-neutral-900">
                      Abrir
                    </Link>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatusTab({
  label,
  value,
  active,
}: {
  label: string;
  value: string;
  active: string;
  count: number | null;
}) {
  const isActive = active === value;
  const href = value === "all" ? "/admin/pedidos" : `/admin/pedidos?status=${value}`;
  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        isActive ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
      }`}
    >
      {label}
    </Link>
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
