import { useEffect, useState } from "react";
import type { SalesReportSummary } from "@/features/reports/types/reports.types";
import { getSalesReportMock } from "@/features/reports/services/reports.mock.service";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Filter } from "lucide-react";

export function SalesReportsPage() {
  const [summary, setSummary] = useState<SalesReportSummary | null>(null);

  useEffect(() => {
    getSalesReportMock().then((response) => setSummary(response.data));
  }, []);

  return (
    <div className="w-full space-y-6">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #059669, #34D399)" }}>
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-black" style={{ color: "var(--color-text-primary)" }}>تقرير المبيعات</CardTitle>
              <CardDescription>ملخص بيانات المبيعات والفواتير.</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" disabled><Filter className="h-4 w-4 ml-1.5" />فترة زمنية</Button>
            <Button variant="outline" disabled><Filter className="h-4 w-4 ml-1.5" />الفرع</Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">إجمالي المبيعات</p>
            {summary ? <p className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>{summary.total_sales.toLocaleString()}</p> : <Skeleton className="h-8 w-32" />}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">عدد الفواتير</p>
            {summary ? <p className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>{summary.invoices_count}</p> : <Skeleton className="h-8 w-20" />}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">متوسط قيمة الفاتورة</p>
            {summary ? <p className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>{summary.average_invoice_value.toLocaleString()}</p> : <Skeleton className="h-8 w-28" />}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="text-center font-bold text-xs">المقياس</TableHead>
                  <TableHead className="text-center font-bold text-xs">القيمة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summary ? (
                  <>
                    <TableRow><TableCell className="text-center">إجمالي المبيعات</TableCell><TableCell className="text-center font-medium">{summary.total_sales.toLocaleString()}</TableCell></TableRow>
                    <TableRow><TableCell className="text-center">عدد الفواتير</TableCell><TableCell className="text-center font-medium">{summary.invoices_count}</TableCell></TableRow>
                    <TableRow><TableCell className="text-center">متوسط قيمة الفاتورة</TableCell><TableCell className="text-center font-medium">{summary.average_invoice_value.toLocaleString()}</TableCell></TableRow>
                  </>
                ) : (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-center"><Skeleton className="h-5 w-full max-w-[120px] mx-auto" /></TableCell>
                      <TableCell className="text-center"><Skeleton className="h-5 w-full max-w-[80px] mx-auto" /></TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
