import { useEffect, useMemo, useState } from "react";
import { SearchFiltersBar } from "@/shared/components/filters/search-filters-bar";
import { DataTable, type DataTableColumn } from "@/shared/components/data-table/data-table";
import { Button } from "@/shared/ui/button";
import type { PurchaseOrderItem } from "@/features/suppliers/types/suppliers.types";
import { listPurchaseOrdersMock } from "@/features/suppliers/services/suppliers.mock.service";

export function PurchaseOrdersPage() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<PurchaseOrderItem[]>([]);

  const handleSearchChange = (value: string) => {
    setLoading(true);
    setSearch(value);
  };

  useEffect(() => {
    listPurchaseOrdersMock(search)
      .then((response) => setRows(response.data))
      .finally(() => setLoading(false));
  }, [search]);

  const columns = useMemo<DataTableColumn<PurchaseOrderItem>[]>(
    () => [
      { key: "purchase_order_number", title: "PO Number" },
      { key: "supplier", title: "Supplier" },
      {
        key: "status",
        title: "Status",
        render: (item) => <span className={`pill pill-${item.status}`}>{item.status}</span>,
      },
      { key: "total", title: "Total", render: (item) => item.total.toLocaleString() },
      { key: "paid_amount", title: "Paid", render: (item) => item.paid_amount.toLocaleString() },
      { key: "remaining_amount", title: "Remaining", render: (item) => item.remaining_amount.toLocaleString() },
      { key: "order_date", title: "Order Date" },
      {
        key: "actions",
        title: "Actions",
        render: () => (
          <div className="row-actions">
            <Button variant="secondary" disabled>Create</Button>
            <Button variant="secondary" disabled>Add Payment</Button>
            <Button variant="secondary" disabled>Return</Button>
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
        <h2>Purchase Orders</h2>
        <p>Purchase orders list with supplier/status/date filters placeholders.</p>
      </div>

      <SearchFiltersBar
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search purchase orders"
        rightSlot={
          <>
            <Button variant="secondary" disabled>Supplier Filter</Button>
            <Button variant="secondary" disabled>Status Filter</Button>
            <Button variant="secondary" disabled>Date Range</Button>
          </>
        }
      />

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        emptyTitle="No purchase orders"
        emptyDescription="No purchase order matches current search."
        rowKey={(row) => String(row.id)}
      />
    </section>
  );
}
