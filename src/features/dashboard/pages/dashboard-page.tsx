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
    return (
      <div className="flex-1 min-h-0 bg-muted/20" dir="rtl">
        <DashboardSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 min-h-0 bg-muted/20" dir="rtl">
        <DashboardError message={error} />
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 bg-muted/20" dir="rtl">
      <DashboardHeader
        periodLabel="هذا الشهر"
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters((p) => !p)}
      />

      <div className="space-y-8 pb-8">
        <DashboardKpis
          data={{
            orderCount: state?.kpiData?.orderCount ?? 1248,
            totalRevenue: state?.kpiData?.totalRevenue ?? 128400,
            averageOrderValue: state?.kpiData?.averageOrderValue ?? 102.9,
            activeClients: state?.kpiData?.activeClients ?? 436,
            totalClients: state?.kpiData?.totalClients ?? 580,
            newClients: state?.kpiData?.newClients ?? 42,
            clientGrowthRate: state?.kpiData?.clientGrowthRate ?? 3.7,
            availableItems: state?.kpiData?.availableItems ?? 312,
            totalItems: state?.kpiData?.totalItems ?? 485,
            outOfBranch: state?.kpiData?.outOfBranch ?? 173,
            utilizationRate: state?.kpiData?.utilizationRate ?? 35.7,
            totalPayments: state?.kpiData?.totalPayments ?? 96500,
            paymentCount: state?.kpiData?.paymentCount ?? 64,
            totalActivities: state?.kpiData?.totalActivities ?? 2847,
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
    </div>
  );
}
