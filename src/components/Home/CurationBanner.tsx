import Image from "next/image";
import Link from "next/link";

/**
 * Banner editorial sobre o processo de curadoria.
 *
 * Vai entre BrandsShowcase e Novidades — quebra o ritmo cream da home,
 * conta o angulo "por que essa loja eh diferente" e empurra pra /sobre.
 *
 * Visual: coral-soft de fundo, foto editorial a esquerda em moldura
 * inclinada, texto + CTAs a direita.
 */
export function CurationBanner() {
  return (
    <section className="relative overflow-hidden border-y border-cream-deep/40 bg-coral-soft/40">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 80% 20%, var(--color-coral-deep) 0, transparent 50%), radial-gradient(circle at 10% 90%, var(--color-sage-deep) 0, transparent 45%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-24 grid md:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 items-center">
        {/* Foto */}
        <div className="order-2 md:order-1">
          <div className="relative w-full max-w-md mx-auto">
            <div
              aria-hidden="true"
              className="absolute -inset-3 rounded-[2rem] bg-cream-soft/60 rotate-[3deg]"
            />
            <div className="relative aspect-[4/5] w-full rounded-[1.75rem] overflow-hidden border border-cream-deep shadow-xl shadow-ink/10 rotate-[-1.5deg] bg-cream-soft">
              <Image
                src="/founder/perfumesdeambientedecor-product-kit.png"
                alt="Kit selecionado de difusores e sabonetes"
                fill
                sizes="(max-width: 768px) 90vw, 45vw"
                className="object-cover"
              />
            </div>
            {/* Selo discreto */}
            <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 rounded-full bg-cream-soft border border-cream-deep h-20 w-20 sm:h-24 sm:w-24 flex flex-col items-center justify-center rotate-[8deg] shadow-md shadow-ink/10">
              <span className="text-[9px] uppercase tracking-widest text-sage-deep">
                desde
              </span>
              <span className="font-display text-2xl sm:text-3xl text-ink leading-none">
                2020
              </span>
            </div>
          </div>
        </div>

        {/* Texto */}
        <div className="order-1 md:order-2">
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-coral-deep">
            <span aria-hidden="true" className="h-px w-8 bg-coral-deep/60" />
            por tras de cada frasco
          </p>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-ink">
            Curadoria honesta,{" "}
            <em className="not-italic text-coral-deep">aroma por aroma</em>.
          </h2>
          <p className="mt-5 text-base sm:text-lg text-ink-soft max-w-xl leading-relaxed">
            Cada marca que entra no catalogo passa por uma escolha pessoal — testamos
            fragrancia, fixacao e acabamento antes de chegar ate voce. Nada de
            empurrao: so o que a gente colocaria na propria casa.
          </p>
          <ul className="mt-6 grid sm:grid-cols-2 gap-2 max-w-lg">
            {[
              "Marcas brasileiras e internacionais",
              "Notas testadas em ambiente real",
              "Acabamento que combina com decoracao",
              "Pos-venda no WhatsApp",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-ink-soft"
              >
                <span
                  aria-hidden="true"
                  className="mt-1.5 h-1.5 w-1.5 rounded-full bg-coral-deep flex-shrink-0"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/marcas"
              className="inline-flex items-center rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-cream-soft hover:bg-coral-deep transition focus:outline-none focus-visible:ring-2 focus-visible:ring-coral"
            >
              Conhecer marcas
              <span aria-hidden="true" className="ml-2">
                →
              </span>
            </Link>
            <Link
              href="/sobre"
              className="inline-flex items-center rounded-full border border-ink/20 px-6 py-3.5 text-sm font-medium text-ink hover:border-coral-deep hover:text-coral-deep transition focus:outline-none focus-visible:ring-2 focus-visible:ring-coral"
            >
              Nossa historia
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
