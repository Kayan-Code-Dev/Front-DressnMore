import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { isModuleLive } from "@/config/feature-flags";
import {
  getInvoiceDeliveryStatsMock,
  listInvoiceDeliveriesMock,
} from "@/features/delivery/services/deliveries.mock.service";
import {
  getInvoiceDeliveryStats,
  listInvoiceDeliveries,
} from "@/features/delivery/services/deliveries.api.service";
import type {
  InvoiceDeliveryFilterParams,
  InvoiceDeliveryItem,
  InvoiceDeliveryStats,
  InvoiceDeliveryStatus,
  InvoiceDeliveryStatusFilter,
} from "@/features/delivery/types/deliveries.types";
import type { RentalPaymentStatus } from "@/features/orders/types/orders.types";
import { listBranches } from "@/features/branches/services/branches.api.service";
import { listBranchesMock } from "@/features/branches/services/branches.mock.service";
import { listEmployees } from "@/features/employees/services/employees.api.service";
import { listEmployeesMock } from "@/features/employees/services/employees.mock.service";
import type { BranchItem } from "@/features/branches/types/branches.types";
import type { EmployeeItem } from "@/features/employees/types/employees.types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
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
  Truck,
  Search,
  Plus,
  Printer,
  FileSpreadsheet,
  FileText,
  Cake,
  Clock,
  BellRing,
  Banknote,
  CircleCheck,
  Hourglass,
  PackageCheck,
  HandHelping,
  RotateCcw,
  AlertTriangle,
  Eye,
  Pencil,
  Shield,
  CreditCard,
  CheckCircle2,
  Ban,
  Trash2,
  RefreshCw,
} from "lucide-react";

const deliveryStatusMap: Record<
  InvoiceDeliveryStatus,
  { label: string; variant: "success" | "warning" | "destructive" | "info" | "secondary"; color: string }
> = {
  waiting: { label: "في الانتظار", variant: "info", color: "#3B82F6" },
  received: { label: "تم الاستلام", variant: "warning", color: "#F59E0B" },
  delivered: { label: "تم التسليم", variant: "success", color: "#10B981" },
  returned: { label: "تم الاسترجاع", variant: "info", color: "#06B6D4" },
  late: { label: "متأخر", variant: "destructive", color: "#EF4444" },
};

const paymentStatusMap: Record<
  RentalPaymentStatus,
  { label: string; variant: "success" | "warning" | "secondary" }
> = {
  paid: { label: "مدفوع (إيجار)", variant: "success" },
  partially_paid: { label: "مدفوع جزئياً (إيجار)", variant: "warning" },
  unpaid: { label: "غير مدفوع", variant: "secondary" },
};

const statusDistribution: {
  key: InvoiceDeliveryStatus;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}[] = [
  { key: "waiting", label: "في الانتظار", icon: Clock, color: "#3B82F6" },
  { key: "received", label: "تم الاستلام", icon: HandHelping, color: "#F59E0B" },
  { key: "delivered", label: "تم التسليم", icon: PackageCheck, color: "#10B981" },
  { key: "returned", label: "تم الاسترجاع", icon: RotateCcw, color: "#06B6D4" },
  { key: "late", label: "متأخر", icon: AlertTriangle, color: "#EF4444" },
];

function CountStatCard({
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
    <div className="rounded-xl border bg-card p-4 flex items-start justify-between gap-3" style={{ borderColor: "var(--color-border)" }}>
      <div>
        {sub && (
          <Badge variant="outline" className="text-[10px] mb-2">{sub}</Badge>
        )}
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p className="text-2xl font-black">{value}</p>
      </div>
      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: gradient }}>
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>
  );
}

function MoneyStatCard({
  label,
  value,
  icon: Icon,
  gradient,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
}) {
  return (
    <div className="rounded-xl p-4 text-white shadow-sm flex items-center justify-between gap-3" style={{ background: gradient }}>
      <div>
        <p className="text-xs opacity-90 mb-1">{label}</p>
        <p className="text-xl font-black">{value}</p>
      </div>
      <Icon className="w-8 h-8 opacity-80 shrink-0" />
    </div>
  );
}

