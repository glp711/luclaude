export default function ProductLoading() {
  return (
    <main>
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="h-3 w-72 rounded-full bg-cream-deep/40 animate-pulse mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square rounded-3xl bg-cream-deep/40 animate-pulse" />
          <div className="space-y-5 animate-pulse">
            <div className="h-3 w-24 rounded-full bg-cream-deep/40" />
            <div className="space-y-2">
              <div className="h-8 w-3/4 rounded-2xl bg-cream-deep/40" />
              <div className="h-8 w-1/2 rounded-2xl bg-cream-deep/40" />
            </div>
            <div className="h-10 w-40 rounded-2xl bg-coral-soft/40" />
            <div className="h-12 w-52 rounded-full bg-coral-soft/40" />
            <div className="space-y-2 pt-4 border-t border-cream-deep">
              <div className="h-4 w-32 rounded-full bg-cream-deep/40" />
              <div className="h-3 w-full rounded-full bg-cream-deep/40" />
              <div className="h-3 w-4/5 rounded-full bg-cream-deep/40" />
              <div className="h-3 w-3/5 rounded-full bg-cream-deep/40" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
