import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { ListPageStandardFilters } from "@/components/shared/ListPageStandardFilters";
import { isModuleLive } from "@/config/feature-flags";
import type { CashboxItem } from "@/features/cashboxes/types/cashboxes.types";
import { listCashboxes } from "@/features/cashboxes/services/cashboxes.api.service";
import type { CashMovementItem } from "@/features/cash-movements/types/cash-movements.types";
import { listCashMovementsMock } from "@/features/cash-movements/services/cash-movements.mock.service";
import {
  createCashMovement,
  listCashMovements,
} from "@/features/cash-movements/services/cash-movements.api.service";
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
import { ArrowLeftRight, Search, Plus, Filter, ChevronLeft, ChevronRight } from "lucide-react";

function fetchCashMovementData(searchTerm: string, currentPage: number) {
  if (isModuleLive("cashMovements")) {
    return listCashMovements({ search: searchTerm, page: currentPage, per_page: 15 });
  }
  return listCashMovementsMock(searchTerm);
}

const typeMap: Record<string, { label: string; variant: "success" | "destructive" | "secondary" }> = {
  income: { label: "إيراد", variant: "success" },
  expense: { label: "مصروف", variant: "destructive" },
  manual_adjustment: { label: "تسوية يدوية", variant: "secondary" },
  invoice_payment: { label: "دفعة فاتورة", variant: "success" },
  supplier_payment: { label: "دفعة مورد", variant: "destructive" },
};

const directionMap: Record<string, string> = {
  in: "وارد",
  out: "صادر",
};

type MovementForm = {
  type: "income" | "expense" | "manual_adjustment";
  direction: "in" | "out";
  amount: string;
  cashbox_id: string;
  description: string;
  reference: string;
};

const emptyForm = (): MovementForm => ({
  type: "income",
  direction: "in",
  amount: "",
  cashbox_id: "",
  description: "",
  reference: "",
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

function formatDate(value: string | null) {
  if (!value) return "—";
  return value.slice(0, 10);
}

export function CashMovementsPage() {
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<CashMovementItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<MovementForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [cashboxes, setCashboxes] = useState<CashboxItem[]>([]);

  const cashboxName = useMemo(() => {
    const map = new Map(cashboxes.map((c) => [c.id, c.name]));
    return (id: number | null) => (id ? map.get(id) ?? `#${id}` : "—");
  }, [cashboxes]);

  useEffect(() => {
    if (!isModuleLive("cashMovements")) return;
    listCashboxes({ per_page: 100 })
      .then((res) => setCashboxes(res.data))
      .catch(() => {});
  }, []);

  const loadRows = useCallback(() => {
    setLoading(true);
    fetchCashMovementData(search, page)
      .then((response) => {
        setRows(response.data);
        const meta = response.meta as { last_page?: number; total?: number } | null | undefined;
        setTotalPages(meta?.last_page ?? 1);
        setTotal(meta?.total ?? response.data.length);
        setError(null);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load cash movements");
        setRows([]);
      })
      .finally(() => setLoading(false));
  }, [search, page]);

  useEffect(() => {
    loadRows();
  }, [loadRows, reloadKey]);

  const openCreate = () => {
    setForm(emptyForm());
    setFormError(null);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    if (saving) return;
    setDialogOpen(false);
    setFormError(null);
  };

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    if (!isModuleLive("cashMovements")) return;

    setSaving(true);
    setFormError(null);
    try {
      await createCashMovement({
        type: form.type,
        direction: form.direction,
        amount: Number(form.amount),
        cashbox_id: form.cashbox_id ? Number(form.cashbox_id) : null,
        description: form.description.trim() || null,
        reference: form.reference.trim() || null,
      });
      closeDialog();
      setReloadKey((k) => k + 1);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Failed to create movement");
    } finally {
      setSaving(false);
    }
  };

  const columns = useMemo(
    () => [
      { key: "id", title: "#" },
      { key: "cashbox", title: "الصندوق" },
      { key: "type", title: "النوع" },
      { key: "direction", title: "الاتجاه" },
      { key: "amount", title: "المبلغ" },
      { key: "balance_after", title: "الرصيد بعد" },
      { key: "reference", title: "المرجع" },
      { key: "created_at", title: "التاريخ" },
    ],
    [],
  );

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #2563EB, #60A5FA)" }}>
              <ArrowLeftRight className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-black" style={{ color: "var(--color-text-primary)" }}>حركات الصندوق</CardTitle>
              <CardDescription>عرض وتتبع حركات النقد في الصناديق.</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" onClick={() => setFiltersOpen((v) => !v)}><Filter className="h-4 w-4 ml-1.5" />الفلاتر</Button>
            <Button disabled={!isModuleLive("cashMovements")} onClick={openCreate}><Plus className="h-4 w-4 ml-1.5" />حركة جديدة</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="بحث في الحركات..." className="pr-9" />
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
                        <TableCell className="text-center text-muted-foreground">{cashboxName(row.cashbox_id)}</TableCell>
                        <TableCell className="text-center"><Badge variant={typeMap[row.type]?.variant ?? "secondary"}>{typeMap[row.type]?.label ?? row.type}</Badge></TableCell>
                        <TableCell className="text-center">{directionMap[row.direction] ?? row.direction}</TableCell>
                        <TableCell className="text-center font-medium">{row.amount.toLocaleString()}</TableCell>
                        <TableCell className="text-center font-medium">{row.balance_after.toLocaleString()}</TableCell>
                        <TableCell className="text-center text-muted-foreground text-xs">{row.reference || "—"}</TableCell>
                        <TableCell className="text-center text-muted-foreground">{formatDate(row.created_at)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={columns.length} className="py-10 text-center text-muted-foreground">لا توجد حركات لعرضها.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm text-muted-foreground">إجمالي الحركات: <span className="font-bold">{total}</span></p>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}><ChevronRight className="h-4 w-4" />السابق</Button>
              <span className="text-sm text-muted-foreground px-2">{page} / {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>التالي<ChevronLeft className="h-4 w-4" /></Button>
            </div>
          )}
        </CardFooter>
      </Card>

      <ShadDialog open={dialogOpen} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle>حركة صندوق جديدة</DialogTitle>
              <DialogDescription>تسجيل حركة نقدية يدوية.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 py-2">
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
                <Label>النوع</Label>
                <Select value={form.type} onValueChange={(v) => setForm((p) => ({ ...p, type: v as MovementForm["type"] }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">إيراد</SelectItem>
                    <SelectItem value="expense">مصروف</SelectItem>
                    <SelectItem value="manual_adjustment">تسوية يدوية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>الاتجاه</Label>
                <Select value={form.direction} onValueChange={(v) => setForm((p) => ({ ...p, direction: v as "in" | "out" }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in">وارد</SelectItem>
                    <SelectItem value="out">صادر</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>المبلغ</Label>
                <Input type="number" min="0" step="0.01" value={form.amount} onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))} required dir="ltr" />
              </div>
              <div className="space-y-2">
                <Label>المرجع</Label>
                <Input value={form.reference} onChange={(e) => setForm((p) => ({ ...p, reference: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>الوصف</Label>
                <Input value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
              </div>
              {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" disabled={saving} onClick={closeDialog}>إلغاء</Button>
              <Button type="submit" disabled={saving}>{saving ? "جاري الحفظ..." : "حفظ"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </ShadDialog>
    </div>
  );
}
