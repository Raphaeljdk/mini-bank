export function Skeleton({ className }: { className?: string }) {
  return <div className={`shimmer rounded-xl ${className}`} />;
}

export function CardSkeleton() {
  return (
    <div className="glass-strong rounded-2xl p-5 space-y-3">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-24" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3 p-4">
      {[...Array(rows)].map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}
