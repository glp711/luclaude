import Link from "next/link";

export const metadata = { title: "Guia do admin" };

const STEPS = [
  {
    title: "1. Entrar no painel",
    text: "Acesse /login, entre com o e-mail admin e depois abra /admin. Se nao estiver logado como admin, a pagina fica escondida.",
    href: "/login",
    cta: "Ir para login",
  },
  {
    title: "2. Conferir o Dashboard",
    text: "Use a primeira tela para ver faturamento, pedidos pagos, pedidos pendentes, produtos ativos e estoque baixo.",
    href: "/admin",
    cta: "Abrir dashboard",
  },
  {
    title: "3. Cadastrar ou editar produtos",
    text: "Em Produtos, voce busca itens, filtra por status, cria produtos novos e edita preco, estoque, categoria, SKU e dimensoes.",
    href: "/admin/produtos",
    cta: "Ver produtos",
  },
  {
    title: "4. Ver financeiro",
    text: "Em Financeiro, clique no faturamento para abrir grafico do mes, ticket medio, pedidos usados no calculo e aviso sobre lucro real.",
    href: "/admin/financeiro",
    cta: "Ver financeiro",
  },
  {
    title: "5. Acompanhar pedidos",
    text: "Em Pedidos, filtre por status, abra o detalhe, confira cliente, endereco, itens, pagamento e salve codigo de rastreio.",
    href: "/admin/pedidos",
    cta: "Ver pedidos",
  },
  {
    title: "6. Organizar categorias",
    text: "Em Categorias, crie nomes como Difusores, Kits e Sabonetes. O slug e gerado automaticamente pelo sistema.",
    href: "/admin/categorias",
    cta: "Ver categorias",
  },
  {
    title: "7. Consultar newsletter",
    text: "Em Newsletter, veja os e-mails cadastrados pelo rodape do site e filtre entre ativos ou todos.",
    href: "/admin/newsletter",
    cta: "Ver newsletter",
  },
];

const ORDER_STATUS = [
  ["Aguardando pagamento", "Pedido criado, mas o pagamento ainda nao foi confirmado."],
  ["Pago", "Pagamento aprovado. A loja precisa preparar o envio."],
  ["Preparando", "Pedido em separacao ou embalagem."],
  ["Enviado", "Pedido despachado, normalmente com codigo de rastreio."],
  ["Entregue", "Pedido concluido."],
  ["Cancelado/Reembolsado", "Pedido encerrado sem entrega ou com devolucao do valor."],
];

export default function AdminGuidePage() {
  return (
    <div className="space-y-8">
      <section className="rounded-[8px] bg-ink p-6 text-cream-soft shadow-xl shadow-ink/10 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-coral">Guia interno</p>
        <h1 className="mt-2 font-display text-5xl leading-none text-cream-soft sm:text-6xl">
          Como usar o admin
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-cream-deep">
          Use esta aba como roteiro para explicar o painel para a cliente. Ela mostra o que cada area faz e em qual ordem operar a loja.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {STEPS.map((step) => (
          <article key={step.title} className="rounded-[8px] border border-cream-deep bg-cream-soft p-5 shadow-sm">
            <h2 className="font-display text-3xl leading-tight text-ink">{step.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{step.text}</p>
            <Link
              href={step.href}
              className="mt-5 inline-flex rounded-full bg-ink px-4 py-2 text-sm font-semibold text-cream-soft transition hover:bg-coral hover:text-ink"
            >
              {step.cta}
            </Link>
          </article>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[8px] border border-cream-deep bg-cream-soft p-6 shadow-sm">
          <h2 className="font-display text-3xl text-ink">Fluxo recomendado de operacao</h2>
          <ol className="mt-5 space-y-3 text-sm leading-relaxed text-ink-soft">
            <li><strong className="text-ink">1.</strong> Ver pedidos novos no Dashboard.</li>
            <li><strong className="text-ink">2.</strong> Abrir pedidos pagos e separar os itens.</li>
            <li><strong className="text-ink">3.</strong> Marcar como preparando quando iniciar a embalagem.</li>
            <li><strong className="text-ink">4.</strong> Inserir codigo de rastreio quando postar.</li>
            <li><strong className="text-ink">5.</strong> Marcar como enviado e depois entregue.</li>
            <li><strong className="text-ink">6.</strong> Conferir estoque baixo e repor produtos.</li>
          </ol>
        </article>

        <article className="rounded-[8px] border border-cream-deep bg-cream-soft p-6 shadow-sm">
          <h2 className="font-display text-3xl text-ink">Webhook e pagamento</h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">
            O Mercado Pago envia atualizacoes para a rota abaixo. Abrir no navegador mostra apenas um teste de saude.
          </p>
          <code className="mt-4 block overflow-x-auto rounded-[8px] bg-ink px-4 py-3 text-xs text-cream-soft">
            https://luperfumes.vercel.app/api/webhooks/mercadopago
          </code>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">
            Quando o pagamento e aprovado, o sistema registra o evento, atualiza o pedido e deixa ele pronto para aparecer como pago no admin.
          </p>
        </article>
      </section>

      <section className="rounded-[8px] border border-cream-deep bg-cream-soft p-6 shadow-sm">
        <h2 className="font-display text-3xl text-ink">Status dos pedidos</h2>
        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
          {ORDER_STATUS.map(([label, text]) => (
            <div key={label} className="rounded-[8px] border border-cream-deep bg-cream p-4">
              <p className="text-sm font-bold text-ink">{label}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
