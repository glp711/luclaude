import Link from "next/link";
import { resendConfirmation, signUp } from "./actions";

export const metadata = {
  title: "Criar conta",
  robots: { index: false, follow: false },
};

type SignUpSearchParams = {
  error?: string;
  sent?: string;
  email?: string;
  resend?: string;
};

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<SignUpSearchParams>;
}) {
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-cream-soft px-5 py-10 sm:px-6">
      <div className="mx-auto grid w-full max-w-5xl items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="hidden rounded-[8px] border border-cream-deep bg-cream p-8 lg:block">
          <p className="text-xs uppercase tracking-widest text-sage-deep">sua conta</p>
          <h1 className="mt-4 font-display text-5xl leading-tight text-ink">
            Uma experiencia mais pessoal na curadoria.
          </h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-ink-soft">
            Crie sua conta para acompanhar pedidos, guardar seus dados com seguranca e
            receber a confirmacao da compra com mais clareza.
          </p>
          <div className="mt-8 grid gap-3 text-sm text-ink-soft">
            <p className="rounded-full bg-cream-soft px-4 py-3">Confirmacao por e-mail</p>
            <p className="rounded-full bg-cream-soft px-4 py-3">Historico de pedidos</p>
            <p className="rounded-full bg-cream-soft px-4 py-3">Checkout mais rapido</p>
          </div>
        </section>

        <div className="w-full">
          <Link href="/" className="mb-7 flex items-center justify-center gap-3 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-mark.svg" alt="" className="h-12 w-12 transition group-hover:-rotate-3" />
            <span className="font-display text-3xl tracking-tight text-ink">
              perfumes de ambiente <span className="text-coral-deep">decor</span>
            </span>
          </Link>

          <form
            action={signUp}
            className="rounded-[8px] border border-cream-deep bg-cream p-6 shadow-[0_14px_40px_rgba(45,41,36,0.07)] sm:p-8"
          >
            <div className="text-center">
              <p className="text-xs uppercase tracking-widest text-sage-deep">cadastro</p>
              <h2 className="mt-2 font-display text-4xl text-ink">Criar conta</h2>
              <p className="mt-1 text-sm text-ink-soft">
                Depois de criar, confirme o e-mail para liberar o acesso.
              </p>
            </div>

            <SignUpFeedback params={params} />

            <div className="mt-6 space-y-5">
              <label className="block">
                <span className="text-xs font-medium uppercase tracking-widest text-sage-deep">
                  Nome completo
                </span>
                <input
                  name="full_name"
                  type="text"
                  required
                  autoComplete="name"
                  className="mt-1.5 block w-full rounded-full border border-cream-deep bg-cream-soft px-4 py-3 text-sm focus:border-coral focus:outline-none transition"
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
                  defaultValue={params.email ?? ""}
                  autoComplete="email"
                  className="mt-1.5 block w-full rounded-full border border-cream-deep bg-cream-soft px-4 py-3 text-sm focus:border-coral focus:outline-none transition"
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
                  className="mt-1.5 block w-full rounded-full border border-cream-deep bg-cream-soft px-4 py-3 text-sm focus:border-coral focus:outline-none transition"
                />
                <span className="mt-1.5 block text-xs text-ink-mute">Minimo de 8 caracteres.</span>
              </label>
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-full bg-coral px-5 py-3 text-sm font-medium text-white hover:bg-coral-deep transition"
            >
              Criar conta
            </button>

            <p className="mt-6 border-t border-cream-deep pt-5 text-center text-sm text-ink-soft">
              Ja tem conta?{" "}
              <Link href="/login" className="text-coral-deep hover:underline underline-offset-4">
                Entrar
              </Link>
            </p>
          </form>

          <Link
            href="/"
            className="mt-6 block text-center text-xs text-ink-mute hover:text-coral-deep transition"
          >
            Voltar para a loja
          </Link>
        </div>
      </div>
    </main>
  );
}

function SignUpFeedback({ params }: { params: SignUpSearchParams }) {
  if (params.sent) {
    return (
      <div className="mt-6 rounded-[8px] border border-sage-soft bg-sage-soft/40 p-4 text-sm text-ink">
        <p className="font-medium text-sage-deep">Conta criada. Confirme seu e-mail.</p>
        <p className="mt-1 text-ink-soft">
          Enviamos o link de confirmacao{params.email ? ` para ${params.email}` : ""}.
          Ao clicar no botao do e-mail, voce volta para a area da cliente no site.
          Confira tambem as abas de spam, promocoes ou lixo eletronico.
        </p>
        {params.resend === "1" && (
          <p className="mt-2 rounded-full bg-cream px-3 py-2 text-xs text-sage-deep">
            Novo e-mail de confirmacao enviado.
          </p>
        )}
        {params.resend === "rate" && (
          <p className="mt-2 rounded-full bg-cream px-3 py-2 text-xs text-coral-deep">
            Aguarde alguns segundos antes de tentar reenviar.
          </p>
        )}
        {params.resend === "error" && (
          <p className="mt-2 rounded-full bg-cream px-3 py-2 text-xs text-coral-deep">
            Nao conseguimos reenviar agora. Tente novamente em instantes.
          </p>
        )}
        {params.email && (
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href={`/login?email=${encodeURIComponent(params.email)}`}
              className="rounded-full bg-sage px-4 py-2 text-xs font-medium uppercase tracking-widest text-white transition hover:bg-sage-deep"
            >
              Ja confirmei, entrar
            </Link>
            <form action={resendConfirmation}>
              <input type="hidden" name="email" value={params.email} />
              <button
                type="submit"
                className="rounded-full border border-sage px-4 py-2 text-xs font-medium uppercase tracking-widest text-sage-deep hover:bg-sage-soft transition"
              >
                Reenviar confirmacao
              </button>
            </form>
          </div>
        )}
      </div>
    );
  }

  if (!params.error) return null;

  return (
    <div className="mt-6 rounded-[8px] border border-coral-soft bg-coral-soft/45 px-4 py-3 text-sm text-coral-deep">
      {signUpErrorLabel(params.error)}
    </div>
  );
}

function signUpErrorLabel(error: string) {
  if (error === "exists") return "Este e-mail ja esta cadastrado. Tente entrar ou recupere a senha.";
  if (error === "weak") return "A senha precisa ter pelo menos 8 caracteres.";
  if (error === "invalid_email") return "Confira se o e-mail foi digitado corretamente.";
  if (error === "rate") return "Muitas tentativas seguidas. Aguarde um pouco e tente novamente.";
  if (error === "missing") return "Preencha nome, e-mail e senha para criar a conta.";
  return "Nao foi possivel criar a conta agora. Tente novamente.";
}
