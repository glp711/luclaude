import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-cream-soft px-6 py-12">
      <div className="text-center max-w-md">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-mark.svg" alt="" className="mx-auto h-20 w-20 mb-6 opacity-80" />
        <p className="text-xs uppercase tracking-widest text-sage-deep">erro 404</p>
        <h1 className="mt-2 font-display text-5xl md:text-6xl text-ink">
          Essa página <em className="text-coral-deep">evaporou</em>.
        </h1>
        <p className="mt-4 text-ink-soft">
          Pode ter sido um link velho, um erro de digitação, ou ela ainda nem nasceu.
          Vamos voltar pra um lugar com cheiro bom?
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-block rounded-full bg-coral px-7 py-3 text-sm font-medium text-white hover:bg-coral-deep transition"
          >
            Voltar pra home
          </Link>
          <Link
            href="/produtos"
            className="inline-block text-sm text-ink-soft hover:text-coral-deep transition"
          >
            Ver catálogo →
          </Link>
        </div>
      </div>
    </main>
  );
}
