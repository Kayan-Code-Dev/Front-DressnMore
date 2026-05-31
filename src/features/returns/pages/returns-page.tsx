import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { isModuleLive } from "@/config/feature-flags";
import {
  getInvoiceReturnStatsMock,
  listInvoiceReturnsMock,
} from "@/features/returns/services/returns.mock.service";
import {
  getInvoiceReturnStats,
  listInvoiceReturns,
} from "@/features/returns/services/returns.api.service";
import type {
  InvoiceReturnFilterParams,
  InvoiceReturnItem,
  InvoiceReturnStats,
  InvoiceReturnStatus,
  InvoiceReturnType,
} from "@/features/returns/types/returns.types";
import type { RentalPaymentStatus } from "@/features/orders/types/orders.types";
import { listBranches } from "@/features/branches/services/branches.api.service";
import { listBranchesMock } from "@/features/branches/services/branches.mock.service";
import { listEmployees } from "@/features/employees/services/employees.api.service";
import { listEmployeesMock } from "@/features/employees/services/employees.mock.service";
import type { BranchItem } from "@/features/branches/types/branches.types";
import type { EmployeeItem } from "@/features/employees/types/employees.types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatNumber } from "@/shared/lib/format/numbers";
import { cn } from "@/shared/utils/cn";
import {
  RotateCcw,
  Search,
  Printer,
  FileSpreadsheet,
  RefreshCw,
  BellRing,
  CircleCheck,
  Banknote,
  AlertCircle,
  ShieldCheck,
  CalendarDays,
  Eye,
  Pencil,
  CheckCircle2,
  Zap,
  Shield,
  Ban,
  Trash2,
} from "lucide-react";

const returnStatusMap: Record<
  InvoiceReturnStatus,
  { label: string; variant: "success" | "warning" | "destructive" | "info" | "secondary"; color: string }
> = {
  waiting: { label: "في الانتظار", variant: "info", color: "#3B82F6" },
  returned: { label: "تم الاسترجاع", variant: "success", color: "#10B981" },
  late: { label: "متأخر", variant: "destructive", color: "#EF4444" },
};

const returnTypeMap: Record<InvoiceReturnType, { label: string; color: string }> = {
  scheduled: { label: "مجدول", color: "#3B82F6" },
  instant: { label: "فوري", color: "#10B981" },
  late: { label: "متأخر", color: "#EF4444" },
};

const paymentStatusMap: Record<
  RentalPaymentStatus,
  { label: string; variant: "success" | "warning" | "destructive" | "secondary" }
> = {
  paid: { label: "مدفوع", variant: "success" },
  partially_paid: { label: "مدفوع جزئياً", variant: "warning" },
  unpaid: { label: "غير مدفوع", variant: "destructive" },
};

const statusDistribution: { key: InvoiceReturnStatus; label: string; color: string }[] = [
  { key: "waiting", label: "في الانتظار", color: "#3B82F6" },
  { key: "returned", label: "تم الاسترجاع", color: "#10B981" },
  { key: "late", label: "متأخر", color: "#EF4444" },
];

function CountStatCard({
  label,
  value,
  sub,
  badge,
  icon: Icon,
  gradient,
  valueClass,
}: {
  label: string;
  value: string | number;
  sub?: string;
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  valueClass?: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-4 flex items-start justify-between gap-3" style={{ borderColor: "var(--color-border)" }}>
      <div>
        {badge && <Badge variant="outline" className="text-[10px] mb-2">{badge}</Badge>}
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p className={cn("text-2xl font-black", valueClass)}>{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </div>
      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: gradient }}>
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>
  );
}

function MoneyBanner({
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
    <div className="rounded-xl p-4 text-white flex items-center justify-between gap-3" style={{ background: gradient }}>
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5 opacity-90" />
        <p className="text-sm opacity-90">{label}</p>
      </div>
      <p className="text-lg font-black">{value}</p>
    </div>
  );
}

