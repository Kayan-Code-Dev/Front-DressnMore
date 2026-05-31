import { useEffect, useMemo, useState } from "react";
import { SearchFiltersBar } from "@/shared/components/filters/search-filters-bar";
import { DataTable, type DataTableColumn } from "@/shared/components/data-table/data-table";
import { Pagination } from "@/shared/components/data-table/pagination";
import { Button } from "@/shared/ui/button";
import { isModuleLive } from "@/config/feature-flags";
import type { CashMovementItem } from "@/features/cash-movements/types/cash-movements.types";
import { listCashMovementsMock } from "@/features/cash-movements/services/cash-movements.mock.service";
import { listCashMovements } from "@/features/cash-movements/services/cash-movements.api.service";

function fetchCashMovementData(searchTerm: string, currentPage: number) {
  if (isModuleLive("cashMovements")) {
    return listCashMovements({ search: searchTerm, page: currentPage, per_page: 15 });
  }
  return listCashMovementsMock(searchTerm);
}

export function CashMovementsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<CashMovementItem[]>([]);
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

    fetchCashMovementData(search, page)
      .then((response) => {
        if (cancelled) return;
        setRows(response.data);
        const meta = response.meta as { last_page?: number } | null | undefined;
        setTotalPages(meta?.last_page ?? 1);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load cash movements");
        setRows([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [search, page]);

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

      {error ? <p className="form-error">{error}</p> : null}

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        emptyTitle="No cash movements"
        emptyDescription="No movement matches current search."
        rowKey={(row) => String(row.id)}
      />

      {!loading && totalPages > 1 ? (
        <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
      ) : null}
    </section>
  );
}
