import type { StatementSummary } from "@/features/cashboxes/types/statement.types";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber } from "@/shared/lib/format/numbers";
import {
  ArrowDownCircle,
  Flag,
  Moon,
  PlusCircle,
  RefreshCw,
  Vault,
  Wallet,
  BarChart3,
} from "lucide-react";

interface StatementStatsCardsProps {
  summary: StatementSummary | null;
  loading?: boolean;
}

function formatShortDate(value: string | null) {
  if (!value) return "—";
  const [y, m, d] = value.split("-");
  return `${d}-${m}-${y}`;
}

export function StatementStatsCards({ summary, loading }: StatementStatsCardsProps) {
  if (loading || !summary) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="border-0 shadow-sm">
            <CardContent className="pt-4 pb-3">
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: "الرصيد الافتتاحي",
      value: formatNumber(summary.opening_balance),
      sub: "بداية الفترة",
      icon: Flag,
      bg: "bg-amber-50",
      color: "text-amber-700",
      iconBg: "bg-amber-100 text-amber-600",
    },
    {
      label: "إجمالي الإيرادات",
      value: `+${formatNumber(summary.total_revenues)}`,
      sub: `آخر حركة: ${formatShortDate(summary.last_income_date)}`,
      icon: PlusCircle,
      bg: "bg-emerald-50",
      color: "text-emerald-700",
      iconBg: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "إجمالي المصاريف",
      value: `-${formatNumber(summary.total_expenses)}`,
      sub: `آخر حركة: ${formatShortDate(summary.last_expense_date)}`,
      icon: ArrowDownCircle,
      bg: "bg-red-50",
      color: "text-red-600",
      iconBg: "bg-red-100 text-red-500",
    },
    {
      label: "الرصيد الحالي",
      value: formatNumber(summary.current_balance),
      sub: "افتتاحي + إيرادات - مصاريف",
      icon: Wallet,
      bg: "bg-pink-50",
      color: summary.current_balance < 0 ? "text-red-600" : "text-pink-700",
      iconBg: "bg-pink-100 text-pink-600",
    },
    {
      label: "الإجمالي المتاح بالخزنة",
      value: formatNumber(summary.available_in_cashbox),
      sub: "الرصيد القابل للصرف",
      icon: Vault,
      bg: "bg-teal-50",
      color: "text-teal-700",
      iconBg: "bg-teal-100 text-teal-600",
    },
    {
      label: "رصيد إقفال اليوم",
      value: formatNumber(summary.closing_balance),
      sub: "يُرحّل تلقائياً لليوم التالي",
      icon: Moon,
      bg: "bg-violet-50",
      color: summary.closing_balance < 0 ? "text-red-600" : "text-violet-700",
      iconBg: "bg-violet-100 text-violet-600",
      badge: "ترحيل",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-blue-600" />
          <p className="font-bold text-sm">ملخص أرصدة جميع الفروع</p>
        </div>
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <RefreshCw className="h-3 w-3" />
          تحديث تلقائي
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label} className={`border-0 shadow-sm ${card.bg} relative overflow-hidden`}>
              {"badge" in card && card.badge ? (
                <span className="absolute top-2 left-2 text-[9px] font-bold bg-violet-200 text-violet-700 px-1.5 py-0.5 rounded">
                  {card.badge}
                </span>
              ) : null}
              <CardContent className="pt-4 pb-3 px-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[11px] text-muted-foreground mb-1">{card.label}</p>
                    <p className={`text-lg font-black leading-tight ${card.color}`}>{card.value} ج.م</p>
                    <p className="text-[10px] text-muted-foreground mt-1.5">{card.sub}</p>
                  </div>
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${card.iconBg}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
