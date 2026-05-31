import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { OrderStepsStepper } from "@/components/custom/OrderStepsStepper";
import type { CreateOrderDraft } from "@/features/orders/types/orders.types";
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
import { Badge } from "@/components/ui/badge";
import { FileCheck, ArrowRight, CheckCircle } from "lucide-react";

export function CreateOrderPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const draft = (location.state as { draft?: CreateOrderDraft } | null)?.draft;

  const [deposit, setDeposit] = useState("");
  const [discount, setDiscount] = useState("0");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!draft || draft.items.length === 0) {
      navigate("/orders/choose-client", { replace: true });
    }
  }, [draft, navigate]);

  if (!draft || draft.items.length === 0) return null;

  const subtotal = draft.items.reduce((s, i) => s + i.rental_price, 0);
  const discountVal = Number(discount) || 0;
  const total = Math.max(0, subtotal - discountVal);
  const depositVal = Number(deposit) || 0;
  const remaining = Math.max(0, total - depositVal);

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  if (submitted) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-16" dir="rtl">
        <CheckCircle className="h-16 w-16 text-green-600 mb-4" />
        <h2 className="text-xl font-black mb-2">تم إنشاء فاتورة التأجير بنجاح</h2>
        <p className="text-muted-foreground mb-6">يمكنك العودة لقائمة الفواتير أو إنشاء فاتورة جديدة.</p>
        <div className="flex gap-3">
          <Button asChild><Link to="/orders">عرض الفواتير</Link></Button>
          <Button variant="outline" asChild><Link to="/orders/choose-client">فاتورة جديدة</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6" dir="rtl">
      <OrderStepsStepper currentStep={3} />

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #5170FF, #818CF8)" }}
            >
              <FileCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-black" style={{ color: "var(--color-text-primary)" }}>
                الخطوة 3: مراجعة وإنشاء الفاتورة
              </CardTitle>
              <CardDescription>راجع التفاصيل قبل تأكيد إنشاء فاتورة التأجير.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-lg border p-3" style={{ borderColor: "var(--color-border)" }}>
              <p className="text-xs text-muted-foreground">العميل</p>
              <p className="font-medium mt-1">{draft.client_name}</p>
            </div>
            <div className="rounded-lg border p-3" style={{ borderColor: "var(--color-border)" }}>
              <p className="text-xs text-muted-foreground">تاريخ التسليم</p>
              <p className="font-medium mt-1">{draft.delivery_date}</p>
            </div>
            <div className="rounded-lg border p-3" style={{ borderColor: "var(--color-border)" }}>
              <p className="text-xs text-muted-foreground">تاريخ الإرجاع</p>
              <p className="font-medium mt-1">{draft.return_date}</p>
            </div>
            <div className="rounded-lg border p-3" style={{ borderColor: "var(--color-border)" }}>
              <p className="text-xs text-muted-foreground">الموظف</p>
              <p className="font-medium mt-1">{draft.employee_name}</p>
            </div>
          </div>

          <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="text-center font-bold text-xs">الصنف</TableHead>
                  <TableHead className="text-center font-bold text-xs">الكود</TableHead>
                  <TableHead className="text-center font-bold text-xs">المقاس</TableHead>
                  <TableHead className="text-center font-bold text-xs">السعر</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {draft.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-center font-medium">{item.name}</TableCell>
                    <TableCell className="text-center"><Badge variant="outline" className="font-mono">{item.code}</Badge></TableCell>
                    <TableCell className="text-center">{item.size}</TableCell>
                    <TableCell className="text-center">{item.rental_price} ج.م</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl">
            <div>
              <Label htmlFor="discount">خصم (ج.م)</Label>
              <Input id="discount" type="number" min="0" value={discount} onChange={(e) => setDiscount(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="deposit">عربون (ج.م)</Label>
              <Input id="deposit" type="number" min="0" value={deposit} onChange={(e) => setDeposit(e.target.value)} className="mt-1.5" />
            </div>
          </div>

          <div className="rounded-lg bg-muted/30 p-4 max-w-sm mr-auto space-y-2">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">المجموع الفرعي</span><span>{subtotal} ج.م</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">الخصم</span><span>- {discountVal} ج.م</span></div>
            <div className="flex justify-between font-black text-lg border-t pt-2"><span>الإجمالي</span><span>{total} ج.م</span></div>
            <div className="flex justify-between text-sm text-green-700"><span>العربون</span><span>{depositVal} ج.م</span></div>
            <div className="flex justify-between text-sm text-amber-700"><span>المتبقي</span><span>{remaining} ج.م</span></div>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <Button variant="outline" asChild>
            <Link to="/orders/choose-clothes" state={{ draft }}><ArrowRight className="h-4 w-4 ml-1" /> السابق</Link>
          </Button>
          <Button disabled={submitting} onClick={handleSubmit}>
            {submitting ? "جاري الإنشاء..." : "تأكيد وإنشاء الفاتورة"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
