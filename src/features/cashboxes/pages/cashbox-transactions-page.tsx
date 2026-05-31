import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { isModuleLive } from "@/config/feature-flags";
import type { BranchItem } from "@/features/branches/types/branches.types";
import { listBranches } from "@/features/branches/services/branches.api.service";
import { listBranchesMock } from "@/features/branches/services/branches.mock.service";
import type { CashboxItem } from "@/features/cashboxes/types/cashboxes.types";
import type {
  BranchSummary,
  LedgerEntry,
  StatementFilterParams,
  StatementSummary,
} from "@/features/cashboxes/types/statement.types";
import { OPENING_BALANCE, computeStatementSummary } from "@/features/cashboxes/mocks/statement.mock";
import { BranchSummaryCards } from "@/features/cashboxes/components/statement/BranchSummaryCards";
import { StatementStatsCards } from "@/features/cashboxes/components/statement/StatementStatsCards";
import { StatementFiltersBar } from "@/features/cashboxes/components/statement/StatementFiltersBar";
import { LedgerTable } from "@/features/cashboxes/components/statement/LedgerTable";
import {
  getBranchSummariesMock,
  getStatementSummaryMock,
  listLedgerEntriesMock,
} from "@/features/cashboxes/services/statement.mock.service";
import { listCashboxes } from "@/features/cashboxes/services/cashboxes.api.service";
import { listCashboxesMock } from "@/features/cashboxes/services/cashboxes.mock.service";
import type { CashMovementItem } from "@/features/cash-movements/types/cash-movements.types";
import { createCashMovement, listCashMovements } from "@/features/cash-movements/services/cash-movements.api.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { formatNumber } from "@/shared/lib/format/numbers";
import {
  Wallet,
  Plus,
  Lock,
  Printer,
  FileText,
  FileSpreadsheet,
  RefreshCw,
  BookOpen,
  Moon,
} from "lucide-react";

type TabKey = "ledger" | "closing";

type ManualForm = {
  type: "income" | "expense";
  direction: "in" | "out";
  amount: string;
  cashbox_id: string;
  description: string;
  reference: string;
  movement_date: string;
};

const defaultFilters: StatementFilterParams = {};

const emptyManualForm = (): ManualForm => ({
  type: "income",
  direction: "in",
  amount: "",
  cashbox_id: "",
  description: "",
  reference: "",
  movement_date: new Date().toISOString().slice(0, 10),
});

function mapMovementToLedger(
  items: CashMovementItem[],
  openingBalance: number,
): LedgerEntry[] {
  let balance = openingBalance;
  return items
    .slice()
    .sort((a, b) => (a.movement_date ?? "").localeCompare(b.movement_date ?? ""))
    .map((item) => {
      const credit = item.direction === "in" ? item.amount : null;
      const debit = item.direction === "out" ? item.amount : null;
      balance += (credit ?? 0) - (debit ?? 0);
      return {
        id: item.id,
        date: (item.movement_date ?? item.created_at ?? "").slice(0, 10),
        reference: item.reference ?? `MOV-${item.id}`,
        description: item.description ?? "—",
        category: item.category ?? item.type,
        branch_id: item.branch_id ?? null,
        branch_name: item.branch_name ?? "—",
        party: item.party ?? "—",
        credit,
        debit,
        running_balance: item.balance_after ?? balance,
        status: (item.status === "partial" ? "partial" : item.direction === "out" ? "paid" : "completed") as LedgerEntry["status"],
        direction: item.direction,
      };
    });
}

