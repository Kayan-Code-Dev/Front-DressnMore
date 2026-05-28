import {
  DollarSign,
  FileText,
  CreditCard,
  UserPlus,
  Tag,
  TrendingUp,
} from "lucide-react";
import type { ReactNode } from "react";
import { fmtAr } from "../utils/dashboard.utils";

type DashboardKpisData = {
  totalRevenue?: number;
  orderCount?: number;
  totalPayments?: number;
  activeClients?: number;
  totalClients?: number;
  clientGrowthRate?: number;
  availableItems?: number;
  utilizationRate?: number;
  profit?: number;
  profitMargin?: number;
};

type DashboardKpisProps = {
  data: DashboardKpisData;
};

type CardDef = {
  label: string;
  value: number;
  suffix: string;
  rate: number;
  icon: ReactNode;
  accent: string;
  accentBg: string;
  gradient: string;
  showRate: boolean;
  rateIsPct: boolean;
};

function buildCards(d: DashboardKpisData): CardDef[] {
  return [
    {
      label: "إجمالي الإيرادات",
      value: d.totalRevenue ?? 0,
      suffix: "ج.م",
      rate: d.clientGrowthRate ?? 0,
      icon: <DollarSign className="w-[15px] h-[15px] text-white" />,
      accent: "#10B981",
      accentBg: "rgba(16,185,129,0.10)",
      gradient: "linear-gradient(135deg, #10B981, #059669)",
      showRate: true,
      rateIsPct: false,
    },
    {
      label: "إجمالي الطلبات",
      value: d.orderCount ?? 0,
      suffix: "طلب",
      rate: 0,
      icon: <FileText className="w-[15px] h-[15px] text-white" />,
      accent: "#0284C7",
      accentBg: "rgba(2,132,199,0.10)",
      gradient: "linear-gradient(135deg, #0369A1, #0EA5E9)",
      showRate: false,
      rateIsPct: false,
    },
    {
      label: "إجمالي المدفوعات",
      value: d.totalPayments ?? 0,
      suffix: "ج.م",
      rate: 0,
      icon: <CreditCard className="w-[15px] h-[15px] text-white" />,
      accent: "#C2964A",
      accentBg: "rgba(194,150,74,0.10)",
      gradient: "linear-gradient(135deg, #B8862A, #E8BF7A)",
      showRate: false,
      rateIsPct: false,
    },
    {
      label: "العملاء النشطون",
      value: d.activeClients ?? d.totalClients ?? 0,
      suffix: "عميل",
      rate: d.clientGrowthRate ?? 0,
      icon: <UserPlus className="w-[15px] h-[15px] text-white" />,
      accent: "#0D9488",
      accentBg: "rgba(13,148,136,0.10)",
      gradient: "linear-gradient(135deg, #0D9488, #14B8A6)",
      showRate: true,
      rateIsPct: false,
    },
    {
      label: "المنتجات المتاحة",
      value: d.availableItems ?? 0,
      suffix: "قطعة",
      rate: d.utilizationRate ?? 0,
      icon: <Tag className="w-[15px] h-[15px] text-white" />,
      accent: "#0891B2",
      accentBg: "rgba(8,145,178,0.10)",
      gradient: "linear-gradient(135deg, #0891B2, #06B6D4)",
      showRate: true,
      rateIsPct: true,
    },
    {
      label: "صافي الربح",
      value: d.profit ?? 0,
      suffix: "ج.م",
      rate: d.profitMargin ?? 0,
      icon: <TrendingUp className="w-[15px] h-[15px] text-white" />,
      accent: "#7C3AED",
      accentBg: "rgba(124,58,237,0.10)",
      gradient: "linear-gradient(135deg, #7C3AED, #8B5CF6)",
      showRate: true,
      rateIsPct: true,
    },
  ];
}

export function DashboardKpis({ data }: DashboardKpisProps) {
  const items = buildCards(data);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 lg:gap-4">
      {items.map((card) => (
        <div key={card.label} className="kpi-card">
          <div
            className="absolute bottom-0 right-0 left-0 h-[3px] rounded-b-[14px]"
            style={{ background: card.gradient, opacity: 0.8 }}
          />
          <div className="flex items-center justify-between mb-3">
            <div
              className="w-9 h-9 flex items-center justify-center rounded-xl shrink-0"
              style={{ background: card.gradient, boxShadow: `0 3px 10px ${card.accent}30` }}
            >
              {card.icon}
            </div>
            {card.showRate && (card.rate > 0 || card.rateIsPct) && (
              <div
                className="flex items-center gap-0.5 text-[10.5px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: card.accentBg, color: card.accent }}
              >
                <span>{card.rateIsPct ? `${card.rate}%` : `+${card.rate}%`}</span>
              </div>
            )}
          </div>
          <p
            className="text-[19px] font-black leading-none tracking-tight"
            style={{ color: "var(--color-text-primary)" }}
          >
            {fmtAr(card.value)}
          </p>
          {card.suffix && (
            <span className="text-[10px] font-semibold ml-1" style={{ color: "var(--color-text-muted)" }}>
              {card.suffix}
            </span>
          )}
          <p
            className="text-[11.5px] font-semibold mt-1.5 leading-snug"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {card.label}
          </p>
        </div>
      ))}
    </div>
  );
}
