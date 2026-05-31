import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getRentalOrderMock } from "@/features/orders/services/orders.mock.service";
import type { RentalOrder, RentalOrderStatus } from "@/features/orders/types/orders.types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowRight,
  ShoppingBag,
  Printer,
  XCircle,
  Package,
  CreditCard,
  Shield,
} from "lucide-react";

const statusMap: Record<RentalOrderStatus, { label: string; variant: "success" | "warning" | "destructive" | "info" | "secondary" }> = {
  active: { label: "نشط", variant: "success" },
  returned: { label: "مرتجع", variant: "info" },
  overdue: { label: "متأخر", variant: "destructive" },
  cancelled: { label: "ملغي", variant: "secondary" },
  pending: { label: "قيد الانتظار", variant: "warning" },
};

const paymentMethodLabels: Record<string, string> = {
  cash: "نقدي",
  card: "بطاقة",
  transfer: "تحويل",
};

const custodyStatusLabels: Record<string, { label: string; variant: "success" | "warning" }> = {
  held: { label: "محتجزة", variant: "warning" },
  returned: { label: "مُرجعة", variant: "success" },
};

export function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<RentalOrder | null>(null);

  useEffect(() => {
    const orderId = Number(id);
    if (!Number.isFinite(orderId)) {
      setLoading(false);
      return;
    }
    getRentalOrderMock(orderId)
      .then((res) => setOrder(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="w-full space-y-4" dir="rtl">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="w-full py-12 text-center" dir="rtl">
        <p className="text-muted-foreground mb-4">لم يتم العثور على الفاتورة.</p>
        <Button variant="outline" asChild><Link to="/orders">العودة للفواتير</Link></Button>
      </div>
    );
  }

  const statusCfg = statusMap[order.status];

  return (
    <div className="w-full space-y-4" dir="rtl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/orders"><ArrowRight className="h-4 w-4 ml-1" /> العودة للفواتير</Link>
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled><Printer className="h-4 w-4 ml-1" /> طباعة</Button>
          <Button variant="outline" size="sm" disabled><XCircle className="h-4 w-4 ml-1 text-destructive" /> إلغاء</Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #5170FF, #818CF8)" }}
            >
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-black" style={{ color: "var(--color-text-primary)" }}>
                فاتورة تأجير #{order.id}
              </CardTitle>
              <CardDescription>{order.client_name} — {order.client_phone}</CardDescription>
            </div>
          </div>
          <Badge variant={statusCfg.variant} className="text-sm px-3 py-1">{statusCfg.label}</Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="rounded-lg border p-3" style={{ borderColor: "var(--color-border)" }}>
              <p className="text-xs text-muted-foreground">تاريخ الزيارة</p>
              <p className="font-medium mt-1">{order.visit_date}</p>
            </div>
            <div className="rounded-lg border p-3" style={{ borderColor: "var(--color-border)" }}>
              <p className="text-xs text-muted-foreground">تاريخ التسليم</p>
              <p className="font-medium mt-1">{order.delivery_date}</p>
            </div>
            <div className="rounded-lg border p-3" style={{ borderColor: "var(--color-border)" }}>
              <p className="text-xs text-muted-foreground">تاريخ الإرجاع</p>
              <p className="font-medium mt-1">{order.return_date}</p>
            </div>
            <div className="rounded-lg border p-3" style={{ borderColor: "var(--color-border)" }}>
              <p className="text-xs text-muted-foreground">الموظف</p>
              <p className="font-medium mt-1">{order.employee_name}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="rounded-lg bg-muted/30 p-4 text-center">
              <p className="text-xs text-muted-foreground">الإجمالي</p>
              <p className="text-xl font-black mt-1">{order.total_price.toLocaleString("ar-EG")} ج.م</p>
            </div>
            <div className="rounded-lg bg-green-50 dark:bg-green-950/30 p-4 text-center">
              <p className="text-xs text-muted-foreground">المحصّل</p>
              <p className="text-xl font-black mt-1 text-green-700">{order.paid.toLocaleString("ar-EG")} ج.م</p>
            </div>
            <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 p-4 text-center">
              <p className="text-xs text-muted-foreground">المتبقي</p>
              <p className="text-xl font-black mt-1 text-amber-700">{order.remaining.toLocaleString("ar-EG")} ج.م</p>
            </div>
          </div>

          <Tabs defaultValue="items">
            <TabsList className="mb-4">
              <TabsTrigger value="items" className="gap-1.5"><Package className="h-3.5 w-3.5" /> الأصناف ({order.items?.length ?? 0})</TabsTrigger>
              <TabsTrigger value="payments" className="gap-1.5"><CreditCard className="h-3.5 w-3.5" /> المدفوعات ({order.payments?.length ?? 0})</TabsTrigger>
              <TabsTrigger value="custodies" className="gap-1.5"><Shield className="h-3.5 w-3.5" /> الضمانات ({order.custodies?.length ?? 0})</TabsTrigger>
            </TabsList>

            <TabsContent value="items">
              <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="text-center font-bold text-xs">الصنف</TableHead>
                      <TableHead className="text-center font-bold text-xs">الكود</TableHead>
                      <TableHead className="text-center font-bold text-xs">المقاس</TableHead>
                      <TableHead className="text-center font-bold text-xs">اللون</TableHead>
                      <TableHead className="text-center font-bold text-xs">السعر</TableHead>
                      <TableHead className="text-center font-bold text-xs">تاريخ الإرجاع</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(order.items ?? []).map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-center font-medium">{item.cloth_name}</TableCell>
                        <TableCell className="text-center"><Badge variant="outline" className="font-mono">{item.cloth_code}</Badge></TableCell>
                        <TableCell className="text-center">{item.size}</TableCell>
                        <TableCell className="text-center">{item.color}</TableCell>
                        <TableCell className="text-center">{item.rental_price.toLocaleString("ar-EG")} ج.م</TableCell>
                        <TableCell className="text-center text-muted-foreground text-xs">{item.return_date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="payments">
              <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="text-center font-bold text-xs">#</TableHead>
                      <TableHead className="text-center font-bold text-xs">المبلغ</TableHead>
                      <TableHead className="text-center font-bold text-xs">طريقة الدفع</TableHead>
                      <TableHead className="text-center font-bold text-xs">التاريخ</TableHead>
                      <TableHead className="text-center font-bold text-xs">ملاحظات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(order.payments ?? []).length > 0 ? (order.payments ?? []).map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="text-center text-muted-foreground">{p.id}</TableCell>
                        <TableCell className="text-center font-medium">{p.amount.toLocaleString("ar-EG")} ج.م</TableCell>
                        <TableCell className="text-center">{paymentMethodLabels[p.method] ?? p.method}</TableCell>
                        <TableCell className="text-center text-muted-foreground text-xs">{p.paid_at}</TableCell>
                        <TableCell className="text-center text-muted-foreground">{p.notes ?? "—"}</TableCell>
                      </TableRow>
                    )) : (
                      <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">لا توجد مدفوعات.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="custodies">
              <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="text-center font-bold text-xs">#</TableHead>
                      <TableHead className="text-center font-bold text-xs">العنصر</TableHead>
                      <TableHead className="text-center font-bold text-xs">القيمة</TableHead>
                      <TableHead className="text-center font-bold text-xs">الحالة</TableHead>
                      <TableHead className="text-center font-bold text-xs">تاريخ الاستلام</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(order.custodies ?? []).length > 0 ? (order.custodies ?? []).map((c) => {
                      const cfg = custodyStatusLabels[c.status];
                      return (
                        <TableRow key={c.id}>
                          <TableCell className="text-center text-muted-foreground">{c.id}</TableCell>
                          <TableCell className="text-center font-medium">{c.item_name}</TableCell>
                          <TableCell className="text-center">{c.value > 0 ? `${c.value.toLocaleString("ar-EG")} ج.م` : "—"}</TableCell>
                          <TableCell className="text-center"><Badge variant={cfg.variant}>{cfg.label}</Badge></TableCell>
                          <TableCell className="text-center text-muted-foreground text-xs">{c.received_at}</TableCell>
                        </TableRow>
                      );
                    }) : (
                      <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">لا توجد ضمانات.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
