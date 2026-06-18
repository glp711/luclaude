import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/guards";
import { formatBRL } from "@/lib/money";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Minha conta",
  robots: { index: false, follow: false },
};

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

export default async function MinhaContaPage({
  searchParams,
}: {
  searchParams: Promise<{ confirmed?: string; welcome?: string }>;
}) {
  const params = await searchParams;
  const user = await getCurrentUser();
  if (!user) redirect("/login?from=/minha-conta");

  const supabase = await createSupabaseServerClient();
  const [{ data: profile }, { data: orders }] = await Promise.all([
    supabase.from("profiles").select("full_name, phone").eq("id", user.id).maybeSingle(),
    supabase
      .from("orders")
      .select("id, order_number, status, total_cents, created_at, tracking_code")
      .eq("customer_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const firstName = (profile?.full_name ?? user.email ?? "").split(" ")[0] || "Voce";

  return (
    <main>
      <section className="bg-cream-soft border-b border-cream-deep/60">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <nav className="mb-3 flex items-center gap-2 text-xs text-ink-mute" aria-label="breadcrumb">
            <Link href="/" className="hover:text-coral-deep transition">Inicio</Link>
            <span>/</span>
            <span className="text-ink-soft">Minha conta</span>
          </nav>
          <h1 className="font-display text-5xl text-ink">
            Ola, <em className="text-coral-deep not-italic">{firstName}</em>.
          </h1>
          <p className="mt-2 text-ink-soft">
            Aqui voce acompanha pedidos e consulta seus dados.
          </p>
          {(params.confirmed || params.welcome) && (
            <div className="mt-5 rounded-[8px] border border-sage-soft bg-sage-soft/45 px-4 py-3 text-sm text-sage-deep">
              {params.confirmed
                ? "E-mail confirmado com sucesso. Sua conta ja esta ativa."
                : "Conta criada com sucesso. Seja bem-vinda."}
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-6 py-10 md:grid-cols-[1fr_280px]">
        <div className="space-y-6">
          <section className="rounded-[8px] border border-cream-deep bg-cream-soft p-6">
            <h2 className="mb-4 font-display text-2xl text-ink">Pedidos recentes</h2>
            {!orders || orders.length === 0 ? (
              <div className="rounded-[8px] border border-dashed border-cream-deep bg-cream p-8 text-center">
                <p className="font-display text-lg text-ink">Voce ainda nao tem pedidos</p>
                <p className="mt-1 text-sm text-ink-soft">
                  Que tal comecar pelo nosso catalogo?
                </p>
                <Link
                  href="/produtos"
                  className="mt-4 inline-block rounded-full bg-coral px-6 py-2.5 text-sm font-medium text-white hover:bg-coral-deep transition"
                >
                  Ver catalogo
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-cream-deep">
                {orders.map((order) => (
                  <li key={order.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
                    <div className="space-y-1">
                      <div className="font-mono text-sm text-ink">#{order.order_number}</div>
                      <div className="text-xs text-ink-mute">
                        {new Date(order.created_at).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                      {order.tracking_code && (
                        <div className="text-xs text-coral-deep">
                          Rastreio: <span className="font-mono">{order.tracking_code}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider ${
                          STATUS_STYLE[order.status] ?? "bg-cream-deep text-ink-soft"
                        }`}
                      >
                        {STATUS_LABEL[order.status] ?? order.status}
                      </span>
                      <span className="font-display text-xl tabular-nums text-coral-deep">
                        {formatBRL(order.total_cents)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="h-fit space-y-4">
          <section className="rounded-[8px] border border-cream-deep bg-cream-soft p-6">
            <h2 className="mb-3 font-display text-xl text-ink">Meus dados</h2>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-widest text-sage-deep">Nome</dt>
                <dd className="text-ink">{profile?.full_name ?? "-"}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest text-sage-deep">E-mail</dt>
                <dd className="break-all text-ink">{user.email}</dd>
              </div>
              {profile?.phone && (
                <div>
                  <dt className="text-xs uppercase tracking-widest text-sage-deep">Telefone</dt>
                  <dd className="text-ink">{profile.phone}</dd>
                </div>
              )}
            </dl>
          </section>

          <form action="/logout" method="post">
            <button
              type="submit"
              className="w-full rounded-full border border-cream-deep px-5 py-2.5 text-sm text-ink-soft hover:border-coral hover:text-coral-deep transition"
            >
              Sair
            </button>
          </form>
        </aside>
      </div>
    </main>
  );
}
