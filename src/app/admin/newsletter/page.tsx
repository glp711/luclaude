import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = { title: "Newsletter · Admin" };

type Sub = {
  id: string;
  email: string;
  source: string | null;
  subscribed_at: string;
  unsubscribed_at: string | null;
  confirmed: boolean;
};

export default async function NewsletterPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  const onlyActive = filter !== "all";

  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("newsletter_subscriptions")
    .select("id, email, source, subscribed_at, unsubscribed_at, confirmed", { count: "exact" })
    .order("subscribed_at", { ascending: false })
    .limit(200);

  if (onlyActive) query = query.is("unsubscribed_at", null);

  const { data: subs, count, error } = await query.returns<Sub[]>();

  return (
    <div className="space-y-6">
      <nav className="text-xs text-ink-mute flex items-center gap-2" aria-label="breadcrumb">
        <Link href="/admin" className="hover:text-coral-deep transition">Admin</Link>
        <span>/</span>
        <span className="text-ink-soft">Newsletter</span>
      </nav>

      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl text-ink">Newsletter</h1>
          <p className="text-sm text-ink-soft mt-0.5">
            {count != null ? `${count} ${onlyActive ? "ativos" : "no total"}` : "—"}
          </p>
        </div>
        <div className="flex gap-2 text-xs">
          <Link
            href="/admin/newsletter"
            className={`rounded-full px-3 py-1.5 transition ${
              onlyActive
                ? "bg-ink text-cream-soft"
                : "bg-cream-soft border border-cream-deep text-ink-soft hover:border-coral"
            }`}
          >
            Ativos
          </Link>
          <Link
            href="/admin/newsletter?filter=all"
            className={`rounded-full px-3 py-1.5 transition ${
              !onlyActive
                ? "bg-ink text-cream-soft"
                : "bg-cream-soft border border-cream-deep text-ink-soft hover:border-coral"
            }`}
          >
            Todos
          </Link>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl bg-coral-soft/50 border border-coral-soft px-4 py-3 text-sm text-coral-deep">
          Erro: {error.message}.{" "}
          <span className="text-ink-soft">
            (Rodou a migration 0002_newsletter.sql no Supabase?)
          </span>
        </div>
      ) : !subs || subs.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-cream-deep bg-cream-soft p-12 text-center text-ink-soft">
          Sem inscritos ainda. Eles aparecem aqui assim que alguém cadastrar pelo
          formulário no rodapé do site.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-cream-deep bg-cream-soft">
          <table className="min-w-full divide-y divide-cream-deep text-sm">
            <thead className="bg-cream text-sage-deep">
              <tr>
                <Th>E-mail</Th>
                <Th>Origem</Th>
                <Th>Inscrito em</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-deep/50">
              {subs.map((s) => (
                <tr key={s.id} className="hover:bg-coral-soft/20 transition">
                  <Td className="font-mono text-xs text-ink">{s.email}</Td>
                  <Td className="text-xs text-ink-mute">{s.source ?? "—"}</Td>
                  <Td className="text-xs text-ink-mute">
                    {new Date(s.subscribed_at).toLocaleDateString("pt-BR")}
                  </Td>
                  <Td>
                    {s.unsubscribed_at ? (
                      <span className="rounded-full bg-coral-soft/40 text-ink-mute px-2.5 py-0.5 text-xs uppercase tracking-wider">
                        Descadastrado
                      </span>
                    ) : (
                      <span className="rounded-full bg-sage-soft text-ink px-2.5 py-0.5 text-xs uppercase tracking-wider">
                        Ativo
                      </span>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
          {count != null && count > 200 && (
            <div className="border-t border-cream-deep p-3 text-center text-xs text-ink-mute">
              Mostrando os 200 mais recentes — total {count}.
            </div>
          )}
        </div>
      )}
    </div>
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