function TableSkeletonRows({ rows = 5 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: 5 }).map((__, j) => (
            <TableCell key={j}><Skeleton className="h-16 w-full" /></TableCell>
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

function getCustomer(row: InvoiceDeliveryItem) {
  return row.customer ?? {
    name: row.client_name,
    national_id: "",
    phone: row.client_phone,
    whatsapp: "",
    address: "",
  };
}

function employeeInitial(name: string) {
  return name.trim().charAt(0) || "؟";
}

export function DeliveriesPage() {
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<RentalPaymentStatus | "all">("all");
  const [deliveryStatus, setDeliveryStatus] = useState<InvoiceDeliveryStatusFilter>("all");
  const [employeeId, setEmployeeId] = useState<string>("all");
  const [branchId, setBranchId] = useState<string>("all");
  const [eventFrom, setEventFrom] = useState("");
  const [eventTo, setEventTo] = useState("");
  const [rows, setRows] = useState<InvoiceDeliveryItem[]>([]);
  const [stats, setStats] = useState<InvoiceDeliveryStats | null>(null);
  const [employees, setEmployees] = useState<EmployeeItem[]>([]);
  const [branches, setBranches] = useState<BranchItem[]>([]);

  const filterParams = useMemo<InvoiceDeliveryFilterParams>(() => ({
    search,
    payment_status: paymentStatus === "all" ? "" : paymentStatus,
    delivery_status: deliveryStatus === "all" ? "" : deliveryStatus,
    employee_id: employeeId === "all" ? undefined : Number(employeeId),
    branch_id: branchId === "all" ? undefined : Number(branchId),
    event_date_from: eventFrom || undefined,
    event_date_to: eventTo || undefined,
  }), [search, paymentStatus, deliveryStatus, employeeId, branchId, eventFrom, eventTo]);

  const reload = () => {
    setLoading(true);
    setStatsLoading(true);
  };

  useEffect(() => {
    const loadLookups = isModuleLive("employees")
      ? () => Promise.all([listEmployees({ per_page: 100 }), listBranches({ per_page: 100 })])
      : () => Promise.all([listEmployeesMock(), listBranchesMock()]);

    loadLookups()
      .then(([empRes, branchRes]) => {
        setEmployees(empRes.data);
        setBranches(branchRes.data);
      })
      .catch(() => {
        setEmployees([]);
        setBranches([]);
      });
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadStats = isModuleLive("deliveries")
      ? () => getInvoiceDeliveryStats(filterParams)
      : () => getInvoiceDeliveryStatsMock(filterParams).then((r) => r.data);

    loadStats()
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .finally(() => {
        if (!cancelled) setStatsLoading(false);
      });

    return () => { cancelled = true; };
  }, [filterParams]);

  useEffect(() => {
    let cancelled = false;
    const loadRows = isModuleLive("deliveries")
      ? () => listInvoiceDeliveries({ ...filterParams, per_page: 100 })
      : () => listInvoiceDeliveriesMock({ ...filterParams, per_page: 100 });

    loadRows()
      .then((response) => {
        if (cancelled) return;
        setRows(response.data);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load deliveries");
        setRows([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [filterParams]);

  const footerTotals = useMemo(() => ({
    total: rows.length,
    revenue: rows.reduce((s, r) => s + r.total_price, 0),
    collected: rows.reduce((s, r) => s + r.paid, 0),
    remaining: rows.reduce((s, r) => s + r.remaining, 0),
  }), [rows]);

  return (
    <div className="w-full space-y-4 pb-20" dir="rtl">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-black flex items-center gap-2" style={{ color: "var(--color-text-primary)" }}>
            <RefreshCw className="w-5 h-5 text-primary" />
            تسليمات الفواتير
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            كل فاتورة تُعرض هنا حسب موعد فرح العميل — مرتبة تصاعدياً بالتاريخ
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button asChild>
            <Link to="/orders/choose-client">
              <Plus className="h-4 w-4 ml-1.5" />
              فاتورة جديدة
            </Link>
          </Button>
          <Button variant="outline" className="text-pink-600 border-pink-200" disabled>
            <Printer className="h-4 w-4 ml-1.5" />
            طباعة
          </Button>
          <Button variant="outline" className="text-emerald-600 border-emerald-200" disabled>
            <FileSpreadsheet className="h-4 w-4 ml-1.5" />
            تصدير Excel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)
        ) : stats ? (
          <>
            <CountStatCard label="إجمالي الفواتير" value={stats.total} sub={`${stats.total} فاتورة`} icon={FileText} gradient="linear-gradient(135deg, #5170FF, #818CF8)" />
            <CountStatCard label="أفراح اليوم" value={stats.today_weddings} icon={Cake} gradient="linear-gradient(135deg, #64748B, #94A3B8)" />
            <CountStatCard label="بانتظار التسليم" value={stats.waiting_delivery} sub="قادم" icon={Clock} gradient="linear-gradient(135deg, #D97706, #FBBF24)" />
            <CountStatCard label="متأخرة الاسترجاع" value={stats.late_returns} icon={BellRing} gradient="linear-gradient(135deg, #DC2626, #F87171)" />
          </>
        ) : null}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {statsLoading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)
        ) : stats ? (
          <>
            <MoneyStatCard label="إجمالي الإيرادات" value={`${formatNumber(stats.revenue)} ج.م`} icon={Banknote} gradient="linear-gradient(135deg, #475569, #64748B)" />
            <MoneyStatCard label="إجمالي المحصل" value={`${formatNumber(stats.collected)} ج.م`} icon={CircleCheck} gradient="linear-gradient(135deg, #059669, #34D399)" />
            <MoneyStatCard label="إجمالي المتبقي" value={`${formatNumber(stats.remaining)} ج.م`} icon={Hourglass} gradient="linear-gradient(135deg, #D97706, #FBBF24)" />
          </>
        ) : null}
      </div>

      {stats && (
        <div className="rounded-xl border p-4 space-y-3" style={{ borderColor: "var(--color-border)" }}>
          <p className="text-sm font-bold">توزيع حالات التسليم</p>
          <div className="flex flex-wrap gap-2">
            {statusDistribution.map(({ key, label, icon: Icon, color }) => {
              const count = stats.status_distribution[key] ?? 0;
              const active = deliveryStatus === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => { reload(); setDeliveryStatus(active ? "all" : key); }}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium border transition-colors",
                    active ? "text-white border-transparent" : "bg-background hover:bg-muted/50",
                  )}
                  style={active ? { background: color, borderColor: color } : { borderColor: color, color }}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                  <span className={cn("rounded-full px-2 py-0.5 text-xs font-bold", active ? "bg-white/20" : "bg-muted")}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #0891B2, #22D3EE)" }}>
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-black">قائمة تسليمات الفواتير</CardTitle>
              <CardDescription>فلترة وعرض فواتير الإيجار حسب موعد الفرح وحالة التسليم</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-3">
            <div className="relative xl:col-span-2">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                value={search}
                onChange={(e) => { reload(); setSearch(e.target.value); }}
                placeholder="اسم العميل، رقم الفاتورة، رقم قومي..."
                className="pr-9"
              />
            </div>

            <Select value={paymentStatus} onValueChange={(v) => { reload(); setPaymentStatus(v as RentalPaymentStatus | "all"); }}>
              <SelectTrigger><SelectValue placeholder="حالة الدفع" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">حالة الدفع: الكل</SelectItem>
                <SelectItem value="paid">مدفوع</SelectItem>
                <SelectItem value="partially_paid">مدفوع جزئياً</SelectItem>
                <SelectItem value="unpaid">غير مدفوع</SelectItem>
              </SelectContent>
            </Select>

            <Select value={deliveryStatus} onValueChange={(v) => { reload(); setDeliveryStatus(v as InvoiceDeliveryStatusFilter); }}>
              <SelectTrigger><SelectValue placeholder="حالة التسليم" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">حالة التسليم: الكل</SelectItem>
                <SelectItem value="waiting">في الانتظار</SelectItem>
                <SelectItem value="received">تم الاستلام</SelectItem>
                <SelectItem value="delivered">تم التسليم</SelectItem>
                <SelectItem value="returned">تم الاسترجاع</SelectItem>
                <SelectItem value="late">متأخر</SelectItem>
              </SelectContent>
            </Select>

            <Select value={employeeId} onValueChange={(v) => { reload(); setEmployeeId(v); }}>
              <SelectTrigger><SelectValue placeholder="الموظف" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الموظف: الكل</SelectItem>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={String(emp.id)}>{emp.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={branchId} onValueChange={(v) => { reload(); setBranchId(v); }}>
              <SelectTrigger><SelectValue placeholder="الفرع" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الفرع: الكل</SelectItem>
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={String(branch.id)}>{branch.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
            <Input type="date" value={eventFrom} onChange={(e) => { reload(); setEventFrom(e.target.value); }} placeholder="موعد الفرح من" />
            <Input type="date" value={eventTo} onChange={(e) => { reload(); setEventTo(e.target.value); }} placeholder="موعد الفرح إلى" />
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
                    <TableHead className="text-center font-bold text-xs">#</TableHead>
                    <TableHead className="text-center font-bold text-xs">بيانات العميل</TableHead>
                    <TableHead className="text-center font-bold text-xs">التواريخ / الإجراءات</TableHead>
                    <TableHead className="text-center font-bold text-xs">الأصناف / المبلغ / الحالة</TableHead>
                    <TableHead className="text-center font-bold text-xs">الموظف</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableSkeletonRows rows={6} />
                  ) : rows.length > 0 ? (
                    rows.map((row) => {
                      const customer = getCustomer(row);
                      const deliveryCfg = deliveryStatusMap[row.delivery_status];
                      const paymentCfg = paymentStatusMap[row.payment_status ?? "unpaid"];
                      const itemsPreview = row.items_preview ?? [];

                      return (
                        <TableRow key={row.id} className="align-top">
                          <TableCell className="text-center whitespace-nowrap">
                            <span className="text-lg font-black text-primary">#{row.id}</span>
                          </TableCell>

                          <TableCell className="min-w-[200px]">
                            <div className="space-y-1 text-sm">
                              <p className="font-bold">{customer.name}</p>
                              {customer.national_id && (
                                <p className="text-xs text-muted-foreground">الرقم القومي: <span dir="ltr">{customer.national_id}</span></p>
                              )}
                              {customer.phone && (
                                <p className="text-xs text-muted-foreground">الهاتف: <span dir="ltr">{customer.phone}</span></p>
                              )}
                              {customer.whatsapp && (
                                <p className="text-xs text-muted-foreground">هاتف الواتساب: <span dir="ltr">{customer.whatsapp}</span></p>
                              )}
                              {customer.address && (
                                <p className="text-xs text-muted-foreground leading-relaxed">العنوان: {customer.address}</p>
                              )}
                            </div>
                          </TableCell>

                          <TableCell className="min-w-[220px]">
                            <div className="space-y-2">
                              <div className="space-y-0.5 text-xs text-muted-foreground">
                                <p>تاريخ الفاتورة: <span className="text-foreground">{formatDate(row.invoice_date)}</span></p>
                                <p>استلام: <span className="text-orange-600 font-medium">{formatDate(row.delivery_date)}</span></p>
                                <p>الفرح: <span className="text-blue-600 font-medium">{formatDate(row.event_date)}</span></p>
                                <p>استرجاع: <span className="text-purple-600 font-medium">{formatDate(row.return_date)}</span></p>
                              </div>
                              <div className="flex items-center justify-center gap-0.5 flex-wrap pt-1 border-t" style={{ borderColor: "var(--color-border)" }}>
                                <Button variant="ghost" size="icon" className="h-7 w-7" asChild title="عرض">
                                  <Link to={`/orders/${row.id}`}><Eye className="h-3.5 w-3.5" /></Link>
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7" title="تعديل" disabled><Pencil className="h-3.5 w-3.5" /></Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7" title="إتمام" disabled><CheckCircle2 className="h-3.5 w-3.5" /></Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7" title="الدفع" disabled><CreditCard className="h-3.5 w-3.5" /></Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7" title="الضمان" disabled><Shield className="h-3.5 w-3.5" /></Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7" title="إلغاء" disabled><Ban className="h-3.5 w-3.5" /></Button>
                              </div>
                              <Select value={row.delivery_status} disabled>
                                <SelectTrigger className="h-8 text-xs" style={{ borderColor: deliveryCfg.color, color: deliveryCfg.color }}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(deliveryStatusMap).map(([key, cfg]) => (
                                    <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <div className="flex justify-center">
                                <Button variant="ghost" size="icon" className="h-7 w-7" title="حذف" disabled>
                                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="min-w-[220px]">
                            <div className="space-y-2 text-sm">
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground font-medium">الأصناف:</p>
                                {itemsPreview.map((item) => (
                                  <div key={item.id} className="flex items-center gap-1.5 text-xs">
                                    <Badge variant="info" className="text-[10px] px-1.5 py-0">إيجار</Badge>
                                    <span>{item.name}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="space-y-0.5 text-xs">
                                <p>السعر: <span className="font-medium">{formatNumber(row.total_price)} ج.م</span></p>
                                <p>المدفوع: <span className="font-medium text-emerald-600">{formatNumber(row.paid)} ج.م</span></p>
                                <p>المتبقي: <span className={cn("font-medium", row.remaining > 0 && "text-destructive")}>{formatNumber(row.remaining)} ج.م</span></p>
                              </div>
                              <Badge variant={paymentCfg.variant} className="text-[10px]">{paymentCfg.label}</Badge>
                              {row.delay_days != null && row.delay_days > 0 && (
                                <p className="text-xs text-destructive font-medium">
                                  تأخر الاسترجاع {row.delay_days} {row.delay_days === 1 ? "يوم" : "أيام"}
                                </p>
                              )}
                            </div>
                          </TableCell>

                          <TableCell className="text-center min-w-[120px]">
                            <div className="flex flex-col items-center gap-2">
                              <div
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                                style={{ background: "linear-gradient(135deg, #5170FF, #818CF8)" }}
                              >
                                {employeeInitial(row.employee_name)}
                              </div>
                              <p className="font-medium text-sm">{row.employee_name || "—"}</p>
                              {row.branch_name && <p className="text-xs text-muted-foreground">{row.branch_name}</p>}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                        لا توجد تسليمات لعرضها.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {!loading && rows.length > 0 && (
        <div
          className="fixed bottom-0 left-0 right-0 z-40 px-4 py-3 text-white flex items-center justify-between flex-wrap gap-3 shadow-lg"
          style={{ background: "linear-gradient(135deg, #1e3a5f, #2563eb)" }}
        >
          <p className="font-bold">{footerTotals.total} فاتورة</p>
          <div className="flex items-center gap-6 flex-wrap text-sm">
            <span>الإجمالي: <strong>{formatNumber(footerTotals.revenue)} ج.م</strong></span>
            <span>محصّل: <strong>{formatNumber(footerTotals.collected)} ج.م</strong></span>
            <span>متبقي: <strong>{formatNumber(footerTotals.remaining)} ج.م</strong></span>
          </div>
        </div>
      )}
    </div>
  );
}
