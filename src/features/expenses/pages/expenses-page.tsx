import { useEffect, useMemo, useState } from "react";
import { SearchFiltersBar } from "@/shared/components/filters/search-filters-bar";
import { DataTable, type DataTableColumn } from "@/shared/components/data-table/data-table";
import { Pagination } from "@/shared/components/data-table/pagination";
import { Button } from "@/shared/ui/button";
import { isModuleLive } from "@/config/feature-flags";
import type { ExpenseItem } from "@/features/expenses/types/expenses.types";
import { listExpensesMock } from "@/features/expenses/services/expenses.mock.service";
import { listExpenses } from "@/features/expenses/services/expenses.api.service";

function fetchExpenseData(searchTerm: string, currentPage: number) {
  if (isModuleLive("expenses")) {
    return listExpenses({ search: searchTerm, page: currentPage, per_page: 15 });
  }
  return listExpensesMock(searchTerm);
}

export function ExpensesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<ExpenseItem[]>([]);
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

    fetchExpenseData(search, page)
      .then((response) => {
        if (cancelled) return;
        setRows(response.data);
        const meta = response.meta as { last_page?: number } | null | undefined;
        setTotalPages(meta?.last_page ?? 1);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load expenses");
        setRows([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [search, page]);

  const columns = useMemo<DataTableColumn<ExpenseItem>[]>(
    () => [
      { key: "branch", title: "Branch" },
      { key: "cashbox", title: "Cashbox" },
      { key: "category", title: "Category" },
      { key: "vendor", title: "Vendor" },
      { key: "amount", title: "Amount", render: (item) => item.amount.toLocaleString() },
      { key: "expense_date", title: "Expense Date" },
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
            <Button variant="secondary" disabled>Approve</Button>
            <Button variant="secondary" disabled>Pay</Button>
            <Button variant="secondary" disabled>Cancel</Button>
            <Button variant="secondary" disabled>Delete</Button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <section>
      <div className="page-title">
        <h2>Expenses</h2>
      </div>

      <SearchFiltersBar
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search expenses"
        rightSlot={
          <>
            <Button>+ Create Expense</Button>
            <Button variant="secondary" disabled>Branch</Button>
            <Button variant="secondary" disabled>Cashbox</Button>
            <Button variant="secondary" disabled>Category</Button>
            <Button variant="secondary" disabled>Status</Button>
            <Button variant="secondary" disabled>Date Range</Button>
            <Button variant="secondary" disabled>Amount Range</Button>
            <Button variant="secondary" disabled>Vendor</Button>
          </>
        }
      />

      {error ? <p className="form-error">{error}</p> : null}

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        emptyTitle="No expenses"
        emptyDescription="No expense matches current search."
        rowKey={(row) => String(row.id)}
      />

      {!loading && totalPages > 1 ? (
        <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
      ) : null}
    </section>
  );
}
