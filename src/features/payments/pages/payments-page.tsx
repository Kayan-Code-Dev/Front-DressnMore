import { useCallback, useEffect, useMemo, useState } from "react";
import { isModuleLive } from "@/config/feature-flags";
import type { PaymentFilterParams, PaymentItem, PaymentStats } from "@/features/payments/types/payments.types";
import { computePaymentStats } from "@/features/payments/mocks/payments.mock";
import { getPaymentStatsMock, listPaymentsMock } from "@/features/payments/services/payments.mock.service";
import { cancelPayment, listPayments, payPayment } from "@/features/payments/services/payments.api.service";
import { listBranches } from "@/features/branches/services/branches.api.service";
import { listBranchesMock } from "@/features/branches/services/branches.mock.service";
import type { BranchItem } from "@/features/branches/types/branches.types";
import { FinanceListFiltersBar } from "@/components/shared/FinanceListFiltersBar";
import { FinanceStatsCards } from "@/components/shared/FinanceStatsCards";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { formatNumber } from "@/shared/lib/format/numbers";
import {
  CreditCard, CheckCircle, XCircle, Eye, Pencil, Printer, CircleDollarSign,
  Banknote, Landmark, ChevronLeft, ChevronRight,
} from "lucide-react";

const statusMap: Record<string, { label: string; variant: "success" | "warning" | "destructive" | "info"; color: string }> = {
  paid: { label: "مكتمل", variant: "success", color: "#22C55E" },
  pending: { label: "معلق", variant: "warning", color: "#F59E0B" },
  cancelled: { label: "ملغي", variant: "destructive", color: "#EF4444" },
};

const methodMap: Record<string, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  cash: { label: "كاش", icon: Banknote },
  bank_transfer: { label: "تحويل بنكي", icon: Landmark },
  card: { label: "بطاقة بنكية", icon: CreditCard },
};

const defaultFilters: PaymentFilterParams = {};

function formatDate(value: string | null) {
  if (!value) return "—";
  return value.slice(0, 10);
}

function CustomerCell({ name }: { name?: string }) {
  const label = name ?? "—";
  return (
    <div className="flex items-center justify-center gap-2 min-w-0">
      <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
        {label.charAt(0)}
      </span>
      <span className="font-medium truncate">{label}</span>
    </div>
  );
}

