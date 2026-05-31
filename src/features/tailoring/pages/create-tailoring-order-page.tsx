import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isModuleLive } from "@/config/feature-flags";
import { createTailoringOrder } from "@/features/tailoring/services/tailoring.api.service";
import { createTailoringOrderMock } from "@/features/tailoring/services/tailoring.mock.service";
import type { TailoringPriority } from "@/features/tailoring/types/tailoring.types";
import { listCustomers } from "@/features/customers/services/customers.api.service";
import { listCustomersMock } from "@/features/customers/services/customers.mock.service";
import { listBranches } from "@/features/branches/services/branches.api.service";
import { listBranchesMock } from "@/features/branches/services/branches.mock.service";
import type { CustomerItem } from "@/features/customers/types/customers.types";
import type { BranchItem } from "@/features/branches/types/branches.types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Scissors, CheckCircle } from "lucide-react";

export function CreateTailoringOrderPage() {
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [branches, setBranches] = useState<BranchItem[]>([]);
  const [loadingLookups, setLoadingLookups] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [customerId, setCustomerId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [garmentName, setGarmentName] = useState("");
  const [fabricDescription, setFabricDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [occasionDate, setOccasionDate] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [priority, setPriority] = useState<TailoringPriority>("normal");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const loadCustomers = isModuleLive("tailoring")
      ? () => listCustomers({ per_page: 100 }).then((r) => r.data)
      : () => listCustomersMock().then((r) => r.data);
    const loadBranches = isModuleLive("tailoring")
      ? () => listBranches({ per_page: 100 }).then((r) => r.data)
      : () => listBranchesMock().then((r) => r.data);

    Promise.all([loadCustomers(), loadBranches()])
      .then(([customersList, branchesList]) => {
        setCustomers(customersList);
        setBranches(branchesList);
      })
      .finally(() => setLoadingLookups(false));
  }, []);

  const price = Math.max(0, Number(unitPrice) || 0);
  const paid = Math.max(0, Number(paidAmount) || 0);
  const canSubmit = customerId && branchId && garmentName.trim() && dueDate && price > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        customer_id: Number(customerId),
        branch_id: Number(branchId),
        garment_name: garmentName.trim(),
        fabric_description: fabricDescription.trim() || undefined,
        tailoring_due_date: dueDate,
        occasion_datetime: occasionDate || undefined,
        unit_price: price,
        paid_amount: paid > 0 ? paid : undefined,
        order_notes: notes.trim() || undefined,
        priority,
      };

      const result = isModuleLive("tailoring")
        ? await createTailoringOrder(payload)
        : (await createTailoringOrderMock(payload)).data;

      setOrderId(result.id);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذّر إنشاء الأمر");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted && orderId) {
    return (
      <div className="w-full max-w-lg mx-auto py-12 text-center space-y-4" dir="rtl">
        <CheckCircle className="w-14 h-14 text-green-500 mx-auto" />
        <h2 className="text-xl font-black">تم إنشاء أمر التفصيل بنجاح</h2>
        <p className="text-muted-foreground">رقم الأمر: #{orderId}</p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
          <Button asChild><Link to={`/tailoring/orders/${orderId}`}>عرض الأمر</Link></Button>
          <Button variant="outline" asChild><Link to="/tailoring/orders">العودة للقائمة</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 overflow-x-hidden" dir="rtl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/tailoring/orders"><ArrowRight className="h-4 w-4" /></Link>
        </Button>
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #BE185D, #F472B6)" }}>
            <Scissors className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-black truncate">أمر تفصيل جديد</h1>
            <p className="text-sm text-muted-foreground">إنشاء أمر تفصيل جديد للعميلة</p>
          </div>
        </div>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

      <form onSubmit={handleSubmit}>
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">بيانات الأمر</CardTitle>
            <CardDescription>أدخل تفاصيل الثوب والعميلة وموعد التسليم</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingLookups ? (
              <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>العميلة *</Label>
                    <Select value={customerId} onValueChange={setCustomerId}>
                      <SelectTrigger><SelectValue placeholder="اختر العميلة" /></SelectTrigger>
                      <SelectContent>
                        {customers.map((c) => (
                          <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>الفرع *</Label>
                    <Select value={branchId} onValueChange={setBranchId}>
                      <SelectTrigger><SelectValue placeholder="اختر الفرع" /></SelectTrigger>
                      <SelectContent>
                        {branches.map((b) => (
                          <SelectItem key={b.id} value={String(b.id)}>{b.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="garment">نوع الثوب *</Label>
                    <Input id="garment" value={garmentName} onChange={(e) => setGarmentName(e.target.value)} placeholder="مثال: فستان زفاف" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fabric">القماش / الوصف</Label>
                    <Input id="fabric" value={fabricDescription} onChange={(e) => setFabricDescription(e.target.value)} placeholder="مثال: دانتيل فرنسي — أسود" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="due">موعد التسليم *</Label>
                    <Input id="due" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="occasion">تاريخ المناسبة</Label>
                    <Input id="occasion" type="date" value={occasionDate} onChange={(e) => setOccasionDate(e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">السعر (ج.م) *</Label>
                    <Input id="price" type="number" min="0" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paid">دفعة مقدّمة</Label>
                    <Input id="paid" type="number" min="0" value={paidAmount} onChange={(e) => setPaidAmount(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>الأولوية</Label>
                    <Select value={priority} onValueChange={(v) => setPriority(v as TailoringPriority)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">عادي</SelectItem>
                        <SelectItem value="VIP">VIP</SelectItem>
                        <SelectItem value="urgent">عاجل</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">ملاحظات</Label>
                  <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="تفاصيل التصميم أو ملاحظات إضافية..." />
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end border-t pt-4">
            <Button type="button" variant="outline" asChild><Link to="/tailoring/orders">إلغاء</Link></Button>
            <Button type="submit" disabled={!canSubmit || submitting || loadingLookups} style={{ background: "linear-gradient(135deg, #1E293B, #334155)" }} className="text-white border-0 w-full sm:w-auto">
              {submitting ? "جاري الحفظ..." : "إنشاء أمر التفصيل"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
