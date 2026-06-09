import Link from "next/link";
import { signUp } from "./actions";

export default function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; sent?: string }>;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-50">
      <form
        action={signUp}
        className="w-full max-w-sm rounded-lg border bg-white p-8 shadow-sm space-y-5"
      >
        <div>
          <h1 className="text-2xl font-light">Criar conta</h1>
          <p className="text-sm text-neutral-500">Luperfumes</p>
        </div>

        <SignUpFeedback searchParams={searchParams} />

        <label className="block">
          <span className="text-sm text-neutral-700">Nome completo</span>
          <input
            name="full_name"
            type="text"
            required
            autoComplete="name"
            className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
          />
        </label>

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
          <span className="text-sm text-neutral-700">Senha (mín. 8 chars)</span>
          <input
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
          />
        </label>

        <button
          type="submit"
          className="w-full rounded-md bg-neutral-900 py-2 text-sm text-white hover:bg-neutral-700"
        >
          Criar conta
        </button>

        <p className="pt-4 text-sm text-neutral-600 border-t">
          Já tem conta?{" "}
          <Link href="/login" className="text-neutral-900 hover:underline">
            Entrar
          </Link>
        </p>
      </form>
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
      <div className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-800">
        Conta criada. Confirme seu e-mail para entrar.
      </div>
    );
  }
  if (error) {
    return (
      <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
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
