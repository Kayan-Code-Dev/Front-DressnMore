import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { isModuleLive } from "@/config/feature-flags";
import {
  getRentalOrderStatsMock,
  listRentalOrdersMock,
} from "@/features/orders/services/orders.mock.service";
import {
  getRentalOrderStats,
  listRentalOrders,
} from "@/features/orders/services/orders.api.service";
import type {
  RentalOrder,
  RentalOrderStats,
  RentalOrderStatus,
  RentalPaymentStatus,
  RentalStatusFilter,
} from "@/features/orders/types/orders.types";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatNumber } from "@/shared/lib/format/numbers";
import {
  Key,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Eye,
  Printer,
  FileText,
  Pencil,
  Shield,
  CreditCard,
  CheckCircle2,
  CalendarDays,
  Trash2,
} from "lucide-react";
import { cn } from "@/shared/utils/cn";

const statusMap: Record<
  RentalOrderStatus,
  { label: string; variant: "success" | "warning" | "destructive" | "info" | "secondary" }
> = {
  active: { label: "نشط", variant: "success" },
  returned: { label: "مرتجع", variant: "info" },
  overdue: { label: "متأخر", variant: "destructive" },
  cancelled: { label: "ملغي", variant: "secondary" },
  pending: { label: "قيد الانتظار", variant: "warning" },
};

const paymentStatusMap: Record<
  RentalPaymentStatus,
  { label: string; variant: "success" | "warning" | "destructive" | "secondary" }
> = {
  paid: { label: "مدفوع (إيجار)", variant: "success" },
  partially_paid: { label: "مدفوع جزئياً (إيجار)", variant: "warning" },
  unpaid: { label: "غير مدفوع", variant: "secondary" },
};

const statusFilters: { value: RentalStatusFilter; label: string }[] = [
  { value: "all", label: "الكل" },
  { value: "active", label: "نشط" },
  { value: "returned", label: "مرتجع" },
  { value: "overdue", label: "متأخر" },
  { value: "cancelled", label: "ملغي" },
];

const PER_PAGE_OPTIONS = [6, 10, 15, 25, 50];

function StatCard({
  label,
  value,
  sub,
  gradient,
}: {
  label: string;
  value: string | number;
  sub?: string;
  gradient: string;
}) {
  return (
    <div
      className="rounded-xl p-4 text-white shadow-sm"
      style={{ background: gradient }}
    >
      <p className="text-xs opacity-90 mb-1">{label}</p>
      <p className="text-2xl font-black">{value}</p>
      {sub && <p className="text-xs opacity-80 mt-1">{sub}</p>}
    </div>
  );
}

function TableSkeletonRows({ rows = 5 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-16 w-full" /></TableCell>
          <TableCell><Skeleton className="h-16 w-full" /></TableCell>
          <TableCell><Skeleton className="h-16 w-full" /></TableCell>
          <TableCell><Skeleton className="h-16 w-full" /></TableCell>
          <TableCell><Skeleton className="h-16 w-full" /></TableCell>
        </TableRow>
      ))}
    </>
  );
}

function formatDate(value?: string) {
  if (!value) return "—";
  return value;
}

function getCustomer(row: RentalOrder) {
  return row.customer ?? {
    name: row.client_name,
    national_id: "",
    phone: row.client_phone,
    whatsapp: "",
    address: "",
  };
}

