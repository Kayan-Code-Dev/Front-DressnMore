import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { isModuleLive } from "@/config/feature-flags";
import { ListPageStandardFilters } from "@/components/shared/ListPageStandardFilters";
import {
  getRentalOrderStatsMock,
  listRentalOrdersMock,
} from "@/features/orders/services/orders.mock.service";
import {
  getRentalOrderStats,
  listRentalOrders,
} from "@/features/orders/services/orders.api.service";
import type { RentalOrder, RentalOrderStats, RentalOrderStatus } from "@/features/orders/types/orders.types";
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
  ShoppingBag,
  Search,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Printer,
  XCircle,
  FileText,
  AlertTriangle,
  Banknote,
} from "lucide-react";

const statusMap: Record<RentalOrderStatus, { label: string; variant: "success" | "warning" | "destructive" | "info" | "secondary" }> = {
  active: { label: "نشط", variant: "success" },
  returned: { label: "مرتجع", variant: "info" },
  overdue: { label: "متأخر", variant: "destructive" },
  cancelled: { label: "ملغي", variant: "secondary" },
  pending: { label: "قيد الانتظار", variant: "warning" },
};

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  gradient,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="pt-5 pb-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs text-muted-foreground mb-1">{label}</p>
            <p className="text-xl font-black" style={{ color: "var(--color-text-primary)" }}>{value}</p>
            {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
          </div>
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: gradient }}
          >
            <Icon className="w-4 h-4 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
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

export function RentalOrdersPage() {
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<RentalOrder[]>([]);
  const [stats, setStats] = useState<RentalOrderStats | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const handleSearchChange = (value: string) => {
    setLoading(true);
    setSearch(value);
    setPage(1);
  };

  const handlePageChange = (nextPage: number) => {
    setLoading(true);
    setPage(nextPage);
  };

  useEffect(() => {
    const loadStats = isModuleLive("invoices") ? getRentalOrderStats : getRentalOrderStatsMock;
    loadStats()
      .then((res) => setStats("data" in res ? res.data : res))
      .finally(() => setStatsLoading(false));
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadOrders = isModuleLive("invoices")
      ? () => listRentalOrders({ search, page, per_page: 15 })
      : () => listRentalOrdersMock(search, page);

    loadOrders()
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
        setError(err instanceof Error ? err.message : "Failed to load orders");
        setRows([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [search, page]);

  const columns = useMemo(
    () => [
      { key: "id", title: "#" },
      { key: "client", title: "العميل" },
      { key: "employee", title: "الموظف" },
      { key: "delivery_date", title: "تاريخ التسليم" },
      { key: "return_date", title: "تاريخ الإرجاع" },
      { key: "total", title: "الإجمالي" },
      { key: "status", title: "الحالة" },
      { key: "actions", title: "إجراءات" },
    ],
    [],
  );

  return (
    <div className="w-full space-y-4" dir="rtl">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}><CardContent className="pt-5"><Skeleton className="h-16 w-full" /></CardContent></Card>
          ))
        ) : stats ? (
          <>
            <StatCard label="إجمالي الفواتير" value={stats.total} sub={`${stats.active} نشطة`} icon={FileText} gradient="linear-gradient(135deg, #475569, #64748B)" />
            <StatCard label="فواتير نشطة" value={stats.active} sub="قيد التأجير" icon={ShoppingBag} gradient="linear-gradient(135deg, #059669, #34D399)" />
            <StatCard label="متأخرات الإرجاع" value={stats.overdue} sub="تحتاج متابعة" icon={AlertTriangle} gradient="linear-gradient(135deg, #DC2626, #F87171)" />
            <StatCard label="إجمالي الإيرادات" value={`${stats.revenue} ج.م`} sub={`محصّل: ${stats.collected} ج.م`} icon={Banknote} gradient="linear-gradient(135deg, #D97706, #FBBF24)" />
          </>
        ) : null}
      </div>

      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #5170FF, #818CF8)" }}
            >
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-black" style={{ color: "var(--color-text-primary)" }}>
                فواتير التأجير
              </CardTitle>
              <CardDescription>إدارة ومتابعة فواتير تأجير الأزياء.</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" onClick={() => setFiltersOpen((v) => !v)}>
              <Filter className="h-4 w-4 ml-1.5" />
              الفلاتر
            </Button>
            <Button asChild>
              <Link to="/orders/choose-client">
                <Plus className="h-4 w-4 ml-1.5" />
                فاتورة تأجير جديدة
              </Link>
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="بحث برقم الفاتورة أو اسم العميل..."
                className="pr-9"
              />
            </div>
          </div>

          <ListPageStandardFilters open={filtersOpen} />

          {error && (
            <div className="flex items-center justify-center py-6">
              <p className="text-destructive text-sm">حدث خطأ أثناء تحميل البيانات: {error}</p>
            </div>
          )}

          {!error && (
            <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    {columns.map((col) => (
                      <TableHead key={col.key} className="text-center font-bold text-xs">{col.title}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableSkeletonRows rows={6} cols={columns.length} />
                  ) : rows.length > 0 ? (
                    rows.map((row) => {
                      const statusCfg = statusMap[row.status];
                      return (
                        <TableRow key={row.id}>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="font-mono">{row.id}</Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="font-medium">{row.client_name}</div>
                            <div className="text-xs text-muted-foreground" dir="ltr">{row.client_phone}</div>
                          </TableCell>
                          <TableCell className="text-center text-muted-foreground">{row.employee_name}</TableCell>
                          <TableCell className="text-center text-muted-foreground text-xs">{row.delivery_date}</TableCell>
                          <TableCell className="text-center text-muted-foreground text-xs">{row.return_date}</TableCell>
                          <TableCell className="text-center font-medium">{row.total_price} ج.م</TableCell>
                          <TableCell className="text-center">
                            <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Button variant="ghost" size="icon" asChild title="عرض">
                                <Link to={`/orders/${row.id}`}><Eye className="h-4 w-4" /></Link>
                              </Button>
                              <Button variant="ghost" size="icon" title="طباعة" disabled><Printer className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="icon" title="إلغاء" disabled><XCircle className="h-4 w-4 text-destructive" /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="py-10 text-center text-muted-foreground">
                        لا توجد فواتير تأجير لعرضها.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm text-muted-foreground">
            إجمالي الفواتير: <span className="font-bold">{total}</span>
          </p>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => handlePageChange(page - 1)}>
                <ChevronRight className="h-4 w-4" /> السابق
              </Button>
              <span className="text-sm text-muted-foreground px-2">{page} / {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => handlePageChange(page + 1)}>
                التالي <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
