import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { isModuleLive } from "@/config/feature-flags";
import {
  getSaleInvoiceStatsMock,
  listSalesInvoicesMock,
} from "@/features/sales/services/sales.mock.service";
import {
  getSaleInvoiceStats,
  listSalesInvoices,
} from "@/features/sales/services/sales.api.service";
import type {
  SaleInvoice,
  SaleInvoiceFilterParams,
  SaleInvoiceStats,
  SaleInvoiceStatus,
  SalePaymentStatus,
} from "@/features/sales/types/sales.types";
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
import { cn } from "@/shared/utils/cn";
import {
  ShoppingCart,
  Search,
  Plus,
  CalendarDays,
  FileText,
  Eye,
  Printer,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const invoiceStatusMap: Record<
  SaleInvoiceStatus,
  { label: string; variant: "success" | "warning" | "destructive" | "secondary" }
> = {
  completed: { label: "مكتملة", variant: "success" },
  in_progress: { label: "معلقة", variant: "warning" },
  pending: { label: "معلقة", variant: "warning" },
  cancelled: { label: "ملغية", variant: "destructive" },
};

const paymentStatusMap: Record<
  SalePaymentStatus,
  { label: string; variant: "success" | "warning" | "destructive" | "secondary" }
> = {
  paid: { label: "مدفوع بالكامل", variant: "success" },
  partially_paid: { label: "مدفوع جزئياً", variant: "warning" },
  unpaid: { label: "غير مدفوع", variant: "destructive" },
};

function StatCard({
  label,
  value,
  sub,
  gradient,
  textDark,
}: {
  label: string;
  value: string | number;
  sub?: string;
  gradient: string;
  textDark?: boolean;
}) {
  return (
    <div
      className={cn("rounded-xl p-4 shadow-sm", textDark ? "border bg-card" : "text-white")}
      style={textDark ? { borderColor: "var(--color-border)" } : { background: gradient }}
    >
      <p className={cn("text-xs mb-1", textDark ? "text-muted-foreground" : "opacity-90")}>{label}</p>
      <p className={cn("text-2xl font-black", textDark && "text-foreground")}>{value}</p>
      {sub && <p className={cn("text-xs mt-1", textDark ? "text-muted-foreground" : "opacity-80")}>{sub}</p>}
    </div>
  );
}

function CollectionBar({ percent }: { percent: number }) {
  return (
    <div className="space-y-1">
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${Math.min(100, Math.max(0, percent))}%`,
            background: percent >= 100 ? "#10B981" : percent > 0 ? "#F59E0B" : "#EF4444",
          }}
        />
      </div>
      <p className="text-[10px] text-muted-foreground">{percent}% محصّل</p>
    </div>
  );
}

function TableSkeletonRows({ rows = 5 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: 7 }).map((__, j) => (
            <TableCell key={j}><Skeleton className="h-10 w-full" /></TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

function formatDate(value?: string) {
  if (!value) return "—";
  return value.replace(/-/g, "/");
}

export function SalesInvoicesPage() {
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [invoiceStatus, setInvoiceStatus] = useState<SaleInvoiceStatus | "all">("all");
  const [paymentStatus, setPaymentStatus] = useState<SalePaymentStatus | "all">("all");
  const [rows, setRows] = useState<SaleInvoice[]>([]);
  const [stats, setStats] = useState<SaleInvoiceStats | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const filterParams = useMemo<SaleInvoiceFilterParams>(() => ({
    search,
    invoice_status: invoiceStatus === "all" ? "" : invoiceStatus,
    payment_status: paymentStatus === "all" ? "" : paymentStatus,
  }), [search, invoiceStatus, paymentStatus]);

  const reload = () => {
    setLoading(true);
    setStatsLoading(true);
  };

  useEffect(() => {
    let cancelled = false;
    const loadStats = isModuleLive("sales")
      ? () => getSaleInvoiceStats(filterParams)
      : () => getSaleInvoiceStatsMock(filterParams).then((r) => r.data);

    loadStats()
      .then((data) => { if (!cancelled) setStats(data); })
      .finally(() => { if (!cancelled) setStatsLoading(false); });

    return () => { cancelled = true; };
  }, [filterParams]);

  useEffect(() => {
    let cancelled = false;
    const loadRows = isModuleLive("sales")
      ? () => listSalesInvoices({ ...filterParams, page, per_page: 15 })
      : () => listSalesInvoicesMock({ ...filterParams, page, per_page: 15 });

    loadRows()
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
        setError(err instanceof Error ? err.message : "Failed to load invoices");
        setRows([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [filterParams, page]);

  const displayedTotal = useMemo(
    () => rows.reduce((s, r) => s + r.total, 0),
    [rows],
  );

  return (
    <div className="w-full space-y-4" dir="rtl">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-black flex items-center gap-2" style={{ color: "var(--color-text-primary)" }}>
            <FileText className="w-5 h-5 text-primary" />
            فواتير البيع
          </h1>
          <p className="text-sm text-muted-foreground mt-1">قسم المبيعات المباشرة — إدارة فواتير البيع والمدفوعات ومتابعة العملاء</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button asChild>
            <Link to="/sales/create">
              <Plus className="h-4 w-4 ml-1.5" />
              فاتورة بيع جديدة
            </Link>
          </Button>
          <Button variant="outline" disabled>
            <CalendarDays className="h-4 w-4 ml-1.5" />
            جدول المواعيد
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {statsLoading ? (
          Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)
        ) : stats ? (
          <>
            <StatCard label="إجمالي الفواتير" value={stats.total} sub="فاتورة بيع" gradient="linear-gradient(135deg, #93C5FD, #BFDBFE)" textDark />
            <StatCard label="مكتملة" value={stats.completed} sub="تم التسليم" gradient="linear-gradient(135deg, #86EFAC, #BBF7D0)" textDark />
            <StatCard label="قيد التنفيذ" value={stats.in_progress} sub="في انتظار الاستلام" gradient="linear-gradient(135deg, #FDE68A, #FEF3C7)" textDark />
            <StatCard label="إجمالي الإيرادات" value={`${formatNumber(stats.revenue)} ج.م`} sub="شامل الضريبة" gradient="linear-gradient(135deg, #64748B, #94A3B8)" />
            <StatCard label="المحصل" value={`${formatNumber(stats.collected)} ج.م`} sub="مجموع المدفوعات" gradient="linear-gradient(135deg, #38BDF8, #7DD3FC)" />
            <StatCard label="المتبقي" value={`${formatNumber(stats.remaining)} ج.م`} sub="رصيد العملاء" gradient="linear-gradient(135deg, #F9A8D4, #FBCFE8)" textDark />
          </>
        ) : null}
      </div>

      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #D97706, #FBBF24)" }}>
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-black">قائمة فواتير البيع</CardTitle>
              <CardDescription>عرض وإدارة فواتير المبيعات المباشرة</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                value={search}
                onChange={(e) => { reload(); setSearch(e.target.value); setPage(1); }}
                placeholder="بحث باسم العميلة، رقم الفاتورة، الهاتف..."
                className="pr-9"
              />
            </div>
            <Select value={invoiceStatus} onValueChange={(v) => { reload(); setInvoiceStatus(v as SaleInvoiceStatus | "all"); setPage(1); }}>
              <SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="كل الحالات" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الحالات</SelectItem>
                <SelectItem value="completed">مكتملة</SelectItem>
                <SelectItem value="in_progress">قيد التنفيذ</SelectItem>
                <SelectItem value="pending">معلقة</SelectItem>
                <SelectItem value="cancelled">ملغية</SelectItem>
              </SelectContent>
            </Select>
            <Select value={paymentStatus} onValueChange={(v) => { reload(); setPaymentStatus(v as SalePaymentStatus | "all"); setPage(1); }}>
              <SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="كل حالات الدفع" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل حالات الدفع</SelectItem>
                <SelectItem value="paid">مدفوع بالكامل</SelectItem>
                <SelectItem value="partially_paid">مدفوع جزئياً</SelectItem>
                <SelectItem value="unpaid">غير مدفوع</SelectItem>
              </SelectContent>
            </Select>
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
                    <TableHead className="text-center font-bold text-xs">رقم الفاتورة / العميلة</TableHead>
                    <TableHead className="text-center font-bold text-xs">تاريخ الفاتورة</TableHead>
                    <TableHead className="text-center font-bold text-xs">الفرع</TableHead>
                    <TableHead className="text-center font-bold text-xs">الإجمالي</TableHead>
                    <TableHead className="text-center font-bold text-xs">حالة الدفع</TableHead>
                    <TableHead className="text-center font-bold text-xs">حالة الفاتورة</TableHead>
                    <TableHead className="text-center font-bold text-xs">إجراء</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableSkeletonRows rows={7} />
                  ) : rows.length > 0 ? (
                    rows.map((row) => {
                      const invStatus = invoiceStatusMap[row.invoice_status ?? "pending"];
                      const payStatus = paymentStatusMap[row.payment_status ?? "unpaid"];
                      const collectedPercent = row.collected_percent ?? 0;

                      return (
                        <TableRow key={row.id}>
                          <TableCell className="min-w-[160px]">
                            <p className="font-black text-primary">#{row.id}</p>
                            <p className="font-bold text-sm mt-0.5">{row.client_name}</p>
                            {row.client_phone && (
                              <p className="text-xs text-muted-foreground" dir="ltr">{row.client_phone}</p>
                            )}
                          </TableCell>
                          <TableCell className="text-center text-sm text-muted-foreground whitespace-nowrap">
                            {formatDate(row.sale_date)}
                          </TableCell>
                          <TableCell className="text-center text-sm">{row.branch_name || "—"}</TableCell>
                          <TableCell className="min-w-[120px]">
                            <p className="font-bold text-sm text-center">{formatNumber(row.total)} ج.م</p>
                            <CollectionBar percent={collectedPercent} />
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant={payStatus.variant}>{payStatus.label}</Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant={invStatus.variant}>{invStatus.label}</Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Button variant="ghost" size="icon" title="طباعة" disabled>
                                <Printer className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" asChild title="عرض">
                                <Link to={`/sales/create?id=${row.id}`}><Eye className="h-4 w-4" /></Link>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                        لا توجد فواتير بيع لعرضها.
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
            إجمالي المعروض: <span className="font-bold">{formatNumber(displayedTotal)} ج.م</span>
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <p className="text-sm text-muted-foreground">
              عرض <span className="font-bold">{rows.length}</span> من <span className="font-bold">{total}</span> فاتورة
            </p>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => { setLoading(true); setPage(page - 1); }}>
                  <ChevronRight className="h-4 w-4" /> السابق
                </Button>
                <span className="text-sm text-muted-foreground px-2">{page} / {totalPages}</span>
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => { setLoading(true); setPage(page + 1); }}>
                  التالي <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
