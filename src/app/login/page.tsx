import Link from "next/link";
import { resendLoginConfirmation, signIn } from "./actions";

export const metadata = { title: "Entrar" };

type LoginSearchParams = {
  error?: string;
  from?: string;
  email?: string;
  resent?: string;
  confirmed?: string;
  created?: string;
  reset?: string;
  welcome?: string;
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<LoginSearchParams>;
}) {
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-cream-soft px-5 py-10 sm:px-6">
      <div className="mx-auto grid w-full max-w-5xl items-center gap-8 lg:grid-cols-[1fr_0.95fr]">
        <section className="hidden rounded-[8px] border border-cream-deep bg-cream p-8 lg:block">
          <p className="text-xs uppercase tracking-widest text-sage-deep">area da cliente</p>
          <h1 className="mt-4 font-display text-5xl leading-tight text-ink">
            Acompanhe seus aromas favoritos com tranquilidade.
          </h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-ink-soft">
            Entre para ver pedidos, acessar dados de entrega e continuar sua experiencia
            na curadoria Perfumes de Ambiente Decor.
          </p>
          <div className="mt-8 rounded-[8px] bg-cream-soft p-5">
            <p className="font-display text-2xl text-ink">Primeiro acesso?</p>
            <p className="mt-1 text-sm text-ink-soft">
              Crie uma conta e confirme o link enviado por e-mail antes de entrar.
            </p>
            <Link
              href="/cadastro"
              className="mt-4 inline-flex rounded-full bg-coral px-5 py-2.5 text-sm font-medium text-white hover:bg-coral-deep transition"
            >
              Criar conta
            </Link>
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
            action={signIn}
            className="rounded-[8px] border border-cream-deep bg-cream p-6 shadow-[0_14px_40px_rgba(45,41,36,0.07)] sm:p-8"
          >
            <div className="text-center">
              <p className="text-xs uppercase tracking-widest text-sage-deep">login</p>
              <h2 className="mt-2 font-display text-4xl text-ink">Bem-vinda de volta</h2>
              <p className="mt-1 text-sm text-ink-soft">Entre para acompanhar seus pedidos.</p>
            </div>

            <LoginFeedback params={params} />

            {params.from && <input type="hidden" name="from" value={params.from} />}

            <div className="mt-6 space-y-5">
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
                  autoComplete="current-password"
                  className="mt-1.5 block w-full rounded-full border border-cream-deep bg-cream-soft px-4 py-3 text-sm focus:border-coral focus:outline-none transition"
                />
              </label>
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-full bg-coral px-5 py-3 text-sm font-medium text-white hover:bg-coral-deep transition"
            >
              Entrar
            </button>

            <div className="mt-6 border-t border-cream-deep pt-5 text-center text-sm text-ink-soft space-y-2">
              <Link href="/cadastro" className="block hover:text-coral-deep transition">
                Ainda nao tenho conta - <span className="text-coral-deep">criar agora</span>
              </Link>
              <Link href="/recuperar-senha" className="block text-xs hover:text-coral-deep transition">
                Esqueci minha senha
              </Link>
            </div>
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

function LoginFeedback({ params }: { params: LoginSearchParams }) {
  const success = successMessage(params);
  if (success) {
    return (
      <div className="mt-6 rounded-[8px] border border-sage-soft bg-sage-soft/40 px-4 py-3 text-sm text-sage-deep">
        {success}
      </div>
    );
  }

  if (!params.error) return null;

  const notConfirmed = params.error === "not_confirmed";

  return (
    <div className="mt-6 rounded-[8px] border border-coral-soft bg-coral-soft/45 p-4 text-sm text-coral-deep">
      <p>{loginErrorLabel(params.error)}</p>
      {notConfirmed && params.email && (
        <form action={resendLoginConfirmation} className="mt-4">
          <input type="hidden" name="email" value={params.email} />
          {params.from && <input type="hidden" name="from" value={params.from} />}
          <button
            type="submit"
            className="rounded-full border border-coral px-4 py-2 text-xs font-medium uppercase tracking-widest text-coral-deep hover:bg-coral hover:text-white transition"
          >
            Reenviar confirmacao
          </button>
          {params.resent === "1" && (
            <p className="mt-2 text-xs text-sage-deep">Novo e-mail de confirmacao enviado.</p>
          )}
          {params.resent === "rate" && (
            <p className="mt-2 text-xs text-coral-deep">Aguarde alguns segundos antes de reenviar.</p>
          )}
          {params.resent === "error" && (
            <p className="mt-2 text-xs text-coral-deep">Nao conseguimos reenviar agora.</p>
          )}
        </form>
      )}
    </div>
  );
}

function successMessage(params: LoginSearchParams) {
  if (params.confirmed) return "E-mail confirmado. Agora voce ja pode entrar.";
  if (params.created) return "Conta criada. Entre para continuar.";
  if (params.reset) return "Senha atualizada. Entre com a nova senha.";
  if (params.welcome) return "Conta criada com sucesso.";
  return null;
}

function loginErrorLabel(error: string) {
  if (error === "invalid") return "E-mail ou senha incorretos.";
  if (error === "not_confirmed") {
    return "Confirme seu e-mail antes de entrar. Se nao encontrou a mensagem, reenvie o link.";
  }
  if (error === "expired") return "Esse link expirou. Solicite um novo acesso.";
  if (error === "callback") return "Nao foi possivel confirmar o acesso. Tente novamente.";
  return "Nao foi possivel entrar. Tente de novo.";
}