function TableSkeletonRows({ rows = 5 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: 6 }).map((__, j) => (
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

function getCustomer(row: InvoiceReturnItem) {
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

export function ReturnsPage() {
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [returnStatus, setReturnStatus] = useState<InvoiceReturnStatus | "all">("all");
  const [returnType, setReturnType] = useState<InvoiceReturnType | "all">("all");
  const [paymentStatus, setPaymentStatus] = useState<RentalPaymentStatus | "all">("all");
  const [employeeId, setEmployeeId] = useState("all");
  const [branchId, setBranchId] = useState("all");
  const [returnFrom, setReturnFrom] = useState("");
  const [returnTo, setReturnTo] = useState("");
  const [rows, setRows] = useState<InvoiceReturnItem[]>([]);
  const [stats, setStats] = useState<InvoiceReturnStats | null>(null);
  const [employees, setEmployees] = useState<EmployeeItem[]>([]);
  const [branches, setBranches] = useState<BranchItem[]>([]);

  const filterParams = useMemo<InvoiceReturnFilterParams>(() => ({
    search,
    return_status: returnStatus === "all" ? "" : returnStatus,
    return_type: returnType === "all" ? "" : returnType,
    payment_status: paymentStatus === "all" ? "" : paymentStatus,
    employee_id: employeeId === "all" ? undefined : Number(employeeId),
    branch_id: branchId === "all" ? undefined : Number(branchId),
    return_date_from: returnFrom || undefined,
    return_date_to: returnTo || undefined,
  }), [search, returnStatus, returnType, paymentStatus, employeeId, branchId, returnFrom, returnTo]);

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
    const loadStats = isModuleLive("returns")
      ? () => getInvoiceReturnStats(filterParams)
      : () => getInvoiceReturnStatsMock(filterParams).then((r) => r.data);

    loadStats()
      .then((data) => { if (!cancelled) setStats(data); })
      .finally(() => { if (!cancelled) setStatsLoading(false); });

    return () => { cancelled = true; };
  }, [filterParams]);

  useEffect(() => {
    let cancelled = false;
    const loadRows = isModuleLive("returns")
      ? () => listInvoiceReturns({ ...filterParams, per_page: 100 })
      : () => listInvoiceReturnsMock({ ...filterParams, per_page: 100 });

    loadRows()
      .then((response) => {
        if (cancelled) return;
        setRows(response.data);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load returns");
        setRows([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [filterParams]);

  const footerTotals = useMemo(() => ({
    count: rows.length,
    revenue: rows.reduce((s, r) => s + r.total_price, 0),
    penalties: rows.reduce((s, r) => s + (r.penalty_amount ?? 0), 0),
  }), [rows]);

  return (
    <div className="w-full space-y-4 pb-20" dir="rtl">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-sm text-muted-foreground mb-1">متابعة إرجاع جميع الفواتير — فوري / مجدول / متأخر مع احتساب الغرامات</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" className="text-emerald-600 border-emerald-200" disabled>
            <FileSpreadsheet className="h-4 w-4 ml-1.5" />
            تصدير Excel
          </Button>
          <Button variant="outline" className="text-red-500 border-red-200" disabled>
            <Printer className="h-4 w-4 ml-1.5" />
            طباعة
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)
        ) : stats ? (
          <>
            <CountStatCard label="إجمالي الإرجاعات" value={stats.total} badge={`${stats.total} فاتورة`} icon={RefreshCw} gradient="linear-gradient(135deg, #5170FF, #818CF8)" />
            <CountStatCard label="إرجاعات متأخرة" value={stats.late_returns} badge="تنبيه" sub={stats.max_delay_days > 0 ? `أكثر تأخر: ${stats.max_delay_days} أيام` : undefined} icon={BellRing} gradient="linear-gradient(135deg, #DC2626, #F87171)" valueClass="text-destructive" />
            <CountStatCard label="تم الاسترجاع" value={stats.returned} sub={`${stats.waiting} في الانتظار`} icon={CircleCheck} gradient="linear-gradient(135deg, #059669, #34D399)" />
            <CountStatCard label="إجمالي الغرامات (ج.م)" value={formatNumber(stats.penalties_total)} sub={`مستحق: ${formatNumber(stats.penalties_due)} ج.م`} icon={Banknote} gradient="linear-gradient(135deg, #D97706, #FBBF24)" />
          </>
        ) : null}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {statsLoading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)
        ) : stats ? (
          <>
            <MoneyBanner label="غرامات مستحقة (لم تدفع)" value={`${formatNumber(stats.penalties_due)} ج.م`} icon={AlertCircle} gradient="linear-gradient(135deg, #EA580C, #FB923C)" />
            <MoneyBanner label="غرامات محصلة" value={`${formatNumber(stats.penalties_collected)} ج.م`} icon={ShieldCheck} gradient="linear-gradient(135deg, #059669, #34D399)" />
            <div className="rounded-xl border p-4" style={{ borderColor: "var(--color-border)" }}>
              <p className="text-sm font-bold mb-2">توزيع حالات الإرجاع</p>
              <div className="flex flex-wrap gap-2">
                {statusDistribution.map(({ key, label, color }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => { reload(); setReturnStatus(returnStatus === key ? "all" : key); }}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border",
                      returnStatus === key ? "text-white border-transparent" : "bg-background",
                    )}
                    style={returnStatus === key ? { background: color } : { borderColor: color, color }}
                  >
                    {label}
                    <span className="rounded-full px-1.5 py-0.5 text-[10px] bg-black/10">{stats.status_distribution[key] ?? 0}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </div>

      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #F59E0B, #FCD34D)" }}>
              <RotateCcw className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-black">قائمة إرجاعات الفواتير</CardTitle>
              <CardDescription>فلترة وعرض فواتير الإيجار حسب موعد الاسترجاع والغرامات</CardDescription>
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
            <Select value={returnStatus} onValueChange={(v) => { reload(); setReturnStatus(v as InvoiceReturnStatus | "all"); }}>
              <SelectTrigger><SelectValue placeholder="حالة الإرجاع" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">حالة الإرجاع: الكل</SelectItem>
                <SelectItem value="waiting">في الانتظار</SelectItem>
                <SelectItem value="returned">تم الاسترجاع</SelectItem>
                <SelectItem value="late">متأخر</SelectItem>
              </SelectContent>
            </Select>
            <Select value={returnType} onValueChange={(v) => { reload(); setReturnType(v as InvoiceReturnType | "all"); }}>
              <SelectTrigger><SelectValue placeholder="نوع الإرجاع" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">نوع الإرجاع: الكل</SelectItem>
                <SelectItem value="scheduled">مجدول</SelectItem>
                <SelectItem value="instant">فوري</SelectItem>
                <SelectItem value="late">متأخر</SelectItem>
              </SelectContent>
            </Select>
            <Select value={paymentStatus} onValueChange={(v) => { reload(); setPaymentStatus(v as RentalPaymentStatus | "all"); }}>
              <SelectTrigger><SelectValue placeholder="حالة الدفع" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">حالة الدفع: الكل</SelectItem>
                <SelectItem value="paid">مدفوع</SelectItem>
                <SelectItem value="partially_paid">مدفوع جزئياً</SelectItem>
                <SelectItem value="unpaid">غير مدفوع</SelectItem>
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
            <Input type="date" value={returnFrom} onChange={(e) => { reload(); setReturnFrom(e.target.value); }} placeholder="موعد الاسترجاع من" />
            <Input type="date" value={returnTo} onChange={(e) => { reload(); setReturnTo(e.target.value); }} placeholder="موعد الاسترجاع إلى" />
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
                    <TableHead className="text-center font-bold text-xs">الإرجاع والغرامة</TableHead>
                    <TableHead className="text-center font-bold text-xs">الموظف</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableSkeletonRows rows={6} />
                  ) : rows.length > 0 ? (
                    rows.map((row) => {
                      const customer = getCustomer(row);
                      const statusCfg = returnStatusMap[row.return_status];
                      const typeCfg = returnTypeMap[row.return_type];
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
                              {customer.national_id && <p className="text-xs text-muted-foreground">الرقم القومي: <span dir="ltr">{customer.national_id}</span></p>}
                              {customer.phone && <p className="text-xs text-muted-foreground">الهاتف: <span dir="ltr">{customer.phone}</span></p>}
                              {customer.whatsapp && <p className="text-xs text-muted-foreground">واتساب: <span dir="ltr">{customer.whatsapp}</span></p>}
                              {customer.address && <p className="text-xs text-muted-foreground leading-relaxed">العنوان: {customer.address}</p>}
                            </div>
                          </TableCell>

                          <TableCell className="min-w-[220px]">
                            <div className="space-y-2">
                              <div className="space-y-0.5 text-xs text-muted-foreground">
                                <p>تاريخ الفاتورة: <span className="text-foreground">{formatDate(row.invoice_date)}</span></p>
                                <p>موعد الفرح: <span className="text-blue-600 font-medium">{formatDate(row.event_date)}</span></p>
                                <p>موعد الاسترجاع: <span className="text-purple-600 font-medium">{formatDate(row.return_date)}</span></p>
                                <p>الاسترجاع الفعلي: <span className="text-emerald-600 font-medium">{formatDate(row.actual_return_date)}</span></p>
                              </div>
                              <div className="flex items-center justify-center gap-0.5 flex-wrap pt-1 border-t" style={{ borderColor: "var(--color-border)" }}>
                                <Button variant="ghost" size="icon" className="h-7 w-7" asChild title="عرض"><Link to={`/orders/${row.id}`}><Eye className="h-3.5 w-3.5" /></Link></Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7" disabled title="تعديل"><Pencil className="h-3.5 w-3.5" /></Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7" disabled title="إتمام"><CheckCircle2 className="h-3.5 w-3.5" /></Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7" disabled title="سريع"><Zap className="h-3.5 w-3.5" /></Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7" disabled title="ضمان"><Shield className="h-3.5 w-3.5" /></Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7" disabled title="إلغاء"><Ban className="h-3.5 w-3.5" /></Button>
                              </div>
                              <Select value={row.return_status} disabled>
                                <SelectTrigger className="h-8 text-xs" style={{ borderColor: statusCfg.color, color: statusCfg.color }}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(returnStatusMap).map(([key, cfg]) => (
                                    <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <div className="flex justify-center">
                                <Button variant="ghost" size="icon" className="h-7 w-7" disabled title="حذف"><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="min-w-[200px]">
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
                              {row.return_note && <p className="text-xs text-muted-foreground">{row.return_note}</p>}
                            </div>
                          </TableCell>

                          <TableCell className="min-w-[160px]">
                            <div className="space-y-2 rounded-lg border p-2 bg-emerald-50/30" style={{ borderColor: "#86EFAC" }}>
                              <Badge className="text-[10px]" style={{ background: `${typeCfg.color}18`, color: typeCfg.color, borderColor: typeCfg.color }}>
                                <CalendarDays className="w-3 h-3 ml-1" />
                                {typeCfg.label}
                              </Badge>
                              {(row.penalty_amount ?? 0) > 0 ? (
                                <>
                                  <p className="text-xs text-destructive font-medium">غرامة: {formatNumber(row.penalty_amount ?? 0)} ج.م</p>
                                  {(row.penalty_due ?? 0) > 0 && <p className="text-xs text-orange-600">مستحق: {formatNumber(row.penalty_due ?? 0)} ج.م</p>}
                                </>
                              ) : (
                                <p className="text-xs text-emerald-600">لا توجد غرامة</p>
                              )}
                              <p className="text-xs font-bold text-emerald-700">غرامة/يوم: {formatNumber(row.penalty_per_day ?? 0)} ج.م</p>
                              {row.delay_days != null && row.delay_days > 0 && (
                                <p className="text-xs text-destructive">تأخر {row.delay_days} {row.delay_days === 1 ? "يوم" : "أيام"}</p>
                              )}
                              {row.product_condition && (
                                <p className="text-xs text-muted-foreground">حالة المنتج: {row.product_condition === "good" ? "جيدة" : row.product_condition}</p>
                              )}
                            </div>
                          </TableCell>

                          <TableCell className="text-center min-w-[120px]">
                            <div className="flex flex-col items-center gap-2">
                              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: "linear-gradient(135deg, #5170FF, #818CF8)" }}>
                                {employeeInitial(row.employee_name)}
                              </div>
                              <p className="font-medium text-sm">{row.employee_name || "—"}</p>
                              {row.branch_name && <p className="text-xs text-muted-foreground">{row.branch_name}</p>}
                              {row.return_status === "returned" && (
                                <Badge variant="success" className="text-[10px]"><CheckCircle2 className="w-3 h-3 ml-1" />{row.employee_name.split(" ")[0]}</Badge>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                        لا توجد إرجاعات لعرضها.
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
          <p className="font-bold">{footerTotals.count} إرجاع</p>
          <div className="flex items-center gap-6 flex-wrap text-sm">
            <span>إجمالي الإيرادات: <strong>{formatNumber(footerTotals.revenue)} ج.م</strong></span>
            <span>إجمالي الغرامات: <strong>{formatNumber(footerTotals.penalties)} ج.م</strong></span>
          </div>
        </div>
      )}
    </div>
  );
}
