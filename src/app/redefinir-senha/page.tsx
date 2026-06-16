import Link from "next/link";
import { updatePassword } from "./actions";

export const metadata = { title: "Redefinir senha" };

export default function RedefinirSenhaPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-cream-soft px-6 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-3 mb-8 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-mark.svg" alt="" className="h-12 w-12 transition group-hover:-rotate-3" />
          <span className="font-display text-3xl tracking-tight text-ink">
            perfumes de ambiente <span className="text-coral-deep">decor</span>
          </span>
        </Link>

        <form
          action={updatePassword}
          className="rounded-3xl border border-cream-deep bg-cream p-8 shadow-[0_1px_2px_rgba(45,41,36,0.04)] space-y-5"
        >
          <div className="text-center">
            <h1 className="font-display text-3xl text-ink">Nova senha</h1>
            <p className="text-sm text-ink-soft mt-1">
              Escolha uma senha com pelo menos 8 caracteres.
            </p>
          </div>

          <Feedback searchParams={searchParams} />

          <label className="block">
            <span className="text-xs font-medium uppercase tracking-widest text-sage-deep">
              Nova senha
            </span>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="mt-1.5 block w-full rounded-full border border-cream-deep bg-cream-soft px-4 py-2.5 text-sm focus:border-coral focus:outline-none transition"
            />
          </label>

          <label className="block">
            <span className="text-xs font-medium uppercase tracking-widest text-sage-deep">
              Confirme a senha
            </span>
            <input
              name="confirm"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="mt-1.5 block w-full rounded-full border border-cream-deep bg-cream-soft px-4 py-2.5 text-sm focus:border-coral focus:outline-none transition"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-full bg-coral py-3 text-sm font-medium text-white hover:bg-coral-deep transition"
          >
            Salvar nova senha
          </button>
        </form>

        <Link
          href="/"
          className="mt-6 block text-center text-xs text-ink-mute hover:text-coral-deep transition"
        >
          ← Voltar pra loja
        </Link>
      </div>
    </main>
  );
}

async function Feedback({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  if (!error) return null;
  const msg =
    error === "weak"
      ? "Senha muito curta — use pelo menos 8 caracteres."
      : error === "mismatch"
      ? "As senhas não conferem."
      : error === "failed"
      ? "Não foi possível salvar. Tente o link de novo."
      : "Algo deu errado.";
  return (
    <div className="rounded-2xl bg-coral-soft/50 border border-coral-soft px-4 py-2.5 text-sm text-coral-deep">
      {msg}
    </div>
  );
}
