import { useEffect, useMemo, useState } from "react";
import { SearchFiltersBar } from "@/shared/components/filters/search-filters-bar";
import { DataTable, type DataTableColumn } from "@/shared/components/data-table/data-table";
import { Button } from "@/shared/ui/button";
import type { OverdueReturnItem } from "@/features/returns/types/returns.types";
import { listOverdueReturnsMock } from "@/features/returns/services/returns.mock.service";

export function OverdueReturnsPage() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<OverdueReturnItem[]>([]);

  const handleSearchChange = (value: string) => {
    setLoading(true);
    setSearch(value);
  };

  useEffect(() => {
    listOverdueReturnsMock(search)
      .then((response) => setRows(response.data))
      .finally(() => setLoading(false));
  }, [search]);

  const columns = useMemo<DataTableColumn<OverdueReturnItem>[]>(
    () => [
      { key: "customer", title: "Customer" },
      { key: "invoice_number", title: "Invoice #" },
      { key: "item", title: "Dress/Item" },
      { key: "delivery_date", title: "Delivery Date" },
      { key: "expected_return_date", title: "Expected Return" },
      { key: "overdue_days", title: "Overdue Days" },
      { key: "amount", title: "Amount", render: (item) => item.amount.toLocaleString() },
      {
        key: "status",
        title: "Status",
        render: (item) => <span className={`pill pill-${item.status}`}>{item.status}</span>,
      },
      {
        key: "actions",
        title: "Actions",
        render: () => (
          <div className="row-actions">
            <Button variant="secondary" disabled>Contact Customer</Button>
            <Button variant="secondary" disabled>Mark Returned</Button>
            <Button variant="secondary" disabled>View Invoice</Button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <section>
      <div className="page-title">
        <h2>Overdue Returns</h2>
        <p>Overdue list foundation with mock-only actions.</p>
      </div>

      <SearchFiltersBar
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search overdue returns"
        rightSlot={
          <>
            <Button variant="secondary" disabled>Customer</Button>
            <Button variant="secondary" disabled>Date Range</Button>
            <Button variant="secondary" disabled>Overdue Days</Button>
          </>
        }
      />

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        emptyTitle="No overdue returns"
        emptyDescription="No overdue records for current filters."
        rowKey={(row) => String(row.id)}
      />
    </section>
  );
}
