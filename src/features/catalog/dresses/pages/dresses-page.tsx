import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { ListPageStandardFilters } from "@/components/shared/ListPageStandardFilters";
import { isModuleLive } from "@/config/feature-flags";
import type { DressItem, DressStatus } from "@/features/catalog/dresses/types/dresses.types";
import { listDressesMock } from "@/features/catalog/dresses/services/dresses.mock.service";
import {
  createDress,
  deleteDress,
  listDresses,
  updateDress,
} from "@/features/catalog/dresses/services/dresses.api.service";
import { listDressCategories } from "@/features/catalog/categories/services/categories.api.service";
import type { CategoryItem } from "@/features/catalog/categories/types/categories.types";
import { listBranches } from "@/features/branches/services/branches.api.service";
import type { BranchItem } from "@/features/branches/types/branches.types";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
} from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Shirt, Search, Filter, ChevronLeft, ChevronRight, Plus, Pencil, Trash2 } from "lucide-react";

function fetchDressData(searchTerm: string, currentPage: number) {
  if (isModuleLive("dresses")) {
    return listDresses({ search: searchTerm, page: currentPage, per_page: 15 });
  }
  return listDressesMock(searchTerm);
}

type DressForm = {
  code: string;
  name: string;
  dress_category_id: string;
  branch_id: string;
  status: DressStatus;
};

const emptyForm = (): DressForm => ({
  code: "",
  name: "",
  dress_category_id: "",
  branch_id: "",
  status: "available",
});

const statusMap: Record<string, { label: string; variant: "success" | "warning" | "destructive" | "info" }> = {
  available: { label: "متاح", variant: "success" },
  rented: { label: "مؤجر", variant: "warning" },
  sold: { label: "مباع", variant: "info" },
  maintenance: { label: "صيانة", variant: "destructive" },
  unavailable: { label: "غير متاح", variant: "destructive" },
};

const DRESS_STATUSES: DressStatus[] = ["available", "rented", "sold", "maintenance", "unavailable"];

