import Link from "next/link";
import { signUp } from "./actions";

export const metadata = { title: "Criar conta" };

export default function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; sent?: string }>;
}) {
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
          action={signUp}
          className="rounded-3xl border border-cream-deep bg-cream p-8 shadow-[0_1px_2px_rgba(45,41,36,0.04)] space-y-5"
        >
          <div className="text-center">
            <h1 className="font-display text-3xl text-ink">Criar conta</h1>
            <p className="text-sm text-ink-soft mt-1">É rapidinho. Pode preparar uma xícara de café.</p>
          </div>

          <SignUpFeedback searchParams={searchParams} />

          <label className="block">
            <span className="text-xs font-medium uppercase tracking-widest text-sage-deep">
              Nome completo
            </span>
            <input
              name="full_name"
              type="text"
              required
              autoComplete="name"
              className="mt-1.5 block w-full rounded-full border border-cream-deep bg-cream-soft px-4 py-2.5 text-sm focus:border-coral focus:outline-none transition"
            />
          </label>

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
              minLength={8}
              autoComplete="new-password"
              className="mt-1.5 block w-full rounded-full border border-cream-deep bg-cream-soft px-4 py-2.5 text-sm focus:border-coral focus:outline-none transition"
            />
            <span className="mt-1 block text-xs text-ink-mute">Mínimo 8 caracteres.</span>
          </label>

          <button
            type="submit"
            className="w-full rounded-full bg-coral py-3 text-sm font-medium text-white hover:bg-coral-deep transition"
          >
            Criar conta
          </button>

          <p className="pt-4 border-t border-cream-deep text-sm text-ink-soft text-center">
            Já tem conta?{" "}
            <Link href="/login" className="text-coral-deep hover:underline underline-offset-4">
              Entrar
            </Link>
          </p>
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

async function SignUpFeedback({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; sent?: string }>;
}) {
  const { error, sent } = await searchParams;
  if (sent) {
    return (
      <div className="rounded-2xl bg-sage-soft/60 border border-sage-soft px-4 py-2.5 text-sm text-ink">
        ✓ Conta criada. Confirme seu e-mail para entrar.
      </div>
    );
  }
  if (error) {
    return (
      <div className="rounded-2xl bg-coral-soft/50 border border-coral-soft px-4 py-2.5 text-sm text-coral-deep">
        {error === "exists"
          ? "Este e-mail já está cadastrado."
          : error === "weak"
          ? "Senha muito fraca."
          : "Não foi possível criar a conta."}
      </div>
    );
  }
  return null;
}
