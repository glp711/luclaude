import Link from "next/link";

export const metadata = {
  title: "Sobre a marca",
  description: "A história por trás da perfumesdeambientedecor — perfumaria de ambiente escolhida a dedo.",
};

export default function SobrePage() {
  return (
    <main>
      <section className="bg-cream-soft border-b border-cream-deep/60">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <p className="text-xs uppercase tracking-widest text-sage-deep">conheça quem faz</p>
          <h1 className="mt-2 font-display text-5xl md:text-6xl text-ink">
            Atrás de cada frasco, a <em className="text-coral-deep">perfumesdeambientedecor</em>.
          </h1>
          <p className="mt-5 text-lg text-ink-soft leading-relaxed max-w-2xl mx-auto">
            A perfumesdeambientedecor não nasceu de uma planilha de mercado. Nasceu de uma vontade
            simples: a de deixar cada cantinho da casa com cheiro de cuidado.
          </p>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-6 py-16 space-y-12 text-ink leading-relaxed">
        <div
          className="aspect-[16/9] rounded-3xl bg-cream-soft border border-cream-deep bg-cover bg-center"
          style={{ backgroundImage: "url(/founder/perfumesdeambientedecor-founder-card.png)" }}
          role="img"
          aria-label="Fundadora da perfumesdeambientedecor apresentando produto"
        />

        <div className="grid sm:grid-cols-2 gap-4">
          <div
            className="aspect-[4/5] rounded-3xl bg-cream-soft border border-cream-deep bg-cover bg-center"
            style={{ backgroundImage: "url(/founder/perfumesdeambientedecor-product-kit.png)" }}
            role="img"
            aria-label="Kit de difusor da perfumesdeambientedecor"
          />
          <div
            className="aspect-[4/5] rounded-3xl bg-cream-soft border border-cream-deep bg-cover bg-center"
            style={{ backgroundImage: "url(/founder/perfumesdeambientedecor-founder-diffuser.png)" }}
            role="img"
            aria-label="Difusor de ambiente apresentado pela fundadora"
          />
        </div>

        <section className="space-y-4">
          <h2 className="font-display text-3xl text-ink">Como começou</h2>
          <p className="text-ink-soft">
            A marca nasceu do cuidado em receber gente em casa. Aroma é parte
            do abraço — o cheiro que recebe quem chega já é, ele mesmo, um cuidado.
            Foi escolhendo difusor por difusor, sabonete por sabonete, até que os
            amigos começaram a perguntar onde comprar.
          </p>
          <p className="text-ink-soft">
            Quando a lista de pedidos não cabia mais no WhatsApp, virou loja.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-3xl text-ink">O que move</h2>
          <p className="text-ink-soft">
            Cada produto que entra no catálogo passa por curadoria primeiro. Se não combina
            com casa cheirosa, presente bonito e cuidado real, não entra. Simples assim.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-3xl text-ink">O que você encontra</h2>
          <ul className="space-y-2 text-ink-soft">
            <li className="flex gap-3"><span className="text-coral-deep">●</span> <span><strong className="text-ink">Difusores</strong> que perfumam por meses, não dias.</span></li>
            <li className="flex gap-3"><span className="text-coral-deep">●</span> <span><strong className="text-ink">Home sprays</strong> pra dar um respiro no ambiente em segundos.</span></li>
            <li className="flex gap-3"><span className="text-coral-deep">●</span> <span><strong className="text-ink">Sabonetes</strong> que cuidam da pele e perfumam o banheiro.</span></li>
            <li className="flex gap-3"><span className="text-coral-deep">●</span> <span><strong className="text-ink">Kits</strong> prontos pra presentear (ou se presentear).</span></li>
          </ul>
        </section>

        <div className="rounded-3xl bg-sage-soft/50 border border-sage-soft p-8 text-center">
          <p className="font-display text-2xl italic text-ink">
            &ldquo;Casa boa é casa que cheira a memória boa.&rdquo;
          </p>
          <p className="mt-2 text-xs uppercase tracking-widest text-sage-deep">— perfumesdeambientedecor</p>
          <Link
            href="/produtos"
            className="mt-6 inline-block rounded-full bg-coral px-7 py-3 text-sm font-medium text-white hover:bg-coral-deep transition"
          >
            Ver catálogo
          </Link>
        </div>
      </article>
    </main>
  );
}
