import { ProductCardSkeleton } from "@/components/skeletons/ProductCardSkeleton";

export default function CatalogLoading() {
  return (
    <main>
      <section className="bg-cream-soft border-b border-cream-deep/60">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16 animate-pulse">
          <div className="h-3 w-32 rounded-full bg-cream-deep/40 mb-3" />
          <div className="h-12 w-72 rounded-2xl bg-cream-deep/40" />
          <div className="h-4 w-60 rounded-full bg-cream-deep/40 mt-3" />
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10">
          <aside className="space-y-3 animate-pulse">
            <div className="h-4 w-20 rounded-full bg-cream-deep/40" />
            <div className="h-3 w-24 rounded-full bg-cream-deep/40" />
            <div className="h-3 w-32 rounded-full bg-cream-deep/40" />
            <div className="h-3 w-28 rounded-full bg-cream-deep/40" />
            <div className="h-3 w-24 rounded-full bg-cream-deep/40" />
          </aside>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
