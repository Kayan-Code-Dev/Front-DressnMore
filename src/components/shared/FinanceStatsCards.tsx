import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber } from "@/shared/lib/format/numbers";

export type FinanceStatItem = {
  label: string;
  subLabel?: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  valueColor?: string;
};

interface FinanceStatsCardsProps {
  stats: FinanceStatItem[];
  loading?: boolean;
}

export function FinanceStatsCards({ stats, loading }: FinanceStatsCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-0 shadow-sm"><CardContent className="pt-5"><Skeleton className="h-16 w-full" /></CardContent></Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="border-0 shadow-sm overflow-hidden">
            <CardContent className="pt-5 pb-4 px-5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-black leading-none" style={{ color: stat.valueColor ?? "var(--color-text-primary)" }}>
                    {typeof stat.value === "number" ? formatNumber(stat.value) : stat.value}
                  </p>
                  {stat.subLabel && <p className="text-[10px] text-muted-foreground mt-2">{stat.subLabel}</p>}
                </div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: stat.gradient }}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
