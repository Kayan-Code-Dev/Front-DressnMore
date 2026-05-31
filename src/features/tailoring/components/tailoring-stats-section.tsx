import type { TailoringOrderStats } from "@/features/tailoring/types/tailoring.types";
import { KANBAN_STAGES } from "@/features/tailoring/constants/tailoring.constants";
import { formatNumber } from "@/shared/lib/format/numbers";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Scissors,
  Gift,
  AlarmClock,
  CircleCheck,
  Coins,
  PieChart,
  AlertTriangle,
} from "lucide-react";

interface TailoringStatsSectionProps {
  stats: TailoringOrderStats | null;
  loading: boolean;
  urgentOrders: { id: number; client_name: string; garment_name: string; priority: string; days_remaining_label?: string }[];
  readyOrders: { id: number; client_name: string; garment_name: string; total_price: number; whatsapp?: string }[];
}

function StatCard({
  label,
  value,
  sub,
  badge,
  icon: Icon,
  gradient,
  valueColor,
}: {
  label: string;
  value: string | number;
  sub?: string;
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  valueColor?: string;
}) {
  return (
    <Card className="border-0 shadow-sm overflow-hidden">
      <CardContent className="pt-5 pb-4 px-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground mb-1.5">{label}</p>
            <p className="text-2xl font-black leading-none" style={{ color: valueColor ?? "var(--color-text-primary)" }}>
              {value}
            </p>
            {sub && <p className="text-xs text-muted-foreground mt-2">{sub}</p>}
            {badge && (
              <Badge variant="outline" className="mt-2 text-[10px] font-bold border-0" style={{ background: gradient, color: "#fff" }}>
                {badge}
              </Badge>
            )}
          </div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: gradient }}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function TailoringStatsSection({ stats, loading, urgentOrders, readyOrders }: TailoringStatsSectionProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}><CardContent className="pt-5"><Skeleton className="h-20 w-full" /></CardContent></Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-36 w-full" />
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const collectedPct = stats.revenue > 0 ? Math.round((stats.collected / stats.revenue) * 100) : 0;
  const distTotal = Math.max(1, stats.total);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="قيد التنفيذ"
          value={stats.in_progress}
          sub={`من أصل ${stats.total} أمر`}
          badge={stats.vip_count > 0 ? `VIP ${stats.vip_count}` : undefined}
          icon={Scissors}
          gradient="linear-gradient(135deg, #2563EB, #60A5FA)"
        />
        <StatCard
          label="جاهز للتسليم"
          value={stats.ready}
          sub="تنتظر استلام العميلة"
          badge={stats.ready > 0 ? `${stats.ready} هذا الأسبوع` : undefined}
          icon={Gift}
          gradient="linear-gradient(135deg, #EA580C, #FB923C)"
          valueColor="#EA580C"
        />
        <StatCard
          label="متأخرة"
          value={stats.overdue}
          sub="تحتاج متابعة عاجلة"
          badge={stats.overdue > 0 ? "تنبيه" : undefined}
          icon={AlarmClock}
          gradient="linear-gradient(135deg, #DC2626, #F87171)"
          valueColor="#DC2626"
        />
        <StatCard
          label="منجزة"
          value={stats.completed}
          sub="أوامر مكتملة"
          icon={CircleCheck}
          gradient="linear-gradient(135deg, #059669, #34D399)"
          valueColor="#059669"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #CA8A04, #FACC15)" }}>
                  <Coins className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold">الإيرادات الإجمالية</p>
                  <p className="text-xl font-black">{formatNumber(stats.revenue)} ج.م</p>
                </div>
              </div>
              <span className="text-sm font-bold text-green-600">{collectedPct}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden mb-3">
              <div className="h-full rounded-full bg-green-500 transition-all" style={{ width: `${collectedPct}%` }} />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-green-600 font-medium">محصل: {formatNumber(stats.collected)} ج.م</span>
              <span className="text-red-500 font-medium">متبقي: {formatNumber(stats.remaining)} ج.م</span>
            </div>
            {stats.unpaid_count > 0 && (
              <div className="flex items-center gap-1.5 mt-3 text-xs text-amber-600">
                <AlertTriangle className="w-3.5 h-3.5" />
                {stats.unpaid_count} غير مدفوع
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #2563EB, #60A5FA)" }}>
                <PieChart className="w-4 h-4 text-white" />
              </div>
              <p className="text-sm font-bold">توزيع الأوامر</p>
            </div>
            <div className="flex h-3 rounded-full overflow-hidden mb-3">
              {[
                { key: "active", color: "#3B82F6", count: stats.in_progress },
                { key: "completed", color: "#22C55E", count: stats.completed },
                { key: "ready", color: "#F97316", count: stats.ready },
                { key: "overdue", color: "#EF4444", count: stats.overdue },
              ].map((seg) => (
                <div key={seg.key} style={{ width: `${(seg.count / distTotal) * 100}%`, background: seg.color, minWidth: seg.count > 0 ? 8 : 0 }} />
              ))}
            </div>
            <div className="flex flex-wrap gap-3 text-xs">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" />نشط ({stats.in_progress})</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" />منجز ({stats.completed})</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500" />جاهز ({stats.ready})</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" />متأخر ({stats.overdue})</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-0 shadow-sm overflow-hidden" style={{ background: "linear-gradient(180deg, #FFF1F2 0%, #FFFFFF 40%)" }}>
          <CardContent className="pt-4 pb-3 px-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold flex items-center gap-2">
                <AlarmClock className="w-4 h-4 text-red-500" />
                تحتاج متابعة عاجلة
              </p>
              <Badge variant="destructive" className="rounded-full px-2">{urgentOrders.length}</Badge>
            </div>
            <div className="space-y-2">
              {urgentOrders.length === 0 ? (
                <p className="text-xs text-muted-foreground py-2">لا توجد أوامر عاجلة</p>
              ) : (
                urgentOrders.map((o) => (
                  <div key={o.id} className="flex items-center justify-between gap-2 rounded-lg bg-white/80 px-3 py-2 text-sm border border-red-100">
                    <div className="flex items-center gap-2 min-w-0">
                      {o.priority === "VIP" && <Badge className="text-[10px] bg-amber-100 text-amber-700 border-0 shrink-0">VIP</Badge>}
                      <span className="truncate font-medium">{o.client_name} — {o.garment_name}</span>
                    </div>
                    <span className="text-xs text-red-500 font-bold shrink-0">{o.days_remaining_label ?? "عاجل"}</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm overflow-hidden" style={{ background: "linear-gradient(180deg, #FFF7ED 0%, #FFFFFF 40%)" }}>
          <CardContent className="pt-4 pb-3 px-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold flex items-center gap-2">
                <Gift className="w-4 h-4 text-orange-500" />
                جاهزة للتسليم
              </p>
              <Badge className="rounded-full px-2 bg-orange-100 text-orange-700 border-0">{readyOrders.length}</Badge>
            </div>
            <div className="space-y-2">
              {readyOrders.length === 0 ? (
                <p className="text-xs text-muted-foreground py-2">لا توجد أوامر جاهزة</p>
              ) : (
                readyOrders.map((o) => (
                  <div key={o.id} className="flex items-center justify-between gap-2 rounded-lg bg-white/80 px-3 py-2 text-sm border border-orange-100">
                    <span className="truncate font-medium">{o.client_name} — {o.garment_name}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-bold text-green-600">{formatNumber(o.total_price)} ج.م</span>
                      {o.whatsapp && (
                        <a href={`https://wa.me/${o.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs">W</a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export { KANBAN_STAGES };
