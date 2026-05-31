import { useEffect, useState } from "react";
import type { TailoringReportSummary } from "@/features/reports/types/reports.types";
import { getTailoringReportMock } from "@/features/reports/services/reports.mock.service";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Scissors, Filter } from "lucide-react";
import { ListPageStandardFilters } from "@/components/shared/ListPageStandardFilters";

export function TailoringReportsPage() {
  const [summary, setSummary] = useState<TailoringReportSummary | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    getTailoringReportMock().then((response) => setSummary(response.data));
  }, []);

  return (
    <div className="w-full space-y-6">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #7C3AED, #A78BFA)" }}>
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-black" style={{ color: "var(--color-text-primary)" }}>تقرير التفصيل</CardTitle>
              <CardDescription>ملخص طلبات التفصيل والإنتاج.</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" onClick={() => setFiltersOpen((v) => !v)}><Filter className="h-4 w-4 ml-1.5" />فترة زمنية</Button>
            <Button variant="outline" onClick={() => setFiltersOpen((v) => !v)}><Filter className="h-4 w-4 ml-1.5" />الفرع</Button>
          </div>
        </CardHeader>
      </Card>

      <ListPageStandardFilters open={filtersOpen} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">إجمالي الطلبات</p>
            {summary ? <p className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>{summary.total_orders}</p> : <Skeleton className="h-8 w-20" />}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">جاهزة</p>
            {summary ? <p className="text-2xl font-bold text-emerald-600">{summary.ready_orders}</p> : <Skeleton className="h-8 w-20" />}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">متأخرة</p>
            {summary ? <p className="text-2xl font-bold text-red-600">{summary.late_orders}</p> : <Skeleton className="h-8 w-20" />}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">إجمالي الإيرادات</p>
            {summary ? <p className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>{summary.total_revenue.toLocaleString()}</p> : <Skeleton className="h-8 w-28" />}
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
                    <TableRow><TableCell className="text-center">إجمالي الطلبات</TableCell><TableCell className="text-center font-medium">{summary.total_orders}</TableCell></TableRow>
                    <TableRow><TableCell className="text-center">الطلبات الجاهزة</TableCell><TableCell className="text-center font-medium">{summary.ready_orders}</TableCell></TableRow>
                    <TableRow><TableCell className="text-center">الطلبات المتأخرة</TableCell><TableCell className="text-center font-medium">{summary.late_orders}</TableCell></TableRow>
                    <TableRow><TableCell className="text-center">قيد التنفيذ</TableCell><TableCell className="text-center font-medium">{summary.in_progress_orders}</TableCell></TableRow>
                    <TableRow><TableCell className="text-center">إجمالي الإيرادات</TableCell><TableCell className="text-center font-medium">{summary.total_revenue.toLocaleString()}</TableCell></TableRow>
                  </>
                ) : (
                  Array.from({ length: 5 }).map((_, i) => (
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
