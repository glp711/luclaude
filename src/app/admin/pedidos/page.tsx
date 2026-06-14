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

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-cream-deep text-ink-soft",
  paid: "bg-sage-soft text-ink",
  preparing: "bg-sage-soft text-ink",
  shipped: "bg-coral-soft text-coral-deep",
  delivered: "bg-sage-soft text-ink",
  canceled: "bg-coral-soft/40 text-ink-mute",
  refunded: "bg-cream-deep text-ink-soft",
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
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl text-ink">Pedidos</h1>
          <p className="text-sm text-ink-soft mt-0.5">
            {count != null ? `${count} pedido${count === 1 ? "" : "s"} no filtro atual` : "—"}
          </p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <StatusTab label="Todos" value="all" active={status} />
        {Object.entries(STATUS_LABEL).map(([k, label]) => (
          <StatusTab key={k} label={label} value={k} active={status} />
        ))}
      </div>

      {error ? (
        <div className="rounded-2xl bg-coral-soft/50 border border-coral-soft px-4 py-3 text-sm text-coral-deep">
          Erro: {error.message}
        </div>
      ) : !orders || orders.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-cream-deep bg-cream-soft p-16 text-center">
          <p className="font-display text-2xl text-ink">Nada por aqui</p>
          <p className="mt-2 text-sm text-ink-soft">
            {status !== "all"
              ? `Nenhum pedido com status "${STATUS_LABEL[status] ?? status}".`
              : "Quando chegar o primeiro pedido, ele aparece aqui."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-cream-deep bg-cream-soft">
          <table className="min-w-full divide-y divide-cream-deep text-sm">
            <thead className="bg-cream text-sage-deep">
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
            <tbody className="divide-y divide-cream-deep/50">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-coral-soft/20 transition">
                  <Td className="font-mono text-xs text-ink">#{o.order_number}</Td>
                  <Td>{o.guest_email ?? o.customer_id?.slice(0, 8) ?? "—"}</Td>
                  <Td>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider ${STATUS_STYLE[o.status] ?? "bg-cream-deep text-ink-soft"}`}>
                      {STATUS_LABEL[o.status] ?? o.status}
                    </span>
                  </Td>
                  <Td className="font-mono text-xs text-ink-mute">{o.tracking_code ?? "—"}</Td>
                  <Td className="text-right tabular-nums">{formatBRL(o.total_cents)}</Td>
                  <Td className="text-ink-mute text-xs">{new Date(o.created_at).toLocaleString("pt-BR")}</Td>
                  <Td>
                    <Link
                      href={`/admin/pedidos/${o.id}`}
                      className="text-sm text-ink-soft hover:text-coral-deep transition"
                    >
                      Abrir →
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
}) {
  const isActive = active === value;
  const href = value === "all" ? "/admin/pedidos" : `/admin/pedidos?status=${value}`;
  return (
    <Link
      href={href}
      className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
        isActive
          ? "bg-ink text-cream-soft"
          : "bg-cream-soft border border-cream-deep text-ink-soft hover:border-coral hover:text-coral-deep"
      }`}
    >
      {label}
    </Link>
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
