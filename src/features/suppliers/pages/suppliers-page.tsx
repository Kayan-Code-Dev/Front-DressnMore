import { useEffect, useMemo, useState } from "react";
import { SearchFiltersBar } from "@/shared/components/filters/search-filters-bar";
import { DataTable, type DataTableColumn } from "@/shared/components/data-table/data-table";
import { Button } from "@/shared/ui/button";
import { Dialog } from "@/shared/ui/dialog";
import type { SupplierItem } from "@/features/suppliers/types/suppliers.types";
import { listSuppliersMock } from "@/features/suppliers/services/suppliers.mock.service";

export function SuppliersPage() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<SupplierItem[]>([]);
  const [dialog, setDialog] = useState<null | "create" | "edit" | "delete">(null);

  const handleSearchChange = (value: string) => {
    setLoading(true);
    setSearch(value);
  };

  useEffect(() => {
    listSuppliersMock(search)
      .then((response) => setRows(response.data))
      .finally(() => setLoading(false));
  }, [search]);

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
        <p>Suppliers screen migrated with mock service and CRUD placeholders.</p>
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

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        emptyTitle="No suppliers"
        emptyDescription="No supplier matches current search."
        rowKey={(row) => String(row.id)}
      />

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
