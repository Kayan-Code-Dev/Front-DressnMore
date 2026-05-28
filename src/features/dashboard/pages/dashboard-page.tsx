import { useEffect, useState } from "react";
import { getDashboardMock } from "@/features/dashboard/services/dashboard.mock.service";
import type { DashboardSummary } from "@/features/dashboard/types/dashboard.types";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Receipt,
  Banknote,
  TrendingUp,
  Package,
  ArrowUpRight,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const kpiIcons: Record<string, React.ReactNode> = {
  customers: <Users className="h-5 w-5" />,
  orders: <ShoppingCart className="h-5 w-5" />,
  invoices: <Receipt className="h-5 w-5" />,
  revenue: <Banknote className="h-5 w-5" />,
  dresses: <Package className="h-5 w-5" />,
  growth: <TrendingUp className="h-5 w-5" />,
};

function DashboardSkeleton() {
  return (
    <div className="flex-1 min-h-0 space-y-6" dir="rtl">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <div className="space-y-1">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="card-elevated">
            <CardContent className="p-5">
              <Skeleton className="h-4 w-20 mb-3" />
              <Skeleton className="h-8 w-28 mb-2" />
              <Skeleton className="h-3 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="card-elevated">
            <CardContent className="p-5">
              <Skeleton className="h-5 w-32 mb-3" />
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function DashboardPage() {
  const [state, setState] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    getDashboardMock().then((response) => setState(response.data));
  }, []);

  if (!state) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="flex-1 min-h-0" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <LayoutDashboard className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">لوحة التحكم</h1>
            <p className="text-sm text-muted-foreground">نظرة عامة على بيانات النظام</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {state.kpis.map((kpi) => (
          <Card key={kpi.key} className="card-elevated hover:shadow-md transition-shadow duration-200 group">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-muted-foreground">{kpi.label}</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/15 transition-colors">
                  {kpiIcons[kpi.key] ?? <BarChart3 className="h-4 w-4" />}
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">{kpi.value}</div>
              <div className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                <ArrowUpRight className="h-3.5 w-3.5" />
                <span>{kpi.trend}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Insight Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">نظرة تفصيلية</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {state.cards.map((card) => (
            <Card key={card.title} className="card-elevated hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{card.title}</CardTitle>
                <CardDescription className="text-xs">{card.note}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{card.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="mt-8">
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="text-base">الرسوم البيانية</CardTitle>
            <CardDescription className="text-xs">
              سيتم إضافة الرسوم البيانية عند ربط واجهة برمجة التطبيقات الخاصة بلوحة التحكم
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-48 rounded-xl bg-muted/50 border border-dashed border-border">
              <div className="text-center">
                <BarChart3 className="h-10 w-10 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">الرسوم البيانية — قريباً</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
