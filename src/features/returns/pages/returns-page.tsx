import { useEffect, useMemo, useState } from "react";
import { ListPageStandardFilters } from "@/components/shared/ListPageStandardFilters";
import type { ReturnItem } from "@/features/returns/types/returns.types";
import { listReturnsMock } from "@/features/returns/services/returns.mock.service";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Undo2, Search, Filter } from "lucide-react";

const statusMap: Record<string, { label: string; variant: "success" | "warning" }> = {
  requested: { label: "مطلوب", variant: "warning" },
  returned: { label: "تم الإرجاع", variant: "success" },
};

function TableSkeletonRows({ rows = 5, cols = 8 }: { rows?: number; cols?: number }) {
  return (<>{Array.from({ length: rows }).map((_, i) => (<TableRow key={i}>{Array.from({ length: cols }).map((__, j) => (<TableCell key={j} className="text-center"><Skeleton className="h-5 w-full max-w-[100px] mx-auto" /></TableCell>))}</TableRow>))}</>);
}

export function ReturnsPage() {
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<ReturnItem[]>([]);

  const handleSearchChange = (value: string) => { setLoading(true); setSearch(value); };

  useEffect(() => {
    listReturnsMock(search)
      .then((response) => setRows(response.data))
      .finally(() => setLoading(false));
  }, [search]);

  const columns = useMemo(() => [
    { key: "id", title: "#" },
    { key: "order_id", title: "رقم الطلب" },
    { key: "client", title: "العميل" },
    { key: "employee", title: "الموظف" },
    { key: "cloth_name", title: "القماش" },
    { key: "cloth_code", title: "كود القماش" },
    { key: "return_date", title: "تاريخ الإرجاع" },
    { key: "status", title: "الحالة" },
  ], []);

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #F59E0B, #FCD34D)" }}>
              <Undo2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-black" style={{ color: "var(--color-text-primary)" }}>إدارة المرتجعات</CardTitle>
              <CardDescription>عرض وتتبع عمليات الإرجاع.</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" onClick={() => setFiltersOpen((v) => !v)}><Filter className="h-4 w-4 ml-1.5" />الفلاتر</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input value={search} onChange={(e) => handleSearchChange(e.target.value)} placeholder="بحث في المرتجعات..." className="pr-9" />
            </div>
          </div>
          <ListPageStandardFilters open={filtersOpen} />
          <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
            <Table>
              <TableHeader><TableRow className="bg-muted/30">{columns.map((col) => (<TableHead key={col.key} className="text-center font-bold text-xs">{col.title}</TableHead>))}</TableRow></TableHeader>
              <TableBody>
                {loading ? (<TableSkeletonRows rows={5} cols={columns.length} />) : rows.length > 0 ? (
                  rows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="text-center text-muted-foreground">{row.id}</TableCell>
                      <TableCell className="text-center"><Badge variant="outline" className="font-mono">{row.order_id}</Badge></TableCell>
                      <TableCell className="text-center font-medium">{row.client}</TableCell>
                      <TableCell className="text-center text-muted-foreground">{row.employee}</TableCell>
                      <TableCell className="text-center">{row.cloth_name}</TableCell>
                      <TableCell className="text-center"><Badge variant="outline" className="font-mono">{row.cloth_code}</Badge></TableCell>
                      <TableCell className="text-center text-muted-foreground">{row.return_date}</TableCell>
                      <TableCell className="text-center"><Badge variant={statusMap[row.status]?.variant ?? "secondary"}>{statusMap[row.status]?.label ?? row.status}</Badge></TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={columns.length} className="py-10 text-center text-muted-foreground">لا توجد مرتجعات لعرضها.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter><p className="text-sm text-muted-foreground">إجمالي المرتجعات: <span className="font-bold">{rows.length}</span></p></CardFooter>
      </Card>
    </div>
  );
}
