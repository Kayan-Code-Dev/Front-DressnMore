import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getTailoringOrderMock } from "@/features/tailoring/services/tailoring.mock.service";
import type { TailoringOrder, TailoringOrderStatus } from "@/features/tailoring/types/tailoring.types";
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
import { ArrowRight, Scissors, Ruler, Pencil } from "lucide-react";

const statusMap: Record<TailoringOrderStatus, { label: string; variant: "success" | "warning" | "destructive" | "info" }> = {
  active: { label: "نشط", variant: "success" },
  completed: { label: "منجز", variant: "info" },
  overdue: { label: "متأخر", variant: "destructive" },
  cancelled: { label: "ملغي", variant: "warning" },
};

const stageLabels: Record<string, string> = {
  measurements: "القياسات",
  cutting: "القص",
  sewing: "الخياطة",
  finishing: "التشطيب",
  ready_for_delivery: "جاهز للتسليم",
};

const priorityLabels: Record<string, { label: string; variant: "info" | "destructive" | "secondary" }> = {
  VIP: { label: "VIP", variant: "info" },
  urgent: { label: "عاجل", variant: "destructive" },
  normal: { label: "عادي", variant: "secondary" },
};

export function TailoringOrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<TailoringOrder | null>(null);

  useEffect(() => {
    const orderId = Number(id);
    if (!Number.isFinite(orderId)) {
      setLoading(false);
      return;
    }
    getTailoringOrderMock(orderId)
      .then((res) => setOrder(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="w-full space-y-4" dir="rtl">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="w-full py-12 text-center" dir="rtl">
        <p className="text-muted-foreground mb-4">لم يتم العثور على أمر التفصيل.</p>
        <Button variant="outline" asChild><Link to="/tailoring/orders">العودة للأوامر</Link></Button>
      </div>
    );
  }

  const statusCfg = statusMap[order.status];
  const priorityCfg = priorityLabels[order.priority];

  return (
    <div className="w-full space-y-4" dir="rtl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/tailoring/orders"><ArrowRight className="h-4 w-4 ml-1" /> العودة للأوامر</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link to={`/tailoring/orders/${order.id}/measurements`}><Pencil className="h-4 w-4 ml-1" /> تعديل القياسات</Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #BE185D, #F472B6)" }}>
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-black" style={{ color: "var(--color-text-primary)" }}>
                أمر تفصيل #{order.id}
              </CardTitle>
              <CardDescription>{order.client_name} — {order.fabric_name}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={priorityCfg.variant}>{priorityCfg.label}</Badge>
            <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-lg border p-3" style={{ borderColor: "var(--color-border)" }}>
              <p className="text-xs text-muted-foreground">تاريخ الطلب</p>
              <p className="font-medium mt-1">{order.order_date}</p>
            </div>
            <div className="rounded-lg border p-3" style={{ borderColor: "var(--color-border)" }}>
              <p className="text-xs text-muted-foreground">موعد التسليم</p>
              <p className="font-medium mt-1">{order.due_date}</p>
            </div>
            <div className="rounded-lg border p-3" style={{ borderColor: "var(--color-border)" }}>
              <p className="text-xs text-muted-foreground">المرحلة الحالية</p>
              <p className="font-medium mt-1">{stageLabels[order.current_stage] ?? order.current_stage}</p>
            </div>
            <div className="rounded-lg border p-3" style={{ borderColor: "var(--color-border)" }}>
              <p className="text-xs text-muted-foreground">الموظف</p>
              <p className="font-medium mt-1">{order.employee_name}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-muted/30 p-4 text-center">
              <p className="text-xs text-muted-foreground">الإجمالي</p>
              <p className="text-xl font-black mt-1">{order.total_price} ج.م</p>
            </div>
            <div className="rounded-lg bg-green-50 dark:bg-green-950/30 p-4 text-center">
              <p className="text-xs text-muted-foreground">المحصّل</p>
              <p className="text-xl font-black mt-1 text-green-700">{order.paid} ج.م</p>
            </div>
            <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 p-4 text-center">
              <p className="text-xs text-muted-foreground">المتبقي</p>
              <p className="text-xl font-black mt-1 text-amber-700">{order.remaining} ج.م</p>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Ruler className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-bold">القياسات</h3>
            </div>
            {(order.measurements ?? []).length > 0 ? (
              <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="text-center font-bold text-xs">المقياس</TableHead>
                      <TableHead className="text-center font-bold text-xs">القيمة</TableHead>
                      <TableHead className="text-center font-bold text-xs">الوحدة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(order.measurements ?? []).map((m) => (
                      <TableRow key={m.id}>
                        <TableCell className="text-center font-medium">{m.label}</TableCell>
                        <TableCell className="text-center">{m.value}</TableCell>
                        <TableCell className="text-center text-muted-foreground">{m.unit}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground" style={{ borderColor: "var(--color-border)" }}>
                <p className="mb-3">لم تُسجَّل قياسات بعد.</p>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/tailoring/orders/${order.id}/measurements`}>إضافة القياسات</Link>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
