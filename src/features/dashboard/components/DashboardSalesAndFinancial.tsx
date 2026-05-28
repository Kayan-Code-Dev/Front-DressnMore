import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3, DollarSign } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { SummaryRow } from "./SummaryRow";
import { EmptyChartState } from "./EmptyChartState";
import { fmtCur, fmtPct } from "../utils/dashboard.utils";

type FinancialData = {
  totalIncome?: number;
  totalExpenses?: number;
  profit?: number;
  profitMargin?: number;
};

type DashboardSalesAndFinancialProps = {
  financial: FinancialData;
};

export function DashboardSalesAndFinancial({
  financial,
}: DashboardSalesAndFinancialProps) {
  return (
    <>
      <SectionHeader
        title="المبيعات والمالية"
        description="توزيع الطلبات والإيرادات والمصروفات"
        className="mt-10"
      />
      <section className="mt-4 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12 lg:auto-rows-fr">
        <Card className="flex min-h-[560px] flex-col overflow-hidden rounded-2xl border bg-card/80 shadow-sm backdrop-blur-sm lg:col-span-8">
          <CardHeader className="shrink-0 pb-2">
            <CardTitle className="text-lg">المبيعات حسب الحالة</CardTitle>
            <CardDescription className="text-right">
              أعمدة + خط: عدد الطلبات وإيرادات الآلاف حسب الحالة
            </CardDescription>
          </CardHeader>
          <CardContent className="flex min-h-0 flex-1 flex-col pb-4">
            <div className="flex min-h-0 flex-1 flex-col">
              <EmptyChartState
                icon={<BarChart3 className="h-12 w-12 text-muted-foreground/50" />}
                message="سيتم عرض الرسم البياني عند ربط واجهة برمجة التطبيقات"
                title="المبيعات حسب الحالة"
                className="min-h-0 flex-1 justify-center"
                minHeight={480}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="flex min-h-[560px] flex-col overflow-hidden rounded-2xl border bg-card/80 shadow-sm backdrop-blur-sm lg:col-span-4">
          <CardHeader className="shrink-0 pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              الإيرادات والمصروفات
            </CardTitle>
            <CardDescription className="text-right">
              توزيع احترافي — إيرادات مقابل مصروفات ثم الأرصدة
            </CardDescription>
          </CardHeader>
          <CardContent className="flex min-h-0 flex-1 flex-col space-y-4">
            <div className="flex shrink-0 gap-3 rounded-xl bg-muted/50 p-3">
              <SummaryRow
                label="إيرادات"
                value={fmtCur(financial.totalIncome)}
                accent="text-emerald-600"
              />
              <SummaryRow
                label="مصروفات"
                value={fmtCur(financial.totalExpenses)}
                accent="text-red-600"
              />
            </div>
            <SummaryRow
              label="الربح"
              value={fmtCur(financial.profit)}
              accent="text-emerald-600"
            />
            <SummaryRow label="هامش الربح" value={fmtPct(financial.profitMargin)} />
            <EmptyChartState
              icon={<DollarSign className="h-10 w-10 text-muted-foreground/50" />}
              message="سيتم عرض الرسم البياني عند ربط واجهة برمجة التطبيقات"
              minHeight={160}
            />
          </CardContent>
        </Card>
      </section>
    </>
  );
}
