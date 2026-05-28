import { useEffect, useMemo, useState } from "react";
import { SearchFiltersBar } from "@/shared/components/filters/search-filters-bar";
import { DataTable, type DataTableColumn } from "@/shared/components/data-table/data-table";
import { Button } from "@/shared/ui/button";
import type { AccountingSummary, LedgerEntry } from "@/features/accounting/types/accounting.types";
import { getAccountingSummaryMock, listLedgerMock } from "@/features/accounting/services/accounting.mock.service";

export function AccountingSummaryPage() {
  const [summary, setSummary] = useState<AccountingSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<LedgerEntry[]>([]);

  const handleSearchChange = (value: string) => {
    setLoading(true);
    setSearch(value);
  };

  useEffect(() => {
    getAccountingSummaryMock().then((response) => setSummary(response.data));
  }, []);

  useEffect(() => {
    listLedgerMock(search)
      .then((response) => setRows(response.data))
      .finally(() => setLoading(false));
  }, [search]);

  const columns = useMemo<DataTableColumn<LedgerEntry>[]>(
    () => [
      { key: "date", title: "Date" },
      { key: "type", title: "Type" },
      { key: "reference", title: "Reference" },
      { key: "description", title: "Description" },
      { key: "debit", title: "Debit", render: (item) => item.debit.toLocaleString() },
      { key: "credit", title: "Credit", render: (item) => item.credit.toLocaleString() },
      { key: "balance", title: "Balance", render: (item) => item.balance.toLocaleString() },
    ],
    []
  );

  return (
    <section>
      <div className="page-title">
        <h2>Accounting Summary</h2>
        <p>UI mock foundation for accounting summary and ledger.</p>
      </div>

      <div className="insight-grid">
        <article className="insight-card"><h3>Total Income</h3><strong>{summary?.total_income.toLocaleString() ?? "..."}</strong></article>
        <article className="insight-card"><h3>Total Expenses</h3><strong>{summary?.total_expenses.toLocaleString() ?? "..."}</strong></article>
        <article className="insight-card"><h3>Net Change</h3><strong>{summary?.net_change.toLocaleString() ?? "..."}</strong></article>
        <article className="insight-card">
          <h3>Cashbox Balances</h3>
          <p>{summary ? summary.cashbox_balances.map((item) => `${item.name}: ${item.balance.toLocaleString()}`).join(" | ") : "..."}</p>
        </article>
      </div>

      <SearchFiltersBar
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search ledger"
        rightSlot={
          <>
            <Button variant="secondary" disabled>Date Range</Button>
            <Button variant="secondary" disabled>Cashbox</Button>
            <Button variant="secondary" disabled>Type</Button>
          </>
        }
      />

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        emptyTitle="No ledger entries"
        emptyDescription="No ledger entries match current filters."
        rowKey={(row) => String(row.id)}
      />
    </section>
  );
}
