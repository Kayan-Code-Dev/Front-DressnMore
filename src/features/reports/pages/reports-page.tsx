import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { ReportsOverview } from "@/features/reports/types/reports.types";
import { getReportsOverviewMock } from "@/features/reports/services/reports.mock.service";

export function ReportsPage() {
  const [data, setData] = useState<ReportsOverview | null>(null);

  useEffect(() => {
    getReportsOverviewMock().then((response) => setData(response.data));
  }, []);

  return (
    <section>
      <div className="page-title">
        <h2>Reports</h2>
        <p>Mock reports landing page with summary blocks.</p>
      </div>

      <div className="insight-grid">
        <article className="insight-card">
          <h3>Sales Summary</h3>
          <strong>{data?.total_sales.toLocaleString() ?? "..."}</strong>
          <p>Invoices: {data?.invoices_count ?? "..."}</p>
        </article>
        <article className="insight-card">
          <h3>Tailoring Summary</h3>
          <strong>{data?.total_revenue.toLocaleString() ?? "..."}</strong>
          <p>Orders: {data?.total_orders ?? "..."}</p>
        </article>
      </div>

      <div className="row-actions">
        <Link className="btn btn-primary" to="/reports/sales">
          Open Sales Report
        </Link>
        <Link className="btn btn-secondary" to="/reports/tailoring">
          Open Tailoring Report
        </Link>
      </div>
    </section>
  );
}
