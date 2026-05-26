import { useEffect, useMemo, useState } from "react";
import { SearchFiltersBar } from "@/shared/components/filters/search-filters-bar";
import { DataTable, type DataTableColumn } from "@/shared/components/data-table/data-table";
import { Button } from "@/shared/ui/button";
import type { CashMovementItem } from "@/features/cash-movements/types/cash-movements.types";
import { listCashMovementsMock } from "@/features/cash-movements/services/cash-movements.mock.service";

export function CashMovementsPage() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<CashMovementItem[]>([]);

  const handleSearchChange = (value: string) => {
    setLoading(true);
    setSearch(value);
  };

  useEffect(() => {
    listCashMovementsMock(search)
      .then((response) => setRows(response.data))
      .finally(() => setLoading(false));
  }, [search]);

  const columns = useMemo<DataTableColumn<CashMovementItem>[]>(
    () => [
      { key: "cashbox", title: "Cashbox" },
      { key: "type", title: "Type" },
      { key: "category", title: "Category" },
      { key: "amount", title: "Amount", render: (item) => item.amount.toLocaleString() },
      { key: "balance_after", title: "Balance After", render: (item) => item.balance_after.toLocaleString() },
      { key: "reference", title: "Reference" },
      { key: "created_at", title: "Created At" },
    ],
    []
  );

  return (
    <section>
      <div className="page-title">
        <h2>Cash Movements</h2>
        <p>Ledger screen migrated with mock data and filter placeholders.</p>
      </div>

      <SearchFiltersBar
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search cash movements"
        rightSlot={
          <>
            <Button variant="secondary" disabled>Cashbox Filter</Button>
            <Button variant="secondary" disabled>Type Filter</Button>
            <Button variant="secondary" disabled>Date Range</Button>
          </>
        }
      />

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        emptyTitle="No cash movements"
        emptyDescription="No movement matches current search."
        rowKey={(row) => String(row.id)}
      />
    </section>
  );
}
