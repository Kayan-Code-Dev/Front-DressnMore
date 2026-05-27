import { useEffect, useMemo, useState } from "react";
import { SearchFiltersBar } from "@/shared/components/filters/search-filters-bar";
import { DataTable, type DataTableColumn } from "@/shared/components/data-table/data-table";
import { Pagination } from "@/shared/components/data-table/pagination";
import { Button } from "@/shared/ui/button";
import { Dialog } from "@/shared/ui/dialog";
import { isModuleLive } from "@/config/feature-flags";
import type { SupplierItem } from "@/features/suppliers/types/suppliers.types";
import { listSuppliersMock } from "@/features/suppliers/services/suppliers.mock.service";
import { listSuppliers } from "@/features/suppliers/services/suppliers.api.service";

function fetchSupplierData(searchTerm: string, currentPage: number) {
  if (isModuleLive("suppliers")) {
    return listSuppliers({ search: searchTerm, page: currentPage, per_page: 15 });
  }
  return listSuppliersMock(searchTerm);
}

export function SuppliersPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<SupplierItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dialog, setDialog] = useState<null | "create" | "edit" | "delete">(null);

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

    fetchSupplierData(search, page)
      .then((response) => {
        if (cancelled) return;
        setRows(response.data);
        const meta = response.meta as { last_page?: number } | null | undefined;
        setTotalPages(meta?.last_page ?? 1);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load suppliers");
        setRows([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [search, page]);

  const columns = useMemo<DataTableColumn<SupplierItem>[]>(
    () => [
      { key: "code", title: "Code" },
      { key: "name", title: "Supplier" },
      { key: "phone", title: "Phone" },
      { key: "address", title: "Address" },
      { key: "current_balance", title: "Current Balance", render: (item) => item.current_balance.toLocaleString() },
      {
        key: "status",
        title: "Status",
        render: (item) => <span className={`pill pill-${item.status}`}>{item.status}</span>,
      },
      {
        key: "actions",
        title: "Actions",
        render: () => (
          <div className="row-actions">
            <Button variant="secondary" onClick={() => setDialog("edit")}>Edit</Button>
            <Button variant="secondary" onClick={() => setDialog("delete")}>Delete</Button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <section>
      <div className="page-title">
        <h2>Suppliers</h2>
      </div>

      <SearchFiltersBar
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search suppliers"
        rightSlot={
          <>
            <Button variant="secondary" disabled>Filters (TODO)</Button>
            <Button onClick={() => setDialog("create")}>Create Supplier</Button>
          </>
        }
      />

      {error ? <p className="form-error">{error}</p> : null}

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        emptyTitle="No suppliers"
        emptyDescription="No supplier matches current search."
        rowKey={(row) => String(row.id)}
      />

      {!loading && totalPages > 1 ? (
        <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
      ) : null}

      <Dialog
        open={dialog !== null}
        title="Placeholder action"
        onClose={() => setDialog(null)}
        footer={<Button onClick={() => setDialog(null)}>Close</Button>}
      >
        <p>{dialog ? `${dialog.toUpperCase()} supplier UI placeholder.` : ""}</p>
      </Dialog>
    </section>
  );
}
