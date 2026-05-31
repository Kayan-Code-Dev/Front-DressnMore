import { useEffect, useMemo, useState } from "react";
import { ListPageStandardFilters } from "@/components/shared/ListPageStandardFilters";
import { isModuleLive } from "@/config/feature-flags";
import type { PaymentItem } from "@/features/payments/types/payments.types";
import { listPaymentsMock } from "@/features/payments/services/payments.mock.service";
import { listPayments } from "@/features/payments/services/payments.api.service";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
} from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CreditCard, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";

function fetchPaymentData(searchTerm: string, currentPage: number) {
  if (isModuleLive("payments")) {
    return listPayments({ search: searchTerm, page: currentPage, per_page: 15 });
  }
  return listPaymentsMock(searchTerm);
}

const statusMap: Record<string, { label: string; variant: "success" | "warning" | "destructive" }> = {
  pending: { label: "معلق", variant: "warning" },
  paid: { label: "مدفوع", variant: "success" },
  cancelled: { label: "ملغى", variant: "destructive" },
};

const typeMap: Record<string, string> = {
  initial: "دفعة أولى",
  normal: "عادي",
  fee: "رسوم",
};

function StatusBadge({ status }: { status: string }) {
  const config = statusMap[status] ?? { label: status, variant: "warning" as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

function TableSkeletonRows({ rows = 5, cols = 8 }: { rows?: number; cols?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: cols }).map((__, j) => (
            <TableCell key={j} className="text-center">
              <Skeleton className="h-5 w-full max-w-[100px] mx-auto" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

export function PaymentsPage() {
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<PaymentItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const handleSearchChange = (value: string) => { setLoading(true); setSearch(value); setPage(1); };
  const handlePageChange = (nextPage: number) => { setLoading(true); setPage(nextPage); };

  useEffect(() => {
    let cancelled = false;
    fetchPaymentData(search, page)
      .then((response) => {
        if (cancelled) return;
        setRows(response.data);
        const meta = response.meta as { last_page?: number; total?: number } | null | undefined;
        setTotalPages(meta?.last_page ?? 1);
        setTotal(meta?.total ?? response.data.length);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load payments");
        setRows([]);
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [search, page]);

  const columns = useMemo(() => [
    { key: "id", title: "#" },
    { key: "customer", title: "العميل" },
    { key: "branch", title: "الفرع" },
    { key: "amount", title: "المبلغ" },
    { key: "payment_type", title: "نوع الدفع" },
    { key: "status", title: "الحالة" },
    { key: "payment_date", title: "تاريخ الدفع" },
    { key: "notes", title: "ملاحظات" },
  ], []);

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #059669, #34D399)" }}>
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-black" style={{ color: "var(--color-text-primary)" }}>إدارة المدفوعات</CardTitle>
              <CardDescription>عرض وإدارة المدفوعات والتحصيلات.</CardDescription>
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
              <Input value={search} onChange={(e) => handleSearchChange(e.target.value)} placeholder="بحث عن مدفوعات..." className="pr-9" />
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
                        <TableCell className="text-center font-medium">{row.customer}</TableCell>
                        <TableCell className="text-center text-muted-foreground">{row.branch}</TableCell>
                        <TableCell className="text-center font-medium">{row.amount.toLocaleString()}</TableCell>
                        <TableCell className="text-center"><Badge variant="secondary">{typeMap[row.payment_type] ?? row.payment_type}</Badge></TableCell>
                        <TableCell className="text-center"><StatusBadge status={row.status} /></TableCell>
                        <TableCell className="text-center text-muted-foreground">{row.payment_date}</TableCell>
                        <TableCell className="text-center text-muted-foreground text-xs max-w-[150px] truncate">{row.notes || "—"}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={columns.length} className="py-10 text-center text-muted-foreground">لا توجد مدفوعات لعرضها.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm text-muted-foreground">إجمالي المدفوعات: <span className="font-bold">{total}</span></p>
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
