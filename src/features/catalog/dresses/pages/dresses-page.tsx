import { useEffect, useMemo, useState } from "react";
import { SearchFiltersBar } from "@/shared/components/filters/search-filters-bar";
import { DataTable, type DataTableColumn } from "@/shared/components/data-table/data-table";
import { Button } from "@/shared/ui/button";
import { listDressesMock } from "@/features/catalog/dresses/services/dresses.mock.service";
import type { DressItem } from "@/features/catalog/dresses/types/dresses.types";

export function DressesPage() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<DressItem[]>([]);


  const handleSearchChange = (value: string) => {
    setLoading(true);
    setSearch(value);
  };

  useEffect(() => {
    listDressesMock(search)
      .then((response) => setRows(response.data))
      .finally(() => setLoading(false));
  }, [search]);

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
        <p>Visual table migrated with category/branch/status placeholders.</p>
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

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        emptyTitle="No dresses"
        emptyDescription="Adjust your search and try again."
        rowKey={(row) => String(row.id)}
      />
    </section>
  );
}
