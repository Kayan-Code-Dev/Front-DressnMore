import { useState } from "react";
import { Link } from "react-router-dom";
import { createSaleMock } from "@/features/sales/services/sales.mock.service";
import { saleProductOptions } from "@/features/sales/mocks/sales.mock";
import type { SaleLineItem, SalePaymentMethod } from "@/features/sales/types/sales.types";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShoppingCart, Plus, Trash2, CheckCircle } from "lucide-react";

const mockEmployees = ["محمد علي", "فاطمة محمود", "أحمد سعيد"];
const mockBranches = ["الفرع الرئيسي", "فرع المعادي", "فرع مدينة نصر"];
const paymentMethods: { value: SalePaymentMethod; label: string }[] = [
  { value: "cash", label: "نقدي" },
  { value: "card", label: "بطاقة" },
  { value: "transfer", label: "تحويل" },
];

export function CreateSalePage() {
  const [clientName, setClientName] = useState("");
  const [employee, setEmployee] = useState("");
  const [branch, setBranch] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<SalePaymentMethod>("cash");
  const [discount, setDiscount] = useState("0");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<SaleLineItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [invoiceId, setInvoiceId] = useState<number | null>(null);

  const addItem = () => {
    const product = saleProductOptions.find((p) => String(p.id) === selectedProductId);
    const qty = Math.max(1, Number(quantity) || 1);
    if (!product) return;
    setItems((prev) => {
      const existing = prev.find((i) => i.product_code === product.code);
      if (existing) {
        return prev.map((i) =>
          i.product_code === product.code
            ? { ...i, quantity: i.quantity + qty, total: (i.quantity + qty) * i.unit_price }
            : i,
        );
      }
      return [
        ...prev,
        {
          id: Date.now(),
          product_name: product.name,
          product_code: product.code,
          quantity: qty,
          unit_price: product.price,
          total: qty * product.price,
        },
      ];
    });
    setSelectedProductId("");
    setQuantity("1");
  };

  const removeItem = (id: number) => setItems((prev) => prev.filter((i) => i.id !== id));

  const subtotal = items.reduce((s, i) => s + i.total, 0);
  const discountVal = Number(discount) || 0;
  const total = Math.max(0, subtotal - discountVal);
  const canSubmit = clientName.trim() && employee && branch && items.length > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const res = await createSaleMock();
      setInvoiceId(res.data.id);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-16" dir="rtl">
        <CheckCircle className="h-16 w-16 text-green-600 mb-4" />
        <h2 className="text-xl font-black mb-2">تم إنشاء فاتورة البيع #{invoiceId}</h2>
        <p className="text-muted-foreground mb-6">تم حفظ الفاتورة بنجاح.</p>
        <div className="flex gap-3">
          <Button asChild><Link to="/sales/reports">عرض التقارير</Link></Button>
          <Button variant="outline" onClick={() => { setSubmitted(false); setItems([]); setClientName(""); }}>فاتورة جديدة</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4" dir="rtl">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #059669, #34D399)" }}>
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-black" style={{ color: "var(--color-text-primary)" }}>إنشاء فاتورة بيع</CardTitle>
              <CardDescription>إضافة منتجات وإنشاء فاتورة بيع جديدة.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="client">اسم العميل</Label>
              <Input id="client" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="اسم العميل" className="mt-1.5" />
            </div>
            <div>
              <Label>الموظف</Label>
              <Select value={employee} onValueChange={setEmployee}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="اختر الموظف" /></SelectTrigger>
                <SelectContent>{mockEmployees.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>الفرع</Label>
              <Select value={branch} onValueChange={setBranch}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="اختر الفرع" /></SelectTrigger>
                <SelectContent>{mockBranches.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>طريقة الدفع</Label>
              <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as SalePaymentMethod)}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>{paymentMethods.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-lg border p-4 space-y-3" style={{ borderColor: "var(--color-border)" }}>
            <p className="text-sm font-bold">إضافة منتج</p>
            <div className="flex flex-wrap items-end gap-3">
              <div className="flex-1 min-w-[180px]">
                <Label>المنتج</Label>
                <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="اختر منتج" /></SelectTrigger>
                  <SelectContent>
                    {saleProductOptions.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>{p.name} — {p.price.toLocaleString("ar-EG")} ج.م</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-24">
                <Label>الكمية</Label>
                <Input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="mt-1.5" />
              </div>
              <Button onClick={addItem} disabled={!selectedProductId}><Plus className="h-4 w-4 ml-1" /> إضافة</Button>
            </div>
          </div>

          <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="text-center font-bold text-xs">المنتج</TableHead>
                  <TableHead className="text-center font-bold text-xs">الكود</TableHead>
                  <TableHead className="text-center font-bold text-xs">الكمية</TableHead>
                  <TableHead className="text-center font-bold text-xs">السعر</TableHead>
                  <TableHead className="text-center font-bold text-xs">الإجمالي</TableHead>
                  <TableHead className="text-center font-bold text-xs w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length > 0 ? items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-center font-medium">{item.product_name}</TableCell>
                    <TableCell className="text-center"><Badge variant="outline" className="font-mono">{item.product_code}</Badge></TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell className="text-center">{item.unit_price.toLocaleString("ar-EG")} ج.م</TableCell>
                    <TableCell className="text-center font-medium">{item.total.toLocaleString("ar-EG")} ج.م</TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">لم تُضف منتجات بعد.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="discount">خصم (ج.م)</Label>
              <Input id="discount" type="number" min="0" value={discount} onChange={(e) => setDiscount(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="notes">ملاحظات</Label>
              <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1.5" rows={2} />
            </div>
          </div>

          <div className="rounded-lg bg-muted/30 p-4 max-w-sm mr-auto space-y-2">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">المجموع</span><span>{subtotal.toLocaleString("ar-EG")} ج.م</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">الخصم</span><span>- {discountVal.toLocaleString("ar-EG")} ج.م</span></div>
            <div className="flex justify-between font-black text-lg border-t pt-2"><span>الإجمالي</span><span>{total.toLocaleString("ar-EG")} ج.م</span></div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" asChild><Link to="/sales/reports">إلغاء</Link></Button>
          <Button disabled={!canSubmit || submitting} onClick={handleSubmit}>
            {submitting ? "جاري الحفظ..." : "حفظ فاتورة البيع"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
