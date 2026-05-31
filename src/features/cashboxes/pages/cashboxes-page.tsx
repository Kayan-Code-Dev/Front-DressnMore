import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { isModuleLive } from "@/config/feature-flags";
import type { BranchItem } from "@/features/branches/types/branches.types";
import { listBranches } from "@/features/branches/services/branches.api.service";
import { listBranchesMock } from "@/features/branches/services/branches.mock.service";
import type { CashboxFilterParams, CashboxItem, CashboxStats } from "@/features/cashboxes/types/cashboxes.types";
import { CashboxListFiltersBar } from "@/features/cashboxes/components/CashboxListFiltersBar";
import {
  createCashboxMock,
  deleteCashboxMock,
  getCashboxStatsMock,
  listCashboxesMock,
  updateCashboxMock,
} from "@/features/cashboxes/services/cashboxes.mock.service";
import {
  createCashbox,
  deleteCashbox,
  getCashboxDailySummary,
  listCashboxes,
  updateCashbox,
} from "@/features/cashboxes/services/cashboxes.api.service";
import { FinanceStatsCards } from "@/components/shared/FinanceStatsCards";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Wallet,
  Plus,
  Pencil,
  Trash2,
  Eye,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
import { formatNumber } from "@/shared/lib/format/numbers";

type CashboxForm = {
  name: string;
  branch_id: string;
  initial_balance: string;
  description: string;
  is_active: "true" | "false";
};

const defaultFilters: CashboxFilterParams = {};

const emptyForm = (): CashboxForm => ({
  name: "",
  branch_id: "",
  initial_balance: "0",
  description: "",
  is_active: "true",
});

function TableSkeletonRows({ rows = 6, cols = 8 }: { rows?: number; cols?: number }) {
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

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        active ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-red-500"}`} />
      {active ? "نشط" : "غير نشط"}
    </span>
  );
}

