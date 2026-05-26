import { useEffect, useMemo, useState } from "react";
import { SearchFiltersBar } from "@/shared/components/filters/search-filters-bar";
import { DataTable, type DataTableColumn } from "@/shared/components/data-table/data-table";
import { Button } from "@/shared/ui/button";
import type { ExpenseItem } from "@/features/expenses/types/expenses.types";
import { listExpensesMock } from "@/features/expenses/services/expenses.mock.service";

export function ExpensesPage() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<ExpenseItem[]>([]);

  const handleSearchChange = (value: string) => {
    setLoading(true);
    setSearch(value);
  };

  useEffect(() => {
    listExpensesMock(search)
      .then((response) => setRows(response.data))
      .finally(() => setLoading(false));
  }, [search]);

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
        <p>Expenses list with filters placeholders and action placeholders.</p>
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

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        emptyTitle="No expenses"
        emptyDescription="No expense matches current search."
        rowKey={(row) => String(row.id)}
      />
    </section>
  );
}
