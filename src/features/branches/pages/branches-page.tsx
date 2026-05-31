import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { ListPageStandardFilters } from "@/components/shared/ListPageStandardFilters";
import { isModuleLive } from "@/config/feature-flags";
import type { BranchItem } from "@/features/branches/types/branches.types";
import { listBranchesMock } from "@/features/branches/services/branches.mock.service";
import {
  createBranch,
  deleteBranch,
  listBranches,
  updateBranch,
} from "@/features/branches/services/branches.api.service";
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
  Building2,
  Search,
  Plus,
  Filter,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function fetchBranchData(searchTerm: string, currentPage: number) {
  if (isModuleLive("branches")) {
    return listBranches({ search: searchTerm, page: currentPage, per_page: 15 });
  }
  return listBranchesMock(searchTerm);
}

type BranchForm = {
  branch_code: string;
  name: string;
  phone: string;
  address: string;
  inventory_name: string;
  currency: string;
  status: "active" | "inactive";
};

const emptyForm = (): BranchForm => ({
  branch_code: "",
  name: "",
  phone: "",
  address: "",
  inventory_name: "",
  currency: "",
  status: "active",
});

function formatVat(row: BranchItem): string {
  return row.vat_enabled && row.vat_value ? `${row.vat_value}%` : "—";
}

const statusMap: Record<string, { label: string; variant: "success" | "destructive" }> = {
  active: { label: "نشط", variant: "success" },
  inactive: { label: "غير نشط", variant: "destructive" },
};

