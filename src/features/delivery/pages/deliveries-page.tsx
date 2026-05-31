import { useEffect, useMemo, useState } from "react";
import { SearchFiltersBar } from "@/shared/components/filters/search-filters-bar";
import { DataTable, type DataTableColumn } from "@/shared/components/data-table/data-table";
import { Button } from "@/shared/ui/button";
import type { DeliveryItem } from "@/features/delivery/types/deliveries.types";
import { listDeliveriesMock } from "@/features/delivery/services/deliveries.mock.service";

export function DeliveriesPage() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<DeliveryItem[]>([]);

  const handleSearchChange = (value: string) => {
    setLoading(true);
    setSearch(value);
  };

  useEffect(() => {
    listDeliveriesMock(search)
      .then((response) => setRows(response.data))
      .finally(() => setLoading(false));
  }, [search]);

  const columns = useMemo<DataTableColumn<DeliveryItem>[]>(
    () => [
      { key: "order_id", title: "Order ID" },
      { key: "client", title: "Client" },
      { key: "employee", title: "Employee" },
      { key: "cloth_name", title: "Cloth Name" },
      { key: "cloth_code", title: "Cloth Code" },
      { key: "delivery_date", title: "Delivery Date" },
      {
        key: "status",
        title: "Status",
        render: (item) => <span className={`pill pill-${item.status}`}>{item.status}</span>,
      },
      {
        key: "actions",
        title: "Actions",
        render: () => (
          <Button variant="secondary" disabled>
            Deliver (TODO)
          </Button>
        ),
      },
    ],
    []
  );

  return (
    <section>
      <div className="page-title">
        <h2>Deliveries</h2>
        <p>Delivery list with mock filters placeholders and action placeholder.</p>
      </div>

      <SearchFiltersBar
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search deliveries"
        rightSlot={
          <>
            <Button variant="secondary" disabled>Order ID (TODO)</Button>
            <Button variant="secondary" disabled>Client (TODO)</Button>
            <Button variant="secondary" disabled>Employee (TODO)</Button>
            <Button variant="secondary" disabled>Cloth Name (TODO)</Button>
            <Button variant="secondary" disabled>Cloth Code (TODO)</Button>
            <Button variant="secondary" disabled>Date Range (TODO)</Button>
          </>
        }
      />

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        emptyTitle="No deliveries"
        emptyDescription="No delivery matches current search."
        rowKey={(row) => String(row.id)}
      />
    </section>
  );
}
