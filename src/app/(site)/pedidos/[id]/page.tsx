import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/guards";
import { formatBRL } from "@/lib/money";

export const metadata = {
  title: "Seu pedido",
  robots: { index: false, follow: false },
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Aguardando pagamento",
  paid: "Pagamento confirmado",
  preparing: "Em preparação",
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

type OrderRow = {
  id: string;
  order_number: number;
  status: string;
  total_cents: number;
  subtotal_cents: number;
  shipping_cents: number;
  customer_id: string | null;
  guest_email: string | null;
  tracking_code: string | null;
  created_at: string;
  paid_at: string | null;
};

export default async function OrderPublicPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ok?: string; pending?: string }>;
}) {
  const { id } = await params;
  const { ok, pending } = await searchParams;

  // Usa admin client pra ler pedido (precisa funcionar pra guest também)
  const admin = createSupabaseAdminClient();
  const { data: order } = await admin
    .from("orders")
    .select(
      "id, order_number, status, total_cents, subtotal_cents, shipping_cents, customer_id, guest_email, tracking_code, created_at, paid_at"
    )
    .eq("id", id)
    .single<OrderRow>();

  if (!order) notFound();

  // Autorização: cliente logado precisa ser dono OU pedido precisa ser guest
  // (guest pode ser visto via link direto — não vamos exigir token agora)
  const user = await getCurrentUser();
  if (order.customer_id && order.customer_id !== user?.id && user?.role !== "admin") {
    notFound();
  }

  const banner = ok
    ? { tone: "sage", title: "Obrigada pela compra! 💚", text: "Estamos confirmando seu pagamento. Você vai receber um e-mail assim que tudo for processado." }
    : pending
    ? { tone: "coral", title: "Pagamento pendente", text: "Conclua o pagamento pra que possamos preparar seu pedido. Se já pagou, em alguns minutos atualizamos por aqui." }
    : null;

  return (
    <main>
      <section className="bg-cream-soft border-b border-cream-deep/60">
        <div className="mx-auto max-w-3xl px-6 py-10">
          <nav className="text-xs text-ink-mute mb-3 flex items-center gap-2" aria-label="breadcrumb">
            <Link href="/" className="hover:text-coral-deep transition">Início</Link>
            <span>/</span>
            <span className="text-ink-soft">Pedido #{order.order_number}</span>
          </nav>
          <h1 className="font-display text-5xl text-ink">Pedido #{order.order_number}</h1>
          <p className="mt-2 text-sm text-ink-mute">
            Criado em {new Date(order.created_at).toLocaleString("pt-BR")}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 py-10 space-y-6">
        {banner && (
          <div
            className={`rounded-3xl border p-6 text-center ${
              banner.tone === "sage"
                ? "bg-sage-soft/50 border-sage-soft"
                : "bg-coral-soft/50 border-coral-soft"
            }`}
          >
            <p className="font-display text-2xl text-ink">{banner.title}</p>
            <p className="mt-2 text-sm text-ink-soft max-w-md mx-auto">{banner.text}</p>
          </div>
        )}

        <section className="rounded-2xl border border-cream-deep bg-cream-soft p-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="font-display text-2xl text-ink">Status</h2>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wider ${STATUS_STYLE[order.status] ?? "bg-cream-deep text-ink-soft"}`}
            >
              {STATUS_LABEL[order.status] ?? order.status}
            </span>
          </div>
          {order.tracking_code && (
            <p className="mt-4 text-sm">
              Rastreio:{" "}
              <span className="font-mono bg-cream rounded-full px-2.5 py-0.5">
                {order.tracking_code}
              </span>
            </p>
          )}
          {order.paid_at && (
            <p className="mt-2 text-xs text-ink-mute">
              Pago em {new Date(order.paid_at).toLocaleString("pt-BR")}
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-cream-deep bg-cream-soft p-6">
          <h2 className="font-display text-2xl text-ink mb-3">Resumo financeiro</h2>
          <dl className="text-sm space-y-1.5">
            <div className="flex justify-between">
              <dt className="text-ink-soft">Subtotal</dt>
              <dd className="tabular-nums">{formatBRL(order.subtotal_cents)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-soft">Frete</dt>
              <dd className="tabular-nums">{formatBRL(order.shipping_cents)}</dd>
            </div>
            <div className="pt-2 border-t border-cream-deep flex justify-between items-baseline">
              <dt className="font-display text-lg text-ink">Total</dt>
              <dd className="font-display text-2xl text-coral-deep tabular-nums">
                {formatBRL(order.total_cents)}
              </dd>
            </div>
          </dl>
        </section>

        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center pt-2">
          {user ? (
            <Link
              href="/minha-conta"
              className="rounded-full bg-coral px-7 py-3 text-sm font-medium text-white hover:bg-coral-deep transition"
            >
              Meus pedidos
            </Link>
          ) : (
            <Link
              href="/produtos"
              className="rounded-full bg-coral px-7 py-3 text-sm font-medium text-white hover:bg-coral-deep transition"
            >
              Continuar comprando
            </Link>
          )}
          <Link
            href="/"
            className="text-sm text-ink-soft hover:text-coral-deep transition"
          >
            Voltar pra home
          </Link>
        </div>
      </div>
    </main>
  );
}
