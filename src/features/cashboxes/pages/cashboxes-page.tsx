import { useEffect, useMemo, useState } from "react";
import { SearchFiltersBar } from "@/shared/components/filters/search-filters-bar";
import { DataTable, type DataTableColumn } from "@/shared/components/data-table/data-table";
import { Button } from "@/shared/ui/button";
import type { CashboxItem } from "@/features/cashboxes/types/cashboxes.types";
import { listCashboxesMock } from "@/features/cashboxes/services/cashboxes.mock.service";

export function CashboxesPage() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<CashboxItem[]>([]);

  const handleSearchChange = (value: string) => {
    setLoading(true);
    setSearch(value);
  };

  useEffect(() => {
    listCashboxesMock(search)
      .then((response) => setRows(response.data))
      .finally(() => setLoading(false));
  }, [search]);

  const columns = useMemo<DataTableColumn<CashboxItem>[]>(
    () => [
      { key: "name", title: "Name" },
      { key: "branch", title: "Branch" },
      { key: "initial_balance", title: "Initial Balance", render: (item) => item.initial_balance.toLocaleString() },
      { key: "current_balance", title: "Current Balance", render: (item) => item.current_balance.toLocaleString() },
      {
        key: "is_active",
        title: "Active",
        render: (item) => <span className={`pill pill-${item.is_active ? "active" : "inactive"}`}>{item.is_active ? "yes" : "no"}</span>,
      },
      { key: "description", title: "Description" },
      {
        key: "actions",
        title: "Actions",
        render: () => (
          <div className="row-actions">
            <Button variant="secondary" disabled>View Transactions</Button>
            <Button variant="secondary" disabled>Recalculate</Button>
            <Button variant="secondary" disabled>Edit</Button>
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
        <h2>Cashboxes</h2>
        <p>Cashboxes list screen with mock-only action placeholders.</p>
      </div>

      <SearchFiltersBar
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search cashboxes"
        rightSlot={<Button variant="secondary" disabled>Filters (TODO)</Button>}
      />

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        emptyTitle="No cashboxes"
        emptyDescription="No cashbox matches current search."
        rowKey={(row) => String(row.id)}
      />
    </section>
  );
}
