import Link from "next/link";
import { requestPasswordReset } from "./actions";

export const metadata = { title: "Recuperar senha" };

export default function RecuperarSenhaPage({
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
          action={requestPasswordReset}
          className="rounded-3xl border border-cream-deep bg-cream p-8 shadow-[0_1px_2px_rgba(45,41,36,0.04)] space-y-5"
        >
          <div className="text-center">
            <h1 className="font-display text-3xl text-ink">Recuperar senha</h1>
            <p className="text-sm text-ink-soft mt-1">
              Mandamos um link no seu e-mail pra você criar uma nova.
            </p>
          </div>

          <Feedback searchParams={searchParams} />

          <label className="block">
            <span className="text-xs font-medium uppercase tracking-widest text-sage-deep">
              E-mail cadastrado
            </span>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-1.5 block w-full rounded-full border border-cream-deep bg-cream-soft px-4 py-2.5 text-sm focus:border-coral focus:outline-none transition"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-full bg-coral py-3 text-sm font-medium text-white hover:bg-coral-deep transition"
          >
            Enviar link
          </button>

          <p className="pt-4 border-t border-cream-deep text-sm text-ink-soft text-center">
            Lembrou a senha?{" "}
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

async function Feedback({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; sent?: string }>;
}) {
  const { error, sent } = await searchParams;
  if (sent) {
    return (
      <div className="rounded-2xl bg-sage-soft/60 border border-sage-soft px-4 py-2.5 text-sm text-ink">
        ✓ Se este e-mail existe na nossa loja, você vai receber o link em alguns segundos.
        Olha também a caixa de spam.
      </div>
    );
  }
  if (error === "missing") {
    return (
      <div className="rounded-2xl bg-coral-soft/50 border border-coral-soft px-4 py-2.5 text-sm text-coral-deep">
        Preencha o e-mail pra continuar.
      </div>
    );
  }
  return null;
}
