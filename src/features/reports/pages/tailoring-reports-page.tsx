import { useEffect, useState } from "react";
import { DataTable, type DataTableColumn } from "@/shared/components/data-table/data-table";
import { SearchFiltersBar } from "@/shared/components/filters/search-filters-bar";
import { Button } from "@/shared/ui/button";
import type { TailoringReportSummary } from "@/features/reports/types/reports.types";
import { getTailoringReportMock } from "@/features/reports/services/reports.mock.service";

type TailoringPlaceholderRow = {
  metric: string;
  value: string;
};

export function TailoringReportsPage() {
  const [summary, setSummary] = useState<TailoringReportSummary | null>(null);

  useEffect(() => {
    getTailoringReportMock().then((response) => setSummary(response.data));
  }, []);

  const rows: TailoringPlaceholderRow[] = summary
    ? [
        { metric: "Total Orders", value: String(summary.total_orders) },
        { metric: "Ready Orders", value: String(summary.ready_orders) },
        { metric: "Late Orders", value: String(summary.late_orders) },
        { metric: "In Progress", value: String(summary.in_progress_orders) },
        { metric: "Total Revenue", value: summary.total_revenue.toLocaleString() },
      ]
    : [];

  const columns: DataTableColumn<TailoringPlaceholderRow>[] = [
    { key: "metric", title: "Metric" },
    { key: "value", title: "Value" },
  ];

  return (
    <section>
      <div className="page-title">
        <h2>Tailoring Reports</h2>
        <p>Mock tailoring reports with cards and placeholder table.</p>
      </div>

      <SearchFiltersBar
        search={""}
        onSearchChange={() => {}}
        searchPlaceholder="Search tailoring report"
        rightSlot={
          <>
            <Button variant="secondary" disabled>Date From</Button>
            <Button variant="secondary" disabled>Date To</Button>
            <Button variant="secondary" disabled>Branch</Button>
          </>
        }
      />

      <div className="insight-grid">
        <article className="insight-card"><h3>Total Orders</h3><strong>{summary?.total_orders ?? "..."}</strong></article>
        <article className="insight-card"><h3>Ready Orders</h3><strong>{summary?.ready_orders ?? "..."}</strong></article>
        <article className="insight-card"><h3>Late Orders</h3><strong>{summary?.late_orders ?? "..."}</strong></article>
        <article className="insight-card"><h3>Total Revenue</h3><strong>{summary?.total_revenue.toLocaleString() ?? "..."}</strong></article>
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        loading={summary === null}
        emptyTitle="No report data"
        emptyDescription="Tailoring report data is not available."
        rowKey={(row) => row.metric}
      />
    </section>
  );
}
