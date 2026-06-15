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

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-cream-deep text-ink-soft",
  paid: "bg-sage-soft text-ink",
  preparing: "bg-sage-soft text-ink",
  shipped: "bg-coral-soft text-coral-deep",
  delivered: "bg-sage-soft text-ink",
  canceled: "bg-coral-soft/40 text-ink-mute",
  refunded: "bg-cream-deep text-ink-soft",
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
      <nav className="text-xs text-ink-mute flex items-center gap-2" aria-label="breadcrumb">
        <Link href="/admin" className="hover:text-coral-deep transition">Admin</Link>
        <span>/</span>
        <Link href="/admin/pedidos" className="hover:text-coral-deep transition">Pedidos</Link>
        <span>/</span>
        <span className="text-ink-soft">#{order.order_number}</span>
      </nav>

      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl text-ink">Pedido #{order.order_number}</h1>
          <p className="text-sm text-ink-soft mt-0.5">
            Criado em {new Date(order.created_at).toLocaleString("pt-BR")}
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wider ${STATUS_STYLE[order.status] ?? "bg-cream-deep text-ink-soft"}`}>
          {STATUS_LABEL[order.status]}
        </span>
      </div>

      {next.length > 0 && (
        <section className="rounded-2xl border border-cream-deep bg-cream-soft p-5">
          <h2 className="font-display text-lg text-ink mb-3">Mudar status</h2>
          <div className="flex flex-wrap gap-2">
            {next.map((t) => {
              const action = transitionOrder.bind(null, id, t.value);
              return (
                <form key={t.value} action={action}>
                  <button
                    className={`rounded-full border px-4 py-1.5 text-sm transition ${
                      t.tone === "danger"
                        ? "border-coral-soft text-coral-deep hover:bg-coral-soft/30"
                        : "border-sage-deep text-sage-deep hover:bg-sage-soft"
                    }`}
                  >
                    {t.label}
                  </button>
                </form>
              );
            })}
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-cream-deep bg-cream-soft p-5 space-y-3">
        <h2 className="font-display text-lg text-ink">Rastreio</h2>
        {order.tracking_code ? (
          <div className="text-sm">
            <span className="font-mono bg-cream rounded-full px-2.5 py-0.5">{order.tracking_code}</span>
            {order.tracking_carrier && (
              <span className="ml-2 text-ink-soft">({order.tracking_carrier})</span>
            )}
          </div>
        ) : (
          <p className="text-sm text-ink-mute">Sem código de rastreio.</p>
        )}
        <form action={trackingAction} className="flex flex-wrap gap-2 items-end">
          <input
            name="tracking_code"
            placeholder="Código (ex.: BR123456789BR)"
            defaultValue={order.tracking_code ?? ""}
            className="rounded-full border border-cream-deep bg-cream px-4 py-2 text-sm font-mono focus:border-coral focus:outline-none transition"
          />
          <input
            name="tracking_carrier"
            placeholder="Transportadora"
            defaultValue={order.tracking_carrier ?? ""}
            className="rounded-full border border-cream-deep bg-cream px-4 py-2 text-sm focus:border-coral focus:outline-none transition"
          />
          <button className="rounded-full bg-ink text-cream-soft px-4 py-2 text-sm hover:bg-coral-deep transition">
            Salvar rastreio
          </button>
        </form>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-cream-deep bg-cream-soft p-5 space-y-2">
          <h2 className="font-display text-lg text-ink">Cliente</h2>
          <dl className="text-sm space-y-1.5">
            <Row k="E-mail" v={order.guest_email ?? "(cliente logado)"} />
            <Row k="ID cliente" v={order.customer_id ?? "convidado"} mono />
          </dl>
        </div>
        <div className="rounded-2xl border border-cream-deep bg-cream-soft p-5 space-y-2">
          <h2 className="font-display text-lg text-ink">Pagamento</h2>
          <dl className="text-sm space-y-1.5">
            <Row k="Método" v={order.payment_method ?? "—"} />
            <Row k="MP payment ID" v={order.mp_payment_id ?? "—"} mono />
            <Row
              k="Pago em"
              v={order.paid_at ? new Date(order.paid_at).toLocaleString("pt-BR") : "—"}
            />
          </dl>
        </div>
      </section>

      <section className="rounded-2xl border border-cream-deep bg-cream-soft p-5 space-y-2">
        <h2 className="font-display text-lg text-ink">Endereço de entrega</h2>
        <AddressBlock address={order.shipping_address} />
        {order.shipping_service && (
          <p className="text-xs text-ink-mute pt-2">Frete: {order.shipping_service}</p>
        )}
      </section>

      <section className="rounded-2xl border border-cream-deep bg-cream-soft overflow-hidden">
        <div className="p-5 border-b border-cream-deep">
          <h2 className="font-display text-lg text-ink">Itens</h2>
        </div>
        <table className="min-w-full divide-y divide-cream-deep text-sm">
          <thead className="bg-cream text-sage-deep text-xs uppercase tracking-widest">
            <tr>
              <th className="px-5 py-2.5 text-left">Produto</th>
              <th className="px-5 py-2.5 text-right">Qtd</th>
              <th className="px-5 py-2.5 text-right">Unit.</th>
              <th className="px-5 py-2.5 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-deep/50">
            {(items ?? []).map((it) => {
              const snap = (it.product_snapshot ?? {}) as { name?: string };
              return (
                <tr key={it.id}>
                  <td className="px-5 py-3">{snap.name ?? "—"}</td>
                  <td className="px-5 py-3 text-right tabular-nums">{it.quantity}</td>
                  <td className="px-5 py-3 text-right tabular-nums text-ink-soft">{formatBRL(it.unit_price_cents)}</td>
                  <td className="px-5 py-3 text-right tabular-nums">{formatBRL(it.total_cents)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="border-t border-cream-deep p-5 space-y-1.5 text-sm">
          <Row k="Subtotal" v={formatBRL(order.subtotal_cents)} align="right" />
          <Row k="Frete" v={formatBRL(order.shipping_cents)} align="right" />
          {order.discount_cents > 0 && (
            <Row k="Desconto" v={`- ${formatBRL(order.discount_cents)}`} align="right" />
          )}
          <div className="pt-2 border-t border-cream-deep">
            <Row k="Total" v={formatBRL(order.total_cents)} align="right" bold />
          </div>
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
  mono = false,
}: {
  k: string;
  v: string;
  align?: "left" | "right";
  bold?: boolean;
  mono?: boolean;
}) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-ink-soft">{k}</dt>
      <dd className={`${bold ? "font-display text-lg text-coral-deep" : "text-ink"} ${align === "right" ? "tabular-nums" : ""} ${mono ? "font-mono text-xs" : ""}`}>
        {v}
      </dd>
    </div>
  );
}

function AddressBlock({ address }: { address: unknown }) {
  if (!address || typeof address !== "object") {
    return <p className="text-sm text-ink-mute">—</p>;
  }
  const a = address as Record<string, string | undefined>;
  return (
    <div className="text-sm text-ink space-y-0.5">
      <div className="font-medium">{a.recipient_name}</div>
      <div>{a.street}, {a.number}{a.complement ? ` — ${a.complement}` : ""}</div>
      <div>{a.neighborhood} — {a.city}/{a.state}</div>
      <div className="text-ink-mute">CEP {a.postal_code}</div>
    </div>
  );
}
