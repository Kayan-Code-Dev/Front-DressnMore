import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { ListPageStandardFilters } from "@/components/shared/ListPageStandardFilters";
import { isModuleLive } from "@/config/feature-flags";
import type { BranchItem } from "@/features/branches/types/branches.types";
import { listBranches } from "@/features/branches/services/branches.api.service";
import type { CashboxItem } from "@/features/cashboxes/types/cashboxes.types";
import { listCashboxes } from "@/features/cashboxes/services/cashboxes.api.service";
import type { ExpenseCategoryItem, ExpenseItem } from "@/features/expenses/types/expenses.types";
import { listExpenseCategories } from "@/features/expenses/services/expense-categories.api.service";
import { listExpensesMock } from "@/features/expenses/services/expenses.mock.service";
import {
  approveExpense,
  cancelExpense,
  createExpense,
  deleteExpense,
  listExpenses,
  payExpense,
  updateExpense,
} from "@/features/expenses/services/expenses.api.service";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
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
  Search,
  Plus,
  Filter,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Banknote,
} from "lucide-react";

const PAYMENT_METHODS = [
  { value: "cash", label: "نقدي" },
  { value: "instapay", label: "InstaPay" },
  { value: "vodafone_cash", label: "فودافون كاش" },
  { value: "bank_transfer", label: "تحويل بنكي" },
];

function fetchExpenseData(searchTerm: string, currentPage: number) {
  if (isModuleLive("expenses")) {
    return listExpenses({ search: searchTerm, page: currentPage, per_page: 15 });
  }
  return listExpensesMock(searchTerm);
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
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
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

  useEffect(() => {
    if (!isModuleLive("expenses")) return;
    Promise.all([
      listBranches({ per_page: 100 }),
      listCashboxes({ per_page: 100 }),
      listExpenseCategories({ per_page: 100 }),
    ])
      .then(([bRes, cRes, catRes]) => {
        setBranches(bRes.data);
        setCashboxes(cRes.data);
        setCategories(catRes.data);
      })
      .catch(() => {});
  }, []);

  const loadRows = useCallback(() => {
    setLoading(true);
    fetchExpenseData(search, page)
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
  }, [search, page]);

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

  const columns = useMemo(
    () => [
      { key: "id", title: "#" },
      { key: "branch", title: "الفرع" },
      { key: "cashbox", title: "الصندوق" },
      { key: "category", title: "التصنيف" },
      { key: "vendor", title: "المورد" },
      { key: "amount", title: "المبلغ" },
      { key: "expense_date", title: "التاريخ" },
      { key: "status", title: "الحالة" },
      { key: "actions", title: "إجراءات" },
    ],
    [],
  );

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #DC2626, #F87171)" }}>
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-black" style={{ color: "var(--color-text-primary)" }}>إدارة المصروفات</CardTitle>
              <CardDescription>عرض وإدارة المصروفات في النظام.</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" onClick={() => setFiltersOpen((v) => !v)}><Filter className="h-4 w-4 ml-1.5" />الفلاتر</Button>
            <Button disabled={!isModuleLive("expenses")} onClick={openCreate}><Plus className="h-4 w-4 ml-1.5" />إنشاء مصروف</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="بحث عن مصروف..." className="pr-9" />
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
                        <TableCell className="text-center text-muted-foreground">{branchName(row.branch_id)}</TableCell>
                        <TableCell className="text-center text-muted-foreground">{cashboxName(row.cashbox_id)}</TableCell>
                        <TableCell className="text-center">{row.category?.name ?? "—"}</TableCell>
                        <TableCell className="text-center text-muted-foreground">{row.vendor || "—"}</TableCell>
                        <TableCell className="text-center font-medium">{row.amount.toLocaleString()}</TableCell>
                        <TableCell className="text-center text-muted-foreground">{row.expense_date}</TableCell>
                        <TableCell className="text-center"><StatusBadge status={row.status} /></TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1 flex-wrap">
                            <Button variant="ghost" size="icon" className="h-8 w-8" disabled={!isModuleLive("expenses")} onClick={() => openEdit(row)}><Pencil className="h-3.5 w-3.5 text-muted-foreground" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" disabled={!isModuleLive("expenses")} onClick={() => openDelete(row)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                            {row.status === "pending" && (
                              <Button variant="ghost" size="icon" className="h-8 w-8" disabled={!isModuleLive("expenses")} onClick={() => handleApprove(row)} title="موافقة"><CheckCircle className="h-3.5 w-3.5 text-emerald-600" /></Button>
                            )}
                            {row.status === "approved" && (
                              <Button variant="ghost" size="icon" className="h-8 w-8" disabled={!isModuleLive("expenses")} onClick={() => openPay(row)} title="دفع"><Banknote className="h-3.5 w-3.5 text-blue-600" /></Button>
                            )}
                            {(row.status === "pending" || row.status === "approved") && (
                              <Button variant="ghost" size="icon" className="h-8 w-8" disabled={!isModuleLive("expenses")} onClick={() => handleCancel(row)} title="إلغاء"><XCircle className="h-3.5 w-3.5 text-destructive" /></Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={columns.length} className="py-10 text-center text-muted-foreground">لا توجد مصروفات لعرضها.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm text-muted-foreground">إجمالي المصروفات: <span className="font-bold">{total}</span></p>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}><ChevronRight className="h-4 w-4" />السابق</Button>
              <span className="text-sm text-muted-foreground px-2">{page} / {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>التالي<ChevronLeft className="h-4 w-4" /></Button>
            </div>
          )}
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
            <DialogDescription>تأكيد دفع المصروف #{selected?.id} بمبلغ {selected?.amount.toLocaleString()}</DialogDescription>
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
