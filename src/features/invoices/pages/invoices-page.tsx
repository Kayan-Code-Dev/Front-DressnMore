import { useEffect, useMemo, useState } from "react";
import { SearchFiltersBar } from "@/shared/components/filters/search-filters-bar";
import { DataTable, type DataTableColumn } from "@/shared/components/data-table/data-table";
import { Button } from "@/shared/ui/button";
import { listInvoicesMock } from "@/features/invoices/services/invoices.mock.service";
import type { InvoiceItem } from "@/features/invoices/types/invoices.types";

export function InvoicesPage() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<InvoiceItem[]>([]);


  const handleSearchChange = (value: string) => {
    setLoading(true);
    setSearch(value);
  };

  useEffect(() => {
    listInvoicesMock(search)
      .then((response) => setRows(response.data))
      .finally(() => setLoading(false));
  }, [search]);

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
        <p>Core invoices list migrated with status/type placeholders.</p>
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

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        emptyTitle="No invoices"
        emptyDescription="No matching invoices for the current search."
        rowKey={(row) => String(row.id)}
      />
    </section>
  );
}