export function PaymentsPage() {
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<PaymentFilterParams>(defaultFilters);
  const [rows, setRows] = useState<PaymentItem[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [branches, setBranches] = useState<BranchItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);
  const [dialog, setDialog] = useState<"pay" | "cancel" | null>(null);
  const [selected, setSelected] = useState<PaymentItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const filterParams = useMemo(
    (): PaymentFilterParams => ({
      ...filters,
      search: search.trim() || undefined,
    }),
    [filters, search],
  );

  useEffect(() => {
    const loadBranches = isModuleLive("payments")
      ? () => listBranches({ per_page: 100 }).then((r) => r.data)
      : () => listBranchesMock().then((r) => r.data);
    loadBranches().then(setBranches).catch(() => {});
  }, []);

  useEffect(() => {
    setStatsLoading(true);
    const loadStats = isModuleLive("payments")
      ? () => listPayments({ ...filterParams, per_page: 100 }).then((r) => computePaymentStats(r.data))
      : () => getPaymentStatsMock().then((r) => r.data);

    loadStats()
      .then(setStats)
      .finally(() => setStatsLoading(false));
  }, [filterParams, reloadKey]);

  const loadRows = useCallback(() => {
    setLoading(true);
    const params = { ...filterParams, page, per_page: 15 };
    const fetcher = isModuleLive("payments") ? () => listPayments(params) : () => listPaymentsMock(params);

    fetcher()
      .then((response) => {
        setRows(response.data);
        const meta = response.meta as { last_page?: number; total?: number } | null | undefined;
        setTotalPages(meta?.last_page ?? 1);
        setTotal(meta?.total ?? response.data.length);
        setError(null);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load payments");
        setRows([]);
      })
      .finally(() => setLoading(false));
  }, [filterParams, page]);

  useEffect(() => {
    loadRows();
  }, [loadRows, reloadKey]);

  const resetFilters = () => {
    setSearch("");
    setFilters(defaultFilters);
    setPage(1);
  };

  const closeDialog = () => {
    if (saving) return;
    setDialog(null);
    setSelected(null);
    setFormError(null);
  };

  const handlePay = async () => {
    if (!isModuleLive("payments") || !selected) return;
    setSaving(true);
    setFormError(null);
    try {
      await payPayment(selected.id);
      closeDialog();
      setReloadKey((k) => k + 1);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Failed to mark payment as paid");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async () => {
    if (!isModuleLive("payments") || !selected) return;
    setSaving(true);
    setFormError(null);
    try {
      await cancelPayment(selected.id);
      closeDialog();
      setReloadKey((k) => k + 1);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Failed to cancel payment");
    } finally {
      setSaving(false);
    }
  };

  const footerTotal = useMemo(() => rows.reduce((s, r) => s + r.amount, 0), [rows]);

  const statCards = stats
    ? [
        { label: "إجمالي المدفوعات", subLabel: "معاملة", value: stats.total_count, icon: CreditCard, gradient: "linear-gradient(135deg, #2563EB, #60A5FA)" },
        { label: "المبلغ الكلي", subLabel: "جنيه مصري", value: stats.total_amount, icon: CircleDollarSign, gradient: "linear-gradient(135deg, #1D4ED8, #3B82F6)" },
        { label: "تم التحصيل", subLabel: "جنيه مصري", value: stats.collected_amount, icon: CheckCircle, gradient: "linear-gradient(135deg, #059669, #34D399)", valueColor: "#059669" },
        { label: "في الانتظار", subLabel: "جنيه مصري", value: stats.pending_amount, icon: Banknote, gradient: "linear-gradient(135deg, #D97706, #FBBF24)", valueColor: "#D97706" },
      ]
    : [];

  return (
    <div className="w-full max-w-full space-y-5 overflow-x-hidden" dir="rtl">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #2563EB, #60A5FA)" }}>
          <CreditCard className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-black">قوائم المدفوعات</h1>
          <p className="text-sm text-muted-foreground">عرض وإدارة جميع المدفوعات والتحصيلات</p>
        </div>
      </div>

      <FinanceStatsCards stats={statCards} loading={statsLoading} />

      <FinanceListFiltersBar
        search={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        searchPlaceholder="اسم العميل، رقم الدفعة، رقم الفاتورة..."
        selects={[
          {
            id: "status",
            label: "الحالة",
            value: filters.status ?? "",
            options: [
              { value: "paid", label: "مكتمل" },
              { value: "pending", label: "معلق" },
              { value: "cancelled", label: "ملغي" },
            ],
            onChange: (v) => { setFilters((f) => ({ ...f, status: v || undefined })); setPage(1); },
          },
          {
            id: "branch",
            label: "الفرع",
            value: filters.branch_id ? String(filters.branch_id) : "",
            options: branches.map((b) => ({ value: String(b.id), label: b.name })),
            onChange: (v) => { setFilters((f) => ({ ...f, branch_id: v ? Number(v) : undefined })); setPage(1); },
          },
          {
            id: "method",
            label: "نوع الدفعة",
            value: filters.method ?? "",
            options: [
              { value: "cash", label: "كاش" },
              { value: "bank_transfer", label: "تحويل بنكي" },
              { value: "card", label: "بطاقة بنكية" },
            ],
            onChange: (v) => { setFilters((f) => ({ ...f, method: v || undefined })); setPage(1); },
          },
        ]}
        dateFrom={filters.date_from ?? ""}
        dateTo={filters.date_to ?? ""}
        onDateFromChange={(v) => { setFilters((f) => ({ ...f, date_from: v || undefined })); setPage(1); }}
        onDateToChange={(v) => { setFilters((f) => ({ ...f, date_to: v || undefined })); setPage(1); }}
        onReset={resetFilters}
        resultCount={rows.length}
        totalCount={total}
        onExportExcel={() => {}}
        onExportPdf={() => {}}
        primaryAction={{ label: "دفعة جديدة", onClick: () => {}, disabled: true }}
      />

      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

      <Card className="border-0 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto max-w-full">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#1a3a6d] hover:bg-[#1a3a6d]">
                  {["رقم", "العميل", "الفرع", "المبلغ", "الحالة", "نوع الدفعة", "تاريخ الدفع", "تاريخ الإنشاء", "ملاحظات", "الإجراءات"].map((h) => (
                    <TableHead key={h} className="text-center font-bold text-xs text-white whitespace-nowrap">{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 10 }).map((__, j) => (
                        <TableCell key={j}><Skeleton className="h-5 w-full max-w-[80px] mx-auto" /></TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : rows.length === 0 ? (
                  <TableRow><TableCell colSpan={10} className="py-12 text-center text-muted-foreground">لا توجد مدفوعات</TableCell></TableRow>
                ) : (
                  rows.map((row) => {
                    const statusCfg = statusMap[row.status] ?? statusMap.pending;
                    const methodCfg = row.method ? methodMap[row.method] : null;
                    const MethodIcon = methodCfg?.icon ?? Banknote;
                    return (
                      <TableRow key={row.id}>
                        <TableCell className="text-center">
                          <div className="text-xs font-mono text-blue-600">{row.payment_number ?? `PAY-${row.id}`}</div>
                          <div className="text-[10px] text-muted-foreground">{row.invoice_number ?? `INV-${row.invoice_id}`}</div>
                        </TableCell>
                        <TableCell className="text-center max-w-[160px]"><CustomerCell name={row.customer_name} /></TableCell>
                        <TableCell className="text-center text-sm whitespace-nowrap">{row.branch_name ?? `#${row.branch_id}`}</TableCell>
                        <TableCell className="text-center font-bold whitespace-nowrap">{formatNumber(row.amount)} ج.م</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={statusCfg.variant} className="gap-1"><CheckCircle className="w-3 h-3" />{statusCfg.label}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="inline-flex items-center gap-1.5 text-sm">
                            <MethodIcon className="w-4 h-4 text-muted-foreground" />
                            {methodCfg?.label ?? "—"}
                          </span>
                        </TableCell>
                        <TableCell className="text-center text-xs text-muted-foreground whitespace-nowrap">{formatDate(row.paid_at)}</TableCell>
                        <TableCell className="text-center text-xs text-muted-foreground whitespace-nowrap">{formatDate(row.created_at)}</TableCell>
                        <TableCell className="text-center text-xs text-muted-foreground max-w-[120px] truncate">{row.notes || "—"}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" title="عرض"><Eye className="h-3.5 w-3.5" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" disabled title="تعديل"><Pencil className="h-3.5 w-3.5" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" title="طباعة"><Printer className="h-3.5 w-3.5" /></Button>
                            {row.status === "pending" && isModuleLive("payments") && (
                              <>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => { setSelected(row); setDialog("pay"); }} title="تأكيد"><CheckCircle className="h-3.5 w-3.5 text-green-600" /></Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => { setSelected(row); setDialog("cancel"); }} title="إلغاء"><XCircle className="h-3.5 w-3.5 text-red-500" /></Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-3 py-3 px-4 bg-muted/20 border-t">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {stats && (
              <>
                <span className="text-green-600 font-medium">{stats.paid_count} مكتمل</span>
                <span className="text-amber-600 font-medium">{stats.pending_count} معلق</span>
                <span className="text-red-500 font-medium">{stats.cancelled_count} ملغي</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <span className="text-sm font-bold">الإجمالي: {formatNumber(stats?.total_amount ?? footerTotal)} ج.م</span>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}><ChevronRight className="h-4 w-4" /></Button>
                <span className="text-xs text-muted-foreground">{page}/{totalPages}</span>
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}><ChevronLeft className="h-4 w-4" /></Button>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>

      <Dialog open={dialog === "pay"} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>تأكيد الدفع</DialogTitle>
            <DialogDescription>تأكيد دفع {selected?.payment_number ?? `#${selected?.id}`} بمبلغ {formatNumber(selected?.amount ?? 0)} ج.م؟</DialogDescription>
          </DialogHeader>
          {formError && <p className="text-sm text-destructive">{formError}</p>}
          <DialogFooter>
            <Button variant="outline" disabled={saving} onClick={closeDialog}>إلغاء</Button>
            <Button disabled={saving} onClick={handlePay}>{saving ? "جاري التأكيد..." : "تأكيد الدفع"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dialog === "cancel"} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>إلغاء الدفعة</DialogTitle>
            <DialogDescription>هل أنت متأكد من إلغاء {selected?.payment_number ?? `#${selected?.id}`}؟</DialogDescription>
          </DialogHeader>
          {formError && <p className="text-sm text-destructive">{formError}</p>}
          <DialogFooter>
            <Button variant="outline" disabled={saving} onClick={closeDialog}>تراجع</Button>
            <Button variant="destructive" disabled={saving} onClick={handleCancel}>{saving ? "جاري الإلغاء..." : "إلغاء الدفعة"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
