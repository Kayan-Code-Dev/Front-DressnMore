import { useEffect, useMemo, useState } from "react";
import { SearchFiltersBar } from "@/shared/components/filters/search-filters-bar";
import { DataTable, type DataTableColumn } from "@/shared/components/data-table/data-table";
import { Button } from "@/shared/ui/button";
import type { SupplierPaymentItem } from "@/features/suppliers/types/suppliers.types";
import { listSupplierPaymentsMock } from "@/features/suppliers/services/suppliers.mock.service";

export function SupplierPaymentsPage() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<SupplierPaymentItem[]>([]);

  const handleSearchChange = (value: string) => {
    setLoading(true);
    setSearch(value);
  };

  useEffect(() => {
    listSupplierPaymentsMock(search)
      .then((response) => setRows(response.data))
      .finally(() => setLoading(false));
  }, [search]);

  const columns = useMemo<DataTableColumn<SupplierPaymentItem>[]>(
    () => [
      { key: "supplier", title: "Supplier" },
      { key: "purchase_order_number", title: "Purchase Order" },
      { key: "amount", title: "Amount", render: (item) => item.amount.toLocaleString() },
      { key: "method", title: "Method" },
      { key: "reference", title: "Reference" },
      { key: "paid_at", title: "Paid At" },
      { key: "notes", title: "Notes" },
      {
        key: "actions",
        title: "Actions",
        render: () => (
          <div className="row-actions">
            <Button variant="secondary" disabled>Add Payment</Button>
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
        <h2>Supplier Payments</h2>
        <p>Supplier payments table with filters placeholders and mock data.</p>
      </div>

      <SearchFiltersBar
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search supplier payments"
        rightSlot={
          <>
            <Button variant="secondary" disabled>Supplier</Button>
            <Button variant="secondary" disabled>Purchase Order</Button>
            <Button variant="secondary" disabled>Method</Button>
            <Button variant="secondary" disabled>Date Range</Button>
          </>
        }
      />

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        emptyTitle="No supplier payments"
        emptyDescription="No supplier payment matches current filters."
        rowKey={(row) => String(row.id)}
      />
    </section>
  );
}
