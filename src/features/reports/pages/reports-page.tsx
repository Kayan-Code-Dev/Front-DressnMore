import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { ReportsOverview } from "@/features/reports/types/reports.types";
import { getReportsOverviewMock } from "@/features/reports/services/reports.mock.service";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, TrendingUp, Scissors, ArrowLeft } from "lucide-react";

export function ReportsPage() {
  const [data, setData] = useState<ReportsOverview | null>(null);

  useEffect(() => {
    getReportsOverviewMock().then((response) => setData(response.data));
  }, []);

  return (
    <div className="w-full space-y-6">
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #D97706, #F59E0B)" }}>
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-black" style={{ color: "var(--color-text-primary)" }}>التقارير</CardTitle>
              <CardDescription>ملخص التقارير والإحصائيات.</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #059669, #34D399)" }}>
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <CardTitle className="text-base font-bold" style={{ color: "var(--color-text-primary)" }}>ملخص المبيعات</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">إجمالي المبيعات</span>
                {data ? <span className="font-bold text-lg">{data.total_sales.toLocaleString()}</span> : <Skeleton className="h-6 w-24" />}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">عدد الفواتير</span>
                {data ? <span className="font-bold">{data.invoices_count}</span> : <Skeleton className="h-5 w-16" />}
              </div>
            </div>
            <div className="mt-4">
              <Link to="/reports/sales">
                <Button variant="outline" className="w-full"><ArrowLeft className="h-4 w-4 ml-1.5" />فتح تقرير المبيعات</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #7C3AED, #A78BFA)" }}>
                <Scissors className="w-4 h-4 text-white" />
              </div>
              <CardTitle className="text-base font-bold" style={{ color: "var(--color-text-primary)" }}>ملخص التفصيل</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">إجمالي الإيرادات</span>
                {data ? <span className="font-bold text-lg">{data.total_revenue.toLocaleString()}</span> : <Skeleton className="h-6 w-24" />}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">عدد الطلبات</span>
                {data ? <span className="font-bold">{data.total_orders}</span> : <Skeleton className="h-5 w-16" />}
              </div>
            </div>
            <div className="mt-4">
              <Link to="/reports/tailoring">
                <Button variant="outline" className="w-full"><ArrowLeft className="h-4 w-4 ml-1.5" />فتح تقرير التفصيل</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
