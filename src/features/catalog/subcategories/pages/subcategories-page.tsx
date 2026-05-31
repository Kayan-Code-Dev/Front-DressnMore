import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { ListPageStandardFilters } from "@/components/shared/ListPageStandardFilters";
import { isModuleLive } from "@/config/feature-flags";
import type { SubcategoryItem } from "@/features/catalog/subcategories/types/subcategories.types";
import type { CategoryItem } from "@/features/catalog/categories/types/categories.types";
import { listSubcategoriesMock } from "@/features/catalog/subcategories/services/subcategories.mock.service";
import {
  createDressCategory,
  deleteDressCategory,
  listDressCategories,
  updateDressCategory,
} from "@/features/catalog/categories/services/categories.api.service";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Layers,
  Search,
  Plus,
  Filter,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function fetchSubcategoryData(searchTerm: string, currentPage: number) {
  if (isModuleLive("subcategories")) {
    return listDressCategories({ search: searchTerm, page: currentPage, per_page: 15, only_children: true });
  }
  return listSubcategoriesMock(searchTerm);
}

const statusMap: Record<string, { label: string; variant: "success" | "destructive" }> = {
  active: { label: "نشط", variant: "success" },
  inactive: { label: "غير نشط", variant: "destructive" },
};

function StatusBadge({ status }: { status: string }) {
  const config = statusMap[status] ?? { label: status, variant: "destructive" };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

function TableSkeletonRows({ rows = 5, cols = 6 }: { rows?: number; cols?: number }) {
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

export function SubcategoriesPage() {
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<SubcategoryItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);
  const [dialog, setDialog] = useState<null | "create" | "edit" | "delete">(null);
  const [selected, setSelected] = useState<SubcategoryItem | null>(null);
  const [parents, setParents] = useState<CategoryItem[]>([]);
  const [form, setForm] = useState({ parent_id: "", name: "", description: "", status: "active" as "active" | "inactive" });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadRows = useCallback(() => {
    setLoading(true);
    fetchSubcategoryData(search, page)
      .then((response) => {
        setRows(response.data as SubcategoryItem[]);
        const meta = response.meta as { last_page?: number; total?: number } | null | undefined;
        setTotalPages(meta?.last_page ?? 1);
        setTotal(meta?.total ?? response.data.length);
        setError(null);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load subcategories");
        setRows([]);
      })
      .finally(() => setLoading(false));
  }, [search, page]);

  useEffect(() => {
    loadRows();
  }, [loadRows, reloadKey]);

  useEffect(() => {
    if (!isModuleLive("subcategories")) return;
    listDressCategories({ only_parents: true, per_page: 100 })
      .then((res) => setParents(res.data))
      .catch(() => setParents([]));
  }, []);

  const openCreate = () => {
    setSelected(null);
    setForm({ parent_id: "", name: "", description: "", status: "active" });
    setFormError(null);
    setDialog("create");
  };

  const openEdit = (row: SubcategoryItem) => {
    setSelected(row);
    setForm({
      parent_id: row.parent_id ? String(row.parent_id) : "",
      name: row.name,
      description: row.description ?? "",
      status: row.status,
    });
    setFormError(null);
    setDialog("edit");
  };

  const closeDialog = () => {
    if (saving) return;
    setDialog(null);
    setSelected(null);
    setFormError(null);
  };

  const toPayload = () => ({
    parent_id: form.parent_id ? Number(form.parent_id) : null,
    name: form.name.trim(),
    description: form.description.trim() || null,
    status: form.status,
  });

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    if (!isModuleLive("subcategories")) return;
    setSaving(true);
    setFormError(null);
    try {
      if (dialog === "create") await createDressCategory(toPayload());
      else if (dialog === "edit" && selected) await updateDressCategory(selected.id, toPayload());
      closeDialog();
      setReloadKey((k) => k + 1);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isModuleLive("subcategories") || !selected) return;
    setSaving(true);
    setFormError(null);
    try {
      await deleteDressCategory(selected.id);
      closeDialog();
      setReloadKey((k) => k + 1);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setSaving(false);
    }
  };

  const columns = useMemo(
    () => [
      { key: "id", title: "#" },
      { key: "name", title: "الاسم" },
      { key: "category_name", title: "القسم الرئيسي" },
      { key: "description", title: "الوصف" },
      { key: "status", title: "الحالة" },
      { key: "actions", title: "إجراءات" },
    ],
    []
  );

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #0D9488, #2DD4BF)" }}
            >
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-black" style={{ color: "var(--color-text-primary)" }}>
                إدارة الأقسام الفرعية
              </CardTitle>
              <CardDescription>عرض وتعديل وإنشاء الأقسام الفرعية للمنتجات.</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" onClick={() => setFiltersOpen((v) => !v)}>
              <Filter className="h-4 w-4 ml-1.5" />
              الفلاتر
            </Button>
            <Button disabled={!isModuleLive("subcategories")} onClick={openCreate}>
              <Plus className="h-4 w-4 ml-1.5" />
              إنشاء قسم فرعي
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="بحث عن قسم فرعي..."
                className="pr-9"
              />
            </div>
          </div>

          <ListPageStandardFilters open={filtersOpen} />

          {error && (
            <div className="flex items-center justify-center py-6">
              <p className="text-destructive text-sm">
                حدث خطأ أثناء تحميل البيانات: {error}
              </p>
            </div>
          )}

          {!error && (
            <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    {columns.map((col) => (
                      <TableHead key={col.key} className="text-center font-bold text-xs">
                        {col.title}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableSkeletonRows rows={5} cols={columns.length} />
                  ) : rows.length > 0 ? (
                    rows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="text-center text-muted-foreground">{row.id}</TableCell>
                        <TableCell className="text-center font-medium">{row.name}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">{row.parent?.name ?? row.category_name ?? "—"}</Badge>
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">{row.description || "—"}</TableCell>
                        <TableCell className="text-center">
                          <StatusBadge status={row.status} />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 justify-center">
                            <Button variant="ghost" size="icon" title="تعديل" disabled={!isModuleLive("subcategories")} onClick={() => openEdit(row)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="icon" title="حذف" disabled={!isModuleLive("subcategories")} onClick={() => { setSelected(row); setFormError(null); setDialog("delete"); }}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="py-10 text-center text-muted-foreground">
                        لا توجد أقسام فرعية لعرضها.
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
            إجمالي الأقسام الفرعية: <span className="font-bold">{total}</span>
          </p>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronRight className="h-4 w-4" />
                السابق
              </Button>
              <span className="text-sm text-muted-foreground px-2">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                التالي
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>

      <Dialog open={dialog === "create" || dialog === "edit"} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle>{dialog === "edit" ? "تعديل القسم الفرعي" : "إنشاء قسم فرعي"}</DialogTitle>
              <DialogDescription>أدخل بيانات القسم الفرعي.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 py-2">
              <div className="space-y-2">
                <Label>القسم الرئيسي</Label>
                <Select value={form.parent_id} onValueChange={(v) => setForm((p) => ({ ...p, parent_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="اختر القسم" /></SelectTrigger>
                  <SelectContent>
                    {parents.map((p) => (<SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>الاسم</Label>
                <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label>الوصف</Label>
                <Input value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
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
            <DialogTitle>حذف القسم الفرعي</DialogTitle>
            <DialogDescription>هل أنت متأكد من حذف &quot;{selected?.name}&quot;؟</DialogDescription>
          </DialogHeader>
          {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
          <DialogFooter>
            <Button variant="outline" disabled={saving} onClick={closeDialog}>إلغاء</Button>
            <Button variant="destructive" disabled={saving} onClick={handleDelete}>{saving ? "جاري الحذف..." : "حذف"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
