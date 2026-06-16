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
    (sum: number, row: { total_cents: number }) => sum + (row.total_cents ?? 0),
    0
  );

  const hasError = productsCount.error?.message;

  return (
    <div className="space-y-8">
      <section className="rounded-[8px] bg-ink p-6 text-cream-soft shadow-xl shadow-ink/10 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-coral">Painel da loja</p>
            <h1 className="mt-2 font-display text-5xl leading-none text-cream-soft sm:text-6xl">
              Dashboard
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-cream-deep">
              Acompanhe pedidos, produtos, estoque e faturamento em uma tela mais clara para operar a loja no dia a dia.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/guia" className="rounded-full bg-coral px-5 py-2.5 text-sm font-bold text-ink transition hover:bg-coral-soft">
              Abrir guia
            </Link>
            <Link href="/admin/produtos/novo" className="rounded-full border border-cream-soft/25 px-5 py-2.5 text-sm font-semibold text-cream-soft transition hover:border-coral hover:text-coral">
              Novo produto
            </Link>
          </div>
        </div>
      </section>

      {hasError && (
        <div className="rounded-[8px] border border-coral bg-coral-soft/50 px-5 py-4 text-sm font-medium text-coral-deep">
          Erro ao consultar Supabase: {hasError}. Confira as variaveis de ambiente e as migrations.
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          label="Faturamento do mes"
          value={formatBRL(monthRevenueCents)}
          helper="Pedidos pagos, preparando, enviados ou entregues"
          tone="dark"
        />
        <MetricCard
          label="Pedidos a despachar"
          value={paidOrdersCount.count ?? 0}
          helper="Pagos e esperando preparo/envio"
          href="/admin/pedidos?status=paid"
          tone="success"
        />
        <MetricCard
          label="Aguardando pagamento"
          value={pendingOrdersCount.count ?? 0}
          helper="Pedidos criados que ainda nao foram pagos"
          href="/admin/pedidos?status=pending"
        />
        <MetricCard
          label="Produtos ativos"
          value={activeProductsCount.count ?? 0}
          helper="Produtos visiveis na loja"
          href="/admin/produtos?status=active"
        />
        <MetricCard
          label="Total de produtos"
          value={productsCount.count ?? 0}
          helper="Inclui ativos, rascunhos e arquivados"
          href="/admin/produtos"
        />
        <MetricCard
          label="Estoque baixo"
          value={lowStockCount.count ?? 0}
          helper="Produtos ativos com 3 unidades ou menos"
          href="/admin/produtos?status=active"
          tone={(lowStockCount.count ?? 0) > 0 ? "warning" : "neutral"}
        />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <QuickAction
          title="Cadastrar produto"
          text="Crie produto, preco, estoque, categoria e medidas para frete."
          href="/admin/produtos/novo"
          cta="Criar agora"
        />
        <QuickAction
          title="Acompanhar pedidos"
          text="Veja status, pagamento, endereco, itens e codigo de rastreio."
          href="/admin/pedidos"
          cta="Ver pedidos"
        />
        <QuickAction
          title="Aprender o painel"
          text="Abra o guia interno com o passo a passo para apresentar para a cliente."
          href="/admin/guia"
          cta="Abrir guia"
        />
      </section>
    </div>
  );
}

function MetricCard({
  label,
  value,
  helper,
  href,
  tone = "neutral",
}: {
  label: string;
  value: string | number;
  helper: string;
  href?: string;
  tone?: "neutral" | "dark" | "success" | "warning";
}) {
  const toneClass =
    tone === "dark"
      ? "border-ink bg-ink text-cream-soft"
      : tone === "success"
      ? "border-sage-deep bg-sage-soft/70 text-ink"
      : tone === "warning"
      ? "border-coral bg-coral-soft/70 text-ink"
      : "border-cream-deep bg-cream-soft text-ink";

  const body = (
    <div className={`min-h-[168px] rounded-[8px] border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${toneClass}`}>
      <p className={`text-xs font-extrabold uppercase tracking-[0.16em] ${tone === "dark" ? "text-coral" : "text-sage-deep"}`}>
        {label}
      </p>
      <p className={`mt-4 font-display text-5xl leading-none tabular-nums ${tone === "dark" ? "text-cream-soft" : "text-ink"}`}>
        {value}
      </p>
      <p className={`mt-4 text-sm leading-relaxed ${tone === "dark" ? "text-cream-deep" : "text-ink-soft"}`}>
        {helper}
      </p>
    </div>
  );

  return href ? <Link href={href}>{body}</Link> : body;
}

function QuickAction({
  title,
  text,
  href,
  cta,
}: {
  title: string;
  text: string;
  href: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-[8px] border border-cream-deep bg-cream-soft p-5 shadow-sm transition hover:border-coral hover:shadow-lg"
    >
      <p className="font-display text-2xl text-ink">{title}</p>
      <p className="mt-2 min-h-[48px] text-sm leading-relaxed text-ink-soft">{text}</p>
      <span className="mt-5 inline-flex rounded-full bg-ink px-4 py-2 text-sm font-semibold text-cream-soft transition group-hover:bg-coral group-hover:text-ink">
        {cta}
      </span>
    </Link>
  );
}

function startOfMonthIso() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
}
