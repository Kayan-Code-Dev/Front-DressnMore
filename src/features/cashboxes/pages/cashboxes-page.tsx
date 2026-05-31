import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { ListPageStandardFilters } from "@/components/shared/ListPageStandardFilters";
import { isModuleLive } from "@/config/feature-flags";
import type { BranchItem } from "@/features/branches/types/branches.types";
import { listBranches } from "@/features/branches/services/branches.api.service";
import type { CashboxItem } from "@/features/cashboxes/types/cashboxes.types";
import { listCashboxesMock } from "@/features/cashboxes/services/cashboxes.mock.service";
import {
  createCashbox,
  deleteCashbox,
  listCashboxes,
  updateCashbox,
} from "@/features/cashboxes/services/cashboxes.api.service";
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
import { Wallet, Search, Plus, Filter, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

function fetchCashboxData(searchTerm: string, currentPage: number) {
  if (isModuleLive("cashboxes")) {
    return listCashboxes({ search: searchTerm, page: currentPage, per_page: 15 });
  }
  return listCashboxesMock(searchTerm);
}

type CashboxForm = {
  name: string;
  branch_id: string;
  initial_balance: string;
  description: string;
  is_active: "true" | "false";
};

const emptyForm = (): CashboxForm => ({
  name: "",
  branch_id: "",
  initial_balance: "0",
  description: "",
  is_active: "true",
});

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

export function CashboxesPage() {
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<CashboxItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);
  const [dialog, setDialog] = useState<"create" | "edit" | "delete" | null>(null);
  const [selected, setSelected] = useState<CashboxItem | null>(null);
  const [form, setForm] = useState<CashboxForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [branches, setBranches] = useState<BranchItem[]>([]);

  const branchName = useMemo(() => {
    const map = new Map(branches.map((b) => [b.id, b.name]));
    return (id: number | null) => (id ? map.get(id) ?? `#${id}` : "—");
  }, [branches]);

  useEffect(() => {
    if (!isModuleLive("cashboxes")) return;
    listBranches({ per_page: 100 })
      .then((res) => setBranches(res.data))
      .catch(() => {});
  }, []);

  const loadRows = useCallback(() => {
    setLoading(true);
    fetchCashboxData(search, page)
      .then((response) => {
        setRows(response.data);
        const meta = response.meta as { last_page?: number; total?: number } | null | undefined;
        setTotalPages(meta?.last_page ?? 1);
        setTotal(meta?.total ?? response.data.length);
        setError(null);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load cashboxes");
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

  const openEdit = (row: CashboxItem) => {
    setSelected(row);
    setForm({
      name: row.name,
      branch_id: row.branch_id ? String(row.branch_id) : "",
      initial_balance: String(row.initial_balance),
      description: row.description ?? "",
      is_active: row.is_active ? "true" : "false",
    });
    setFormError(null);
    setDialog("edit");
  };

  const openDelete = (row: CashboxItem) => {
    setSelected(row);
    setFormError(null);
    setDialog("delete");
  };

  const closeDialog = () => {
    if (saving) return;
    setDialog(null);
    setSelected(null);
    setFormError(null);
  };

  const toPayload = () => ({
    name: form.name.trim(),
    branch_id: form.branch_id ? Number(form.branch_id) : null,
    initial_balance: form.initial_balance ? Number(form.initial_balance) : 0,
    description: form.description.trim() || null,
    is_active: form.is_active === "true",
  });

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    if (!isModuleLive("cashboxes")) return;

    setSaving(true);
    setFormError(null);
    try {
      if (dialog === "create") {
        await createCashbox(toPayload());
      } else if (dialog === "edit" && selected) {
        await updateCashbox(selected.id, toPayload());
      }
      closeDialog();
      setReloadKey((k) => k + 1);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Failed to save cashbox");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isModuleLive("cashboxes") || !selected) return;

    setSaving(true);
    setFormError(null);
    try {
      await deleteCashbox(selected.id);
      closeDialog();
      setReloadKey((k) => k + 1);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Failed to delete cashbox");
    } finally {
      setSaving(false);
    }
  };

  const formFields = (
    <div className="grid gap-3 py-2">
      <div className="space-y-2">
        <Label>الاسم</Label>
        <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
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
        <Label>الرصيد الافتتاحي</Label>
        <Input type="number" step="0.01" value={form.initial_balance} onChange={(e) => setForm((p) => ({ ...p, initial_balance: e.target.value }))} dir="ltr" />
      </div>
      <div className="space-y-2">
        <Label>الوصف</Label>
        <Input value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
      </div>
      <div className="space-y-2">
        <Label>الحالة</Label>
        <Select value={form.is_active} onValueChange={(v) => setForm((p) => ({ ...p, is_active: v as "true" | "false" }))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="true">نشط</SelectItem>
            <SelectItem value="false">غير نشط</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
    </div>
  );

  const columns = useMemo(
    () => [
      { key: "id", title: "#" },
      { key: "name", title: "الاسم" },
      { key: "branch", title: "الفرع" },
      { key: "initial_balance", title: "الرصيد الافتتاحي" },
      { key: "current_balance", title: "الرصيد الحالي" },
      { key: "is_active", title: "الحالة" },
      { key: "description", title: "الوصف" },
      { key: "actions", title: "إجراءات" },
    ],
    [],
  );

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #D97706, #FBBF24)" }}>
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-black" style={{ color: "var(--color-text-primary)" }}>إدارة الصناديق</CardTitle>
              <CardDescription>عرض وإدارة صناديق النقد في النظام.</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" onClick={() => setFiltersOpen((v) => !v)}><Filter className="h-4 w-4 ml-1.5" />الفلاتر</Button>
            <Button disabled={!isModuleLive("cashboxes")} onClick={openCreate}><Plus className="h-4 w-4 ml-1.5" />إنشاء صندوق</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="بحث عن صندوق..." className="pr-9" />
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
                        <TableCell className="text-center font-medium">{row.name}</TableCell>
                        <TableCell className="text-center text-muted-foreground">{branchName(row.branch_id)}</TableCell>
                        <TableCell className="text-center">{row.initial_balance.toLocaleString()}</TableCell>
                        <TableCell className="text-center font-medium">{row.current_balance.toLocaleString()}</TableCell>
                        <TableCell className="text-center"><Badge variant={row.is_active ? "success" : "destructive"}>{row.is_active ? "نشط" : "غير نشط"}</Badge></TableCell>
                        <TableCell className="text-center text-muted-foreground text-xs max-w-[150px] truncate">{row.description || "—"}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" disabled={!isModuleLive("cashboxes")} onClick={() => openEdit(row)}><Pencil className="h-3.5 w-3.5 text-muted-foreground" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" disabled={!isModuleLive("cashboxes")} onClick={() => openDelete(row)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={columns.length} className="py-10 text-center text-muted-foreground">لا توجد صناديق لعرضها.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm text-muted-foreground">إجمالي الصناديق: <span className="font-bold">{total}</span></p>
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
              <DialogTitle>{dialog === "edit" ? "تعديل الصندوق" : "إنشاء صندوق جديد"}</DialogTitle>
              <DialogDescription>{dialog === "edit" ? `تعديل: ${selected?.name ?? ""}` : "أدخل بيانات الصندوق."}</DialogDescription>
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
            <DialogTitle>حذف الصندوق</DialogTitle>
            <DialogDescription>هل أنت متأكد من حذف الصندوق &quot;{selected?.name}&quot;؟</DialogDescription>
          </DialogHeader>
          {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
          <DialogFooter>
            <Button variant="outline" disabled={saving} onClick={closeDialog}>إلغاء</Button>
            <Button variant="destructive" disabled={saving} onClick={handleDelete}>{saving ? "جاري الحذف..." : "حذف"}</Button>
          </DialogFooter>
        </DialogContent>
      </ShadDialog>
    </div>
  );
}
