import { useEffect, useMemo, useState } from "react";
import { SearchFiltersBar } from "@/shared/components/filters/search-filters-bar";
import { DataTable, type DataTableColumn } from "@/shared/components/data-table/data-table";
import { Button } from "@/shared/ui/button";
import { listCustomersMock } from "@/features/customers/services/customers.mock.service";
import type { CustomerItem } from "@/features/customers/types/customers.types";

export function CustomersPage() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<CustomerItem[]>([]);


  const handleSearchChange = (value: string) => {
    setLoading(true);
    setSearch(value);
  };

  useEffect(() => {
    listCustomersMock(search)
      .then((response) => setRows(response.data))
      .finally(() => setLoading(false));
  }, [search]);

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
        <p>List screen migrated with mock data only.</p>
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

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        emptyTitle="No customers"
        emptyDescription="Try changing the search term."
        rowKey={(row) => String(row.id)}
      />
    </section>
  );
}
