import { MARQUEE_ITEMS } from "@/lib/home-content";

/**
 * Marquee horizontal de avisos.
 *
 * Lista textos da config, duplica pra rolagem continua e usa
 * `.animate-marquee` definido em globals.css. Pausa no hover, respeita
 * `prefers-reduced-motion`.
 */
export function MarqueeBar() {
  // Duplicamos a lista pra que a animacao de -50% gere loop sem corte
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div
      className="overflow-hidden bg-sage-deep text-cream-soft border-b border-sage-deep/40"
      aria-label="Beneficios da loja"
    >
      <div className="flex w-max animate-marquee py-2.5">
        {items.map((item, idx) => (
          <span
            key={idx}
            className="flex items-center gap-6 px-6 text-[11px] sm:text-xs uppercase tracking-[0.22em] whitespace-nowrap"
          >
            <span aria-hidden="true" className="text-cream-soft/60">
              ✦
            </span>
            <span>{item}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
