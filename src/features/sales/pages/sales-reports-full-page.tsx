import { useEffect, useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";
import { isModuleLive } from "@/config/feature-flags";
import {
  getDailySalesMock,
  getEmployeeSalesMock,
  getProductSalesMock,
  getSalesReportSummaryMock,
} from "@/features/sales/services/sales.mock.service";
import {
  getDailySales,
  getEmployeeSales,
  getProductSales,
  getSalesReportSummary,
} from "@/features/sales/services/sales.api.service";
import type {
  DailySalesRow,
  EmployeeSalesRow,
  ProductSalesRow,
  SalesReportSummary,
  SalesReportTab,
} from "@/features/sales/types/sales.types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, DollarSign, FileText, BarChart3, Users, Calendar } from "lucide-react";

function StatCard({
  label,
  value,
  icon: Icon,
  gradient,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
}) {
  return (
    <Card>
      <CardContent className="pt-5 pb-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs text-muted-foreground mb-1">{label}</p>
            <p className="text-xl font-black" style={{ color: "var(--color-text-primary)" }}>{value}</p>
          </div>
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: gradient }}>
            <Icon className="w-4 h-4 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SalesReportsFullPage() {
  const [activeTab, setActiveTab] = useState<SalesReportTab>("daily");
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<SalesReportSummary | null>(null);
  const [daily, setDaily] = useState<DailySalesRow[]>([]);
  const [products, setProducts] = useState<ProductSalesRow[]>([]);
  const [employees, setEmployees] = useState<EmployeeSalesRow[]>([]);

  useEffect(() => {
    setLoading(true);
    const live = isModuleLive("sales");
    Promise.all([
      live ? getSalesReportSummary() : getSalesReportSummaryMock().then((r) => r.data),
      live ? getDailySales() : getDailySalesMock().then((r) => r.data),
      live ? getProductSales() : getProductSalesMock().then((r) => r.data),
      live ? getEmployeeSales() : getEmployeeSalesMock().then((r) => r.data),
    ])
      .then(([summaryRes, dailyRes, productsRes, employeesRes]) => {
        setSummary(summaryRes as SalesReportSummary);
        setDaily(dailyRes as DailySalesRow[]);
        setProducts(productsRes as ProductSalesRow[]);
        setEmployees(employeesRes as EmployeeSalesRow[]);
      })
      .finally(() => setLoading(false));
  }, []);

  const dailyChartOption = useMemo(
    () => ({
      tooltip: { trigger: "axis" as const },
      grid: { left: 40, right: 20, top: 20, bottom: 40 },
      xAxis: {
        type: "category" as const,
        data: daily.map((d) => d.date),
        axisLabel: { fontSize: 11, color: "#64748B" },
      },
      yAxis: {
        type: "value" as const,
        axisLabel: { fontSize: 11, color: "#64748B" },
      },
      series: [
        {
          name: "المبيعات",
          type: "bar" as const,
          data: daily.map((d) => d.total),
          itemStyle: { color: "#059669", borderRadius: [4, 4, 0, 0] },
        },
      ],
    }),
    [daily],
  );

  const productsChartOption = useMemo(
    () => ({
      tooltip: { trigger: "item" as const, formatter: "{b}: {c} ج.م ({d}%)" },
      legend: { bottom: 0, textStyle: { fontSize: 11, color: "#64748B" } },
      series: [
        {
          type: "pie" as const,
          radius: ["40%", "65%"],
          center: ["50%", "42%"],
          label: { show: false },
          data: products.map((p) => ({ name: p.product_name, value: p.revenue })),
          itemStyle: { borderRadius: 4, borderColor: "#fff", borderWidth: 2 },
        },
      ],
    }),
    [products],
  );

  const employeeChartOption = useMemo(
    () => ({
      tooltip: { trigger: "axis" as const },
      grid: { left: 100, right: 20, top: 20, bottom: 20 },
      xAxis: { type: "value" as const, axisLabel: { fontSize: 11, color: "#64748B" } },
      yAxis: {
        type: "category" as const,
        data: employees.map((e) => e.employee_name),
        axisLabel: { fontSize: 11, color: "#64748B" },
      },
      series: [
        {
          name: "المبيعات",
          type: "bar" as const,
          data: employees.map((e) => e.total_sales),
          itemStyle: { color: "#5170FF", borderRadius: [0, 4, 4, 0] },
        },
      ],
    }),
    [employees],
  );

  const formatMoney = (n: number) => `${n} ج.م`;

  return (
    <div className="w-full space-y-4" dir="rtl">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #059669, #34D399)" }}>
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-black" style={{ color: "var(--color-text-primary)" }}>تقارير المبيعات</CardTitle>
              <CardDescription>تحليل شامل لمبيعات المتجر والفواتير.</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}><CardContent className="pt-5"><Skeleton className="h-16 w-full" /></CardContent></Card>
          ))
        ) : summary ? (
          <>
            <StatCard label="إجمالي المبيعات" value={formatMoney(summary.total_sales)} icon={DollarSign} gradient="linear-gradient(135deg, #D97706, #FBBF24)" />
            <StatCard label="عدد الفواتير" value={String(summary.invoices_count)} icon={FileText} gradient="linear-gradient(135deg, #0EA5E9, #38BDF8)" />
            <StatCard label="متوسط قيمة الفاتورة" value={formatMoney(Math.round(summary.average_invoice_value))} icon={BarChart3} gradient="linear-gradient(135deg, #7C3AED, #A78BFA)" />
          </>
        ) : null}
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as SalesReportTab)}>
            <TabsList className="mb-6">
              <TabsTrigger value="daily" className="gap-1.5"><Calendar className="h-3.5 w-3.5" /> يومي</TabsTrigger>
              <TabsTrigger value="products" className="gap-1.5"><BarChart3 className="h-3.5 w-3.5" /> المنتجات</TabsTrigger>
              <TabsTrigger value="by-employee" className="gap-1.5"><Users className="h-3.5 w-3.5" /> حسب الموظف</TabsTrigger>
            </TabsList>

            <TabsContent value="daily" className="space-y-4">
              {loading ? <Skeleton className="h-[280px] w-full" /> : (
                <>
                  <ReactECharts option={dailyChartOption} style={{ height: 280, width: "100%" }} opts={{ renderer: "svg" }} />
                  <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/30">
                          <TableHead className="text-center font-bold text-xs">التاريخ</TableHead>
                          <TableHead className="text-center font-bold text-xs">عدد الفواتير</TableHead>
                          <TableHead className="text-center font-bold text-xs">الإجمالي</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {daily.map((row) => (
                          <TableRow key={row.date}>
                            <TableCell className="text-center">{row.date}</TableCell>
                            <TableCell className="text-center">{row.invoices_count}</TableCell>
                            <TableCell className="text-center font-medium">{formatMoney(row.total)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="products" className="space-y-4">
              {loading ? <Skeleton className="h-[280px] w-full" /> : (
                <>
                  <ReactECharts option={productsChartOption} style={{ height: 280, width: "100%" }} opts={{ renderer: "svg" }} />
                  <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/30">
                          <TableHead className="text-center font-bold text-xs">المنتج</TableHead>
                          <TableHead className="text-center font-bold text-xs">الكود</TableHead>
                          <TableHead className="text-center font-bold text-xs">الكمية المباعة</TableHead>
                          <TableHead className="text-center font-bold text-xs">الإيراد</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.map((row) => (
                          <TableRow key={row.product_code}>
                            <TableCell className="text-center font-medium">{row.product_name}</TableCell>
                            <TableCell className="text-center font-mono text-sm">{row.product_code}</TableCell>
                            <TableCell className="text-center">{row.quantity_sold}</TableCell>
                            <TableCell className="text-center font-medium">{formatMoney(row.revenue)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="by-employee" className="space-y-4">
              {loading ? <Skeleton className="h-[280px] w-full" /> : (
                <>
                  <ReactECharts option={employeeChartOption} style={{ height: 280, width: "100%" }} opts={{ renderer: "svg" }} />
                  <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/30">
                          <TableHead className="text-center font-bold text-xs">الموظف</TableHead>
                          <TableHead className="text-center font-bold text-xs">عدد الفواتير</TableHead>
                          <TableHead className="text-center font-bold text-xs">إجمالي المبيعات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {employees.map((row) => (
                          <TableRow key={row.employee_name}>
                            <TableCell className="text-center font-medium">{row.employee_name}</TableCell>
                            <TableCell className="text-center">{row.invoices_count}</TableCell>
                            <TableCell className="text-center font-medium">{formatMoney(row.total_sales)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
