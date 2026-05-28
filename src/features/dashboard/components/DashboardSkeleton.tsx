export function DashboardSkeleton() {
  return (
    <div className="space-y-4 fade-in" dir="rtl">
      {/* Header skeleton */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-6 w-48 rounded-lg animate-pulse" style={{ background: "var(--color-border)" }} />
          <div className="h-4 w-32 rounded-lg animate-pulse" style={{ background: "var(--color-border)" }} />
        </div>
        <div className="h-9 w-20 rounded-xl animate-pulse" style={{ background: "var(--color-border)" }} />
      </div>

      {/* KPI cards skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 lg:gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="kpi-card">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl animate-pulse" style={{ background: "var(--color-border)" }} />
            </div>
            <div className="h-6 w-20 rounded-lg animate-pulse mb-2" style={{ background: "var(--color-border)" }} />
            <div className="h-3 w-24 rounded animate-pulse" style={{ background: "var(--color-border)" }} />
          </div>
        ))}
      </div>

      {/* Growth section skeleton */}
      <div className="h-32 rounded-2xl animate-pulse" style={{ background: "#0F1C36" }} />

      {/* Financial section skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-64 rounded-2xl animate-pulse" style={{ background: "var(--color-border)" }} />
        <div className="h-64 rounded-2xl animate-pulse" style={{ background: "var(--color-border)" }} />
      </div>
    </div>
  );
}