export function RentalOrdersPage() {
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<RentalStatusFilter>("all");
  const [perPage, setPerPage] = useState(15);
  const [rows, setRows] = useState<RentalOrder[]>([]);
  const [stats, setStats] = useState<RentalOrderStats | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const apiStatus = statusFilter === "all" ? undefined : statusFilter;

  const reload = () => {
    setLoading(true);
    setStatsLoading(true);
  };

  const handleSearchChange = (value: string) => {
    reload();
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value: RentalStatusFilter) => {
    reload();
    setStatusFilter(value);
    setPage(1);
  };

  const handlePerPageChange = (value: string) => {
    reload();
    setPerPage(Number(value));
    setPage(1);
  };

  const handlePageChange = (nextPage: number) => {
    setLoading(true);
    setPage(nextPage);
  };

  useEffect(() => {
    let cancelled = false;
    const loadStats = isModuleLive("invoices") ? getRentalOrderStats : getRentalOrderStatsMock;

    loadStats()
      .then((res) => {
        if (cancelled) return;
        setStats("data" in res ? res.data : res);
      })
      .finally(() => {
        if (!cancelled) setStatsLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const filters = { status: apiStatus, search, page, per_page: perPage };

    const loadOrders = isModuleLive("invoices")
      ? () => listRentalOrders(filters)
      : () => listRentalOrdersMock(search, page, { status: apiStatus }, perPage);

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
  }, [search, page, perPage, apiStatus]);

  const columns = useMemo(
    () => [
      { key: "index", title: "#" },
      { key: "customer", title: "بيانات العميل" },
      { key: "dates", title: "التواريخ / الإجراءات" },
      { key: "items", title: "الأصناف / المبالغ / الحالة" },
      { key: "employee", title: "الموظف" },
    ],
    [],
  );

  return (
    <div className="w-full space-y-4" dir="rtl">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-black flex items-center gap-2" style={{ color: "var(--color-text-primary)" }}>
            <Key className="w-5 h-5 text-primary" />
            قسم الإيجار
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">فواتير الإيجار — إدارة عقود الإيجار ومتابعة المنتجات المؤجرة</p>
        </div>
        <Button asChild className="font-bold">
          <Link to="/orders/choose-client">
            <Plus className="h-4 w-4 ml-1.5" />
            فاتورة إيجار جديدة
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {statsLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))
        ) : stats ? (
          <>
            <StatCard
              label="إجمالي الفواتير"
              value={stats.total}
              sub={`${stats.active} نشطة`}
              gradient="linear-gradient(135deg, #64748B, #94A3B8)"
            />
            <StatCard
              label="فواتير نشطة"
              value={stats.active}
              sub={`${stats.returned} مرتجعة`}
              gradient="linear-gradient(135deg, #059669, #34D399)"
            />
            <StatCard
              label="متأخرات الإرجاع"
              value={stats.overdue}
              sub="تحتاج متابعة"
              gradient="linear-gradient(135deg, #DC2626, #F87171)"
            />
            <StatCard
              label="إجمالي الإيرادات"
              value={`${formatNumber(stats.revenue)} ج.م`}
              sub={`محصّل: ${formatNumber(stats.collected)} ج.م`}
              gradient="linear-gradient(135deg, #D97706, #FBBF24)"
            />
            <StatCard
              label="المتبقي للتحصيل"
              value={`${formatNumber(stats.remaining)} ج.م`}
              sub="من جميع الفواتير"
              gradient="linear-gradient(135deg, #DB2777, #F472B6)"
            />
          </>
        ) : null}
      </div>

      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #5170FF, #818CF8)" }}
            >
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-black" style={{ color: "var(--color-text-primary)" }}>
                فواتير الإيجار
              </CardTitle>
              <CardDescription>إدارة عقود الإيجار ومتابعة المنتجات المؤجرة</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="ابحث بالاسم أو الهاتف أو الرقم القومي..."
                className="pr-9"
              />
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {statusFilters.map((filter) => (
                <Button
                  key={filter.value}
                  size="sm"
                  variant={statusFilter === filter.value ? "default" : "outline"}
                  className={cn("rounded-full px-4", statusFilter === filter.value && "font-bold")}
                  onClick={() => handleStatusChange(filter.value)}
                >
                  {filter.label}
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Select value={String(perPage)} onValueChange={handlePerPageChange}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PER_PAGE_OPTIONS.map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} فاتورة
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && (
            <div className="flex items-center justify-center py-6">
              <p className="text-destructive text-sm">حدث خطأ أثناء تحميل البيانات: {error}</p>
            </div>
          )}

          {!error && (
            <div className="rounded-lg border overflow-x-auto" style={{ borderColor: "var(--color-border)" }}>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    {columns.map((col) => (
                      <TableHead key={col.key} className="text-center font-bold text-xs whitespace-nowrap">
                        {col.title}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableSkeletonRows rows={6} />
                  ) : rows.length > 0 ? (
                    rows.map((row, index) => {
                      const statusCfg = statusMap[row.status];
                      const paymentCfg = paymentStatusMap[row.payment_status ?? "unpaid"];
                      const customer = getCustomer(row);
                      const itemsPreview = row.items_preview ?? [];

                      return (
                        <TableRow key={row.id} className="align-top">
                          <TableCell className="text-center whitespace-nowrap">
                            <Badge variant="outline" className="font-mono text-xs">
                              #{index + 1 + (page - 1) * perPage}
                            </Badge>
                          </TableCell>

                          <TableCell className="min-w-[200px]">
                            <div className="space-y-1 text-sm">
                              <p className="font-bold">{customer.name}</p>
                              {customer.national_id && (
                                <p className="text-xs text-muted-foreground">
                                  الرقم القومي: <span dir="ltr">{customer.national_id}</span>
                                </p>
                              )}
                              {customer.phone && (
                                <p className="text-xs text-muted-foreground">
                                  الهاتف: <span dir="ltr">{customer.phone}</span>
                                </p>
                              )}
                              {customer.whatsapp && (
                                <p className="text-xs text-muted-foreground">
                                  هاتف الواتساب: <span dir="ltr">{customer.whatsapp}</span>
                                </p>
                              )}
                              {customer.address && (
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                  العنوان: {customer.address}
                                </p>
                              )}
                            </div>
                          </TableCell>

                          <TableCell className="min-w-[220px]">
                            <div className="space-y-2">
                              <div className="space-y-0.5 text-xs text-muted-foreground">
                                <p>تاريخ الفاتورة: <span className="text-foreground">{formatDate(row.invoice_date)}</span></p>
                                <p>استلام: <span className="text-foreground">{formatDate(row.delivery_date)}</span></p>
                                <p>الفرح: <span className="text-foreground">{formatDate(row.event_date)}</span></p>
                                <p>استرجاع: <span className="text-foreground">{formatDate(row.return_date)}</span></p>
                              </div>
                              <div className="flex items-center justify-center gap-0.5 flex-wrap pt-1 border-t" style={{ borderColor: "var(--color-border)" }}>
                                <Button variant="ghost" size="icon" className="h-7 w-7" title="طباعة" disabled>
                                  <Printer className="h-3.5 w-3.5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7" title="عرض المستند" disabled>
                                  <FileText className="h-3.5 w-3.5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7" title="تعديل" disabled>
                                  <Pencil className="h-3.5 w-3.5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7" asChild title="عرض التفاصيل">
                                  <Link to={`/orders/${row.id}`}><Eye className="h-3.5 w-3.5" /></Link>
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7" title="الضمان" disabled>
                                  <Shield className="h-3.5 w-3.5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7" title="الدفع" disabled>
                                  <CreditCard className="h-3.5 w-3.5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7" title="إتمام" disabled>
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7" title="المواعيد" disabled>
                                  <CalendarDays className="h-3.5 w-3.5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7" title="حذف" disabled>
                                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="min-w-[220px]">
                            <div className="space-y-2 text-sm">
                              <div className="space-y-0.5">
                                <p className="text-xs text-muted-foreground font-medium">الأصناف:</p>
                                {itemsPreview.length > 0 ? (
                                  itemsPreview.map((item) => (
                                    <p key={item.id} className="text-xs">({item.name})</p>
                                  ))
                                ) : (
                                  <p className="text-xs text-muted-foreground">{row.items_count} صنف</p>
                                )}
                              </div>
                              <div className="space-y-0.5 text-xs">
                                <p>
                                  السعر (شامل الضريبة):{" "}
                                  <span className="font-medium">{formatNumber(row.total_price)} ج.م</span>
                                </p>
                                <p>
                                  المدفوع:{" "}
                                  <span className="font-medium text-emerald-600">{formatNumber(row.paid)} ج.م</span>
                                </p>
                                <p>
                                  المتبقي:{" "}
                                  <span className={cn("font-medium", row.remaining > 0 && "text-destructive")}>
                                    {formatNumber(row.remaining)} ج.م
                                  </span>
                                </p>
                              </div>
                              <div className="flex flex-wrap gap-1 justify-center">
                                <Badge variant={paymentCfg.variant} className="text-[10px]">
                                  {paymentCfg.label}
                                </Badge>
                                <Badge variant={statusCfg.variant} className="text-[10px]">
                                  {statusCfg.label}
                                </Badge>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="text-center min-w-[120px]">
                            <div className="space-y-1">
                              <p className="font-medium text-sm">{row.employee_name || "—"}</p>
                              {row.branch_name && (
                                <p className="text-xs text-muted-foreground">{row.branch_name}</p>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="py-10 text-center text-muted-foreground">
                        لا توجد فواتير إيجار لعرضها.
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
