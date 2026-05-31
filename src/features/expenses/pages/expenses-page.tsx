import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { isModuleLive } from "@/config/feature-flags";
import type { BranchItem } from "@/features/branches/types/branches.types";
import { listBranches } from "@/features/branches/services/branches.api.service";
import { listBranchesMock } from "@/features/branches/services/branches.mock.service";
import type { CashboxItem } from "@/features/cashboxes/types/cashboxes.types";
import { listCashboxes } from "@/features/cashboxes/services/cashboxes.api.service";
import { listCashboxesMock } from "@/features/cashboxes/services/cashboxes.mock.service";
import type { ExpenseCategoryItem, ExpenseFilterParams, ExpenseItem, ExpenseSummary } from "@/features/expenses/types/expenses.types";
import { listExpenseCategories } from "@/features/expenses/services/expense-categories.api.service";
import { expenseCategoriesFixture } from "@/features/expenses/mocks/expenses.mock";
import { getExpensesSummaryMock, listExpensesMock } from "@/features/expenses/services/expenses.mock.service";
import {
  approveExpense,
  cancelExpense,
  createExpense,
  deleteExpense,
  getExpensesSummary,
  listExpenses,
  payExpense,
  updateExpense,
} from "@/features/expenses/services/expenses.api.service";
import { FinanceListFiltersBar } from "@/components/shared/FinanceListFiltersBar";
import { FinanceStatsCards } from "@/components/shared/FinanceStatsCards";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog as ShadDialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Receipt,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Banknote,
  CircleDollarSign,
  Clock,
  Eye,
  Printer,
} from "lucide-react";
import { formatNumber } from "@/shared/lib/format/numbers";

const PAYMENT_METHODS = [
  { value: "cash", label: "نقدي" },
  { value: "instapay", label: "InstaPay" },
  { value: "vodafone_cash", label: "فودافون كاش" },
  { value: "bank_transfer", label: "تحويل بنكي" },
];

const defaultFilters: ExpenseFilterParams = {};

function fetchExpenseData(params: ExpenseFilterParams & { page?: number; per_page?: number }) {
  if (isModuleLive("expenses")) {
    return listExpenses({ ...params, page: params.page ?? 1, per_page: params.per_page ?? 15 });
  }
  return listExpensesMock({ ...params, page: params.page ?? 1, per_page: params.per_page ?? 15 });
}

const statusMap: Record<string, { label: string; variant: "success" | "warning" | "destructive" | "info" }> = {
  pending: { label: "معلق", variant: "warning" },
  approved: { label: "موافق عليه", variant: "info" },
  paid: { label: "مدفوع", variant: "success" },
  cancelled: { label: "ملغى", variant: "destructive" },
};

type ExpenseForm = {
  expense_category_id: string;
  branch_id: string;
  cashbox_id: string;
  amount: string;
  method: string;
  vendor: string;
  expense_date: string;
  description: string;
  notes: string;
};

const emptyForm = (): ExpenseForm => ({
  expense_category_id: "",
  branch_id: "",
  cashbox_id: "",
  amount: "",
  method: "",
  vendor: "",
  expense_date: new Date().toISOString().slice(0, 10),
  description: "",
  notes: "",
});

