import Link from "next/link";

export const metadata = {
  title: "Trocas e devoluções",
  description: "Política de trocas e devoluções da perfumesdeambientedecor, conforme o Código de Defesa do Consumidor.",
};

export default function TrocasPage() {
  return (
    <main>
      <section className="bg-cream-soft border-b border-cream-deep/60">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <nav className="text-xs text-ink-mute mb-3 flex items-center gap-2" aria-label="breadcrumb">
            <Link href="/" className="hover:text-coral-deep transition">Início</Link>
            <span>/</span>
            <span className="text-ink-soft">Trocas e devoluções</span>
          </nav>
          <h1 className="font-display text-5xl text-ink">Trocas e devoluções</h1>
          <p className="mt-3 text-ink-soft max-w-2xl">
            Aqui você encontra tudo o que precisa saber sobre direito de
            arrependimento, troca de produtos com defeito e prazos.
          </p>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-6 py-14 space-y-10 text-ink leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-display text-3xl text-ink">Direito de arrependimento (7 dias)</h2>
          <p className="text-ink-soft">
            Pelo <strong className="text-ink">artigo 49 do Código de Defesa do Consumidor</strong>,
            você tem até <strong className="text-ink">7 dias corridos</strong>, contados a partir
            do recebimento do produto, pra desistir da compra. Sem precisar justificar, sem custo
            extra de devolução.
          </p>
          <p className="text-ink-soft">
            Pra exercer esse direito, é só nos chamar pelos canais de <Link href="/contato" className="text-coral-deep underline underline-offset-4">contato</Link>{" "}
            com o número do pedido. A gente combina a retirada e devolve o valor pago integralmente
            (incluindo o frete) em até 7 dias úteis após receber o produto de volta.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-3xl text-ink">Como o produto precisa voltar</h2>
          <ul className="space-y-2 text-ink-soft">
            <li className="flex gap-3"><span className="text-coral-deep">●</span> Lacre original íntegro (frascos de difusor não podem ter sido abertos).</li>
            <li className="flex gap-3"><span className="text-coral-deep">●</span> Embalagem original, sem sinais de uso.</li>
            <li className="flex gap-3"><span className="text-coral-deep">●</span> Todos os itens que vieram juntos (embalagens de presente, cartões, brindes).</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-3xl text-ink">Produto chegou com defeito</h2>
          <p className="text-ink-soft">
            Se o produto chegou com avaria ou defeito de fábrica, você tem até{" "}
            <strong className="text-ink">30 dias</strong> pra nos comunicar (art. 26 do CDC).
            Mande fotos do produto e da embalagem pro nosso{" "}
            <Link href="/contato" className="text-coral-deep underline underline-offset-4">contato</Link>{" "}
            que resolvemos com troca ou estorno, à sua escolha.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-3xl text-ink">Como funciona o reembolso</h2>
          <ul className="space-y-2 text-ink-soft">
            <li className="flex gap-3"><span className="text-coral-deep">●</span> <strong className="text-ink">Pix:</strong> em até 3 dias úteis na conta de origem.</li>
            <li className="flex gap-3"><span className="text-coral-deep">●</span> <strong className="text-ink">Cartão de crédito:</strong> estorno na fatura em até 2 ciclos.</li>
            <li className="flex gap-3"><span className="text-coral-deep">●</span> <strong className="text-ink">Boleto:</strong> Pix ou TED na conta indicada por você.</li>
          </ul>
        </section>

        <div className="rounded-3xl bg-sage-soft/50 border border-sage-soft p-8 text-center">
          <p className="font-display text-2xl text-ink">Tem dúvida específica?</p>
          <p className="mt-2 text-sm text-ink-soft">Chama a gente — respondemos rápido.</p>
          <Link
            href="/contato"
            className="mt-5 inline-block rounded-full bg-coral px-7 py-3 text-sm font-medium text-white hover:bg-coral-deep transition"
          >
            Falar com atendimento
          </Link>
        </div>
      </article>
    </main>
  );
}
