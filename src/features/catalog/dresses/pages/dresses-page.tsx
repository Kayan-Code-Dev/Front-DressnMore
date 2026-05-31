import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { ListPageStandardFilters } from "@/components/shared/ListPageStandardFilters";
import { isModuleLive } from "@/config/feature-flags";
import type { DressItem, DressStatus } from "@/features/catalog/dresses/types/dresses.types";
import { dressDisplayName } from "@/features/catalog/dresses/lib/dress-display";
import { listDressesMock } from "@/features/catalog/dresses/services/dresses.mock.service";
import {
  createDress,
  deleteDress,
  listDresses,
  updateDress,
} from "@/features/catalog/dresses/services/dresses.api.service";
import { listDressCategories } from "@/features/catalog/categories/services/categories.api.service";
import type { CategoryItem } from "@/features/catalog/categories/types/categories.types";
import { formatInteger, toWesternDigits } from "@/shared/lib/format/numbers";
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
import { Textarea } from "@/components/ui/textarea";
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
  dress_category_id: string;
  dress_subcategory_id: string;
  description: string;
  status: DressStatus;
};

const emptyForm = (): DressForm => ({
  code: "",
  dress_category_id: "",
  dress_subcategory_id: "",
  description: "",
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
  const [subcategoryOptions, setSubcategoryOptions] = useState<CategoryItem[]>([]);

  useEffect(() => {
    if (!isModuleLive("dresses")) return;
    listDressCategories({ only_parents: true, per_page: 100 })
      .then((res) => setCategoryOptions(res.data))
      .catch(() => setCategoryOptions([]));
  }, []);

  useEffect(() => {
    if (!form.dress_category_id) {
      setSubcategoryOptions([]);
      return;
    }

    listDressCategories({
      only_children: true,
      parent_id: Number(form.dress_category_id),
      per_page: 100,
    })
      .then((res) => setSubcategoryOptions(res.data))
      .catch(() => setSubcategoryOptions([]));
  }, [form.dress_category_id]);

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
      dress_category_id: row.dress_category_id != null ? String(row.dress_category_id) : "",
      dress_subcategory_id: row.dress_subcategory_id != null ? String(row.dress_subcategory_id) : "",
      description: row.description ?? "",
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
    code: toWesternDigits(form.code.trim()),
    dress_category_id: Number(form.dress_category_id),
    dress_subcategory_id: Number(form.dress_subcategory_id),
    description: form.description.trim() || null,
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

  const previewName = useMemo(() => {
    const category = categoryOptions.find((c) => String(c.id) === form.dress_category_id);
    const subcategory = subcategoryOptions.find((c) => String(c.id) === form.dress_subcategory_id);
    return dressDisplayName({
      code: toWesternDigits(form.code.trim()),
      category: category ? { id: category.id, name: category.name } : null,
      subcategory: subcategory ? { id: subcategory.id, name: subcategory.name } : null,
    });
  }, [form, categoryOptions, subcategoryOptions]);

  const columns = useMemo(
    () => [
      { key: "id", title: "#" },
      { key: "display_name", title: "المنتج" },
      { key: "category", title: "القسم" },
      { key: "subcategory", title: "القسم الفرعي" },
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
          className="font-mono"
          dir="ltr"
          required
        />
      </div>
      <div className="space-y-2">
        <Label>القسم</Label>
        <Select
          value={form.dress_category_id || "__none__"}
          onValueChange={(v) =>
            setForm((p) => ({
              ...p,
              dress_category_id: v === "__none__" ? "" : v,
              dress_subcategory_id: "",
            }))
          }
        >
          <SelectTrigger><SelectValue placeholder="اختر القسم" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">— اختر القسم —</SelectItem>
            {categoryOptions.map((cat) => (
              <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>القسم الفرعي</Label>
        <Select
          value={form.dress_subcategory_id || "__none__"}
          onValueChange={(v) =>
            setForm((p) => ({ ...p, dress_subcategory_id: v === "__none__" ? "" : v }))
          }
          disabled={!form.dress_category_id}
        >
          <SelectTrigger><SelectValue placeholder="اختر القسم الفرعي" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">— اختر القسم الفرعي —</SelectItem>
            {subcategoryOptions.map((sub) => (
              <SelectItem key={sub.id} value={String(sub.id)}>{sub.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>الوصف (اختياري)</Label>
        <Textarea
          value={form.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          rows={2}
        />
      </div>
      <div className="space-y-2">
        <Label>الحالة</Label>
        <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v as DressStatus }))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {DRESS_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>{statusMap[s]?.label ?? s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {previewName ? (
        <p className="text-sm text-muted-foreground">
          اسم العرض: <span className="font-mono font-medium text-foreground" dir="ltr">{previewName}</span>
        </p>
      ) : null}
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
              <CardTitle className="text-lg font-black" style={{ color: "var(--color-text-primary)" }}>إدارة المنتجات</CardTitle>
              <CardDescription>الكود + القسم + القسم الفرعي — الاسم يُولَّد تلقائياً.</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" onClick={() => setFiltersOpen((v) => !v)}><Filter className="h-4 w-4 ml-1.5" />الفلاتر</Button>
            <Button disabled={!isModuleLive("dresses")} onClick={openCreate}>
              <Plus className="h-4 w-4 ml-1.5" />
              إضافة منتج
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="بحث عن منتج..." className="pr-9" />
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
                        <TableCell className="text-center text-muted-foreground">{formatInteger(row.id)}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="font-mono" dir="ltr">{dressDisplayName(row)}</Badge>
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">{row.category?.name ?? "—"}</TableCell>
                        <TableCell className="text-center text-muted-foreground">{row.subcategory?.name ?? "—"}</TableCell>
                        <TableCell className="text-center"><StatusBadge status={row.status} /></TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" disabled={!isModuleLive("dresses")} onClick={() => openEdit(row)}>
                              <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" disabled={!isModuleLive("dresses")} onClick={() => openDelete(row)}>
                              <Trash2 className="h-3.5 w-3.5 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={columns.length} className="py-10 text-center text-muted-foreground">لا توجد منتجات لعرضها.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm text-muted-foreground">إجمالي المنتجات: <span className="font-bold">{formatInteger(total)}</span></p>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}><ChevronRight className="h-4 w-4" />السابق</Button>
              <span className="text-sm text-muted-foreground px-2">{formatInteger(page)} / {formatInteger(totalPages)}</span>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>التالي<ChevronLeft className="h-4 w-4" /></Button>
            </div>
          )}
        </CardFooter>
      </Card>

      <Dialog open={dialog === "create" || dialog === "edit"} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle>{dialog === "edit" ? "تعديل المنتج" : "إضافة منتج جديد"}</DialogTitle>
              <DialogDescription>
                {dialog === "edit" ? `تعديل: ${selected ? dressDisplayName(selected) : ""}` : "أدخل بيانات المنتج."}
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
            <DialogTitle>حذف المنتج</DialogTitle>
            <DialogDescription>هل أنت متأكد من حذف &quot;{selected ? dressDisplayName(selected) : ""}&quot;؟</DialogDescription>
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
