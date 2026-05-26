import { useEffect, useMemo, useState } from "react";
import { DataTable, type DataTableColumn } from "@/shared/components/data-table/data-table";
import { SearchFiltersBar } from "@/shared/components/filters/search-filters-bar";
import { Button } from "@/shared/ui/button";
import { Dialog } from "@/shared/ui/dialog";
import type { SubcategoryItem } from "@/features/catalog/subcategories/types/subcategories.types";
import { listSubcategoriesMock } from "@/features/catalog/subcategories/services/subcategories.mock.service";

export function SubcategoriesPage() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<SubcategoryItem[]>([]);
  const [dialog, setDialog] = useState<null | "create" | "edit" | "delete">(null);

  const handleSearchChange = (value: string) => {
    setLoading(true);
    setSearch(value);
  };

  useEffect(() => {
    listSubcategoriesMock(search)
      .then((response) => setRows(response.data))
      .finally(() => setLoading(false));
  }, [search]);

  const columns = useMemo<DataTableColumn<SubcategoryItem>[]>(
    () => [
      { key: "name", title: "Subcategory" },
      { key: "category_name", title: "Category" },
      { key: "description", title: "Description" },
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
        <h2>Dress Subcategories</h2>
        <p>Mock list with category filter placeholder and CRUD placeholders.</p>
      </div>

      <SearchFiltersBar
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search subcategories"
        rightSlot={
          <>
            <Button variant="secondary" disabled>
              Category Filter (TODO)
            </Button>
            <Button onClick={() => setDialog("create")}>Create Subcategory</Button>
          </>
        }
      />

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        emptyTitle="No subcategories"
        emptyDescription="No subcategory matches current search."
        rowKey={(row) => String(row.id)}
      />

      <Dialog
        open={dialog !== null}
        title="Placeholder action"
        onClose={() => setDialog(null)}
        footer={<Button onClick={() => setDialog(null)}>Close</Button>}
      >
        <p>{dialog ? `${dialog.toUpperCase()} subcategory UI placeholder.` : ""}</p>
      </Dialog>
    </section>
  );
}
