import Link from "next/link";

export const metadata = { title: "Finalizar compra" };

export default function CheckoutPage() {
  return (
    <main>
      <section className="bg-cream-soft border-b border-cream-deep/60">
        <div className="mx-auto max-w-3xl px-6 py-10">
          <nav className="text-xs text-ink-mute mb-3 flex items-center gap-2" aria-label="breadcrumb">
            <Link href="/" className="hover:text-coral-deep transition">Início</Link>
            <span>/</span>
            <Link href="/carrinho" className="hover:text-coral-deep transition">Carrinho</Link>
            <span>/</span>
            <span className="text-ink-soft">Finalizar compra</span>
          </nav>
          <h1 className="font-display text-5xl text-ink">Quase lá!</h1>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-14">
        <div className="rounded-3xl border border-cream-deep bg-cream-soft p-10 text-center space-y-6">
          <div className="mx-auto h-16 w-16 rounded-full bg-coral-soft flex items-center justify-center text-2xl">
            🔒
          </div>
          <div>
            <h2 className="font-display text-3xl text-ink">
              Checkout em ativação
            </h2>
            <p className="mt-3 text-ink-soft leading-relaxed max-w-md mx-auto">
              Estamos terminando de conectar o gateway de pagamento (Mercado Pago) e a
              integração de frete (Melhor Envio). Enquanto isso, você pode fazer
              pedidos direto com a LU no WhatsApp.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center pt-2">
            <a
              href="https://wa.me/5500000000000?text=Oi%21%20Quero%20fazer%20um%20pedido%20no%20site"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-sage-deep text-white px-7 py-3 text-sm font-medium hover:bg-sage-deep/90 transition inline-flex items-center gap-2"
            >
              💬 Pedir pelo WhatsApp
            </a>
            <Link
              href="/carrinho"
              className="text-sm text-ink-soft hover:text-coral-deep transition"
            >
              ← Voltar ao carrinho
            </Link>
          </div>
          <p className="text-xs text-ink-mute pt-4 border-t border-cream-deep">
            Cadastre seu e-mail na newsletter pra ser avisada quando o pagamento online
            estiver no ar.
          </p>
        </div>
      </section>
    </main>
  );
}
