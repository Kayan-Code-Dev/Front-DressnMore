import { useEffect, useMemo, useState } from "react";
import { SearchFiltersBar } from "@/shared/components/filters/search-filters-bar";
import { DataTable, type DataTableColumn } from "@/shared/components/data-table/data-table";
import { Button } from "@/shared/ui/button";
import type { ReturnItem } from "@/features/returns/types/returns.types";
import { listReturnsMock } from "@/features/returns/services/returns.mock.service";

export function ReturnsPage() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<ReturnItem[]>([]);

  const handleSearchChange = (value: string) => {
    setLoading(true);
    setSearch(value);
  };

  useEffect(() => {
    listReturnsMock(search)
      .then((response) => setRows(response.data))
      .finally(() => setLoading(false));
  }, [search]);

  const columns = useMemo<DataTableColumn<ReturnItem>[]>(
    () => [
      { key: "order_id", title: "Order ID" },
      { key: "client", title: "Client" },
      { key: "employee", title: "Employee" },
      { key: "cloth_name", title: "Cloth Name" },
      { key: "cloth_code", title: "Cloth Code" },
      { key: "return_date", title: "Return Date" },
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
            Return (TODO)
          </Button>
        ),
      },
    ],
    []
  );

  return (
    <section>
      <div className="page-title">
        <h2>Returns</h2>
        <p>Returns list with filters placeholders and return action placeholder.</p>
      </div>

      <SearchFiltersBar
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search returns"
        rightSlot={
          <>
            <Button variant="secondary" disabled>Filters (TODO)</Button>
          </>
        }
      />

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        emptyTitle="No returns"
        emptyDescription="No return matches current search."
        rowKey={(row) => String(row.id)}
      />
    </section>
  );
}
