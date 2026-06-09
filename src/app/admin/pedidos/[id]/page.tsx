import { notFound } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatBRL } from "@/lib/money";
import { transitionOrder, setTrackingCode } from "../actions";

const STATUS_LABEL: Record<string, string> = {
  pending: "Aguardando pagamento",
  paid: "Pago",
  preparing: "Preparando",
  shipped: "Enviado",
  delivered: "Entregue",
  canceled: "Cancelado",
  refunded: "Reembolsado",
};

const TRANSITIONS: Record<string, { value: string; label: string; tone: "neutral" | "danger" }[]> = {
  pending: [{ value: "canceled", label: "Cancelar", tone: "danger" }],
  paid: [
    { value: "preparing", label: "Marcar como preparando", tone: "neutral" },
    { value: "shipped", label: "Marcar como enviado", tone: "neutral" },
    { value: "canceled", label: "Cancelar", tone: "danger" },
    { value: "refunded", label: "Reembolsar", tone: "danger" },
  ],
  preparing: [
    { value: "shipped", label: "Marcar como enviado", tone: "neutral" },
    { value: "canceled", label: "Cancelar", tone: "danger" },
  ],
  shipped: [{ value: "delivered", label: "Marcar como entregue", tone: "neutral" }],
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createSupabaseServerClient();
  const [{ data: order }, { data: items }] = await Promise.all([
    supabase
      .from("orders")
      .select(
        "id, order_number, status, customer_id, guest_email, subtotal_cents, shipping_cents, discount_cents, total_cents, shipping_address, shipping_service, payment_method, mp_payment_id, paid_at, tracking_code, tracking_carrier, shipped_at, delivered_at, created_at, notes"
      )
      .eq("id", id)
      .single(),
    supabase
      .from("order_items")
      .select("id, product_snapshot, quantity, unit_price_cents, total_cents")
      .eq("order_id", id),
  ]);

  if (!order) notFound();

  const next = TRANSITIONS[order.status] ?? [];
  const trackingAction = setTrackingCode.bind(null, id);

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex items-start justify-between">
        <div>
          <Link href="/admin/pedidos" className="text-sm text-neutral-500 hover:text-neutral-900">
            ← Pedidos
          </Link>
          <h1 className="text-2xl font-semibold mt-1">Pedido #{order.order_number}</h1>
          <p className="text-sm text-neutral-500">
            Criado em {new Date(order.created_at).toLocaleString("pt-BR")}
          </p>
        </div>
        <span className="rounded-full bg-neutral-100 px-3 py-1 text-sm font-medium">
          {STATUS_LABEL[order.status]}
        </span>
      </div>

      {next.length > 0 && (
        <div className="rounded-lg border bg-white p-4">
          <h2 className="text-sm font-medium mb-3">Mudar status</h2>
          <div className="flex flex-wrap gap-2">
            {next.map((t) => {
              const action = transitionOrder.bind(null, id, t.value);
              return (
                <form key={t.value} action={action}>
                  <button
                    className={`rounded-md border px-3 py-1.5 text-sm ${
                      t.tone === "danger"
                        ? "border-red-300 text-red-700 hover:bg-red-50"
                        : "border-neutral-300 hover:bg-neutral-50"
                    }`}
                  >
                    {t.label}
                  </button>
                </form>
              );
            })}
          </div>
        </div>
      )}

      <section className="rounded-lg border bg-white p-4 space-y-3">
        <h2 className="text-sm font-medium">Rastreio</h2>
        {order.tracking_code ? (
          <div className="text-sm">
            <span className="font-mono">{order.tracking_code}</span>
            {order.tracking_carrier && (
              <span className="ml-2 text-neutral-500">({order.tracking_carrier})</span>
            )}
          </div>
        ) : (
          <p className="text-sm text-neutral-500">Sem código de rastreio.</p>
        )}
        <form action={trackingAction} className="flex flex-wrap gap-2 items-end">
          <input
            name="tracking_code"
            placeholder="Código (ex.: BR123456789BR)"
            defaultValue={order.tracking_code ?? ""}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm font-mono"
          />
          <input
            name="tracking_carrier"
            placeholder="Transportadora"
            defaultValue={order.tracking_carrier ?? ""}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
          <button className="rounded-md border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-50">
            Salvar
          </button>
        </form>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-lg border bg-white p-4 space-y-2">
          <h2 className="text-sm font-medium">Cliente</h2>
          <dl className="text-sm space-y-1">
            <Row k="E-mail" v={order.guest_email ?? "(cliente logado)"} />
            <Row k="ID cliente" v={order.customer_id ?? "convidado"} />
          </dl>
        </div>
        <div className="rounded-lg border bg-white p-4 space-y-2">
          <h2 className="text-sm font-medium">Pagamento</h2>
          <dl className="text-sm space-y-1">
            <Row k="Método" v={order.payment_method ?? "—"} />
            <Row k="MP payment ID" v={order.mp_payment_id ?? "—"} />
            <Row
              k="Pago em"
              v={order.paid_at ? new Date(order.paid_at).toLocaleString("pt-BR") : "—"}
            />
          </dl>
        </div>
      </section>

      <section className="rounded-lg border bg-white p-4 space-y-2">
        <h2 className="text-sm font-medium">Endereço de entrega</h2>
        <AddressBlock address={order.shipping_address} />
        {order.shipping_service && (
          <p className="text-sm text-neutral-500">Frete: {order.shipping_service}</p>
        )}
      </section>

      <section className="rounded-lg border bg-white">
        <div className="p-4 border-b">
          <h2 className="text-sm font-medium">Itens</h2>
        </div>
        <table className="min-w-full divide-y divide-neutral-200 text-sm">
          <thead className="bg-neutral-50 text-neutral-600 text-xs uppercase">
            <tr>
              <th className="px-4 py-2 text-left">Produto</th>
              <th className="px-4 py-2 text-right">Qtd</th>
              <th className="px-4 py-2 text-right">Unit.</th>
              <th className="px-4 py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {(items ?? []).map((it) => {
              const snap = (it.product_snapshot ?? {}) as { name?: string };
              return (
                <tr key={it.id}>
                  <td className="px-4 py-3">{snap.name ?? "—"}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{it.quantity}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{formatBRL(it.unit_price_cents)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{formatBRL(it.total_cents)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="border-t p-4 space-y-1 text-sm">
          <Row k="Subtotal" v={formatBRL(order.subtotal_cents)} align="right" />
          <Row k="Frete" v={formatBRL(order.shipping_cents)} align="right" />
          {order.discount_cents > 0 && (
            <Row k="Desconto" v={`- ${formatBRL(order.discount_cents)}`} align="right" />
          )}
          <Row k="Total" v={formatBRL(order.total_cents)} align="right" bold />
        </div>
      </section>
    </div>
  );
}

function Row({
  k,
  v,
  align = "left",
  bold = false,
}: {
  k: string;
  v: string;
  align?: "left" | "right";
  bold?: boolean;
}) {
  return (
    <div className={`flex justify-between gap-2 ${align === "right" ? "" : ""}`}>
      <dt className="text-neutral-500">{k}</dt>
      <dd className={`${bold ? "font-medium" : ""} ${align === "right" ? "tabular-nums" : ""}`}>{v}</dd>
    </div>
  );
}

function AddressBlock({ address }: { address: unknown }) {
  if (!address || typeof address !== "object") {
    return <p className="text-sm text-neutral-500">—</p>;
  }
  const a = address as Record<string, string | undefined>;
  return (
    <div className="text-sm text-neutral-700 space-y-0.5">
      <div>{a.recipient_name}</div>
      <div>{a.street}, {a.number}{a.complement ? ` — ${a.complement}` : ""}</div>
      <div>{a.neighborhood} — {a.city}/{a.state}</div>
      <div className="text-neutral-500">CEP {a.postal_code}</div>
    </div>
  );
}