export function CashboxTransactionsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("ledger");
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<StatementFilterParams>(defaultFilters);
  const [selectedBranch, setSelectedBranch] = useState<number | "all">("all");
  const [rows, setRows] = useState<LedgerEntry[]>([]);
  const [summary, setSummary] = useState<StatementSummary | null>(null);
  const [branchSummaries, setBranchSummaries] = useState<BranchSummary[]>([]);
  const [branches, setBranches] = useState<BranchItem[]>([]);
  const [cashboxes, setCashboxes] = useState<CashboxItem[]>([]);
  const [reloadKey, setReloadKey] = useState(0);
  const [manualOpen, setManualOpen] = useState(false);
  const [manualForm, setManualForm] = useState<ManualForm>(emptyManualForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const filterParams = useMemo(
    (): StatementFilterParams => ({
      ...filters,
      search: search.trim() || undefined,
      branch_id: selectedBranch === "all" ? filters.branch_id : Number(selectedBranch),
    }),
    [filters, search, selectedBranch],
  );

  const categories = useMemo(
    () => [...new Set(rows.map((r) => r.category))].filter(Boolean).sort(),
    [rows],
  );

  useEffect(() => {
    const loadBranches = isModuleLive("cashboxes")
      ? () => listBranches({ per_page: 100 }).then((r) => r.data)
      : () => listBranchesMock().then((r) => r.data);
    const loadCashboxes = isModuleLive("cashboxes")
      ? () => listCashboxes({ per_page: 100 }).then((r) => r.data)
      : () => listCashboxesMock({ per_page: 100 }).then((r) => r.data);

    Promise.all([loadBranches(), loadCashboxes()])
      .then(([b, c]) => {
        setBranches(b);
        setCashboxes(c);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    getBranchSummariesMock().then((r) => setBranchSummaries(r.data)).catch(() => {});
  }, [reloadKey]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setStatsLoading(true);
    try {
      if (isModuleLive("cashMovements")) {
        const response = await listCashMovements({ ...filterParams, per_page: 100 });
        const opening = cashboxes.reduce((s, c) => s + c.initial_balance, 0) || OPENING_BALANCE;
        const mapped = mapMovementToLedger(response.data, opening);
        setRows(mapped);
        setSummary(computeStatementSummary(mapped));
      } else {
        const [entriesRes, summaryRes] = await Promise.all([
          listLedgerEntriesMock(filterParams),
          getStatementSummaryMock(filterParams),
        ]);
        setRows(entriesRes.data);
        setSummary(summaryRes.data);
      }
    } catch {
      setRows([]);
      setSummary(null);
    } finally {
      setLoading(false);
      setStatsLoading(false);
    }
  }, [filterParams, cashboxes]);

  useEffect(() => {
    loadData();
  }, [loadData, reloadKey]);

  const footerNet = useMemo(() => {
    const credit = rows.reduce((s, r) => s + (r.credit ?? 0), 0);
    const debit = rows.reduce((s, r) => s + (r.debit ?? 0), 0);
    return { credit, debit, net: credit - debit };
  }, [rows]);

  const handleManualSave = async (event: FormEvent) => {
    event.preventDefault();
    if (!isModuleLive("cashMovements")) {
      setManualOpen(false);
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      await createCashMovement({
        type: manualForm.type,
        direction: manualForm.direction,
        amount: Number(manualForm.amount),
        cashbox_id: manualForm.cashbox_id ? Number(manualForm.cashbox_id) : null,
        description: manualForm.description.trim() || null,
        reference: manualForm.reference.trim() || null,
        movement_date: manualForm.movement_date || null,
      });
      setManualOpen(false);
      setManualForm(emptyManualForm());
      setReloadKey((k) => k + 1);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "فشل إنشاء القيد");
    } finally {
      setSaving(false);
    }
  };

  const branchFilterOptions = useMemo(() => {
    if (branchSummaries.length > 1) {
      return branchSummaries
        .filter((b) => b.id !== "all")
        .map((b) => ({ id: Number(b.id), name: b.name }));
    }
    return branches.map((b) => ({ id: b.id, name: b.name }));
  }, [branchSummaries, branches]);

  return (
    <div className="w-full max-w-full space-y-5 overflow-x-hidden" dir="rtl">
      <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #2563EB, #60A5FA)" }}
          >
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black">كشف المعاملات</h1>
            <p className="text-sm text-muted-foreground">
              عرض محاسبي شامل — حسب الفرع مع أرصدة وإقفال
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" className="bg-[#1a3a6d] hover:bg-[#152f57]" onClick={() => setManualOpen(true)}>
            <Plus className="h-4 w-4 ml-1" />
            قيد يدوي
          </Button>
          <Button size="sm" variant="outline" className="text-amber-700 border-amber-200 bg-amber-50/50">
            <Lock className="h-4 w-4 ml-1" />
            إقفال الفترة
          </Button>
          <Button size="sm" variant="outline">
            <Printer className="h-4 w-4 ml-1" />
            طباعة التقرير
          </Button>
          <Button size="sm" variant="outline" className="text-red-600 border-red-200 bg-red-50/50">
            <FileText className="h-4 w-4 ml-1" />
            PDF
          </Button>
          <Button size="sm" variant="outline" className="text-green-700 border-green-200 bg-green-50/50">
            <FileSpreadsheet className="h-4 w-4 ml-1" />
            تصدير Excel
          </Button>
        </div>
      </div>

      <BranchSummaryCards
        branches={branchSummaries}
        selectedId={selectedBranch}
        onSelect={(id) => {
          setSelectedBranch(id);
          setFilters((p) => ({
            ...p,
            branch_id: id === "all" ? undefined : Number(id),
          }));
        }}
      />

      <StatementStatsCards summary={summary} loading={statsLoading} />

      {summary ? (
        <div className="rounded-xl border bg-violet-50 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm text-violet-800">
          <p>
            رصيد إقفال اليوم{" "}
            <strong>{formatNumber(summary.closing_balance)} ج.م</strong> يُرحّل تلقائياً كـ رصيد
            افتتاحي لليوم التالي
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-semibold shrink-0">
            <RefreshCw className="h-3.5 w-3.5" />
            تلقائي
          </span>
        </div>
      ) : null}

      <div className="flex gap-2">
        <Button
          size="sm"
          variant={activeTab === "ledger" ? "default" : "outline"}
          onClick={() => setActiveTab("ledger")}
        >
          <BookOpen className="h-4 w-4 ml-1" />
          دفتر الأستاذ
        </Button>
        <Button
          size="sm"
          variant={activeTab === "closing" ? "default" : "outline"}
          onClick={() => setActiveTab("closing")}
        >
          <Moon className="h-4 w-4 ml-1" />
          إقفال اليوم
        </Button>
      </div>

      {activeTab === "ledger" ? (
        <>
          <StatementFiltersBar
            search={search}
            onSearchChange={setSearch}
            type={filters.type ?? ""}
            onTypeChange={(v) => setFilters((p) => ({ ...p, type: v || undefined }))}
            branchId={filters.branch_id ? String(filters.branch_id) : ""}
            onBranchChange={(v) =>
              setFilters((p) => ({ ...p, branch_id: v ? Number(v) : undefined }))
            }
            category={filters.category ?? ""}
            onCategoryChange={(v) => setFilters((p) => ({ ...p, category: v || undefined }))}
            dateFrom={filters.date_from ?? ""}
            onDateFromChange={(v) => setFilters((p) => ({ ...p, date_from: v || undefined }))}
            dateTo={filters.date_to ?? ""}
            onDateToChange={(v) => setFilters((p) => ({ ...p, date_to: v || undefined }))}
            branches={branchFilterOptions}
            categories={categories.length ? categories : ["مدفوعات عملاء", "مصاريف", "إيجار", "صيانة", "مواد خام"]}
          />

          <LedgerTable rows={rows} loading={loading} openingBalance={summary?.opening_balance} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-emerald-200 bg-emerald-50/50 shadow-sm">
              <CardContent className="pt-5 pb-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">إجمالي الدائن (دخل)</p>
                <p className="text-2xl font-black text-emerald-700">{formatNumber(footerNet.credit)} ج.م</p>
              </CardContent>
            </Card>
            <Card className="border-red-200 bg-red-50/50 shadow-sm">
              <CardContent className="pt-5 pb-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">إجمالي المدين (خروج)</p>
                <p className="text-2xl font-black text-red-600">{formatNumber(footerNet.debit)} ج.م</p>
              </CardContent>
            </Card>
            <Card className="border-amber-200 bg-amber-50/50 shadow-sm">
              <CardContent className="pt-5 pb-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">صافي الفترة</p>
                <p className={`text-2xl font-black ${footerNet.net < 0 ? "text-amber-700" : "text-emerald-700"}`}>
                  {footerNet.net >= 0 ? "+" : ""}
                  {formatNumber(footerNet.net)} ج.م
                </p>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <Card className="border-blue-200/50 max-w-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-base font-bold">إقفال اليوم</CardTitle>
            </div>
            <CardDescription>تسجيل رصيد الإقفال اليومي وترحيله لليوم التالي.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="close-date">تاريخ الإغلاق</Label>
              <Input id="close-date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} dir="ltr" />
            </div>
            <div className="space-y-2">
              <Label>رصيد النظام</Label>
              <p className="text-xl font-bold text-amber-700">
                {formatNumber(summary?.current_balance ?? 0)} ج.م
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="actual-balance">الرصيد الفعلي</Label>
              <Input id="actual-balance" type="number" placeholder="أدخل الرصيد الفعلي" dir="ltr" />
            </div>
            <div className="rounded-lg border p-3 bg-muted/20 text-sm">
              <p className="text-muted-foreground mb-1">الفرق المتوقع</p>
              <p className="font-bold text-emerald-600">0 ج.م</p>
            </div>
            <Button className="w-full" disabled>
              <Lock className="h-4 w-4 ml-1.5" />
              تنفيذ الإغلاق (قريباً)
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={manualOpen} onOpenChange={(open) => !open && !saving && setManualOpen(false)}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <form onSubmit={handleManualSave}>
            <DialogHeader>
              <DialogTitle>قيد يدوي جديد</DialogTitle>
              <DialogDescription>إضافة حركة نقدية يدوية للخزنة.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 py-2">
              <div className="space-y-2">
                <Label>النوع</Label>
                <Select
                  value={manualForm.type}
                  onValueChange={(v) => {
                    const type = v as ManualForm["type"];
                    setManualForm((p) => ({
                      ...p,
                      type,
                      direction: type === "income" ? "in" : "out",
                    }));
                  }}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">إيراد</SelectItem>
                    <SelectItem value="expense">مصروف</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>الخزنة</Label>
                <Select
                  value={manualForm.cashbox_id || "none"}
                  onValueChange={(v) =>
                    setManualForm((p) => ({ ...p, cashbox_id: v === "none" ? "" : v }))
                  }
                >
                  <SelectTrigger><SelectValue placeholder="اختر الخزنة" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">—</SelectItem>
                    {cashboxes.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>المبلغ</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={manualForm.amount}
                  onChange={(e) => setManualForm((p) => ({ ...p, amount: e.target.value }))}
                  required
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label>التاريخ</Label>
                <Input
                  type="date"
                  value={manualForm.movement_date}
                  onChange={(e) => setManualForm((p) => ({ ...p, movement_date: e.target.value }))}
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label>المرجع</Label>
                <Input
                  value={manualForm.reference}
                  onChange={(e) => setManualForm((p) => ({ ...p, reference: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>البيان</Label>
                <Input
                  value={manualForm.description}
                  onChange={(e) => setManualForm((p) => ({ ...p, description: e.target.value }))}
                />
              </div>
              {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" disabled={saving} onClick={() => setManualOpen(false)}>
                إلغاء
              </Button>
              <Button type="submit" disabled={saving || !isModuleLive("cashMovements")}>
                {saving ? "جاري الحفظ..." : "حفظ القيد"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