function formatChange(value: number) {
  const prefix = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${prefix}${formatNumber(Math.abs(value))}`;
}

export function CashboxesPage() {
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<CashboxFilterParams>(defaultFilters);
  const [perPage, setPerPage] = useState("6");
  const [rows, setRows] = useState<CashboxItem[]>([]);
  const [stats, setStats] = useState<CashboxStats | null>(null);
  const [branches, setBranches] = useState<BranchItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);
  const [dialog, setDialog] = useState<"create" | "edit" | "delete" | null>(null);
  const [selected, setSelected] = useState<CashboxItem | null>(null);
  const [form, setForm] = useState<CashboxForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const filterParams = useMemo(
    (): CashboxFilterParams => ({
      ...filters,
      search: search.trim() || undefined,
    }),
    [filters, search],
  );

  const branchName = useMemo(() => {
    const map = new Map(branches.map((b) => [b.id, b.name]));
    return (row: CashboxItem) => row.branch_name ?? (row.branch_id ? map.get(row.branch_id) ?? `#${row.branch_id}` : "—");
  }, [branches]);

  useEffect(() => {
    const loadBranches = isModuleLive("cashboxes")
      ? () => listBranches({ per_page: 100 }).then((r) => r.data)
      : () => listBranchesMock().then((r) => r.data);
    loadBranches().then(setBranches).catch(() => {});
  }, []);

  useEffect(() => {
    setStatsLoading(true);
    const loadStats = isModuleLive("cashboxes")
      ? async () => {
          const [summaryRes, listRes] = await Promise.all([
            getCashboxDailySummary({
              branch_id: filters.branch_id,
            }),
            listCashboxes({ ...filterParams, per_page: 100 }),
          ]);
          const summary = summaryRes.data;
          const items = listRes.data;
          const activeCount = items.filter((item) => item.is_active).length;
          return {
            total_balances: items.reduce((sum, item) => sum + item.current_balance, 0),
            total_revenues: summary?.total_in ?? 0,
            total_expenses: summary?.total_out ?? 0,
            active_count: activeCount,
            total_count: items.length,
          } satisfies CashboxStats;
        }
      : () => getCashboxStatsMock().then((r) => r.data);

    loadStats()
      .then(setStats)
      .finally(() => setStatsLoading(false));
  }, [filterParams, filters.branch_id, reloadKey]);

  const loadRows = useCallback(() => {
    setLoading(true);
    const params = { ...filterParams, page, per_page: Number(perPage) };
    const fetcher = isModuleLive("cashboxes") ? () => listCashboxes(params) : () => listCashboxesMock(params);

    fetcher()
      .then((response) => {
        setRows(response.data);
        const meta = response.meta as { last_page?: number; total?: number } | null | undefined;
        setTotalPages(meta?.last_page ?? 1);
        setTotal(meta?.total ?? response.data.length);
        setError(null);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "فشل تحميل الخزائن");
        setRows([]);
      })
      .finally(() => setLoading(false));
  }, [filterParams, page, perPage]);

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
    setSaving(true);
    setFormError(null);
    try {
      if (isModuleLive("cashboxes")) {
        if (dialog === "create") await createCashbox(toPayload());
        else if (dialog === "edit" && selected) await updateCashbox(selected.id, toPayload());
      } else {
        if (dialog === "create") await createCashboxMock(toPayload());
        else if (dialog === "edit" && selected) await updateCashboxMock(selected.id, toPayload());
      }
      closeDialog();
      setReloadKey((k) => k + 1);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "فشل حفظ الخزنة");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setSaving(true);
    setFormError(null);
    try {
      if (isModuleLive("cashboxes")) await deleteCashbox(selected.id);
      else await deleteCashboxMock(selected.id);
      closeDialog();
      setReloadKey((k) => k + 1);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "فشل حذف الخزنة");
    } finally {
      setSaving(false);
    }
  };

  const footerTotals = useMemo(
    () => ({
      balances: rows.reduce((sum, row) => sum + row.current_balance, 0),
      revenues: rows.reduce((sum, row) => sum + (row.total_in ?? 0), 0),
      expenses: rows.reduce((sum, row) => sum + (row.total_out ?? 0), 0),
      active: rows.filter((row) => row.is_active).length,
    }),
    [rows],
  );

  const statCards = stats
    ? [
        {
          label: "إجمالي الأرصدة",
          subLabel: "ج.م",
          value: stats.total_balances,
          icon: Wallet,
          gradient: "linear-gradient(135deg, #2563EB, #60A5FA)",
        },
        {
          label: "إجمالي الإيرادات",
          subLabel: "ج.م",
          value: stats.total_revenues,
          icon: ArrowDownLeft,
          gradient: "linear-gradient(135deg, #059669, #34D399)",
          valueColor: "#059669",
        },
        {
          label: "إجمالي المصروفات",
          subLabel: "ج.م",
          value: stats.total_expenses,
          icon: ArrowUpRight,
          gradient: "linear-gradient(135deg, #DC2626, #F87171)",
          valueColor: "#DC2626",
        },
        {
          label: "الخزائن النشطة",
          subLabel: "خزنة",
          value: `${stats.active_count} من ${stats.total_count}`,
          icon: CheckCircle2,
          gradient: "linear-gradient(135deg, #D97706, #FBBF24)",
          valueColor: "#D97706",
        },
      ]
    : [];

  const formFields = (
    <div className="grid gap-3 py-2">
      <div className="space-y-2">
        <Label>اسم الخزنة</Label>
        <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
      </div>
      <div className="space-y-2">
        <Label>الفرع</Label>
        <Select
          value={form.branch_id || "none"}
          onValueChange={(v) => setForm((p) => ({ ...p, branch_id: v === "none" ? "" : v }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر الفرع" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">—</SelectItem>
            {branches.map((b) => (
              <SelectItem key={b.id} value={String(b.id)}>
                {b.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>الرصيد الافتتاحي</Label>
        <Input
          type="number"
          step="0.01"
          value={form.initial_balance}
          onChange={(e) => setForm((p) => ({ ...p, initial_balance: e.target.value }))}
          dir="ltr"
        />
      </div>
      <div className="space-y-2">
        <Label>الوصف</Label>
        <Input value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
      </div>
      <div className="space-y-2">
        <Label>الحالة</Label>
        <Select
          value={form.is_active}
          onValueChange={(v) => setForm((p) => ({ ...p, is_active: v as "true" | "false" }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">نشط</SelectItem>
            <SelectItem value="false">غير نشط</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
    </div>
  );

  return (
    <div className="w-full max-w-full space-y-5 overflow-x-hidden" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #2563EB, #60A5FA)" }}
          >
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black">الخزائن</h1>
            <p className="text-sm text-muted-foreground">إدارة خزائن الفروع وأرصدتها</p>
          </div>
        </div>
        <Button onClick={openCreate} className="shrink-0">
          <Plus className="h-4 w-4 ml-1.5" />
          إضافة خزنة
        </Button>
      </div>

      <FinanceStatsCards stats={statCards} loading={statsLoading} />

      <CashboxListFiltersBar
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        branchId={filters.branch_id ? String(filters.branch_id) : ""}
        onBranchChange={(v) => {
          setFilters((p) => ({ ...p, branch_id: v ? Number(v) : undefined }));
          setPage(1);
        }}
        status={filters.status ?? ""}
        onStatusChange={(v) => {
          setFilters((p) => ({ ...p, status: v || undefined }));
          setPage(1);
        }}
        perPage={perPage}
        onPerPageChange={(v) => {
          setPerPage(v);
          setPage(1);
        }}
        branches={branches}
      />

      <Card className="border shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {error && (
            <div className="flex items-center justify-center py-6">
              <p className="text-destructive text-sm">حدث خطأ أثناء تحميل البيانات: {error}</p>
            </div>
          )}
          {!error && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#1a3a6d] hover:bg-[#1a3a6d]">
                    <TableHead className="text-center font-bold text-xs text-white">الاسم</TableHead>
                    <TableHead className="text-center font-bold text-xs text-white">الفرع</TableHead>
                    <TableHead className="text-center font-bold text-xs text-white">الرصيد الافتتاحي</TableHead>
                    <TableHead className="text-center font-bold text-xs text-white">الرصيد الحالي</TableHead>
                    <TableHead className="text-center font-bold text-xs text-white">الإيرادات</TableHead>
                    <TableHead className="text-center font-bold text-xs text-white">المصروفات</TableHead>
                    <TableHead className="text-center font-bold text-xs text-white">الحالة</TableHead>
                    <TableHead className="text-center font-bold text-xs text-white">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableSkeletonRows rows={Number(perPage)} cols={8} />
                  ) : rows.length > 0 ? (
                    rows.map((row) => {
                      const change = row.balance_change ?? row.current_balance - row.initial_balance;
                      return (
                        <TableRow key={row.id} className="even:bg-muted/20">
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2 min-w-0">
                              <span className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                <Wallet className="h-4 w-4" />
                              </span>
                              <div className="min-w-0 text-right">
                                <p className="font-bold text-sm truncate">{row.name}</p>
                                {row.manager_name ? (
                                  <p className="text-xs text-muted-foreground truncate">{row.manager_name}</p>
                                ) : null}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                              <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                              {branchName(row)}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">{formatNumber(row.initial_balance)} ج.م</TableCell>
                          <TableCell className="text-center">
                            <p className="font-semibold">{formatNumber(row.current_balance)} ج.م</p>
                            <p
                              className={`text-[11px] font-medium ${
                                change >= 0 ? "text-emerald-600" : "text-red-500"
                              }`}
                            >
                              {formatChange(change)}
                            </p>
                          </TableCell>
                          <TableCell className="text-center font-semibold text-emerald-600">
                            {formatNumber(row.total_in ?? 0)} ج.م
                          </TableCell>
                          <TableCell className="text-center font-semibold text-red-500">
                            {formatNumber(row.total_out ?? 0)} ج.م
                          </TableCell>
                          <TableCell className="text-center">
                            <StatusBadge active={row.is_active} />
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-blue-50" asChild>
                                <Link to={`/cashboxes/${row.id}`}>
                                  <Eye className="h-3.5 w-3.5 text-blue-600" />
                                </Link>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full bg-amber-50"
                                onClick={() => openEdit(row)}
                              >
                                <Pencil className="h-3.5 w-3.5 text-amber-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full bg-red-50"
                                onClick={() => openDelete(row)}
                              >
                                <Trash2 className="h-3.5 w-3.5 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                        لا توجد خزائن لعرضها.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t py-4">
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span>
              نشط: <strong className="text-foreground">{footerTotals.active}</strong>
            </span>
            <span>
              إجمالي الأرصدة: <strong className="text-foreground">{formatNumber(footerTotals.balances)} ج.م</strong>
            </span>
            <span>
              الإيرادات: <strong className="text-emerald-600">{formatNumber(footerTotals.revenues)} ج.م</strong>
            </span>
            <span>
              المصروفات: <strong className="text-red-500">{formatNumber(footerTotals.expenses)} ج.م</strong>
            </span>
          </div>
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
          <p className="text-xs text-muted-foreground sm:mr-auto">
            يعرض {rows.length} من {total} خزنة
          </p>
        </CardFooter>
      </Card>

      <Dialog open={dialog === "create" || dialog === "edit"} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle>{dialog === "edit" ? "تعديل الخزنة" : "إضافة خزنة جديدة"}</DialogTitle>
              <DialogDescription>
                {dialog === "edit" ? `تعديل: ${selected?.name ?? ""}` : "أدخل بيانات الخزنة الجديدة."}
              </DialogDescription>
            </DialogHeader>
            {formFields}
            <DialogFooter>
              <Button type="button" variant="outline" disabled={saving} onClick={closeDialog}>
                إلغاء
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "جاري الحفظ..." : "حفظ"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={dialog === "delete"} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>حذف الخزنة</DialogTitle>
            <DialogDescription>هل أنت متأكد من حذف الخزنة &quot;{selected?.name}&quot;؟</DialogDescription>
          </DialogHeader>
          {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
          <DialogFooter>
            <Button variant="outline" disabled={saving} onClick={closeDialog}>
              إلغاء
            </Button>
            <Button variant="destructive" disabled={saving} onClick={handleDelete}>
              {saving ? "جاري الحذف..." : "حذف"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
