import { useEffect, useMemo, useState } from "react";
import { DataTable, type DataTableColumn } from "@/shared/components/data-table/data-table";
import { Pagination } from "@/shared/components/data-table/pagination";
import { SearchFiltersBar } from "@/shared/components/filters/search-filters-bar";
import { Dialog } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { isModuleLive } from "@/config/feature-flags";
import type { BranchItem } from "@/features/branches/types/branches.types";
import { listBranchesMock } from "@/features/branches/services/branches.mock.service";
import { listBranches } from "@/features/branches/services/branches.api.service";

function fetchBranchData(searchTerm: string, currentPage: number) {
  if (isModuleLive("branches")) {
    return listBranches({ search: searchTerm, page: currentPage, per_page: 15 });
  }
  return listBranchesMock(searchTerm);
}

export function BranchesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<BranchItem[]>([]);
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

    fetchBranchData(search, page)
      .then((response) => {
        if (cancelled) return;
        setRows(response.data);
        const meta = response.meta as { last_page?: number } | null | undefined;
        setTotalPages(meta?.last_page ?? 1);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load branches");
        setRows([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [search, page]);

  const columns = useMemo<DataTableColumn<BranchItem>[]>(
    () => [
      { key: "branch_code", title: "Branch Code" },
      { key: "name", title: "Name" },
      { key: "phone", title: "Phone" },
      { key: "address", title: "Address" },
      { key: "inventory_name", title: "Inventory" },
      { key: "currency", title: "Currency" },
      { key: "vat", title: "VAT" },
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
        <h2>Branches</h2>
      </div>

      <SearchFiltersBar
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search branches"
        rightSlot={
          <>
            <Button variant="secondary" disabled>
              Filters (TODO)
            </Button>
            <Button onClick={() => setDialog("create")}>Create Branch</Button>
          </>
        }
      />

      {error ? <p className="form-error">{error}</p> : null}

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        emptyTitle="No branches"
        emptyDescription="No branch matches current search."
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
        <p>{dialog ? `${dialog.toUpperCase()} branch UI placeholder.` : ""}</p>
      </Dialog>
    </section>
  );
}
