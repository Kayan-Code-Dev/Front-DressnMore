import { useEffect, useMemo, useState } from "react";
import { isModuleLive } from "@/config/feature-flags";
import { getDashboardMock } from "@/features/dashboard/services/dashboard.mock.service";
import { getDashboardOverview } from "@/features/dashboard/services/dashboard.api.service";
import type { DashboardFilterParams, DashboardSummary } from "@/features/dashboard/types/dashboard.types";
import {
  DashboardHeader,
  DashboardKpis,
  DashboardSalesAndFinancial,
  DashboardDistributions,
  DashboardFooter,
  DashboardSkeleton,
  DashboardError,
  DashboardFilters,
} from "@/features/dashboard/components";

const periodLabels: Record<string, string> = {
  today: "اليوم",
  week: "هذا الأسبوع",
  month: "هذا الشهر",
  last_month: "الشهر الماضي",
  year: "هذه السنة",
};

function fetchDashboard(filters: DashboardFilterParams) {
  if (isModuleLive("dashboard")) {
    return getDashboardOverview(filters);
  }
  return getDashboardMock(filters);
}

export function DashboardPage() {
  const [state, setState] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<DashboardFilterParams>({ period: "month" });

  useEffect(() => {
    let cancelled = false;

    fetchDashboard(filters)
      .then((response) => {
        if (!cancelled) {
          setState(response.data);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : "خطأ غير معروف";
          setError(msg);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [filters]);

  const periodLabel = useMemo(
    () => periodLabels[filters.period ?? "month"] ?? "هذا الشهر",
    [filters.period],
  );

  if (loading && !state) {
    return <DashboardSkeleton />;
  }

  if (error && !state) {
    return <DashboardError message={error} />;
  }

  const kpi = state?.kpiData;
  const financial = state?.financialData;

  return (
    <div className="space-y-4 fade-in">
      <DashboardHeader
        periodLabel={periodLabel}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters((p) => !p)}
      />

      {showFilters && (
        <DashboardFilters filters={filters} onChange={setFilters} />
      )}

      <DashboardKpis
        data={{
          totalRevenue: kpi?.totalRevenue ?? 0,
          orderCount: kpi?.orderCount ?? 0,
          totalPayments: kpi?.totalPayments ?? 0,
          activeClients: kpi?.activeClients ?? kpi?.totalClients ?? 0,
          totalClients: kpi?.totalClients ?? 0,
          clientGrowthRate: kpi?.clientGrowthRate ?? 0,
          availableItems: kpi?.availableItems ?? 0,
          utilizationRate: kpi?.utilizationRate ?? 0,
          profit: financial?.profit ?? 0,
          profitMargin: financial?.profitMargin ?? 0,
        }}
      />

      <DashboardSalesAndFinancial
        financial={{
          totalIncome: financial?.totalIncome ?? 0,
          totalExpenses: financial?.totalExpenses ?? 0,
          profit: financial?.profit ?? 0,
          profitMargin: financial?.profitMargin ?? 0,
          totalCashboxBalance: financial?.totalCashboxBalance,
        }}
        growthRates={state?.growthRates}
        salesByStatus={state?.salesByStatus}
      />

      <DashboardDistributions orders={state?.recentOrders ?? []} />

      <DashboardFooter />
    </div>
  );
}
