import { useEffect, useMemo, useState } from "react";
import { SearchFiltersBar } from "@/shared/components/filters/search-filters-bar";
import { DataTable, type DataTableColumn } from "@/shared/components/data-table/data-table";
import { Pagination } from "@/shared/components/data-table/pagination";
import { Button } from "@/shared/ui/button";
import { isModuleLive } from "@/config/feature-flags";
import { listDressesMock } from "@/features/catalog/dresses/services/dresses.mock.service";
import { listDresses } from "@/features/catalog/dresses/services/dresses.api.service";
import type { DressItem } from "@/features/catalog/dresses/types/dresses.types";

function fetchDressData(searchTerm: string, currentPage: number) {
  if (isModuleLive("dresses")) {
    return listDresses({ search: searchTerm, page: currentPage, per_page: 15 });
  }
  return listDressesMock(searchTerm);
}

export function DressesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<DressItem[]>([]);
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

    fetchDressData(search, page)
      .then((response) => {
        if (cancelled) return;
        setRows(response.data);
        const meta = response.meta as { last_page?: number } | null | undefined;
        setTotalPages(meta?.last_page ?? 1);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load dresses");
        setRows([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [search, page]);

  const columns = useMemo<DataTableColumn<DressItem>[]>(
    () => [
      { key: "code", title: "Code" },
      { key: "name", title: "Dress" },
      { key: "category", title: "Category" },
      { key: "branch", title: "Branch" },
      {
        key: "status",
        title: "Status",
        render: (item) => <span className={`pill pill-${item.status}`}>{item.status}</span>,
      },
    ],
    []
  );

  return (
    <section>
      <div className="page-title">
        <h2>Dresses</h2>
      </div>

      <SearchFiltersBar
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search dresses"
        rightSlot={
          <>
            <Button variant="secondary" disabled>
              Status Filter (TODO)
            </Button>
            <Button variant="secondary" disabled>
              Category Filter (TODO)
            </Button>
            <Button variant="secondary" disabled>
              Branch Filter (TODO)
            </Button>
          </>
        }
      />

      {error ? <p className="form-error">{error}</p> : null}

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        emptyTitle="No dresses"
        emptyDescription="Adjust your search and try again."
        rowKey={(row) => String(row.id)}
      />

      {!loading && totalPages > 1 ? (
        <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
      ) : null}
    </section>
  );
}