function StatusBadge({ status }: { status: string }) {
  const config = statusMap[status] ?? { label: status, variant: "info" as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

function TableSkeletonRows({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: cols }).map((__, j) => (
            <TableCell key={j} className="text-center">
              <Skeleton className="h-5 w-full max-w-[120px] mx-auto" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

export function DressesPage() {
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<DressItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);
  const [dialog, setDialog] = useState<"create" | "edit" | "delete" | null>(null);
  const [selected, setSelected] = useState<DressItem | null>(null);
  const [form, setForm] = useState<DressForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [categoryOptions, setCategoryOptions] = useState<CategoryItem[]>([]);
  const [branchOptions, setBranchOptions] = useState<BranchItem[]>([]);

  useEffect(() => {
    if (!isModuleLive("dresses")) return;

    let cancelled = false;
    Promise.all([
      listDressCategories({ only_parents: true, per_page: 100 }),
      listBranches({ per_page: 100 }),
    ])
      .then(([catRes, branchRes]) => {
        if (cancelled) return;
        setCategoryOptions(catRes.data);
        setBranchOptions(branchRes.data);
      })
      .catch(() => {
        if (!cancelled) {
          setCategoryOptions([]);
          setBranchOptions([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const loadRows = useCallback(() => {
    setLoading(true);
    fetchDressData(search, page)
      .then((response) => {
        setRows(response.data);
        const meta = response.meta as { last_page?: number; total?: number } | null | undefined;
        setTotalPages(meta?.last_page ?? 1);
        setTotal(meta?.total ?? response.data.length);
        setError(null);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load dresses");
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

  const openEdit = (row: DressItem) => {
    setSelected(row);
    setForm({
      code: row.code,
      name: row.name,
      dress_category_id: row.dress_category_id != null ? String(row.dress_category_id) : "",
      branch_id: row.branch_id != null ? String(row.branch_id) : "",
      status: row.status,
    });
    setFormError(null);
    setDialog("edit");
  };

  const openDelete = (row: DressItem) => {
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
    code: form.code.trim(),
    name: form.name.trim(),
    dress_category_id: form.dress_category_id ? Number(form.dress_category_id) : null,
    branch_id: form.branch_id ? Number(form.branch_id) : null,
    status: form.status,
  });

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    if (!isModuleLive("dresses")) return;

    setSaving(true);
    setFormError(null);
    try {
      if (dialog === "create") {
        await createDress(toPayload());
      } else if (dialog === "edit" && selected) {
        await updateDress(selected.id, toPayload());
      }
      closeDialog();
      setReloadKey((k) => k + 1);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Failed to save dress");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isModuleLive("dresses") || !selected) return;

    setSaving(true);
    setFormError(null);
    try {
      await deleteDress(selected.id);
      closeDialog();
      setReloadKey((k) => k + 1);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Failed to delete dress");
    } finally {
      setSaving(false);
    }
  };

  const columns = useMemo(
    () => [
      { key: "id", title: "#" },
      { key: "code", title: "الكود" },
      { key: "name", title: "الفستان" },
      { key: "category", title: "القسم" },
      { key: "branch", title: "الفرع" },
      { key: "status", title: "الحالة" },
      { key: "actions", title: "إجراءات" },
    ],
    [],
  );

  const formFields = (
    <div className="grid gap-3 py-2">
      <div className="space-y-2">
        <Label>الكود</Label>
        <Input
          value={form.code}
          onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))}
          placeholder="DRS-001"
          required
        />
      </div>
      <div className="space-y-2">
        <Label>الاسم</Label>
        <Input
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          placeholder="اسم الفستان"
          required
        />
      </div>
      <div className="space-y-2">
        <Label>القسم</Label>
        <Select
          value={form.dress_category_id || "__none__"}
          onValueChange={(v) =>
            setForm((p) => ({ ...p, dress_category_id: v === "__none__" ? "" : v }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر القسم" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">— بدون قسم —</SelectItem>
            {categoryOptions.map((cat) => (
              <SelectItem key={cat.id} value={String(cat.id)}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>الفرع</Label>
        <Select
          value={form.branch_id || "__none__"}
          onValueChange={(v) => setForm((p) => ({ ...p, branch_id: v === "__none__" ? "" : v }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر الفرع" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">— بدون فرع —</SelectItem>
            {branchOptions.map((branch) => (
              <SelectItem key={branch.id} value={String(branch.id)}>
                {branch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>الحالة</Label>
        <Select
          value={form.status}
          onValueChange={(v) => setForm((p) => ({ ...p, status: v as DressStatus }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DRESS_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {statusMap[s]?.label ?? s}
              </SelectItem>
            ))}
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
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #E11D48, #FB7185)" }}>
              <Shirt className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-black" style={{ color: "var(--color-text-primary)" }}>إدارة الفساتين</CardTitle>
              <CardDescription>عرض وتعديل وإدارة الفساتين في النظام.</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" onClick={() => setFiltersOpen((v) => !v)}><Filter className="h-4 w-4 ml-1.5" />الفلاتر</Button>
            <Button disabled={!isModuleLive("dresses")} onClick={openCreate}>
              <Plus className="h-4 w-4 ml-1.5" />
              إنشاء فستان
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="بحث عن فستان..."
                className="pr-9"
              />
            </div>
          </div>
          <ListPageStandardFilters open={filtersOpen} />

          {error && <div className="flex items-center justify-center py-6"><p className="text-destructive text-sm">حدث خطأ أثناء تحميل البيانات: {error}</p></div>}
          {!error && (
            <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    {columns.map((col) => (<TableHead key={col.key} className="text-center font-bold text-xs">{col.title}</TableHead>))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (<TableSkeletonRows rows={5} cols={columns.length} />) : rows.length > 0 ? (
                    rows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="text-center text-muted-foreground">{row.id}</TableCell>
                        <TableCell className="text-center"><Badge variant="outline" className="font-mono">{row.code}</Badge></TableCell>
                        <TableCell className="text-center font-medium">{row.name}</TableCell>
                        <TableCell className="text-center text-muted-foreground">{row.category?.name ?? "—"}</TableCell>
                        <TableCell className="text-center text-muted-foreground">{row.branch?.name ?? "—"}</TableCell>
                        <TableCell className="text-center"><StatusBadge status={row.status} /></TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              disabled={!isModuleLive("dresses")}
                              onClick={() => openEdit(row)}
                            >
                              <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              disabled={!isModuleLive("dresses")}
                              onClick={() => openDelete(row)}
                            >
                              <Trash2 className="h-3.5 w-3.5 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={columns.length} className="py-10 text-center text-muted-foreground">لا توجد فساتين لعرضها.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm text-muted-foreground">إجمالي الفساتين: <span className="font-bold">{total}</span></p>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}><ChevronRight className="h-4 w-4" />السابق</Button>
              <span className="text-sm text-muted-foreground px-2">{page} / {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>التالي<ChevronLeft className="h-4 w-4" /></Button>
            </div>
          )}
        </CardFooter>
      </Card>

      <Dialog open={dialog === "create" || dialog === "edit"} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle>{dialog === "edit" ? "تعديل الفستان" : "إنشاء فستان جديد"}</DialogTitle>
              <DialogDescription>
                {dialog === "edit" ? `تعديل: ${selected?.name ?? ""}` : "أدخل بيانات الفستان الجديد."}
              </DialogDescription>
            </DialogHeader>
            {formFields}
            <DialogFooter>
              <Button type="button" variant="outline" disabled={saving} onClick={closeDialog}>إلغاء</Button>
              <Button type="submit" disabled={saving}>{saving ? "جاري الحفظ..." : "حفظ"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={dialog === "delete"} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>حذف الفستان</DialogTitle>
            <DialogDescription>هل أنت متأكد من حذف الفستان &quot;{selected?.name}&quot;؟</DialogDescription>
          </DialogHeader>
          {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
          <DialogFooter>
            <Button variant="outline" disabled={saving} onClick={closeDialog}>إلغاء</Button>
            <Button variant="destructive" disabled={saving} onClick={handleDelete}>
              {saving ? "جاري الحذف..." : "حذف"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
