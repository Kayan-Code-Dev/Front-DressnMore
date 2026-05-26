import { useEffect, useMemo, useState } from "react";
import { DataTable, type DataTableColumn } from "@/shared/components/data-table/data-table";
import { SearchFiltersBar } from "@/shared/components/filters/search-filters-bar";
import { Dialog } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import type { BranchItem } from "@/features/branches/types/branches.types";
import { listBranchesMock } from "@/features/branches/services/branches.mock.service";

export function BranchesPage() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<BranchItem[]>([]);
  const [dialog, setDialog] = useState<null | "create" | "edit" | "delete">(null);

  const handleSearchChange = (value: string) => {
    setLoading(true);
    setSearch(value);
  };

  useEffect(() => {
    listBranchesMock(search)
      .then((response) => setRows(response.data))
      .finally(() => setLoading(false));
  }, [search]);

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
        <p>Design-first branch list using mock data only.</p>
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

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        emptyTitle="No branches"
        emptyDescription="No branch matches current search."
        rowKey={(row) => String(row.id)}
      />

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
