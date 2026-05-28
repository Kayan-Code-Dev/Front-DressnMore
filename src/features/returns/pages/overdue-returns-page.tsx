import { useEffect, useMemo, useState } from "react";
import type { OverdueReturnItem } from "@/features/returns/types/returns.types";
import { listOverdueReturnsMock } from "@/features/returns/services/returns.mock.service";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Search, Filter } from "lucide-react";

const statusMap: Record<string, { label: string; variant: "destructive" | "warning" | "success" }> = {
  overdue: { label: "متأخر", variant: "destructive" },
  contacted: { label: "تم التواصل", variant: "warning" },
  returned: { label: "تم الإرجاع", variant: "success" },
};

function TableSkeletonRows({ rows = 5, cols = 9 }: { rows?: number; cols?: number }) {
  return (<>{Array.from({ length: rows }).map((_, i) => (<TableRow key={i}>{Array.from({ length: cols }).map((__, j) => (<TableCell key={j} className="text-center"><Skeleton className="h-5 w-full max-w-[100px] mx-auto" /></TableCell>))}</TableRow>))}</>);
}

export function OverdueReturnsPage() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<OverdueReturnItem[]>([]);

  const handleSearchChange = (value: string) => { setLoading(true); setSearch(value); };

  useEffect(() => {
    listOverdueReturnsMock(search)
      .then((response) => setRows(response.data))
      .finally(() => setLoading(false));
  }, [search]);

  const columns = useMemo(() => [
    { key: "id", title: "#" },
    { key: "customer", title: "العميل" },
    { key: "invoice_number", title: "رقم الفاتورة" },
    { key: "item", title: "الصنف" },
    { key: "delivery_date", title: "تاريخ التسليم" },
    { key: "expected_return_date", title: "تاريخ الإرجاع المتوقع" },
    { key: "overdue_days", title: "أيام التأخير" },
    { key: "amount", title: "المبلغ" },
    { key: "status", title: "الحالة" },
  ], []);

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #DC2626, #F87171)" }}>
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-black" style={{ color: "var(--color-text-primary)" }}>المرتجعات المتأخرة</CardTitle>
              <CardDescription>عرض وتتبع المرتجعات التي تجاوزت موعدها.</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" disabled><Filter className="h-4 w-4 ml-1.5" />الفلاتر</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input value={search} onChange={(e) => handleSearchChange(e.target.value)} placeholder="بحث في المرتجعات المتأخرة..." className="pr-9" />
            </div>
          </div>
          <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
            <Table>
              <TableHeader><TableRow className="bg-muted/30">{columns.map((col) => (<TableHead key={col.key} className="text-center font-bold text-xs">{col.title}</TableHead>))}</TableRow></TableHeader>
              <TableBody>
                {loading ? (<TableSkeletonRows rows={5} cols={columns.length} />) : rows.length > 0 ? (
                  rows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="text-center text-muted-foreground">{row.id}</TableCell>
                      <TableCell className="text-center font-medium">{row.customer}</TableCell>
                      <TableCell className="text-center"><Badge variant="outline" className="font-mono">{row.invoice_number}</Badge></TableCell>
                      <TableCell className="text-center">{row.item}</TableCell>
                      <TableCell className="text-center text-muted-foreground">{row.delivery_date}</TableCell>
                      <TableCell className="text-center text-muted-foreground">{row.expected_return_date}</TableCell>
                      <TableCell className="text-center"><Badge variant="destructive">{row.overdue_days} يوم</Badge></TableCell>
                      <TableCell className="text-center font-medium">{row.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-center"><Badge variant={statusMap[row.status]?.variant ?? "destructive"}>{statusMap[row.status]?.label ?? row.status}</Badge></TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={columns.length} className="py-10 text-center text-muted-foreground">لا توجد مرتجعات متأخرة.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter><p className="text-sm text-muted-foreground">إجمالي المرتجعات المتأخرة: <span className="font-bold">{rows.length}</span></p></CardFooter>
      </Card>
    </div>
  );
}
