import Image from "next/image";
import Link from "next/link";

export function CurationBanner() {
  return (
    <section className="relative overflow-hidden border-y border-cream-deep/50 bg-cream-soft">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "linear-gradient(135deg, rgba(248,211,203,0.34), transparent 42%), linear-gradient(315deg, rgba(212,227,221,0.55), transparent 48%)",
        }}
      />

      <div className="relative mx-auto grid max-w-[86rem] items-center gap-10 px-5 py-20 sm:px-8 md:grid-cols-[0.88fr_1.12fr] md:py-24 lg:gap-16 xl:px-0">
        <div className="relative order-2 md:order-1">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[8px] border border-cream-deep bg-cream shadow-2xl shadow-ink/10">
            <Image
              src="/hero/detalhe-materia-prima.jpeg"
              alt="Detalhe de acabamento, matéria-prima e frasco selecionado pela curadoria"
              fill
              sizes="(max-width: 768px) 90vw, 38vw"
              className="object-cover"
              style={{ objectPosition: "center 48%" }}
            />
          </div>
          <div className="absolute -right-3 -top-3 flex h-24 w-24 rotate-[5deg] flex-col items-center justify-center rounded-full border border-cream-deep bg-cream-soft text-center shadow-lg shadow-ink/10 sm:-right-5 sm:-top-5">
            <span className="text-[9px] font-semibold uppercase tracking-widest text-sage-deep">
              desde
            </span>
            <span className="font-display text-3xl leading-none text-ink">2020</span>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-coral-deep">
            <span aria-hidden="true" className="h-px w-8 bg-coral-deep/60" />
            Uma busca pelo extraordinário
          </p>
          <h2 className="mt-4 max-w-2xl font-display text-4xl leading-[1.03] text-ink sm:text-5xl lg:text-6xl">
            Cada curadoria nasce de uma seleção sensível.
          </h2>
          <div className="mt-5 max-w-2xl space-y-3 text-base leading-relaxed text-ink-soft sm:text-lg">
            <p>
              Um encontro entre técnica, emoção e memória, guiado por um olhar
              estético apurado e pelo respeito às matérias-primas.
            </p>
            <p>
              Fragrâncias e extratos nobres da França, Espanha, Alemanha,
              Inglaterra, Líbano, Itália e Brasil compõem uma linguagem olfativa
              construída com amor e esmero.
            </p>
            <p className="font-medium text-ink">
              Tradição, sensibilidade e assinatura em cada escolha.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/marcas"
              className="inline-flex items-center rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-cream-soft shadow-lg shadow-ink/10 transition hover:-translate-y-0.5 hover:bg-coral-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-coral"
            >
              Ver marcas
              <span aria-hidden="true" className="ml-2">
                →
              </span>
            </Link>
            <Link
              href="/sobre"
              className="inline-flex items-center rounded-full border border-ink/15 bg-cream-soft/70 px-6 py-3.5 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:border-coral-deep hover:text-coral-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-coral"
            >
              Nossa história
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
