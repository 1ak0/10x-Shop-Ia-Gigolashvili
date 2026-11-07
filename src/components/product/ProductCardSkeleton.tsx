function SkeletonCard() {
  return (
    <div className="flex animate-pulse flex-col overflow-hidden rounded-2xl border border-line bg-surface" aria-hidden="true">
      <div className="aspect-square bg-muted" />
      <div className="flex flex-col gap-3 p-4">
        <div className="h-3 w-1/2 rounded bg-muted" />
        <div className="h-5 w-4/5 rounded bg-muted" />
        <div className="h-4 w-1/3 rounded bg-muted" />
        <div className="mt-2 h-11 rounded-full bg-muted" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div role="status" aria-label="Loading products">
      <span className="sr-only">Loading products…</span>
      <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: count }, (_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </div>
  );
}
