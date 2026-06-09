import Link from "next/link";
import { signIn } from "./actions";

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; from?: string }>;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-50">
      <form
        action={signIn}
        className="w-full max-w-sm rounded-lg border bg-white p-8 shadow-sm space-y-5"
      >
        <div>
          <h1 className="text-2xl font-light">Entrar</h1>
          <p className="text-sm text-neutral-500">Luperfumes</p>
        </div>

        <LoginError searchParams={searchParams} />

        <label className="block">
          <span className="text-sm text-neutral-700">E-mail</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
          />
        </label>

        <label className="block">
          <span className="text-sm text-neutral-700">Senha</span>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
          />
        </label>

        <button
          type="submit"
          className="w-full rounded-md bg-neutral-900 py-2 text-sm text-white hover:bg-neutral-700"
        >
          Entrar
        </button>

        <div className="pt-4 text-sm text-neutral-600 space-y-1 border-t">
          <Link href="/cadastro" className="block hover:underline">
            Criar conta
          </Link>
          <Link href="/recuperar-senha" className="block hover:underline">
            Esqueci minha senha
          </Link>
        </div>
      </form>
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
    <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
      {error === "invalid"
        ? "E-mail ou senha incorretos."
        : error === "not_confirmed"
        ? "Confirme seu e-mail antes de entrar."
        : "Não foi possível entrar. Tente de novo."}
    </div>
  );
}
