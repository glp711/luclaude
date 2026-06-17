import Link from "next/link";
import { CATEGORY_SHORTCUTS } from "@/lib/home-content";
import { buildProductsUrl } from "@/lib/url";

export function CategoryShortcuts() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="text-center mb-10">
        <p className="text-xs uppercase tracking-widest text-sage-deep">o que voce procura</p>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl text-ink">
          Escolha por categoria
        </h2>
      </div>
      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
        {CATEGORY_SHORTCUTS.map((c) => (
          <li key={c.categorySlug}>
            <Link
              href={buildProductsUrl({ categoria: c.categorySlug })}
              className="group flex flex-col items-center justify-center text-center h-full rounded-2xl border border-cream-deep bg-cream-soft p-4 hover:border-coral hover:bg-coral-soft/30 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-coral"
            >
              <span className="h-12 w-12 rounded-full bg-sage-soft/70 flex items-center justify-center mb-3 group-hover:bg-coral-soft transition">
                <span className="h-2.5 w-2.5 rounded-full bg-sage-deep group-hover:bg-coral-deep transition" />
              </span>
              <span className="font-display text-base sm:text-lg text-ink leading-tight">
                {c.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
