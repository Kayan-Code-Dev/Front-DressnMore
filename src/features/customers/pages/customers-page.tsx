import { useEffect, useMemo, useState } from "react";
import { SearchFiltersBar } from "@/shared/components/filters/search-filters-bar";
import { DataTable, type DataTableColumn } from "@/shared/components/data-table/data-table";
import { Pagination } from "@/shared/components/data-table/pagination";
import { Button } from "@/shared/ui/button";
import { isModuleLive } from "@/config/feature-flags";
import { listCustomersMock } from "@/features/customers/services/customers.mock.service";
import { listCustomers } from "@/features/customers/services/customers.api.service";
import type { CustomerItem } from "@/features/customers/types/customers.types";

function fetchCustomerData(searchTerm: string, currentPage: number) {
  if (isModuleLive("customers")) {
    return listCustomers({ search: searchTerm, page: currentPage, per_page: 15 });
  }
  return listCustomersMock(searchTerm);
}

export function CustomersPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<CustomerItem[]>([]);
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

    fetchCustomerData(search, page)
      .then((response) => {
        if (cancelled) return;
        setRows(response.data);
        const meta = response.meta as { last_page?: number } | null | undefined;
        setTotalPages(meta?.last_page ?? 1);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load customers");
        setRows([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [search, page]);

  const columns = useMemo<DataTableColumn<CustomerItem>[]>(
    () => [
      { key: "name", title: "Customer" },
      { key: "phone", title: "Phone" },
      { key: "city", title: "City" },
      {
        key: "status",
        title: "Status",
        render: (item) => <span className={`pill pill-${item.status}`}>{item.status}</span>,
      },
      { key: "joined_at", title: "Joined" },
    ],
    []
  );

  return (
    <section>
      <div className="page-title">
        <h2>Customers</h2>
      </div>

      <SearchFiltersBar
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search customers"
        rightSlot={
          <>
            <Button variant="secondary" disabled>
              Filters (TODO)
            </Button>
            <Button disabled>Create customer (TODO)</Button>
          </>
        }
      />

      {error ? <p className="form-error">{error}</p> : null}

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        emptyTitle="No customers"
        emptyDescription="Try changing the search term."
        rowKey={(row) => String(row.id)}
      />

      {!loading && totalPages > 1 ? (
        <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
      ) : null}
    </section>
  );
}