function StatusBadge({ status }: { status: string }) {
  const config = statusMap[status] ?? { label: status, variant: "warning" as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

function TableSkeletonRows({ rows = 5, cols = 9 }: { rows?: number; cols?: number }) {
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

export function ExpensesPage() {
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<ExpenseFilterParams>(defaultFilters);
  const [summary, setSummary] = useState<ExpenseSummary | null>(null);
  const [rows, setRows] = useState<ExpenseItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);
  const [dialog, setDialog] = useState<"create" | "edit" | "delete" | "pay" | null>(null);
  const [selected, setSelected] = useState<ExpenseItem | null>(null);
  const [form, setForm] = useState<ExpenseForm>(emptyForm);
  const [payCashboxId, setPayCashboxId] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [branches, setBranches] = useState<BranchItem[]>([]);
  const [cashboxes, setCashboxes] = useState<CashboxItem[]>([]);
  const [categories, setCategories] = useState<ExpenseCategoryItem[]>([]);

  const branchName = useMemo(() => {
    const map = new Map(branches.map((b) => [b.id, b.name]));
    return (id: number | null) => (id ? map.get(id) ?? `#${id}` : "—");
  }, [branches]);

  const cashboxName = useMemo(() => {
    const map = new Map(cashboxes.map((c) => [c.id, c.name]));
    return (id: number | null) => (id ? map.get(id) ?? `#${id}` : "—");
  }, [cashboxes]);

  const filterParams = useMemo(
    (): ExpenseFilterParams => ({ ...filters, search: search.trim() || undefined }),
    [filters, search],
  );

  useEffect(() => {
    const loadBranches = isModuleLive("expenses")
      ? () => listBranches({ per_page: 100 }).then((r) => r.data)
      : () => listBranchesMock().then((r) => r.data);
    const loadCashboxes = isModuleLive("expenses")
      ? () => listCashboxes({ per_page: 100 }).then((r) => r.data)
      : () => listCashboxesMock().then((r) => r.data);
    const loadCategories = isModuleLive("expenses")
      ? () => listExpenseCategories({ per_page: 100 }).then((r) => r.data)
      : () => Promise.resolve(expenseCategoriesFixture);

    Promise.all([loadBranches(), loadCashboxes(), loadCategories()])
      .then(([b, c, cat]) => {
        setBranches(b);
        setCashboxes(c);
        setCategories(cat);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setStatsLoading(true);
    const loadSummary = isModuleLive("expenses")
      ? () => getExpensesSummary(filterParams)
      : () => getExpensesSummaryMock().then((r) => r.data);

    loadSummary()
      .then(setSummary)
      .finally(() => setStatsLoading(false));
  }, [filterParams, reloadKey]);

  const loadRows = useCallback(() => {
    setLoading(true);
    fetchExpenseData({ ...filterParams, page, per_page: 15 })
      .then((response) => {
        setRows(response.data);
        const meta = response.meta as { last_page?: number; total?: number } | null | undefined;
        setTotalPages(meta?.last_page ?? 1);
        setTotal(meta?.total ?? response.data.length);
        setError(null);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load expenses");
        setRows([]);
      })
      .finally(() => setLoading(false));
  }, [filterParams, page]);

  const resetFilters = () => {
    setSearch("");
    setFilters(defaultFilters);
    setPage(1);
  };

  useEffect(() => {
    loadRows();
  }, [loadRows, reloadKey]);

  const openCreate = () => {
    setSelected(null);
    setForm(emptyForm());
    setFormError(null);
    setDialog("create");
  };

  const openEdit = (row: ExpenseItem) => {
    setSelected(row);
    setForm({
      expense_category_id: row.expense_category_id ? String(row.expense_category_id) : "",
      branch_id: row.branch_id ? String(row.branch_id) : "",
      cashbox_id: row.cashbox_id ? String(row.cashbox_id) : "",
      amount: String(row.amount),
      method: row.method ?? "",
      vendor: row.vendor ?? "",
      expense_date: row.expense_date,
      description: row.description ?? "",
      notes: row.notes ?? "",
    });
    setFormError(null);
    setDialog("edit");
  };

  const openDelete = (row: ExpenseItem) => {
    setSelected(row);
    setFormError(null);
    setDialog("delete");
  };

  const openPay = (row: ExpenseItem) => {
    setSelected(row);
    setPayCashboxId(row.cashbox_id ? String(row.cashbox_id) : "");
    setFormError(null);
    setDialog("pay");
  };

  const closeDialog = () => {
    if (saving) return;
    setDialog(null);
    setSelected(null);
    setFormError(null);
  };

  const toPayload = () => ({
    expense_category_id: form.expense_category_id ? Number(form.expense_category_id) : null,
    branch_id: form.branch_id ? Number(form.branch_id) : null,
    cashbox_id: form.cashbox_id ? Number(form.cashbox_id) : null,
    amount: Number(form.amount),
    method: form.method || null,
    vendor: form.vendor.trim() || null,
    expense_date: form.expense_date,
    description: form.description.trim() || null,
    notes: form.notes.trim() || null,
  });

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    if (!isModuleLive("expenses")) return;

    setSaving(true);
    setFormError(null);
    try {
      if (dialog === "create") {
        await createExpense(toPayload());
      } else if (dialog === "edit" && selected) {
        await updateExpense(selected.id, toPayload());
      }
      closeDialog();
      setReloadKey((k) => k + 1);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Failed to save expense");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isModuleLive("expenses") || !selected) return;

    setSaving(true);
    setFormError(null);
    try {
      await deleteExpense(selected.id);
      closeDialog();
      setReloadKey((k) => k + 1);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Failed to delete expense");
    } finally {
      setSaving(false);
    }
  };

  const handleApprove = async (row: ExpenseItem) => {
    if (!isModuleLive("expenses")) return;
    try {
      await approveExpense(row.id);
      setReloadKey((k) => k + 1);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to approve expense");
    }
  };

  const handleCancel = async (row: ExpenseItem) => {
    if (!isModuleLive("expenses")) return;
    try {
      await cancelExpense(row.id);
      setReloadKey((k) => k + 1);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to cancel expense");
    }
  };

  const handlePay = async () => {
    if (!isModuleLive("expenses") || !selected) return;

    setSaving(true);
    setFormError(null);
    try {
      await payExpense(selected.id, {
        cashbox_id: payCashboxId ? Number(payCashboxId) : null,
      });
      closeDialog();
      setReloadKey((k) => k + 1);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Failed to pay expense");
    } finally {
      setSaving(false);
    }
  };

  const formFields = (
    <div className="grid gap-3 py-2">
      <div className="space-y-2">
        <Label>التصنيف</Label>
        <Select value={form.expense_category_id || "none"} onValueChange={(v) => setForm((p) => ({ ...p, expense_category_id: v === "none" ? "" : v }))}>
          <SelectTrigger><SelectValue placeholder="اختر التصنيف" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="none">—</SelectItem>
            {categories.map((c) => (<SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>الفرع</Label>
        <Select value={form.branch_id || "none"} onValueChange={(v) => setForm((p) => ({ ...p, branch_id: v === "none" ? "" : v }))}>
          <SelectTrigger><SelectValue placeholder="اختر الفرع" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="none">—</SelectItem>
            {branches.map((b) => (<SelectItem key={b.id} value={String(b.id)}>{b.name}</SelectItem>))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>الصندوق</Label>
        <Select value={form.cashbox_id || "none"} onValueChange={(v) => setForm((p) => ({ ...p, cashbox_id: v === "none" ? "" : v }))}>
          <SelectTrigger><SelectValue placeholder="اختر الصندوق" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="none">—</SelectItem>
            {cashboxes.map((c) => (<SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>المبلغ</Label>
        <Input type="number" min="0" step="0.01" value={form.amount} onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))} required dir="ltr" />
      </div>
      <div className="space-y-2">
        <Label>طريقة الدفع</Label>
        <Select value={form.method || "none"} onValueChange={(v) => setForm((p) => ({ ...p, method: v === "none" ? "" : v }))}>
          <SelectTrigger><SelectValue placeholder="اختر الطريقة" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="none">—</SelectItem>
            {PAYMENT_METHODS.map((m) => (<SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>المورد</Label>
        <Input value={form.vendor} onChange={(e) => setForm((p) => ({ ...p, vendor: e.target.value }))} />
      </div>
      <div className="space-y-2">
        <Label>التاريخ</Label>
        <Input type="date" value={form.expense_date} onChange={(e) => setForm((p) => ({ ...p, expense_date: e.target.value }))} required dir="ltr" />
      </div>
      <div className="space-y-2">
        <Label>الوصف</Label>
        <Input value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
      </div>
      {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
    </div>
  );

  const statCards = summary
    ? [
        { label: "إجمالي المصروفات", subLabel: "معاملة", value: summary.total_count ?? total, icon: Receipt, gradient: "linear-gradient(135deg, #DC2626, #F87171)" },
        { label: "المبلغ الكلي", subLabel: "جنيه مصري", value: summary.total_amount, icon: CircleDollarSign, gradient: "linear-gradient(135deg, #B91C1C, #EF4444)" },
        { label: "تم الدفع", subLabel: "جنيه مصري", value: summary.paid_amount, icon: CheckCircle, gradient: "linear-gradient(135deg, #059669, #34D399)", valueColor: "#059669" },
        { label: "في الانتظار", subLabel: "جنيه مصري", value: summary.pending_amount + summary.approved_amount, icon: Clock, gradient: "linear-gradient(135deg, #D97706, #FBBF24)", valueColor: "#D97706" },
      ]
    : [];

  const paidCount = rows.filter((r) => r.status === "paid").length;
  const pendingCount = rows.filter((r) => r.status === "pending" || r.status === "approved").length;
  const cancelledCount = rows.filter((r) => r.status === "cancelled").length;

  return (
    <div className="w-full max-w-full space-y-5 overflow-x-hidden" dir="rtl">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #DC2626, #F87171)" }}>
          <Receipt className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-black">قوائم المصروفات</h1>
          <p className="text-sm text-muted-foreground">عرض وإدارة جميع المصروفات والمدفوعات</p>
        </div>
      </div>

      <FinanceStatsCards stats={statCards} loading={statsLoading} />

      <FinanceListFiltersBar
        search={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        searchPlaceholder="المورد، التصنيف، رقم المصروف..."
        selects={[
          {
            id: "category",
            label: "التصنيف",
            value: filters.expense_category_id ? String(filters.expense_category_id) : "",
            options: categories.map((c) => ({ value: String(c.id), label: c.name })),
            onChange: (v) => { setFilters((f) => ({ ...f, expense_category_id: v ? Number(v) : undefined })); setPage(1); },
          },
          {
            id: "branch",
            label: "الفرع",
            value: filters.branch_id ? String(filters.branch_id) : "",
            options: branches.map((b) => ({ value: String(b.id), label: b.name })),
            onChange: (v) => { setFilters((f) => ({ ...f, branch_id: v ? Number(v) : undefined })); setPage(1); },
          },
          {
            id: "status",
            label: "الحالة",
            value: filters.status ?? "",
            options: [
              { value: "pending", label: "معلق" },
              { value: "approved", label: "موافق عليه" },
              { value: "paid", label: "مدفوع" },
              { value: "cancelled", label: "ملغي" },
            ],
            onChange: (v) => { setFilters((f) => ({ ...f, status: v || undefined })); setPage(1); },
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
        primaryAction={{ label: "مصروف جديد", onClick: openCreate, disabled: !isModuleLive("expenses") }}
      />

      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

      <Card className="border-0 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto max-w-full">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#1a3a6d] hover:bg-[#1a3a6d]">
                  {["رقم", "الفرع", "الصندوق", "التصنيف", "المورد", "المبلغ", "التاريخ", "الحالة", "ملاحظات", "الإجراءات"].map((h) => (
                    <TableHead key={h} className="text-center font-bold text-xs text-white whitespace-nowrap">{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableSkeletonRows rows={5} cols={10} />
                ) : rows.length === 0 ? (
                  <TableRow><TableCell colSpan={10} className="py-12 text-center text-muted-foreground">لا توجد مصروفات</TableCell></TableRow>
                ) : (
                  rows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="text-center">
                        <div className="text-xs font-mono text-blue-600">{row.reference_number ?? `EXP-${row.id}`}</div>
                        <div className="text-[10px] text-muted-foreground">#{row.id}</div>
                      </TableCell>
                      <TableCell className="text-center text-sm whitespace-nowrap">{branchName(row.branch_id)}</TableCell>
                      <TableCell className="text-center text-sm whitespace-nowrap">{cashboxName(row.cashbox_id)}</TableCell>
                      <TableCell className="text-center"><Badge variant="secondary">{row.category?.name ?? "—"}</Badge></TableCell>
                      <TableCell className="text-center text-sm">{row.vendor || "—"}</TableCell>
                      <TableCell className="text-center font-bold whitespace-nowrap">{formatNumber(row.amount)} ج.م</TableCell>
                      <TableCell className="text-center text-xs text-muted-foreground whitespace-nowrap">{row.expense_date}</TableCell>
                      <TableCell className="text-center"><StatusBadge status={row.status} /></TableCell>
                      <TableCell className="text-center text-xs text-muted-foreground max-w-[120px] truncate">{row.notes || row.description || "—"}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1 flex-wrap">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" title="عرض"><Eye className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" disabled={!isModuleLive("expenses")} onClick={() => openEdit(row)}><Pencil className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" title="طباعة"><Printer className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" disabled={!isModuleLive("expenses")} onClick={() => openDelete(row)}><Trash2 className="h-3.5 w-3.5 text-red-500" /></Button>
                          {row.status === "pending" && (
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" disabled={!isModuleLive("expenses")} onClick={() => handleApprove(row)} title="موافقة"><CheckCircle className="h-3.5 w-3.5 text-green-600" /></Button>
                          )}
                          {row.status === "approved" && (
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" disabled={!isModuleLive("expenses")} onClick={() => openPay(row)} title="دفع"><Banknote className="h-3.5 w-3.5 text-blue-600" /></Button>
                          )}
                          {(row.status === "pending" || row.status === "approved") && (
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" disabled={!isModuleLive("expenses")} onClick={() => handleCancel(row)} title="إلغاء"><XCircle className="h-3.5 w-3.5 text-red-500" /></Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-3 py-3 px-4 bg-muted/20 border-t">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="text-green-600 font-medium">{paidCount} مدفوع</span>
            <span className="text-amber-600 font-medium">{pendingCount} معلق</span>
            <span className="text-red-500 font-medium">{cancelledCount} ملغي</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <span className="text-sm font-bold">الإجمالي: {formatNumber(summary?.total_amount ?? 0)} ج.م</span>
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

      <ShadDialog open={dialog === "create" || dialog === "edit"} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle>{dialog === "edit" ? "تعديل المصروف" : "إنشاء مصروف جديد"}</DialogTitle>
              <DialogDescription>{dialog === "edit" ? `تعديل مصروف #${selected?.id}` : "أدخل بيانات المصروف."}</DialogDescription>
            </DialogHeader>
            {formFields}
            <DialogFooter>
              <Button type="button" variant="outline" disabled={saving} onClick={closeDialog}>إلغاء</Button>
              <Button type="submit" disabled={saving}>{saving ? "جاري الحفظ..." : "حفظ"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </ShadDialog>

      <ShadDialog open={dialog === "delete"} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>حذف المصروف</DialogTitle>
            <DialogDescription>هل أنت متأكد من حذف المصروف #{selected?.id}؟</DialogDescription>
          </DialogHeader>
          {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
          <DialogFooter>
            <Button variant="outline" disabled={saving} onClick={closeDialog}>إلغاء</Button>
            <Button variant="destructive" disabled={saving} onClick={handleDelete}>{saving ? "جاري الحذف..." : "حذف"}</Button>
          </DialogFooter>
        </DialogContent>
      </ShadDialog>

      <ShadDialog open={dialog === "pay"} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>دفع المصروف</DialogTitle>
            <DialogDescription>تأكيد دفع المصروف #{selected?.id} بمبلغ {formatNumber(selected?.amount ?? 0)}</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label>الصندوق</Label>
            <Select value={payCashboxId || "none"} onValueChange={(v) => setPayCashboxId(v === "none" ? "" : v)}>
              <SelectTrigger><SelectValue placeholder="اختر الصندوق" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">—</SelectItem>
                {cashboxes.map((c) => (<SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>))}
              </SelectContent>
            </Select>
            {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
          </div>
          <DialogFooter>
            <Button variant="outline" disabled={saving} onClick={closeDialog}>إلغاء</Button>
            <Button disabled={saving} onClick={handlePay}>{saving ? "جاري الدفع..." : "تأكيد الدفع"}</Button>
          </DialogFooter>
        </DialogContent>
      </ShadDialog>
    </div>
  );
}
