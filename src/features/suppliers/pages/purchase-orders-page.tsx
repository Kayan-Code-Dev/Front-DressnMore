import { useEffect, useMemo, useState } from "react";
import { ListPageStandardFilters } from "@/components/shared/ListPageStandardFilters";

import type { PurchaseOrderItem } from "@/features/suppliers/types/suppliers.types";
import { listPurchaseOrdersMock } from "@/features/suppliers/services/suppliers.mock.service";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ClipboardList, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { formatNumber } from "@/shared/lib/format/numbers";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function fetchPurchaseOrderData(searchTerm: string, _currentPage: number) {
  return listPurchaseOrdersMock(searchTerm);
}

const statusMap: Record<string, { label: string; variant: "success" | "warning" | "destructive" | "info" }> = {
  open: { label: "مفتوح", variant: "info" },
  partially_paid: { label: "مدفوع جزئياً", variant: "warning" },
  paid: { label: "مدفوع", variant: "success" },
  returned: { label: "مرتجع", variant: "destructive" },
};

function StatusBadge({ status }: { status: string }) {
  const config = statusMap[status] ?? { label: status, variant: "info" as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

function TableSkeletonRows({ rows = 5, cols = 8 }: { rows?: number; cols?: number }) {
  return (<>{Array.from({ length: rows }).map((_, i) => (<TableRow key={i}>{Array.from({ length: cols }).map((__, j) => (<TableCell key={j} className="text-center"><Skeleton className="h-5 w-full max-w-[100px] mx-auto" /></TableCell>))}</TableRow>))}</>);
}

export function PurchaseOrdersPage() {
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<PurchaseOrderItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const handleSearchChange = (value: string) => { setLoading(true); setSearch(value); setPage(1); };
  const handlePageChange = (nextPage: number) => { setLoading(true); setPage(nextPage); };

  useEffect(() => {
    let cancelled = false;
    fetchPurchaseOrderData(search, page)
      .then((response) => {
        if (cancelled) return;
        setRows(response.data);
        const meta = response.meta as { last_page?: number; total?: number } | null | undefined;
        setTotalPages(meta?.last_page ?? 1);
        setTotal(meta?.total ?? response.data.length);
        setError(null);
      })
      .catch((err: unknown) => { if (cancelled) return; setError(err instanceof Error ? err.message : "Failed to load purchase orders"); setRows([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [search, page]);

  const columns = useMemo(() => [
    { key: "id", title: "#" },
    { key: "purchase_order_number", title: "رقم الطلب" },
    { key: "supplier", title: "المورد" },
    { key: "total", title: "الإجمالي" },
    { key: "paid_amount", title: "المدفوع" },
    { key: "remaining_amount", title: "المتبقي" },
    { key: "status", title: "الحالة" },
    { key: "order_date", title: "التاريخ" },
  ], []);

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #0D9488, #2DD4BF)" }}>
              <ClipboardList className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-black" style={{ color: "var(--color-text-primary)" }}>أوامر الشراء</CardTitle>
              <CardDescription>عرض وإدارة أوامر الشراء من الموردين.</CardDescription>
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
              <Input value={search} onChange={(e) => handleSearchChange(e.target.value)} placeholder="بحث عن أمر شراء..." className="pr-9" />
            </div>
          </div>
          <ListPageStandardFilters open={filtersOpen} />

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
                        <TableCell className="text-center"><Badge variant="outline" className="font-mono">{row.purchase_order_number}</Badge></TableCell>
                        <TableCell className="text-center font-medium">{row.supplier}</TableCell>
                        <TableCell className="text-center font-medium">{formatNumber(row.total)}</TableCell>
                        <TableCell className="text-center text-muted-foreground">{formatNumber(row.paid_amount)}</TableCell>
                        <TableCell className="text-center font-medium">{formatNumber(row.remaining_amount)}</TableCell>
                        <TableCell className="text-center"><StatusBadge status={row.status} /></TableCell>
                        <TableCell className="text-center text-muted-foreground">{row.order_date}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={columns.length} className="py-10 text-center text-muted-foreground">لا توجد أوامر شراء لعرضها.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm text-muted-foreground">إجمالي أوامر الشراء: <span className="font-bold">{total}</span></p>
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
