export default function CartLoading() {
  return (
    <main>
      <section className="bg-cream-soft border-b border-cream-deep/60">
        <div className="mx-auto max-w-6xl px-6 py-10 animate-pulse">
          <div className="h-3 w-32 rounded-full bg-cream-deep/40 mb-3" />
          <div className="h-12 w-56 rounded-2xl bg-cream-deep/40" />
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 animate-pulse">
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex gap-4 rounded-2xl border border-cream-deep bg-cream-soft p-4">
                <div className="h-28 w-28 flex-shrink-0 rounded-xl bg-cream-deep/40" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded-full bg-cream-deep/40" />
                  <div className="h-3 w-1/3 rounded-full bg-cream-deep/40" />
                  <div className="h-8 w-32 rounded-full bg-cream-deep/40 mt-3" />
                </div>
              </div>
            ))}
          </div>
          <aside className="rounded-2xl border border-cream-deep bg-cream-soft p-6 space-y-3">
            <div className="h-6 w-24 rounded-full bg-cream-deep/40" />
            <div className="h-3 w-full rounded-full bg-cream-deep/40" />
            <div className="h-3 w-full rounded-full bg-cream-deep/40" />
            <div className="h-3 w-full rounded-full bg-cream-deep/40" />
            <div className="h-12 w-full rounded-full bg-coral-soft/40 mt-4" />
          </aside>
        </div>
      </div>
    </main>
  );
}
