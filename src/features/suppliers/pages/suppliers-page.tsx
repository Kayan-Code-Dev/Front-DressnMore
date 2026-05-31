import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { ListPageStandardFilters } from "@/components/shared/ListPageStandardFilters";
import { isModuleLive } from "@/config/feature-flags";
import type { SupplierItem } from "@/features/suppliers/types/suppliers.types";
import { listSuppliersMock } from "@/features/suppliers/services/suppliers.mock.service";
import {
  createSupplier,
  deleteSupplier,
  listSuppliers,
  updateSupplier,
} from "@/features/suppliers/services/suppliers.api.service";
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
import { Truck, Search, Plus, Filter, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { formatNumber } from "@/shared/lib/format/numbers";

function fetchSupplierData(searchTerm: string, currentPage: number) {
  if (isModuleLive("suppliers")) {
    return listSuppliers({ search: searchTerm, page: currentPage, per_page: 15 });
  }
  return listSuppliersMock(searchTerm);
}

type SupplierForm = {
  code: string;
  name: string;
  phone: string;
  address: string;
  status: "active" | "inactive";
};

const emptyForm = (): SupplierForm => ({
  code: "",
  name: "",
  phone: "",
  address: "",
  status: "active",
});

function TableSkeletonRows({ rows = 5, cols = 7 }: { rows?: number; cols?: number }) {
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

export function SuppliersPage() {
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<SupplierItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);
  const [dialog, setDialog] = useState<"create" | "edit" | "delete" | null>(null);
  const [selected, setSelected] = useState<SupplierItem | null>(null);
  const [form, setForm] = useState<SupplierForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadRows = useCallback(() => {
    setLoading(true);
    fetchSupplierData(search, page)
      .then((response) => {
        setRows(response.data);
        const meta = response.meta as { last_page?: number; total?: number } | null | undefined;
        setTotalPages(meta?.last_page ?? 1);
        setTotal(meta?.total ?? response.data.length);
        setError(null);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load suppliers");
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

  const openEdit = (row: SupplierItem) => {
    setSelected(row);
    setForm({
      code: row.code ?? "",
      name: row.name,
      phone: row.phone ?? "",
      address: row.address ?? "",
      status: row.status,
    });
    setFormError(null);
    setDialog("edit");
  };

  const openDelete = (row: SupplierItem) => {
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
    code: form.code.trim() || null,
    name: form.name.trim(),
    phone: form.phone.trim() || null,
    address: form.address.trim() || null,
    status: form.status,
  });

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    if (!isModuleLive("suppliers")) return;

    setSaving(true);
    setFormError(null);
    try {
      if (dialog === "create") {
        await createSupplier(toPayload());
      } else if (dialog === "edit" && selected) {
        await updateSupplier(selected.id, toPayload());
      }
      closeDialog();
      setReloadKey((k) => k + 1);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Failed to save supplier");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isModuleLive("suppliers") || !selected) return;

    setSaving(true);
    setFormError(null);
    try {
      await deleteSupplier(selected.id);
      closeDialog();
      setReloadKey((k) => k + 1);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Failed to delete supplier");
    } finally {
      setSaving(false);
    }
  };

  const columns = useMemo(
    () => [
      { key: "id", title: "#" },
      { key: "code", title: "الكود" },
      { key: "name", title: "الاسم" },
      { key: "phone", title: "الهاتف" },
      { key: "address", title: "العنوان" },
      { key: "current_balance", title: "الرصيد" },
      { key: "status", title: "الحالة" },
      { key: "actions", title: "إجراءات" },
    ],
    [],
  );

  const formFields = (
    <div className="grid gap-3 py-2">
      <div className="space-y-2">
        <Label>الكود</Label>
        <Input value={form.code} onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))} placeholder="SUP-001" />
      </div>
      <div className="space-y-2">
        <Label>الاسم</Label>
        <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
      </div>
      <div className="space-y-2">
        <Label>الهاتف</Label>
        <Input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} dir="ltr" />
      </div>
      <div className="space-y-2">
        <Label>العنوان</Label>
        <Input value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} />
      </div>
      <div className="space-y-2">
        <Label>الحالة</Label>
        <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v as "active" | "inactive" }))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="active">نشط</SelectItem>
            <SelectItem value="inactive">غير نشط</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
    </div>
  );

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #7C3AED, #A78BFA)" }}>
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-black" style={{ color: "var(--color-text-primary)" }}>إدارة الموردين</CardTitle>
              <CardDescription>عرض وإدارة بيانات الموردين.</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" onClick={() => setFiltersOpen((v) => !v)}><Filter className="h-4 w-4 ml-1.5" />الفلاتر</Button>
            <Button disabled={!isModuleLive("suppliers")} onClick={openCreate}><Plus className="h-4 w-4 ml-1.5" />إنشاء مورد</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="بحث عن مورد..." className="pr-9" />
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
                        <TableCell className="text-center"><Badge variant="outline" className="font-mono">{row.code || "—"}</Badge></TableCell>
                        <TableCell className="text-center font-medium">{row.name}</TableCell>
                        <TableCell className="text-center text-muted-foreground" dir="ltr">{row.phone || "—"}</TableCell>
                        <TableCell className="text-center text-muted-foreground text-xs max-w-[150px] truncate">{row.address || "—"}</TableCell>
                        <TableCell className="text-center font-medium">{formatNumber((row.current_balance ?? 0))}</TableCell>
                        <TableCell className="text-center"><Badge variant={row.status === "active" ? "success" : "destructive"}>{row.status === "active" ? "نشط" : "غير نشط"}</Badge></TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" disabled={!isModuleLive("suppliers")} onClick={() => openEdit(row)}><Pencil className="h-3.5 w-3.5 text-muted-foreground" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" disabled={!isModuleLive("suppliers")} onClick={() => openDelete(row)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={columns.length} className="py-10 text-center text-muted-foreground">لا يوجد موردين لعرضهم.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm text-muted-foreground">إجمالي الموردين: <span className="font-bold">{total}</span></p>
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
              <DialogTitle>{dialog === "edit" ? "تعديل المورد" : "إنشاء مورد جديد"}</DialogTitle>
              <DialogDescription>{dialog === "edit" ? `تعديل: ${selected?.name ?? ""}` : "أدخل بيانات المورد الجديد."}</DialogDescription>
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
            <DialogTitle>حذف المورد</DialogTitle>
            <DialogDescription>هل أنت متأكد من حذف المورد &quot;{selected?.name}&quot;؟</DialogDescription>
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
