import { useEffect, useMemo, useState } from "react";
import { SearchFiltersBar } from "@/shared/components/filters/search-filters-bar";
import { DataTable, type DataTableColumn } from "@/shared/components/data-table/data-table";
import { Pagination } from "@/shared/components/data-table/pagination";
import { Button } from "@/shared/ui/button";
import { isModuleLive } from "@/config/feature-flags";
import type { PaymentItem } from "@/features/payments/types/payments.types";
import { listPaymentsMock } from "@/features/payments/services/payments.mock.service";
import { listPayments } from "@/features/payments/services/payments.api.service";

function fetchPaymentData(searchTerm: string, currentPage: number) {
  if (isModuleLive("payments")) {
    return listPayments({ search: searchTerm, page: currentPage, per_page: 15 });
  }
  return listPaymentsMock(searchTerm);
}

export function PaymentsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<PaymentItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleSearchChange = (value: string) => {
    setLoading(true);
    setSearch(value);
    setPage(1);
  };

  const handlePageChange = (nextPage: number) => {
    setLoading(true);
    setPage(nextPage);
  };

  useEffect(() => {
    let cancelled = false;

    fetchPaymentData(search, page)
      .then((response) => {
        if (cancelled) return;
        setRows(response.data);
        const meta = response.meta as { last_page?: number } | null | undefined;
        setTotalPages(meta?.last_page ?? 1);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load payments");
        setRows([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [search, page]);

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

      {error ? <p className="form-error">{error}</p> : null}

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        emptyTitle="No payments"
        emptyDescription="No payment matches current filters."
        rowKey={(row) => String(row.id)}
      />

      {!loading && totalPages > 1 ? (
        <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
      ) : null}
    </section>
  );
}
