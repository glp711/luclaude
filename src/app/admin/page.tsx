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
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-neutral-500">Visão geral.</p>
      </div>

      {hasError && (
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          Erro ao consultar Supabase: {hasError}. Confira <code>.env.local</code> e a migration.
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card label="Faturamento do mês" value={formatBRL(monthRevenueCents)} accent />
        <Card label="Pedidos a despachar" value={paidOrdersCount.count ?? 0} href="/admin/pedidos?status=paid" />
        <Card label="Aguardando pagamento" value={pendingOrdersCount.count ?? 0} href="/admin/pedidos?status=pending" />
        <Card label="Produtos ativos" value={activeProductsCount.count ?? 0} href="/admin/produtos?status=active" />
        <Card label="Total de produtos" value={productsCount.count ?? 0} href="/admin/produtos" />
        <Card label="Estoque baixo (≤3)" value={lowStockCount.count ?? 0} href="/admin/produtos?status=active" />
      </div>
    </div>
  );
}

function Card({
  label,
  value,
  href,
  accent,
}: {
  label: string;
  value: string | number;
  href?: string;
  accent?: boolean;
}) {
  const body = (
    <div className={`rounded-lg border ${accent ? "bg-neutral-900 text-white" : "bg-white"} p-5`}>
      <div className={`text-xs font-medium ${accent ? "text-neutral-300" : "text-neutral-500"}`}>
        {label}
      </div>
      <div className="mt-1 text-2xl font-light tabular-nums">{value}</div>
    </div>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}

function startOfMonthIso() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString();
}
