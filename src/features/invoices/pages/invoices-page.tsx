import { useEffect, useMemo, useState } from "react";
import { SearchFiltersBar } from "@/shared/components/filters/search-filters-bar";
import { DataTable, type DataTableColumn } from "@/shared/components/data-table/data-table";
import { Pagination } from "@/shared/components/data-table/pagination";
import { Button } from "@/shared/ui/button";
import { isModuleLive } from "@/config/feature-flags";
import { listInvoicesMock } from "@/features/invoices/services/invoices.mock.service";
import { listInvoices } from "@/features/invoices/services/invoices.api.service";
import type { InvoiceItem } from "@/features/invoices/types/invoices.types";

function fetchInvoiceData(searchTerm: string, currentPage: number) {
  if (isModuleLive("invoices")) {
    return listInvoices({ search: searchTerm, page: currentPage, per_page: 15 });
  }
  return listInvoicesMock(searchTerm);
}

export function InvoicesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<InvoiceItem[]>([]);
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

    fetchInvoiceData(search, page)
      .then((response) => {
        if (cancelled) return;
        setRows(response.data);
        const meta = response.meta as { last_page?: number } | null | undefined;
        setTotalPages(meta?.last_page ?? 1);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load invoices");
        setRows([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [search, page]);

  const columns = useMemo<DataTableColumn<InvoiceItem>[]>(
    () => [
      { key: "invoice_number", title: "Invoice #" },
      { key: "customer_name", title: "Customer" },
      {
        key: "type",
        title: "Type",
        render: (item) => <span className="pill">{item.type}</span>,
      },
      {
        key: "status",
        title: "Status",
        render: (item) => <span className={`pill pill-${item.status}`}>{item.status}</span>,
      },
      {
        key: "total",
        title: "Total",
        render: (item) => `$${item.total.toLocaleString()}`,
      },
      { key: "issued_on", title: "Issued" },
    ],
    []
  );

  return (
    <section>
      <div className="page-title">
        <h2>Invoices</h2>
      </div>

      <SearchFiltersBar
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search invoices"
        rightSlot={
          <>
            <Button variant="secondary" disabled>
              Status Filter (TODO)
            </Button>
            <Button variant="secondary" disabled>
              Type Filter (TODO)
            </Button>
          </>
        }
      />

      {error ? <p className="form-error">{error}</p> : null}

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        emptyTitle="No invoices"
        emptyDescription="No matching invoices for the current search."
        rowKey={(row) => String(row.id)}
      />

      {!loading && totalPages > 1 ? (
        <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
      ) : null}
    </section>
  );
}
