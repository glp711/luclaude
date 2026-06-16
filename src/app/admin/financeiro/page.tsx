import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatBRL } from "@/lib/money";

export const metadata = { title: "Financeiro" };

const REVENUE_STATUSES = ["paid", "preparing", "shipped", "delivered"];

type FinanceOrder = {
  id: string;
  order_number: number;
  status: string;
  total_cents: number;
  subtotal_cents: number;
  shipping_cents: number;
  discount_cents: number;
  created_at: string;
};

export default async function FinancePage() {
  const supabase = await createSupabaseServerClient();
  const start = startOfMonth();
  const end = new Date();

  const { data: orders, error } = await supabase
    .from("orders")
    .select("id, order_number, status, total_cents, subtotal_cents, shipping_cents, discount_cents, created_at")
    .in("status", REVENUE_STATUSES)
    .gte("created_at", start.toISOString())
    .lte("created_at", end.toISOString())
    .order("created_at", { ascending: true })
    .returns<FinanceOrder[]>();

  const rows = orders ?? [];
  const revenueCents = sum(rows, "total_cents");
  const subtotalCents = sum(rows, "subtotal_cents");
  const shippingCents = sum(rows, "shipping_cents");
  const discountCents = sum(rows, "discount_cents");
  const averageTicketCents = rows.length > 0 ? Math.round(revenueCents / rows.length) : 0;
  const chart = buildDailyChart(rows, start, end);
  const maxRevenue = Math.max(...chart.map((day) => day.revenueCents), 1);

  return (
    <div className="space-y-8">
      <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-mute" aria-label="breadcrumb">
        <Link href="/admin" className="hover:text-coral-deep transition">Admin</Link>
        <span>/</span>
        <span className="text-ink-soft">Financeiro</span>
      </nav>

      <section className="rounded-[8px] bg-ink p-6 text-cream-soft shadow-xl shadow-ink/10 sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-coral">Detalhe do faturamento</p>
            <h1 className="mt-2 font-display text-5xl leading-none text-cream-soft sm:text-6xl">
              Financeiro
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-cream-deep">
              Visao do mes atual com pedidos pagos, preparando, enviados ou entregues. O lucro real ainda depende de cadastrar custo por produto.
            </p>
          </div>
          <Link
            href="/admin/pedidos"
            className="inline-flex rounded-full border border-cream-soft/25 px-5 py-2.5 text-sm font-semibold text-cream-soft transition hover:border-coral hover:text-coral"
          >
            Ver pedidos
          </Link>
        </div>
      </section>

      {error && (
        <div className="rounded-[8px] border border-coral bg-coral-soft/60 px-5 py-4 text-sm font-semibold text-coral-deep">
          Erro ao carregar financeiro: {error.message}
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <FinanceCard title="Faturamento bruto" value={formatBRL(revenueCents)} helper="Total recebido nos pedidos validos do mes." dark />
        <FinanceCard title="Pedidos pagos" value={rows.length} helper="Quantidade de pedidos que entram no faturamento." />
        <FinanceCard title="Ticket medio" value={formatBRL(averageTicketCents)} helper="Faturamento dividido por pedidos pagos." />
        <FinanceCard title="Lucro real" value="Pendente" helper="Falta campo de custo por produto para calcular certo." warning />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
        <article className="rounded-[8px] border border-cream-deep bg-cream-soft p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-sage-deep">Grafico</p>
              <h2 className="mt-1 font-display text-3xl text-ink">Faturamento por dia</h2>
            </div>
            <p className="text-sm text-ink-soft">{formatDate(start)} ate {formatDate(end)}</p>
          </div>

          <div className="mt-6 space-y-3">
            {chart.map((day) => {
              const width = `${Math.max(3, Math.round((day.revenueCents / maxRevenue) * 100))}%`;
              return (
                <div key={day.key} className="grid grid-cols-[72px_1fr_112px] items-center gap-3">
                  <span className="text-xs font-bold text-ink-soft">{day.label}</span>
                  <div className="h-8 overflow-hidden rounded-full bg-cream">
                    <div
                      className="h-full rounded-full bg-coral"
                      style={{ width }}
                      title={`${day.label}: ${formatBRL(day.revenueCents)}`}
                    />
                  </div>
                  <span className="text-right text-sm font-bold tabular-nums text-ink">
                    {formatBRL(day.revenueCents)}
                  </span>
                </div>
              );
            })}
          </div>
        </article>

        <aside className="space-y-4">
          <div className="rounded-[8px] border border-cream-deep bg-cream-soft p-5 shadow-sm">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-sage-deep">Composicao</p>
            <dl className="mt-4 space-y-3 text-sm">
              <MoneyRow label="Subtotal dos produtos" value={subtotalCents} />
              <MoneyRow label="Frete cobrado" value={shippingCents} />
              <MoneyRow label="Descontos" value={discountCents} negative />
              <div className="border-t border-cream-deep pt-3">
                <MoneyRow label="Total faturado" value={revenueCents} strong />
              </div>
            </dl>
          </div>

          <div className="rounded-[8px] border border-coral bg-coral-soft/50 p-5 shadow-sm">
            <p className="font-display text-2xl text-ink">Por que nao tem lucro?</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              O banco atual nao guarda custo do produto, custo de embalagem, taxa do Mercado Pago ou custo real do frete. Sem isso, qualquer lucro seria chute.
            </p>
            <p className="mt-3 text-sm font-semibold text-ink">
              Proximo passo tecnico: adicionar `cost_cents` em produtos e registrar taxas por pedido.
            </p>
          </div>
        </aside>
      </section>

      <section className="rounded-[8px] border border-cream-deep bg-cream-soft p-5 shadow-sm sm:p-6">
        <h2 className="font-display text-3xl text-ink">Pedidos usados no calculo</h2>
        {rows.length === 0 ? (
          <p className="mt-4 text-sm text-ink-soft">Ainda nao ha pedidos pagos neste mes.</p>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full divide-y divide-cream-deep text-sm">
              <thead className="bg-cream text-sage-deep">
                <tr>
                  <Th>Pedido</Th>
                  <Th>Status</Th>
                  <Th>Data</Th>
                  <Th className="text-right">Total</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-deep/60">
                {rows.slice().reverse().map((order) => (
                  <tr key={order.id} className="hover:bg-coral-soft/20">
                    <Td>
                      <Link href={`/admin/pedidos/${order.id}`} className="font-bold text-ink hover:text-coral-deep">
                        #{order.order_number}
                      </Link>
                    </Td>
                    <Td>{statusLabel(order.status)}</Td>
                    <Td className="text-ink-soft">{new Date(order.created_at).toLocaleString("pt-BR")}</Td>
                    <Td className="text-right font-bold tabular-nums">{formatBRL(order.total_cents)}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function FinanceCard({
  title,
  value,
  helper,
  dark,
  warning,
}: {
  title: string;
  value: string | number;
  helper: string;
  dark?: boolean;
  warning?: boolean;
}) {
  const classes = dark
    ? "border-ink bg-ink text-cream-soft"
    : warning
    ? "border-coral bg-coral-soft/60 text-ink"
    : "border-cream-deep bg-cream-soft text-ink";

  return (
    <div className={`min-h-[156px] rounded-[8px] border p-5 shadow-sm ${classes}`}>
      <p className={`text-xs font-extrabold uppercase tracking-[0.16em] ${dark ? "text-coral" : "text-sage-deep"}`}>
        {title}
      </p>
      <p className={`mt-4 font-display text-4xl leading-none tabular-nums ${dark ? "text-cream-soft" : "text-ink"}`}>
        {value}
      </p>
      <p className={`mt-4 text-sm leading-relaxed ${dark ? "text-cream-deep" : "text-ink-soft"}`}>
        {helper}
      </p>
    </div>
  );
}

function MoneyRow({ label, value, negative, strong }: { label: string; value: number; negative?: boolean; strong?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className={strong ? "font-bold text-ink" : "text-ink-soft"}>{label}</dt>
      <dd className={`font-bold tabular-nums ${negative ? "text-coral-deep" : "text-ink"}`}>
        {negative && value > 0 ? "- " : ""}
        {formatBRL(value)}
      </dd>
    </div>
  );
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-widest ${className ?? ""}`}>{children}</th>;
}

function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 ${className ?? ""}`}>{children}</td>;
}

function sum(rows: FinanceOrder[], key: keyof Pick<FinanceOrder, "total_cents" | "subtotal_cents" | "shipping_cents" | "discount_cents">) {
  return rows.reduce((total, row) => total + (row[key] ?? 0), 0);
}

function startOfMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

function buildDailyChart(rows: FinanceOrder[], start: Date, end: Date) {
  const days: { key: string; label: string; revenueCents: number }[] = [];
  const cursor = new Date(start);

  while (cursor <= end) {
    const key = cursor.toISOString().slice(0, 10);
    days.push({ key, label: cursor.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }), revenueCents: 0 });
    cursor.setDate(cursor.getDate() + 1);
  }

  for (const order of rows) {
    const key = new Date(order.created_at).toISOString().slice(0, 10);
    const day = days.find((item) => item.key === key);
    if (day) day.revenueCents += order.total_cents;
  }

  return days;
}

function formatDate(date: Date) {
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    paid: "Pago",
    preparing: "Preparando",
    shipped: "Enviado",
    delivered: "Entregue",
  };
  return labels[status] ?? status;
}
