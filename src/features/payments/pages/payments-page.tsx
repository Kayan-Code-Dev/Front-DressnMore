import { useEffect, useMemo, useState } from "react";
import { SearchFiltersBar } from "@/shared/components/filters/search-filters-bar";
import { DataTable, type DataTableColumn } from "@/shared/components/data-table/data-table";
import { Button } from "@/shared/ui/button";
import type { PaymentItem } from "@/features/payments/types/payments.types";
import { listPaymentsMock } from "@/features/payments/services/payments.mock.service";

export function PaymentsPage() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<PaymentItem[]>([]);

  const handleSearchChange = (value: string) => {
    setLoading(true);
    setSearch(value);
  };

  useEffect(() => {
    listPaymentsMock(search)
      .then((response) => setRows(response.data))
      .finally(() => setLoading(false));
  }, [search]);

  const columns = useMemo<DataTableColumn<PaymentItem>[]>(
    () => [
      { key: "customer", title: "Customer" },
      { key: "branch", title: "Branch" },
      { key: "amount", title: "Amount", render: (item) => item.amount.toLocaleString() },
      {
        key: "status",
        title: "Status",
        render: (item) => <span className={`pill pill-${item.status}`}>{item.status}</span>,
      },
      { key: "payment_type", title: "Payment Type" },
      { key: "payment_date", title: "Payment Date" },
      { key: "created_at", title: "Created At" },
      { key: "notes", title: "Notes" },
      {
        key: "actions",
        title: "Actions",
        render: () => (
          <div className="row-actions">
            <Button variant="secondary" disabled>View Details</Button>
            <Button variant="secondary" disabled>Pay</Button>
            <Button variant="secondary" disabled>Cancel</Button>
            <Button variant="secondary" disabled>Export</Button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <section>
      <div className="page-title">
        <h2>Payments</h2>
        <p>Payments list migrated with mock-only filters and action placeholders.</p>
      </div>

      <SearchFiltersBar
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search payments"
        rightSlot={
          <>
            <Button variant="secondary" disabled>Status</Button>
            <Button variant="secondary" disabled>Payment Type</Button>
            <Button variant="secondary" disabled>Branch</Button>
            <Button variant="secondary" disabled>Customer</Button>
            <Button variant="secondary" disabled>Invoice/Order</Button>
            <Button variant="secondary" disabled>Date Range</Button>
            <Button variant="secondary" disabled>Amount Range</Button>
          </>
        }
      />

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        emptyTitle="No payments"
        emptyDescription="No payment matches current filters."
        rowKey={(row) => String(row.id)}
      />
    </section>
  );
}
