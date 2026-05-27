import { useEffect, useMemo, useState } from "react";
import { SearchFiltersBar } from "@/shared/components/filters/search-filters-bar";
import { DataTable, type DataTableColumn } from "@/shared/components/data-table/data-table";
import { Pagination } from "@/shared/components/data-table/pagination";
import { Button } from "@/shared/ui/button";
import { isModuleLive } from "@/config/feature-flags";
import type { PurchaseOrderItem } from "@/features/suppliers/types/suppliers.types";
import { listPurchaseOrdersMock } from "@/features/suppliers/services/suppliers.mock.service";
import { listPurchaseOrders } from "@/features/suppliers/services/purchase-orders.api.service";

function fetchPurchaseOrderData(searchTerm: string, currentPage: number) {
  if (isModuleLive("purchaseOrders")) {
    return listPurchaseOrders({ search: searchTerm, page: currentPage, per_page: 15 });
  }
  return listPurchaseOrdersMock(searchTerm);
}

export function PurchaseOrdersPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<PurchaseOrderItem[]>([]);
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

    fetchPurchaseOrderData(search, page)
      .then((response) => {
        if (cancelled) return;
        setRows(response.data);
        const meta = response.meta as { last_page?: number } | null | undefined;
        setTotalPages(meta?.last_page ?? 1);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load purchase orders");
        setRows([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [search, page]);

  const columns = useMemo<DataTableColumn<PurchaseOrderItem>[]>(
    () => [
      { key: "purchase_order_number", title: "PO Number" },
      { key: "supplier", title: "Supplier" },
      {
        key: "status",
        title: "Status",
        render: (item) => <span className={`pill pill-${item.status}`}>{item.status}</span>,
      },
      { key: "total", title: "Total", render: (item) => item.total.toLocaleString() },
      { key: "paid_amount", title: "Paid", render: (item) => item.paid_amount.toLocaleString() },
      { key: "remaining_amount", title: "Remaining", render: (item) => item.remaining_amount.toLocaleString() },
      { key: "order_date", title: "Order Date" },
      {
        key: "actions",
        title: "Actions",
        render: () => (
          <div className="row-actions">
            <Button variant="secondary" disabled>Create</Button>
            <Button variant="secondary" disabled>Add Payment</Button>
            <Button variant="secondary" disabled>Return</Button>
            <Button variant="secondary" disabled>Export</Button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <section>
      <div className="page-title">
        <h2>Purchase Orders</h2>
      </div>

      <SearchFiltersBar
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search purchase orders"
        rightSlot={
          <>
            <Button variant="secondary" disabled>Supplier Filter</Button>
            <Button variant="secondary" disabled>Status Filter</Button>
            <Button variant="secondary" disabled>Date Range</Button>
          </>
        }
      />

      {error ? <p className="form-error">{error}</p> : null}

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        emptyTitle="No purchase orders"
        emptyDescription="No purchase order matches current search."
        rowKey={(row) => String(row.id)}
      />

      {!loading && totalPages > 1 ? (
        <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
      ) : null}
    </section>
  );
}