function StatusBadge({ status }: { status: string }) {
  const config = statusMap[status] ?? { label: status, variant: "destructive" };
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

export function BranchesPage() {
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<BranchItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);
  const [dialog, setDialog] = useState<"create" | "edit" | "delete" | null>(null);
  const [selected, setSelected] = useState<BranchItem | null>(null);
  const [form, setForm] = useState<BranchForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadRows = useCallback(() => {
    setLoading(true);
    fetchBranchData(search, page)
      .then((response) => {
        setRows(response.data);
        const meta = response.meta as { last_page?: number; total?: number } | null | undefined;
        setTotalPages(meta?.last_page ?? 1);
        setTotal(meta?.total ?? response.data.length);
        setError(null);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load branches");
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

  const openEdit = (row: BranchItem) => {
    setSelected(row);
    setForm({
      branch_code: row.branch_code ?? "",
      name: row.name,
      phone: row.phone ?? "",
      address: row.address ?? "",
      inventory_name: row.inventory_name ?? "",
      currency: row.currency ?? "",
      status: row.status,
    });
    setFormError(null);
    setDialog("edit");
  };

  const openDelete = (row: BranchItem) => {
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
    branch_code: form.branch_code.trim() || null,
    name: form.name.trim(),
    phone: form.phone.trim() || null,
    address: form.address.trim() || null,
    inventory_name: form.inventory_name.trim() || null,
    currency: form.currency.trim() || null,
    status: form.status,
  });

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    if (!isModuleLive("branches")) return;

    setSaving(true);
    setFormError(null);
    try {
      if (dialog === "create") {
        await createBranch(toPayload());
      } else if (dialog === "edit" && selected) {
        await updateBranch(selected.id, toPayload());
      }
      closeDialog();
      setReloadKey((k) => k + 1);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Failed to save branch");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isModuleLive("branches") || !selected) return;

    setSaving(true);
    setFormError(null);
    try {
      await deleteBranch(selected.id);
      closeDialog();
      setReloadKey((k) => k + 1);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Failed to delete branch");
    } finally {
      setSaving(false);
    }
  };

  const columns = useMemo(
    () => [
      { key: "id", title: "#" },
      { key: "branch_code", title: "كود الفرع" },
      { key: "name", title: "الاسم" },
      { key: "phone", title: "الهاتف" },
      { key: "address", title: "العنوان" },
      { key: "inventory_name", title: "المخزن" },
      { key: "currency", title: "العملة" },
      { key: "vat", title: "الضريبة" },
      { key: "status", title: "الحالة" },
      { key: "actions", title: "إجراءات" },
    ],
    [],
  );

  const formFields = (
    <div className="grid gap-3 py-2">
      <div className="space-y-2">
        <Label>كود الفرع</Label>
        <Input
          value={form.branch_code}
          onChange={(e) => setForm((p) => ({ ...p, branch_code: e.target.value }))}
          placeholder="BR-001"
        />
      </div>
      <div className="space-y-2">
        <Label>الاسم</Label>
        <Input
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          required
        />
      </div>
      <div className="space-y-2">
        <Label>الهاتف</Label>
        <Input
          value={form.phone}
          onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
          dir="ltr"
        />
      </div>
      <div className="space-y-2">
        <Label>العنوان</Label>
        <Input
          value={form.address}
          onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label>المخزن</Label>
        <Input
          value={form.inventory_name}
          onChange={(e) => setForm((p) => ({ ...p, inventory_name: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label>العملة</Label>
        <Input
          value={form.currency}
          onChange={(e) => setForm((p) => ({ ...p, currency: e.target.value }))}
          placeholder="SAR"
        />
      </div>
      <div className="space-y-2">
        <Label>الحالة</Label>
        <Select
          value={form.status}
          onValueChange={(v) => setForm((p) => ({ ...p, status: v as "active" | "inactive" }))}
        >
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
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #7C3AED, #A78BFA)" }}
            >
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-black" style={{ color: "var(--color-text-primary)" }}>
                إدارة الفروع
              </CardTitle>
              <CardDescription>عرض وتعديل وإنشاء الفروع في النظام.</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" onClick={() => setFiltersOpen((v) => !v)}>
              <Filter className="h-4 w-4 ml-1.5" />
              الفلاتر
            </Button>
            <Button disabled={!isModuleLive("branches")} onClick={openCreate}>
              <Plus className="h-4 w-4 ml-1.5" />
              إنشاء فرع جديد
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
                placeholder="بحث عن فرع..."
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
                        <TableCell className="text-center">
                          <Badge variant="outline" className="font-mono">{row.branch_code || "—"}</Badge>
                        </TableCell>
                        <TableCell className="text-center font-medium">{row.name}</TableCell>
                        <TableCell className="text-center text-muted-foreground" dir="ltr">{row.phone || "—"}</TableCell>
                        <TableCell className="text-center text-muted-foreground text-xs max-w-[180px] truncate">
                          {row.address || "—"}
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">{row.inventory_name || "—"}</TableCell>
                        <TableCell className="text-center">{row.currency || "—"}</TableCell>
                        <TableCell className="text-center">{formatVat(row)}</TableCell>
                        <TableCell className="text-center">
                          <StatusBadge status={row.status} />
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              disabled={!isModuleLive("branches")}
                              onClick={() => openEdit(row)}
                            >
                              <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              disabled={!isModuleLive("branches")}
                              onClick={() => openDelete(row)}
                            >
                              <Trash2 className="h-3.5 w-3.5 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="py-10 text-center text-muted-foreground">
                        لا توجد فروع لعرضها.
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
            إجمالي الفروع: <span className="font-bold">{total}</span>
          </p>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                <ChevronRight className="h-4 w-4" />
                السابق
              </Button>
              <span className="text-sm text-muted-foreground px-2">
                {page} / {totalPages}
              </span>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                التالي
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>

      <ShadDialog open={dialog === "create" || dialog === "edit"} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle>{dialog === "edit" ? "تعديل الفرع" : "إنشاء فرع جديد"}</DialogTitle>
              <DialogDescription>
                {dialog === "edit" ? `تعديل: ${selected?.name ?? ""}` : "أدخل بيانات الفرع الجديد."}
              </DialogDescription>
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
            <DialogTitle>حذف الفرع</DialogTitle>
            <DialogDescription>هل أنت متأكد من حذف الفرع &quot;{selected?.name}&quot;؟</DialogDescription>
          </DialogHeader>
          {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
          <DialogFooter>
            <Button variant="outline" disabled={saving} onClick={closeDialog}>إلغاء</Button>
            <Button variant="destructive" disabled={saving} onClick={handleDelete}>
              {saving ? "جاري الحذف..." : "حذف"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </ShadDialog>
    </div>
  );
}
