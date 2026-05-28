import { useEffect, useState } from "react";
import { DataTable, type DataTableColumn } from "@/shared/components/data-table/data-table";
import { SearchFiltersBar } from "@/shared/components/filters/search-filters-bar";
import { Button } from "@/shared/ui/button";
import type { SalesReportSummary } from "@/features/reports/types/reports.types";
import { getSalesReportMock } from "@/features/reports/services/reports.mock.service";

type SalesPlaceholderRow = {
  metric: string;
  value: string;
};

export function SalesReportsPage() {
  const [summary, setSummary] = useState<SalesReportSummary | null>(null);

  useEffect(() => {
    getSalesReportMock().then((response) => setSummary(response.data));
  }, []);

  const rows: SalesPlaceholderRow[] = summary
    ? [
        { metric: "Total Sales", value: summary.total_sales.toLocaleString() },
        { metric: "Invoices Count", value: String(summary.invoices_count) },
        { metric: "Average Invoice Value", value: summary.average_invoice_value.toLocaleString() },
      ]
    : [];

  const columns: DataTableColumn<SalesPlaceholderRow>[] = [
    { key: "metric", title: "Metric" },
    { key: "value", title: "Value" },
  ];

  return (
    <section>
      <div className="page-title">
        <h2>Sales Reports</h2>
        <p>Mock sales reports with filters and placeholder summary table.</p>
      </div>

      <SearchFiltersBar
        search={""}
        onSearchChange={() => {}}
        searchPlaceholder="Search sales report"
        rightSlot={
          <>
            <Button variant="secondary" disabled>Date From</Button>
            <Button variant="secondary" disabled>Date To</Button>
            <Button variant="secondary" disabled>Branch</Button>
            <Button variant="secondary" disabled>Employee</Button>
          </>
        }
      />

      <div className="insight-grid">
        <article className="insight-card"><h3>Total Sales</h3><strong>{summary?.total_sales.toLocaleString() ?? "..."}</strong></article>
        <article className="insight-card"><h3>Invoices</h3><strong>{summary?.invoices_count ?? "..."}</strong></article>
        <article className="insight-card"><h3>Average Invoice</h3><strong>{summary?.average_invoice_value.toLocaleString() ?? "..."}</strong></article>
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        loading={summary === null}
        emptyTitle="No report data"
        emptyDescription="Sales report data is not available."
        rowKey={(row) => row.metric}
      />
    </section>
  );
}
