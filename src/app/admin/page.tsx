import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatBRL } from "@/lib/money";

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient();

  const [
    productsCount,
    activeProductsCount,
    lowStockCount,
    pendingOrdersCount,
    paidOrdersCount,
    monthRevenue,
  ] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("products").select("id", { count: "exact", head: true }).lte("stock_quantity", 3).eq("status", "active"),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "paid"),
    supabase
      .from("orders")
      .select("total_cents")
      .in("status", ["paid", "preparing", "shipped", "delivered"])
      .gte("created_at", startOfMonthIso()),
  ]);

  const monthRevenueCents = (monthRevenue.data ?? []).reduce(
    (s: number, r: { total_cents: number }) => s + (r.total_cents ?? 0),
    0
  );

  const hasError = productsCount.error?.message;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl text-ink">Dashboard</h1>
        <p className="text-sm text-ink-soft mt-1">Visão geral da loja.</p>
      </div>

      {hasError && (
        <div className="rounded-2xl bg-coral-soft/50 border border-coral-soft px-4 py-3 text-sm text-coral-deep">
          Erro ao consultar Supabase: {hasError}. Confira <code className="bg-cream-soft px-1 rounded">.env.local</code> e a migration.
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card
          label="Faturamento do mês"
          value={formatBRL(monthRevenueCents)}
          accent
          icon="💰"
        />
        <Card
          label="Pedidos a despachar"
          value={paidOrdersCount.count ?? 0}
          href="/admin/pedidos?status=paid"
          icon="📦"
        />
        <Card
          label="Aguardando pagamento"
          value={pendingOrdersCount.count ?? 0}
          href="/admin/pedidos?status=pending"
          icon="⏳"
        />
        <Card
          label="Produtos ativos"
          value={activeProductsCount.count ?? 0}
          href="/admin/produtos?status=active"
          icon="✨"
        />
        <Card
          label="Total de produtos"
          value={productsCount.count ?? 0}
          href="/admin/produtos"
          icon="🗂"
        />
        <Card
          label="Estoque baixo (≤3)"
          value={lowStockCount.count ?? 0}
          href="/admin/produtos?status=active"
          icon="⚠️"
          warning={(lowStockCount.count ?? 0) > 0}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/admin/produtos/novo"
          className="rounded-2xl border border-cream-deep bg-cream-soft p-5 hover:border-coral transition flex items-center justify-between"
        >
          <div>
            <p className="font-display text-xl text-ink">Novo produto</p>
            <p className="text-sm text-ink-soft mt-0.5">Adicionar ao catálogo.</p>
          </div>
          <span className="text-coral-deep">→</span>
        </Link>
        <Link
          href="/admin/pedidos"
          className="rounded-2xl border border-cream-deep bg-cream-soft p-5 hover:border-coral transition flex items-center justify-between"
        >
          <div>
            <p className="font-display text-xl text-ink">Todos os pedidos</p>
            <p className="text-sm text-ink-soft mt-0.5">Filtrar por status, ver detalhes.</p>
          </div>
          <span className="text-coral-deep">→</span>
        </Link>
      </div>
    </div>
  );
}

function Card({
  label,
  value,
  href,
  accent,
  warning,
  icon,
}: {
  label: string;
  value: string | number;
  href?: string;
  accent?: boolean;
  warning?: boolean;
  icon?: string;
}) {
  const baseClass = accent
    ? "bg-ink text-cream-soft border-ink"
    : warning
    ? "bg-coral-soft/40 border-coral-soft hover:border-coral"
    : "bg-cream-soft border-cream-deep hover:border-coral";

  const body = (
    <div className={`rounded-2xl border ${baseClass} p-5 transition`}>
      {icon && <div className="text-2xl mb-2">{icon}</div>}
      <div className={`text-xs font-medium uppercase tracking-widest ${accent ? "text-cream-deep" : "text-sage-deep"}`}>
        {label}
      </div>
      <div className={`mt-1 font-display text-3xl tabular-nums ${accent ? "text-cream-soft" : warning ? "text-coral-deep" : "text-ink"}`}>
        {value}
      </div>
    </div>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}

function startOfMonthIso() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString();
}
