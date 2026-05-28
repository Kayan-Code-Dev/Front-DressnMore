import { useEffect, useState } from "react";
import { getDashboardMock } from "@/features/dashboard/services/dashboard.mock.service";
import type { DashboardSummary } from "@/features/dashboard/types/dashboard.types";
import { KpiCard } from "@/features/dashboard/components/kpi-card";
import { TableSkeleton } from "@/shared/components/loading/table-skeleton";

export function DashboardPage() {
  const [state, setState] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    getDashboardMock().then((response) => setState(response.data));
  }, []);

  if (!state) {
    return <TableSkeleton rows={4} columns={4} />;
  }

  return (
    <section className="dashboard-page">
      <div className="page-title">
        <h2>Dashboard</h2>
        <p>Visual foundation uses mock widgets only.</p>
      </div>

      <div className="kpi-grid">
        {state.kpis.map((kpi) => (
          <KpiCard key={kpi.key} label={kpi.label} value={kpi.value} trend={kpi.trend} />
        ))}
      </div>

      <div className="insight-grid">
        {state.cards.map((card) => (
          <article className="insight-card" key={card.title}>
            <h3>{card.title}</h3>
            <strong>{card.value}</strong>
            <p>{card.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
