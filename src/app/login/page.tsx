import Link from "next/link";
import { signIn } from "./actions";

export const metadata = { title: "Entrar" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; from?: string }>;
}) {
  const { from } = await searchParams;
  return (
    <main className="min-h-screen flex items-center justify-center bg-cream-soft px-6 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-3 mb-8 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-mark.svg" alt="" className="h-12 w-12 transition group-hover:-rotate-3" />
          <span className="font-display text-3xl tracking-tight text-ink">
            Lu<span className="text-coral-deep">perfumes</span>
          </span>
        </Link>

        <form
          action={signIn}
          className="rounded-3xl border border-cream-deep bg-cream p-8 shadow-[0_1px_2px_rgba(45,41,36,0.04)] space-y-5"
        >
          <div className="text-center">
            <h1 className="font-display text-3xl text-ink">Bem-vinda de volta</h1>
            <p className="text-sm text-ink-soft mt-1">Entre para acompanhar seus pedidos.</p>
          </div>

          <LoginError searchParams={searchParams} />

          {from && <input type="hidden" name="from" value={from} />}

          <label className="block">
            <span className="text-xs font-medium uppercase tracking-widest text-sage-deep">
              E-mail
            </span>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-1.5 block w-full rounded-full border border-cream-deep bg-cream-soft px-4 py-2.5 text-sm focus:border-coral focus:outline-none transition"
            />
          </label>

          <label className="block">
            <span className="text-xs font-medium uppercase tracking-widest text-sage-deep">
              Senha
            </span>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-1.5 block w-full rounded-full border border-cream-deep bg-cream-soft px-4 py-2.5 text-sm focus:border-coral focus:outline-none transition"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-full bg-coral py-3 text-sm font-medium text-white hover:bg-coral-deep transition"
          >
            Entrar
          </button>

          <div className="pt-4 border-t border-cream-deep text-sm text-ink-soft text-center space-y-1.5">
            <Link href="/cadastro" className="block hover:text-coral-deep transition">
              Ainda não tenho conta — <span className="text-coral-deep">criar agora</span>
            </Link>
            <Link href="/recuperar-senha" className="block hover:text-coral-deep transition text-xs">
              Esqueci minha senha
            </Link>
          </div>
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

async function LoginError({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  if (!error) return null;
  return (
    <div className="rounded-2xl bg-coral-soft/50 border border-coral-soft px-4 py-2.5 text-sm text-coral-deep">
      {error === "invalid"
        ? "E-mail ou senha incorretos."
        : error === "not_confirmed"
        ? "Confirme seu e-mail antes de entrar."
        : "Não foi possível entrar. Tente de novo."}
    </div>
  );
}
