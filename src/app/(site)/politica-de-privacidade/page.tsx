import Link from "next/link";

export const metadata = {
  title: "Política de privacidade",
  description: "Como a perfumesdeambientedecor coleta, usa e protege seus dados pessoais, conforme a LGPD.",
};

export default function PrivacidadePage() {
  return (
    <main>
      <section className="bg-cream-soft border-b border-cream-deep/60">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <nav className="text-xs text-ink-mute mb-3 flex items-center gap-2" aria-label="breadcrumb">
            <Link href="/" className="hover:text-coral-deep transition">Início</Link>
            <span>/</span>
            <span className="text-ink-soft">Política de privacidade</span>
          </nav>
          <h1 className="font-display text-5xl text-ink">Política de privacidade</h1>
          <p className="mt-3 text-ink-soft max-w-2xl">
            A gente leva a sério a privacidade dos seus dados. Aqui está, em
            linguagem simples, o que coletamos e por quê.
          </p>
          <p className="mt-3 text-xs uppercase tracking-widest text-sage-deep">
            Última atualização: junho de 2026
          </p>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-6 py-14 space-y-10 text-ink leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-display text-3xl text-ink">Que dados coletamos</h2>
          <ul className="space-y-2 text-ink-soft">
            <li className="flex gap-3"><span className="text-coral-deep">●</span> <strong className="text-ink">Cadastro:</strong> nome, e-mail, senha (criptografada).</li>
            <li className="flex gap-3"><span className="text-coral-deep">●</span> <strong className="text-ink">Compra:</strong> CPF, endereço de entrega, telefone.</li>
            <li className="flex gap-3"><span className="text-coral-deep">●</span> <strong className="text-ink">Pagamento:</strong> não armazenamos seu cartão — quem cuida disso é o Mercado Pago, certificado PCI DSS.</li>
            <li className="flex gap-3"><span className="text-coral-deep">●</span> <strong className="text-ink">Navegação:</strong> cookies essenciais (carrinho, sessão) e analíticos anonimizados.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-3xl text-ink">Pra que usamos</h2>
          <ul className="space-y-2 text-ink-soft">
            <li className="flex gap-3"><span className="text-coral-deep">●</span> Processar seus pedidos e gerar nota fiscal.</li>
            <li className="flex gap-3"><span className="text-coral-deep">●</span> Calcular frete e gerar etiqueta de envio.</li>
            <li className="flex gap-3"><span className="text-coral-deep">●</span> Enviar confirmações e atualizações do pedido (e-mail).</li>
            <li className="flex gap-3"><span className="text-coral-deep">●</span> Atender você quando entrar em contato.</li>
            <li className="flex gap-3"><span className="text-coral-deep">●</span> Cumprir obrigações fiscais e legais.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-3xl text-ink">Com quem compartilhamos</h2>
          <p className="text-ink-soft">
            Só com parceiros essenciais para o pedido funcionar:
          </p>
          <ul className="space-y-2 text-ink-soft">
            <li className="flex gap-3"><span className="text-coral-deep">●</span> <strong className="text-ink">Mercado Pago</strong> — processamento de pagamento.</li>
            <li className="flex gap-3"><span className="text-coral-deep">●</span> <strong className="text-ink">Melhor Envio / Correios / Jadlog</strong> — frete e rastreio.</li>
            <li className="flex gap-3"><span className="text-coral-deep">●</span> <strong className="text-ink">Supabase</strong> — infraestrutura de banco de dados.</li>
            <li className="flex gap-3"><span className="text-coral-deep">●</span> <strong className="text-ink">Resend</strong> — envio dos e-mails transacionais.</li>
          </ul>
          <p className="text-ink-soft">
            <strong className="text-ink">Nunca</strong> vendemos seus dados para terceiros nem
            usamos para anúncios fora do nosso domínio.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-3xl text-ink">Seus direitos (LGPD)</h2>
          <p className="text-ink-soft">
            A Lei Geral de Proteção de Dados garante que você pode, a qualquer momento:
          </p>
          <ul className="space-y-2 text-ink-soft">
            <li className="flex gap-3"><span className="text-coral-deep">●</span> Saber quais dados temos sobre você.</li>
            <li className="flex gap-3"><span className="text-coral-deep">●</span> Corrigir dados incorretos.</li>
            <li className="flex gap-3"><span className="text-coral-deep">●</span> Solicitar exclusão do que não é obrigatório guardar.</li>
            <li className="flex gap-3"><span className="text-coral-deep">●</span> Pedir uma cópia exportada dos seus dados.</li>
          </ul>
          <p className="text-ink-soft">
            Pra exercer qualquer um desses direitos, é só falar pelo nosso{" "}
            <Link href="/contato" className="text-coral-deep underline underline-offset-4">contato</Link>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-3xl text-ink">Cookies</h2>
          <p className="text-ink-soft">
            Usamos cookies essenciais (pra manter seu carrinho e sua sessão) e cookies
            analíticos anônimos (pra entender o que está funcionando e o que precisa
            melhorar). Você pode desativar cookies nas configurações do navegador, mas
            partes do site (como o carrinho) podem deixar de funcionar.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-3xl text-ink">Mudanças nesta política</h2>
          <p className="text-ink-soft">
            Se a gente atualizar esta política, a data lá em cima muda. Mudanças
            importantes — tipo um parceiro novo no processamento — a gente avisa por
            e-mail antes.
          </p>
        </section>
      </article>
    </main>
  );
}
