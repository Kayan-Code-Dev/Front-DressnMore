import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { ListPageStandardFilters } from "@/components/shared/ListPageStandardFilters";
import { isModuleLive } from "@/config/feature-flags";
import type { InvoiceItem } from "@/features/invoices/types/invoices.types";
import { listInvoicesMock } from "@/features/invoices/services/invoices.mock.service";
import {
  addInvoicePayment,
  cancelInvoice,
  deliverInvoice,
  listInvoices,
  returnInvoice,
} from "@/features/invoices/services/invoices.api.service";
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
  Dialog as ShadDialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  FileText,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Banknote,
  Truck,
  RotateCcw,
  XCircle,
} from "lucide-react";

function fetchInvoiceData(searchTerm: string, currentPage: number) {
  if (isModuleLive("invoices")) {
    return listInvoices({ search: searchTerm, page: currentPage, per_page: 15 });
  }
  return listInvoicesMock(searchTerm);
}

const statusMap: Record<string, { label: string; variant: "success" | "warning" | "destructive" | "info" | "secondary" }> = {
  draft: { label: "مسودة", variant: "secondary" },
  confirmed: { label: "مؤكدة", variant: "info" },
  partially_paid: { label: "مدفوعة جزئياً", variant: "warning" },
  paid: { label: "مدفوعة", variant: "success" },
  delivered: { label: "مُسلّمة", variant: "success" },
  returned: { label: "مُرتجعة", variant: "info" },
  cancelled: { label: "ملغاة", variant: "destructive" },
};

const typeMap: Record<string, string> = {
  rent: "إيجار",
  sale: "بيع",
  tailoring: "تفصيل",
};

const PAYMENT_METHODS = [
  { value: "cash", label: "نقدي" },
  { value: "instapay", label: "InstaPay" },
  { value: "vodafone_cash", label: "فودافون كاش" },
  { value: "bank_transfer", label: "تحويل بنكي" },
];

