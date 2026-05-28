import { useEffect, useMemo, useState } from "react";
import { DataTable, type DataTableColumn } from "@/shared/components/data-table/data-table";
import { Pagination } from "@/shared/components/data-table/pagination";
import { SearchFiltersBar } from "@/shared/components/filters/search-filters-bar";
import { Button } from "@/shared/ui/button";
import { Dialog } from "@/shared/ui/dialog";
import { isModuleLive } from "@/config/feature-flags";
import type { CategoryItem } from "@/features/catalog/categories/types/categories.types";
import { listCategoriesMock } from "@/features/catalog/categories/services/categories.mock.service";
import { listDressCategories } from "@/features/catalog/categories/services/categories.api.service";

function fetchCategoryData(searchTerm: string, currentPage: number) {
  if (isModuleLive("categories")) {
    return listDressCategories({ search: searchTerm, page: currentPage, per_page: 15, only_parents: true });
  }
  return listCategoriesMock(searchTerm);
}

export function CategoriesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<CategoryItem[]>([]);
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

    fetchCategoryData(search, page)
      .then((response) => {
        if (cancelled) return;
        setRows(response.data);
        const meta = response.meta as { last_page?: number } | null | undefined;
        setTotalPages(meta?.last_page ?? 1);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load categories");
        setRows([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [search, page]);

  const columns = useMemo<DataTableColumn<CategoryItem>[]>(
    () => [
      { key: "name", title: "Category" },
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
        <h2>Dress Categories</h2>
      </div>

      <SearchFiltersBar
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search categories"
        rightSlot={
          <Button onClick={() => setDialog("create")}>Create Category</Button>
        }
      />

      {error ? <p className="form-error">{error}</p> : null}

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        emptyTitle="No categories"
        emptyDescription="No category matches current search."
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
        <p>{dialog ? `${dialog.toUpperCase()} category UI placeholder.` : ""}</p>
      </Dialog>
    </section>
  );
}
