import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ListPageStandardFilters } from "@/components/shared/ListPageStandardFilters";
import { searchDeliveriesMock } from "@/features/orders/services/orders.mock.service";
import type { DeliverySearchRow } from "@/features/orders/types/orders.types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Truck,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Package,
  RotateCcw,
  Clock,
  AlertTriangle,
} from "lucide-react";

const typeLabels: Record<string, { label: string; variant: "info" | "warning" }> = {
  delivery: { label: "تسليم", variant: "info" },
  return: { label: "إرجاع", variant: "warning" },
};

const statusLabels: Record<string, { label: string; variant: "success" | "warning" | "destructive" }> = {
  pending: { label: "قيد الانتظار", variant: "warning" },
  done: { label: "تم", variant: "success" },
  overdue: { label: "متأخر", variant: "destructive" },
};

function TableSkeletonRows({ rows = 5, cols = 8 }: { rows?: number; cols?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: cols }).map((__, j) => (
            <TableCell key={j} className="text-center"><Skeleton className="h-5 w-full max-w-[90px] mx-auto" /></TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

export function DeliverySearchPage() {
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<DeliverySearchRow[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const stats = useMemo(() => ({
    deliveries: rows.filter((r) => r.type === "delivery").length,
    returns: rows.filter((r) => r.type === "return").length,
    overdue: rows.filter((r) => r.status === "overdue").length,
    pending: rows.filter((r) => r.status === "pending").length,
  }), [rows]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    searchDeliveriesMock(search, page)
      .then((response) => {
        if (cancelled) return;
        setRows(response.data);
        const meta = response.meta as { last_page?: number; total?: number } | null | undefined;
        setTotalPages(meta?.last_page ?? 1);
        setTotal(meta?.total ?? response.data.length);
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [search, page]);

  const columns = useMemo(
    () => [
      { key: "order_id", title: "رقم الفاتورة" },
      { key: "client", title: "العميل" },
      { key: "cloth", title: "الصنف" },
      { key: "type", title: "النوع" },
      { key: "date", title: "التاريخ" },
      { key: "status", title: "الحالة" },
      { key: "employee", title: "الموظف" },
    ],
    [],
  );

  return (
    <div className="w-full space-y-4" dir="rtl">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="pt-5 pb-4 flex items-center gap-3"><div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0EA5E9, #38BDF8)" }}><Package className="w-4 h-4 text-white" /></div><div><p className="text-xs text-muted-foreground">تسليمات</p><p className="text-xl font-black">{stats.deliveries}</p></div></CardContent></Card>
        <Card><CardContent className="pt-5 pb-4 flex items-center gap-3"><div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #F59E0B, #FCD34D)" }}><RotateCcw className="w-4 h-4 text-white" /></div><div><p className="text-xs text-muted-foreground">إرجاعات</p><p className="text-xl font-black">{stats.returns}</p></div></CardContent></Card>
        <Card><CardContent className="pt-5 pb-4 flex items-center gap-3"><div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #EAB308, #FDE047)" }}><Clock className="w-4 h-4 text-white" /></div><div><p className="text-xs text-muted-foreground">قيد الانتظار</p><p className="text-xl font-black">{stats.pending}</p></div></CardContent></Card>
        <Card><CardContent className="pt-5 pb-4 flex items-center gap-3"><div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #DC2626, #F87171)" }}><AlertTriangle className="w-4 h-4 text-white" /></div><div><p className="text-xs text-muted-foreground">متأخر</p><p className="text-xl font-black">{stats.overdue}</p></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #0891B2, #22D3EE)" }}>
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-black" style={{ color: "var(--color-text-primary)" }}>بحث التسليمات والإرجاعات</CardTitle>
              <CardDescription>متابعة مواعيد تسليم وإرجاع الأزياء.</CardDescription>
            </div>
          </div>
          <Button variant="outline" onClick={() => setFiltersOpen((v) => !v)}><Filter className="h-4 w-4 ml-1.5" />الفلاتر</Button>
        </CardHeader>
        <CardContent>
          <div className="relative max-w-sm mb-4">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => { setLoading(true); setSearch(e.target.value); setPage(1); }} placeholder="بحث بالعميل أو الصنف أو رقم الفاتورة..." className="pr-9" />
          </div>
          <ListPageStandardFilters open={filtersOpen} />

          <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  {columns.map((col) => (<TableHead key={col.key} className="text-center font-bold text-xs">{col.title}</TableHead>))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableSkeletonRows rows={5} cols={columns.length} />
                ) : rows.length > 0 ? (
                  rows.map((row) => {
                    const typeCfg = typeLabels[row.type];
                    const statusCfg = statusLabels[row.status];
                    return (
                      <TableRow key={row.id}>
                        <TableCell className="text-center">
                          <Button variant="link" size="sm" asChild className="font-mono p-0 h-auto">
                            <Link to={`/orders/${row.order_id}`}>{row.order_id}</Link>
                          </Button>
                        </TableCell>
                        <TableCell className="text-center font-medium">{row.client_name}</TableCell>
                        <TableCell className="text-center">
                          <div>{row.cloth_name}</div>
                          <Badge variant="outline" className="font-mono text-xs mt-0.5">{row.cloth_code}</Badge>
                        </TableCell>
                        <TableCell className="text-center"><Badge variant={typeCfg.variant}>{typeCfg.label}</Badge></TableCell>
                        <TableCell className="text-center text-muted-foreground text-xs">{row.scheduled_date}</TableCell>
                        <TableCell className="text-center"><Badge variant={statusCfg.variant}>{statusCfg.label}</Badge></TableCell>
                        <TableCell className="text-center text-muted-foreground">{row.employee_name}</TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow><TableCell colSpan={columns.length} className="py-10 text-center text-muted-foreground">لا توجد نتائج.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm text-muted-foreground">إجمالي النتائج: <span className="font-bold">{total}</span></p>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => { setLoading(true); setPage(page - 1); }}><ChevronRight className="h-4 w-4" /> السابق</Button>
              <span className="text-sm text-muted-foreground px-2">{page} / {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => { setLoading(true); setPage(page + 1); }}>التالي <ChevronLeft className="h-4 w-4" /></Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
