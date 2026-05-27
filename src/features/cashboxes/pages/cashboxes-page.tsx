import { useEffect, useMemo, useState } from "react";
import { SearchFiltersBar } from "@/shared/components/filters/search-filters-bar";
import { DataTable, type DataTableColumn } from "@/shared/components/data-table/data-table";
import { Pagination } from "@/shared/components/data-table/pagination";
import { Button } from "@/shared/ui/button";
import { isModuleLive } from "@/config/feature-flags";
import type { CashboxItem } from "@/features/cashboxes/types/cashboxes.types";
import { listCashboxesMock } from "@/features/cashboxes/services/cashboxes.mock.service";
import { listCashboxes } from "@/features/cashboxes/services/cashboxes.api.service";

function fetchCashboxData(searchTerm: string, currentPage: number) {
  if (isModuleLive("cashboxes")) {
    return listCashboxes({ search: searchTerm, page: currentPage, per_page: 15 });
  }
  return listCashboxesMock(searchTerm);
}

export function CashboxesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<CashboxItem[]>([]);
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

    fetchCashboxData(search, page)
      .then((response) => {
        if (cancelled) return;
        setRows(response.data);
        const meta = response.meta as { last_page?: number } | null | undefined;
        setTotalPages(meta?.last_page ?? 1);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load cashboxes");
        setRows([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [search, page]);

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
      </div>

      <SearchFiltersBar
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search cashboxes"
        rightSlot={<Button variant="secondary" disabled>Filters (TODO)</Button>}
      />

      {error ? <p className="form-error">{error}</p> : null}

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        emptyTitle="No cashboxes"
        emptyDescription="No cashbox matches current search."
        rowKey={(row) => String(row.id)}
      />

      {!loading && totalPages > 1 ? (
        <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
      ) : null}
    </section>
  );
}
