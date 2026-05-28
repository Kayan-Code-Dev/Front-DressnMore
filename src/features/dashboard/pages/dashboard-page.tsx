import { useEffect, useState } from "react";
import { getDashboardMock } from "@/features/dashboard/services/dashboard.mock.service";
import type { DashboardSummary } from "@/features/dashboard/types/dashboard.types";
import {
  DashboardHeader,
  DashboardKpis,
  DashboardSalesAndFinancial,
  DashboardDistributions,
  DashboardFooter,
  DashboardSkeleton,
  DashboardError,
} from "@/features/dashboard/components";

export function DashboardPage() {
  const [state, setState] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getDashboardMock()
      .then((response) => {
        if (!cancelled) {
          setState(response.data);
          setError(null);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : "خطأ غير معروف";
          setError(msg);
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return <DashboardError message={error} />;
  }

  return (
    <div className="space-y-4 fade-in">
      <DashboardHeader
        periodLabel="هذا الشهر"
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters((p) => !p)}
      />

      <DashboardKpis
        data={{
          totalRevenue: state?.kpiData?.totalRevenue ?? 128400,
          orderCount: state?.kpiData?.orderCount ?? 1248,
          totalPayments: state?.kpiData?.totalPayments ?? 96500,
          activeClients: state?.kpiData?.activeClients ?? 436,
          totalClients: state?.kpiData?.totalClients ?? 580,
          clientGrowthRate: state?.kpiData?.clientGrowthRate ?? 3.7,
          availableItems: state?.kpiData?.availableItems ?? 312,
          utilizationRate: state?.kpiData?.utilizationRate ?? 35.7,
          profit: state?.financialData?.profit ?? 86100,
          profitMargin: state?.financialData?.profitMargin ?? 67.1,
        }}
      />

      <DashboardSalesAndFinancial
        financial={{
          totalIncome: state?.financialData?.totalIncome ?? 128400,
          totalExpenses: state?.financialData?.totalExpenses ?? 42300,
          profit: state?.financialData?.profit ?? 86100,
          profitMargin: state?.financialData?.profitMargin ?? 67.1,
        }}
      />

      <DashboardDistributions />

      <DashboardFooter />
    </div>
  );
}
