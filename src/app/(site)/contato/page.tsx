import Link from "next/link";

export const metadata = {
  title: "Contato",
  description: "Fale com a LU. Atendimento por WhatsApp, e-mail e Instagram.",
};

export default function ContatoPage() {
  return (
    <main>
      <section className="bg-cream-soft border-b border-cream-deep/60">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <nav className="text-xs text-ink-mute mb-3 flex items-center gap-2" aria-label="breadcrumb">
            <Link href="/" className="hover:text-coral-deep transition">Início</Link>
            <span>/</span>
            <span className="text-ink-soft">Contato</span>
          </nav>
          <h1 className="font-display text-5xl md:text-6xl text-ink">Fale com a LU</h1>
          <p className="mt-3 text-lg text-ink-soft max-w-2xl">
            Dúvida sobre um produto, pedido ou parceria? Manda mensagem que respondemos
            no horário comercial.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="grid md:grid-cols-3 gap-4">
          <a
            href="https://wa.me/5500000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-2xl border border-cream-deep bg-cream-soft p-6 hover:border-coral hover:bg-coral-soft/30 transition"
          >
            <div className="h-12 w-12 rounded-full bg-sage-soft flex items-center justify-center mb-4 group-hover:bg-coral-soft transition text-xl">
              💬
            </div>
            <h2 className="font-display text-2xl text-ink">WhatsApp</h2>
            <p className="mt-1 text-sm text-ink-soft">
              Atendimento direto, com a LU em pessoa.
            </p>
            <span className="mt-4 inline-block text-xs text-coral-deep">Abrir conversa →</span>
          </a>

          <a
            href="mailto:contato@luperfumes.com.br"
            className="group rounded-2xl border border-cream-deep bg-cream-soft p-6 hover:border-coral hover:bg-coral-soft/30 transition"
          >
            <div className="h-12 w-12 rounded-full bg-sage-soft flex items-center justify-center mb-4 group-hover:bg-coral-soft transition text-xl">
              ✉️
            </div>
            <h2 className="font-display text-2xl text-ink">E-mail</h2>
            <p className="mt-1 text-sm text-ink-soft">
              contato@luperfumes.com.br
            </p>
            <span className="mt-4 inline-block text-xs text-coral-deep">Mandar e-mail →</span>
          </a>

          <a
            href="https://www.instagram.com/perfumesdeambientedecor/"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-2xl border border-cream-deep bg-cream-soft p-6 hover:border-coral hover:bg-coral-soft/30 transition"
          >
            <div className="h-12 w-12 rounded-full bg-sage-soft flex items-center justify-center mb-4 group-hover:bg-coral-soft transition text-xl">
              📷
            </div>
            <h2 className="font-display text-2xl text-ink">Instagram</h2>
            <p className="mt-1 text-sm text-ink-soft">@perfumesdeambientedecor</p>
            <span className="mt-4 inline-block text-xs text-coral-deep">Seguir →</span>
          </a>
        </div>

        <div className="mt-12 rounded-2xl border border-cream-deep bg-cream-soft p-6">
          <h3 className="font-display text-xl text-ink">Horário de atendimento</h3>
          <p className="mt-2 text-sm text-ink-soft">
            Segunda a sexta, das 9h às 18h. Sábado, das 9h às 13h.
          </p>
          <p className="mt-2 text-xs text-ink-mute">
            Fora desse horário, deixa a mensagem — a LU responde assim que chega.
          </p>
        </div>
      </section>
    </main>
  );
}
