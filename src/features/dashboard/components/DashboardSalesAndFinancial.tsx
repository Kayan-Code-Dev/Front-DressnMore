import {
  DollarSign,
  Store,
  Key,
  Scissors,
  TrendingUp,
  ArrowDown,
  ArrowUp,
  Scale,
  Landmark,
} from "lucide-react";
import type { DashboardGrowthRates, DashboardSalesByStatus } from "@/features/dashboard/types/dashboard.types";
import { fmtAr } from "../utils/dashboard.utils";
import { DashboardSalesChart } from "./DashboardSalesChart";

type FinancialData = {
  totalIncome?: number;
  totalExpenses?: number;
  profit?: number;
  profitMargin?: number;
  totalCashboxBalance?: number;
};

type DashboardSalesAndFinancialProps = {
  financial: FinancialData;
  growthRates?: DashboardGrowthRates;
  salesByStatus?: DashboardSalesByStatus;
};

export function DashboardSalesAndFinancial({
  financial,
  growthRates,
  salesByStatus,
}: DashboardSalesAndFinancialProps) {
  const totalIncome = financial.totalIncome ?? 0;
  const totalExpenses = financial.totalExpenses ?? 0;
  const balance = financial.totalCashboxBalance ?? totalIncome - totalExpenses;

  const growthItems = [
    { key: "revenue", label: "إجمالي الإيرادات", rate: growthRates?.revenue ?? 0, color: "#10B981", icon: DollarSign },
    { key: "sales", label: "المبيعات المباشرة", rate: growthRates?.sales ?? 0, color: "#C2964A", icon: Store },
    { key: "rental", label: "قسم الإيجار", rate: growthRates?.rental ?? 0, color: "#7C3AED", icon: Key },
    { key: "tailoring", label: "قسم التفصيل", rate: growthRates?.tailoring ?? 0, color: "#0D9488", icon: Scissors },
  ];

  const chartData = salesByStatus ?? { draft: 0, open: 0, paid: 0, cancelled: 0 };

  return (
    <div className="space-y-4">
      <div
        className="rounded-2xl p-4 lg:p-5"
        style={{
          background: "linear-gradient(135deg, #0A1628 0%, #0F1C36 100%)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center gap-2 mb-3.5">
          <div
            className="w-6 h-6 flex items-center justify-center rounded-lg"
            style={{ background: "rgba(16,185,129,0.15)" }}
          >
            <TrendingUp className="w-[13px] h-[13px]" style={{ color: "#10B981" }} />
          </div>
          <span className="text-white text-[12px] font-bold">مقارنة بالفترة السابقة</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {growthItems.map((item) => {
            const Icon = item.icon;
            const prefix = item.rate >= 0 ? "+" : "";
            return (
              <div
                key={item.key}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${item.color}18` }}
                >
                  <Icon className="w-[15px] h-[15px]" style={{ color: item.color }} />
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-black" style={{ color: item.color }}>
                    {prefix}{item.rate}%
                  </p>
                  <p
                    className="text-[11px] font-medium truncate"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    {item.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div
          className="rounded-2xl p-5 border"
          style={{ background: "white", borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center rounded-xl text-white" style={{ background: "#0C2A42" }}>
                <Landmark className="w-4 h-4" />
              </div>
              <h3 className="font-black text-sm" style={{ color: "var(--color-text-primary)" }}>
                الخزنة
              </h3>
            </div>
          </div>

          <div
            className="rounded-xl p-4 mb-4 text-white text-center"
            style={{ background: "linear-gradient(135deg, #0369A1, #0EA5E9)" }}
          >
            <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.70)" }}>
              إجمالي أرصدة الصناديق
            </p>
            <p className="text-3xl font-black">{fmtAr(balance)}</p>
            <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.60)" }}>
              جنيه مصري
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "إجمالي الإيرادات", value: totalIncome, colorClass: "text-emerald-600", bgClass: "bg-emerald-50", Icon: ArrowDown },
              { label: "إجمالي المصاريف", value: totalExpenses, colorClass: "text-red-500", bgClass: "bg-red-50", Icon: ArrowUp },
              { label: "صافي الحركة", value: totalIncome - totalExpenses, colorClass: "text-sky-600", bgClass: "bg-sky-50", Icon: Scale },
            ].map((item) => (
              <div key={item.label} className={`${item.bgClass} rounded-xl p-3 text-center`}>
                <div className="flex items-center justify-center mb-1">
                  <item.Icon className={`w-4 h-4 ${item.colorClass}`} />
                </div>
                <p className={`text-sm font-black ${item.colorClass}`}>{fmtAr(item.value)}</p>
                <p className="text-[10px] mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div
          className="rounded-2xl p-5 border"
          style={{ background: "white", borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }}
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-black text-base" style={{ color: "var(--color-text-primary)" }}>
                الأداء المالي
              </h3>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                المبيعات حسب الحالة
              </p>
            </div>
          </div>

          <DashboardSalesChart data={chartData} />
        </div>
      </div>
    </div>
  );
}
