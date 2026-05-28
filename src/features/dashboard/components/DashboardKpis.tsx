import {
  Activity,
  BarChart3,
  DollarSign,
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { KpiCard } from "./KpiCard";
import { fmtCur, fmtNum, fmtPct } from "../utils/dashboard.utils";

type DashboardKpisData = {
  orderCount?: number;
  totalRevenue?: number;
  averageOrderValue?: number;
  activeClients?: number;
  totalClients?: number;
  newClients?: number;
  clientGrowthRate?: number;
  availableItems?: number;
  totalItems?: number;
  outOfBranch?: number;
  utilizationRate?: number;
  totalPayments?: number;
  paymentCount?: number;
  totalActivities?: number;
};

type DashboardKpisProps = {
  data: DashboardKpisData;
};

export function DashboardKpis({ data }: DashboardKpisProps) {
  const clientSubtitle = [
    data.totalClients != null && `إجمالي ${fmtNum(data.totalClients)}`,
    data.newClients != null && `جدد ${fmtNum(data.newClients)}`,
  ]
    .filter(Boolean)
    .join(" — ") || undefined;

  return (
    <section className="space-y-5">
      <SectionHeader
        title="مؤشرات الأداء"
        description="نظرة سريعة على المؤشرات الرئيسية للفترة المحددة"
      />
      <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={<ShoppingBag className="h-6 w-6 text-amber-600" aria-hidden />}
          iconBg="bg-amber-500/10"
          borderColor="border-amber-500/60"
          title="إجمالي الطلبات"
          value={fmtNum(data.orderCount)}
          subtitle={
            data.totalRevenue != null
              ? `إيرادات ${fmtCur(data.totalRevenue, "")}`
              : undefined
          }
        />
        <KpiCard
          icon={<DollarSign className="h-6 w-6 text-emerald-600" aria-hidden />}
          iconBg="bg-emerald-500/10"
          borderColor="border-emerald-500/60"
          title="إجمالي الإيرادات"
          value={
            data.totalRevenue != null
              ? `${(data.totalRevenue / 1000).toFixed(1)}K`
              : "0"
          }
          suffix="ج.م"
          subtitle={
            data.averageOrderValue != null
              ? `متوسط الطلب ${fmtCur(data.averageOrderValue, "")}`
              : undefined
          }
        />
        <KpiCard
          icon={<Users className="h-6 w-6 text-violet-600" aria-hidden />}
          iconBg="bg-violet-500/10"
          borderColor="border-violet-500/60"
          title="العملاء النشطون"
          value={fmtNum(data.activeClients)}
          subtitle={clientSubtitle}
          trend={data.clientGrowthRate}
        />
        <KpiCard
          icon={<Package className="h-6 w-6 text-rose-600" aria-hidden />}
          iconBg="bg-rose-500/10"
          borderColor="border-rose-500/60"
          title="المنتجات المتاحة"
          value={fmtNum(data.availableItems)}
          subtitle={
            data.totalItems != null
              ? `إجمالي ${fmtNum(data.totalItems)} — مستأجر ${fmtNum(data.outOfBranch)}`
              : undefined
          }
        />
        <KpiCard
          icon={<Wallet className="h-5 w-5 text-teal-600" aria-hidden />}
          iconBg="bg-teal-500/10"
          borderColor="border-teal-500/60"
          title="إجمالي المدفوعات"
          value={
            data.totalPayments != null
              ? `${(data.totalPayments / 1000).toFixed(1)}K`
              : "0"
          }
          suffix="ج.م"
          subtitle={
            data.paymentCount != null
              ? `${fmtNum(data.paymentCount)} عملية`
              : undefined
          }
        />
        <KpiCard
          icon={<TrendingUp className="h-5 w-5 text-sky-500" aria-hidden />}
          iconBg="bg-sky-500/10"
          borderColor="border-sky-500/60"
          title="متوسط قيمة الطلب"
          value={fmtCur(data.averageOrderValue ?? 0, "")}
          suffix="ج.م"
        />
        <KpiCard
          icon={<Activity className="h-5 w-5 text-orange-600" aria-hidden />}
          iconBg="bg-orange-500/10"
          borderColor="border-orange-500/60"
          title="إجمالي النشاطات"
          value={fmtNum(data.totalActivities)}
        />
        <KpiCard
          icon={<BarChart3 className="h-5 w-5 text-indigo-600" aria-hidden />}
          iconBg="bg-indigo-500/10"
          borderColor="border-indigo-500/60"
          title="معدل استخدام المخزون"
          value={fmtPct(data.utilizationRate)}
        />
      </div>
    </section>
  );
}