function StatusBadge({ status }: { status: string }) {
  const config = statusMap[status] ?? { label: status, variant: "secondary" as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

function TableSkeletonRows({ rows = 5, cols = 8 }: { rows?: number; cols?: number }) {
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

function formatDate(value: string | null) {
  if (!value) return "—";
  return value.slice(0, 10);
}

export function InvoicesPage() {
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<InvoiceItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);
  const [dialog, setDialog] = useState<"payment" | "deliver" | "return" | "cancel" | null>(null);
  const [selected, setSelected] = useState<InvoiceItem | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadRows = useCallback(() => {
    setLoading(true);
    fetchInvoiceData(search, page)
      .then((response) => {
        setRows(response.data);
        const meta = response.meta as { last_page?: number; total?: number } | null | undefined;
        setTotalPages(meta?.last_page ?? 1);
        setTotal(meta?.total ?? response.data.length);
        setError(null);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load invoices");
        setRows([]);
      })
      .finally(() => setLoading(false));
  }, [search, page]);

  useEffect(() => {
    loadRows();
  }, [loadRows, reloadKey]);

  const openDialog = (type: typeof dialog, row: InvoiceItem) => {
    setSelected(row);
    setFormError(null);
    if (type === "payment") {
      setPaymentAmount(String(row.remaining_amount ?? 0));
      setPaymentMethod("cash");
    }
    setDialog(type);
  };

  const closeDialog = () => {
    if (saving) return;
    setDialog(null);
    setSelected(null);
    setFormError(null);
  };

  const handlePayment = async (event: FormEvent) => {
    event.preventDefault();
    if (!isModuleLive("invoices") || !selected) return;

    setSaving(true);
    setFormError(null);
    try {
      await addInvoicePayment(selected.id, {
        amount: Number(paymentAmount),
        method: paymentMethod || null,
      });
      closeDialog();
      setReloadKey((k) => k + 1);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Failed to add payment");
    } finally {
      setSaving(false);
    }
  };

  const handleDeliver = async () => {
    if (!isModuleLive("invoices") || !selected) return;

    setSaving(true);
    setFormError(null);
    try {
      await deliverInvoice(selected.id, {});
      closeDialog();
      setReloadKey((k) => k + 1);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Failed to deliver invoice");
    } finally {
      setSaving(false);
    }
  };

  const handleReturn = async () => {
    if (!isModuleLive("invoices") || !selected) return;

    setSaving(true);
    setFormError(null);
    try {
      await returnInvoice(selected.id, { dress_status_after_return: "available" });
      closeDialog();
      setReloadKey((k) => k + 1);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Failed to return invoice");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async () => {
    if (!isModuleLive("invoices") || !selected) return;

    setSaving(true);
    setFormError(null);
    try {
      await cancelInvoice(selected.id);
      closeDialog();
      setReloadKey((k) => k + 1);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Failed to cancel invoice");
    } finally {
      setSaving(false);
    }
  };

  const canPay = (row: InvoiceItem) =>
    row.status !== "cancelled" && row.status !== "draft" && (row.remaining_amount ?? 0) > 0;

  const canDeliver = (row: InvoiceItem) =>
    row.type === "rent" && !["delivered", "returned", "cancelled", "draft"].includes(row.status);

  const canReturn = (row: InvoiceItem) =>
    row.type === "rent" && row.status === "delivered";

  const canCancel = (row: InvoiceItem) =>
    !["cancelled", "returned"].includes(row.status);

  const columns = useMemo(() => [
    { key: "id", title: "#" },
    { key: "invoice_number", title: "رقم الفاتورة" },
    { key: "customer", title: "العميل" },
    { key: "type", title: "النوع" },
    { key: "total", title: "الإجمالي" },
    { key: "remaining", title: "المتبقي" },
    { key: "status", title: "الحالة" },
    { key: "created_at", title: "التاريخ" },
    { key: "actions", title: "إجراءات" },
  ], []);

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #0369A1, #0EA5E9)" }}>
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-black" style={{ color: "var(--color-text-primary)" }}>إدارة الفواتير</CardTitle>
              <CardDescription>عرض وإدارة الفواتير — دفع، تسليم، إرجاع.</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" onClick={() => setFiltersOpen((v) => !v)}><Filter className="h-4 w-4 ml-1.5" />الفلاتر</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="بحث عن فاتورة..." className="pr-9" />
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
                        <TableCell className="text-center"><Badge variant="outline" className="font-mono">{row.invoice_number}</Badge></TableCell>
                        <TableCell className="text-center font-medium">#{row.customer_id}</TableCell>
                        <TableCell className="text-center"><Badge variant="secondary">{typeMap[row.type] ?? row.type}</Badge></TableCell>
                        <TableCell className="text-center font-medium">{row.total.toLocaleString()}</TableCell>
                        <TableCell className="text-center text-amber-700 font-medium">{(row.remaining_amount ?? 0).toLocaleString()}</TableCell>
                        <TableCell className="text-center"><StatusBadge status={row.status} /></TableCell>
                        <TableCell className="text-center text-muted-foreground">{formatDate(row.created_at)}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1 flex-wrap">
                            {canPay(row) && (
                              <Button variant="ghost" size="icon" className="h-8 w-8" disabled={!isModuleLive("invoices")} onClick={() => openDialog("payment", row)} title="دفع"><Banknote className="h-3.5 w-3.5 text-emerald-600" /></Button>
                            )}
                            {canDeliver(row) && (
                              <Button variant="ghost" size="icon" className="h-8 w-8" disabled={!isModuleLive("invoices")} onClick={() => openDialog("deliver", row)} title="تسليم"><Truck className="h-3.5 w-3.5 text-blue-600" /></Button>
                            )}
                            {canReturn(row) && (
                              <Button variant="ghost" size="icon" className="h-8 w-8" disabled={!isModuleLive("invoices")} onClick={() => openDialog("return", row)} title="إرجاع"><RotateCcw className="h-3.5 w-3.5 text-violet-600" /></Button>
                            )}
                            {canCancel(row) && (
                              <Button variant="ghost" size="icon" className="h-8 w-8" disabled={!isModuleLive("invoices")} onClick={() => openDialog("cancel", row)} title="إلغاء"><XCircle className="h-3.5 w-3.5 text-destructive" /></Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={columns.length} className="py-10 text-center text-muted-foreground">لا توجد فواتير لعرضها.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm text-muted-foreground">إجمالي الفواتير: <span className="font-bold">{total}</span></p>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}><ChevronRight className="h-4 w-4" />السابق</Button>
              <span className="text-sm text-muted-foreground px-2">{page} / {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>التالي<ChevronLeft className="h-4 w-4" /></Button>
            </div>
          )}
        </CardFooter>
      </Card>

      <ShadDialog open={dialog === "payment"} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <form onSubmit={handlePayment}>
            <DialogHeader>
              <DialogTitle>تسجيل دفعة</DialogTitle>
              <DialogDescription>فاتورة {selected?.invoice_number} — المتبقي: {(selected?.remaining_amount ?? 0).toLocaleString()}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 py-2">
              <div className="space-y-2">
                <Label>المبلغ</Label>
                <Input type="number" min="0" step="0.01" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} required dir="ltr" />
              </div>
              <div className="space-y-2">
                <Label>طريقة الدفع</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHODS.map((m) => (<SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" disabled={saving} onClick={closeDialog}>إلغاء</Button>
              <Button type="submit" disabled={saving}>{saving ? "جاري التسجيل..." : "تسجيل الدفعة"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </ShadDialog>

      <ShadDialog open={dialog === "deliver"} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>تسليم الفاتورة</DialogTitle>
            <DialogDescription>تأكيد تسليم فاتورة {selected?.invoice_number}؟</DialogDescription>
          </DialogHeader>
          {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
          <DialogFooter>
            <Button variant="outline" disabled={saving} onClick={closeDialog}>إلغاء</Button>
            <Button disabled={saving} onClick={handleDeliver}>{saving ? "جاري التسليم..." : "تأكيد التسليم"}</Button>
          </DialogFooter>
        </DialogContent>
      </ShadDialog>

      <ShadDialog open={dialog === "return"} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>إرجاع الفاتورة</DialogTitle>
            <DialogDescription>تأكيد إرجاع فاتورة {selected?.invoice_number}؟</DialogDescription>
          </DialogHeader>
          {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
          <DialogFooter>
            <Button variant="outline" disabled={saving} onClick={closeDialog}>إلغاء</Button>
            <Button disabled={saving} onClick={handleReturn}>{saving ? "جاري الإرجاع..." : "تأكيد الإرجاع"}</Button>
          </DialogFooter>
        </DialogContent>
      </ShadDialog>

      <ShadDialog open={dialog === "cancel"} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>إلغاء الفاتورة</DialogTitle>
            <DialogDescription>هل أنت متأكد من إلغاء فاتورة {selected?.invoice_number}؟</DialogDescription>
          </DialogHeader>
          {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
          <DialogFooter>
            <Button variant="outline" disabled={saving} onClick={closeDialog}>تراجع</Button>
            <Button variant="destructive" disabled={saving} onClick={handleCancel}>{saving ? "جاري الإلغاء..." : "إلغاء الفاتورة"}</Button>
          </DialogFooter>
        </DialogContent>
      </ShadDialog>
    </div>
  );
}
