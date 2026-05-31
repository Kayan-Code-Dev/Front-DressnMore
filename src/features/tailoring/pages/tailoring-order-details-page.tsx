import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { isModuleLive } from "@/config/feature-flags";
import { getTailoringOrder } from "@/features/tailoring/services/tailoring.api.service";
import { getTailoringOrderMock } from "@/features/tailoring/services/tailoring.mock.service";
import type { TailoringOrder } from "@/features/tailoring/types/tailoring.types";
import { TailoringStageTracker } from "@/features/tailoring/components/tailoring-stage-tracker";
import {
  priorityMap,
  statusMap,
  paymentStatusMap,
  nextStage,
  TAILORING_STAGES,
} from "@/features/tailoring/constants/tailoring.constants";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNumber } from "@/shared/lib/format/numbers";
import { cn } from "@/shared/utils/cn";
import {
  ArrowRight,
  Printer,
  MessageCircle,
  Banknote,
  Ban,
  ArrowLeft,
  Scissors,
  Calendar,
  ShoppingBag,
  Info,
  Phone,
  MapPin,
  Ruler,
  FileText,
  ArrowUpRight,
} from "lucide-react";

type DetailTab = "progress" | "measurements" | "payments";

export function TailoringOrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<TailoringOrder | null>(null);
  const [tab, setTab] = useState<DetailTab>("progress");

  useEffect(() => {
    const orderId = Number(id);
    if (!Number.isFinite(orderId)) { setLoading(false); return; }

    const loadOrder = isModuleLive("tailoring")
      ? () => getTailoringOrder(orderId).then((data) => ({ data }))
      : () => getTailoringOrderMock(orderId);

    loadOrder()
      .then((res) => setOrder(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="w-full space-y-4" dir="rtl">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="w-full py-12 text-center" dir="rtl">
        <p className="text-muted-foreground mb-4">لم يتم العثور على أمر التفصيل.</p>
        <Button variant="outline" asChild><Link to="/tailoring/orders">العودة لقسم التفصيل</Link></Button>
      </div>
    );
  }

  const statusCfg = statusMap[order.status];
  const priorityCfg = priorityMap[order.priority];
  const paymentCfg = paymentStatusMap[order.payment_status];
  const customer = order.customer;
  const next = nextStage(order.current_stage);
  const nextLabel = TAILORING_STAGES.find((s) => s.key === next)?.label;
  const completedStages = order.stages_completed ?? 1;
  const remainingStages = (order.stages_total ?? 8) - completedStages;

  return (
    <div className="w-full space-y-5" dir="rtl">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link to="/tailoring/orders" className="hover:text-blue-600">قسم التفصيل</Link>
        <span>/</span>
        <span>{order.garment_name} — #{order.order_number}</span>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Button variant="ghost" size="icon" asChild className="shrink-0 mt-1">
            <Link to="/tailoring/orders"><ArrowRight className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="text-xl font-black">{order.garment_name} #{order.order_number}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
              <Badge variant={priorityCfg.variant}>{priorityCfg.label}</Badge>
              <Badge variant={paymentCfg.variant}>{paymentCfg.label}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              طلب {order.order_date} • {order.branch_name} • خياطة: {order.tailor_name ?? order.employee_name}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button disabled style={{ background: "#1E293B" }} className="text-white border-0">
            <ArrowUpRight className="h-4 w-4 ml-1.5" />تحديث المرحلة
          </Button>
          <Button disabled variant="outline" className="text-green-700 border-green-200 bg-green-50">
            <Banknote className="h-4 w-4 ml-1.5" />تسجيل دفعة
          </Button>
          {customer?.whatsapp && (
            <Button variant="outline" className="text-green-600 border-green-200" asChild>
              <a href={`https://wa.me/${customer.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
                <MessageCircle className="h-4 w-4 ml-1.5" />واتساب
              </a>
            </Button>
          )}
          <Button variant="outline" disabled><Printer className="h-4 w-4 ml-1.5" />طباعة</Button>
          <Button variant="outline" disabled className="text-red-600 border-red-200"><Ban className="h-4 w-4 ml-1.5" />إلغاء الأمر</Button>
        </div>
      </div>

      <TailoringStageTracker order={order} />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Right column — customer */}
        <div className="xl:col-span-3 space-y-4 order-3 xl:order-1">
          <Card className="border-0 shadow-sm">
            <CardContent className="pt-5 text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-black text-white" style={{ background: "linear-gradient(135deg, #EC4899, #F472B6)" }}>
                {order.client_name.charAt(0)}
              </div>
              <h3 className="font-bold">{customer?.name ?? order.client_name}</h3>
              {customer?.tag && <Badge className="mt-2 bg-pink-100 text-pink-700 border-0">{customer.tag}</Badge>}
              <div className="mt-4 space-y-2.5 text-sm text-right">
                {customer?.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground"><Phone className="w-4 h-4 shrink-0" /><span dir="ltr">{customer.phone}</span></div>
                )}
                {customer?.whatsapp && (
                  <div className="flex items-center gap-2 text-green-600"><MessageCircle className="w-4 h-4 shrink-0" /><span dir="ltr">{customer.whatsapp}</span></div>
                )}
                {customer?.district && (
                  <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="w-4 h-4 shrink-0" />{customer.district}</div>
                )}
                {customer?.neighborhood && (
                  <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="w-4 h-4 shrink-0" />{customer.neighborhood}</div>
                )}
                {customer?.address && (
                  <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="w-4 h-4 shrink-0" />{customer.address}</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="pt-5">
              <div className="flex items-center gap-2 mb-4"><Calendar className="w-4 h-4 text-blue-500" /><h3 className="font-bold text-sm">التواريخ</h3></div>
              <dl className="space-y-2.5 text-sm">
                {[["تاريخ الطلب", order.order_date], ["موعد التسليم", order.due_date], ["تاريخ المناسبة", order.occasion_date]].map(([label, val]) => (
                  <div key={label} className="flex justify-between gap-2 py-1.5 border-b last:border-0" style={{ borderColor: "var(--color-border)" }}>
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="font-medium">{val ?? "—"}</dd>
                  </div>
                ))}
                {order.days_remaining_label && (
                  <div className="flex justify-between gap-2 py-2 px-3 rounded-lg bg-green-50 mt-2">
                    <dt className="text-green-700 font-medium">الوقت المتبقي</dt>
                    <dd className="font-black text-green-700">{order.days_remaining_label}</dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="pt-5">
              <div className="flex items-center gap-2 mb-4"><ShoppingBag className="w-4 h-4 text-amber-500" /><h3 className="font-bold text-sm">القماش</h3></div>
              <dl className="space-y-2 text-sm">
                {[["نوع الثوب", order.garment_name], ["نوع القماش", order.fabric_type ?? order.fabric_name], ["اللون", order.fabric_color], ["الكمية", order.fabric_quantity], ["المورد", order.fabric_supplier]].map(([label, val]) => (
                  val ? (
                    <div key={label} className="flex justify-between gap-2 py-1.5 border-b last:border-0" style={{ borderColor: "var(--color-border)" }}>
                      <dt className="text-muted-foreground">{label}</dt>
                      <dd className="font-medium text-left">{val}</dd>
                    </div>
                  ) : null
                ))}
              </dl>
              {order.design_description && (
                <div className="mt-4 pt-3 border-t" style={{ borderColor: "var(--color-border)" }}>
                  <p className="text-xs font-bold mb-1">التصميم</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{order.design_description}</p>
                  {order.design_style && <p className="text-xs text-blue-600 mt-1">الأسلوب: {order.design_style}</p>}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Center — tabs */}
        <div className="xl:col-span-5 space-y-4 order-2">
          <Card className="border-0 shadow-sm">
            <CardContent className="pt-4">
              <div className="flex border-b mb-4" style={{ borderColor: "var(--color-border)" }}>
                {([
                  { key: "progress", label: "سجل التقدم", icon: FileText },
                  { key: "measurements", label: "القياسات", icon: Ruler },
                  { key: "payments", label: "الدفعات", icon: Banknote },
                ] as const).map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTab(key)}
                    className={cn(
                      "flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors",
                      tab === key ? "border-blue-500 text-blue-600" : "border-transparent text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Icon className="w-4 h-4" />{label}
                  </button>
                ))}
              </div>

              {tab === "progress" && (
                <div className="space-y-4">
                  <p className="text-sm font-bold">{completedStages} مراحل مكتملة</p>
                  <div className="space-y-3">
                    {(order.progress_log ?? []).map((entry) => (
                      <div key={entry.id} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="text-xs">{entry.stage_label}</Badge>
                            <span className="text-xs text-muted-foreground">{entry.date}</span>
                          </div>
                          <p className="text-sm mt-1">بواسطة: {entry.by}</p>
                        </div>
                      </div>
                    ))}
                    {remainingStages > 0 && (
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <div className="w-8 h-8 rounded-full border-2 border-dashed flex items-center justify-center shrink-0" />
                        <p className="text-sm">{remainingStages} مرحلة متبقية</p>
                      </div>
                    )}
                  </div>
                  {nextLabel && (
                    <Button disabled className="w-full mt-4" style={{ background: "#1E293B" }}>
                      <ArrowLeft className="h-4 w-4 ml-2" />الانتقال إلى: {nextLabel}
                    </Button>
                  )}
                </div>
              )}

              {tab === "measurements" && (
                <div>
                  {(order.measurements ?? []).length > 0 ? (
                    <>
                      <div className="rounded-lg border overflow-hidden mb-3" style={{ borderColor: "var(--color-border)" }}>
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-muted/30">
                              <TableHead className="text-center text-xs font-bold">المقياس</TableHead>
                              <TableHead className="text-center text-xs font-bold">القيمة</TableHead>
                              <TableHead className="text-center text-xs font-bold">الوحدة</TableHead>
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
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/tailoring/orders/${order.id}/edit-measurements`}>تعديل القياسات</Link>
                      </Button>
                    </>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Ruler className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      <p className="mb-3">لم تُسجَّل قياسات بعد</p>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/tailoring/orders/${order.id}/edit-measurements`}>إضافة القياسات</Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {tab === "payments" && (
                <div className="text-center py-8 text-muted-foreground">
                  <Banknote className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p>{order.payments_count ?? 0} دفعة مسجّلة</p>
                  <p className="text-sm mt-2">المحصّل: <span className="font-bold text-green-600">{formatNumber(order.paid)} ج.م</span></p>
                  <p className="text-sm">المتبقي: <span className="font-bold text-red-500">{formatNumber(order.remaining)} ج.م</span></p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Left column — summary */}
        <div className="xl:col-span-4 space-y-4 order-1 xl:order-3">
          <Card className="border-0 shadow-sm text-white overflow-hidden" style={{ background: "linear-gradient(160deg, #1E293B 0%, #0F172A 100%)" }}>
            <CardContent className="pt-5">
              <div className="flex items-center gap-2 mb-4"><Scissors className="w-4 h-4" /><h3 className="font-bold">ملخص الأمر</h3></div>
              <dl className="space-y-2.5 text-sm">
                {[["العميلة", order.client_name], ["الثوب", order.garment_name], ["الخياطة", order.tailor_name ?? order.employee_name], ["موعد التسليم", order.due_date?.slice(5).replace("-", "/")]].map(([label, val]) => (
                  <div key={label} className="flex justify-between gap-2">
                    <dt className="text-white/60">{label}</dt>
                    <dd className={label === "موعد التسليم" ? "font-bold text-green-400" : "font-medium"}>{val}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-5 pt-4 border-t border-white/10">
                <p className="text-xs text-white/60 mb-1">السعر الإجمالي</p>
                <p className="text-3xl font-black">{formatNumber(order.total_price)} ج.م</p>
                {order.remaining > 0 && (
                  <div className="mt-3 rounded-lg px-3 py-2 text-sm" style={{ background: "rgba(127,29,29,0.5)" }}>
                    <p className="text-white/70 text-xs">متبقي للتحصيل</p>
                    <p className="font-black">{formatNumber(order.remaining)} ج.م</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="pt-5">
              <div className="flex items-center gap-2 mb-4"><Info className="w-4 h-4 text-blue-500" /><h3 className="font-bold text-sm">معلومات إضافية</h3></div>
              <dl className="space-y-2 text-sm">
                {[["الفرع", order.branch_name], ["الخياطة", order.tailor_name ?? order.employee_name], ["الدفعات", `${order.payments_count ?? 0} دفعة`], ["مراحل منجزة", `${completedStages} / ${order.stages_total ?? 8}`]].map(([label, val]) => (
                  <div key={label} className="flex justify-between gap-2 py-1.5 border-b last:border-0" style={{ borderColor: "var(--color-border)" }}>
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="font-medium">{val ?? "—"}</dd>
                  </div>
                ))}
                <div className="flex justify-between gap-2 py-1.5">
                  <dt className="text-muted-foreground">الأولوية</dt>
                  <dd><Badge variant={priorityCfg.variant}>{priorityCfg.label}</Badge></dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
