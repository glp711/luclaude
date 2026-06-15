export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-cream-deep bg-cream-soft overflow-hidden animate-pulse">
      <div className="aspect-square bg-cream-deep/40" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-3/4 rounded-full bg-cream-deep/40" />
        <div className="h-4 w-1/2 rounded-full bg-cream-deep/40" />
        <div className="h-5 w-1/3 rounded-full bg-coral-soft/40 mt-2" />
      </div>
    </div>
  );
}
