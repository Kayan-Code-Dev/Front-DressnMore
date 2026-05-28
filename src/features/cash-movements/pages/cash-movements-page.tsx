import { useEffect, useMemo, useState } from "react";
import { isModuleLive } from "@/config/feature-flags";
import type { CashMovementItem } from "@/features/cash-movements/types/cash-movements.types";
import { listCashMovementsMock } from "@/features/cash-movements/services/cash-movements.mock.service";
import { listCashMovements } from "@/features/cash-movements/services/cash-movements.api.service";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeftRight, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";

function fetchCashMovementData(searchTerm: string, currentPage: number) {
  if (isModuleLive("cashMovements")) {
    return listCashMovements({ search: searchTerm, page: currentPage, per_page: 15 });
  }
  return listCashMovementsMock(searchTerm);
}

const typeMap: Record<string, { label: string; variant: "success" | "destructive" }> = {
  income: { label: "إيراد", variant: "success" },
  expense: { label: "مصروف", variant: "destructive" },
};

function TableSkeletonRows({ rows = 5, cols = 8 }: { rows?: number; cols?: number }) {
  return (<>{Array.from({ length: rows }).map((_, i) => (<TableRow key={i}>{Array.from({ length: cols }).map((__, j) => (<TableCell key={j} className="text-center"><Skeleton className="h-5 w-full max-w-[100px] mx-auto" /></TableCell>))}</TableRow>))}</>);
}

export function CashMovementsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<CashMovementItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const handleSearchChange = (value: string) => { setLoading(true); setSearch(value); setPage(1); };
  const handlePageChange = (nextPage: number) => { setLoading(true); setPage(nextPage); };

  useEffect(() => {
    let cancelled = false;
    fetchCashMovementData(search, page)
      .then((response) => {
        if (cancelled) return;
        setRows(response.data);
        const meta = response.meta as { last_page?: number; total?: number } | null | undefined;
        setTotalPages(meta?.last_page ?? 1);
        setTotal(meta?.total ?? response.data.length);
        setError(null);
      })
      .catch((err: unknown) => { if (cancelled) return; setError(err instanceof Error ? err.message : "Failed to load cash movements"); setRows([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [search, page]);

  const columns = useMemo(() => [
    { key: "id", title: "#" },
    { key: "cashbox", title: "الصندوق" },
    { key: "type", title: "النوع" },
    { key: "category", title: "التصنيف" },
    { key: "amount", title: "المبلغ" },
    { key: "balance_after", title: "الرصيد بعد" },
    { key: "reference", title: "المرجع" },
    { key: "created_at", title: "التاريخ" },
  ], []);

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #2563EB, #60A5FA)" }}>
              <ArrowLeftRight className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-black" style={{ color: "var(--color-text-primary)" }}>حركات الصندوق</CardTitle>
              <CardDescription>عرض وتتبع حركات النقد في الصناديق.</CardDescription>
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
              <Input value={search} onChange={(e) => handleSearchChange(e.target.value)} placeholder="بحث في الحركات..." className="pr-9" />
            </div>
          </div>
          {error && <div className="flex items-center justify-center py-6"><p className="text-destructive text-sm">حدث خطأ أثناء تحميل البيانات: {error}</p></div>}
          {!error && (
            <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
              <Table>
                <TableHeader><TableRow className="bg-muted/30">{columns.map((col) => (<TableHead key={col.key} className="text-center font-bold text-xs">{col.title}</TableHead>))}</TableRow></TableHeader>
                <TableBody>
                  {loading ? (<TableSkeletonRows rows={5} cols={columns.length} />) : rows.length > 0 ? (
                    rows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="text-center text-muted-foreground">{row.id}</TableCell>
                        <TableCell className="text-center text-muted-foreground">{row.cashbox}</TableCell>
                        <TableCell className="text-center"><Badge variant={typeMap[row.type]?.variant ?? "secondary"}>{typeMap[row.type]?.label ?? row.type}</Badge></TableCell>
                        <TableCell className="text-center">{row.category}</TableCell>
                        <TableCell className="text-center font-medium">{row.amount.toLocaleString()}</TableCell>
                        <TableCell className="text-center font-medium">{row.balance_after.toLocaleString()}</TableCell>
                        <TableCell className="text-center text-muted-foreground text-xs">{row.reference || "—"}</TableCell>
                        <TableCell className="text-center text-muted-foreground">{row.created_at}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={columns.length} className="py-10 text-center text-muted-foreground">لا توجد حركات لعرضها.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm text-muted-foreground">إجمالي الحركات: <span className="font-bold">{total}</span></p>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => handlePageChange(page - 1)}><ChevronRight className="h-4 w-4" />السابق</Button>
              <span className="text-sm text-muted-foreground px-2">{page} / {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => handlePageChange(page + 1)}>التالي<ChevronLeft className="h-4 w-4" /></Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
