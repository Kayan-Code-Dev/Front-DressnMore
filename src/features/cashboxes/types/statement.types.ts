export type LedgerEntryStatus = "completed" | "paid" | "partial";

export type LedgerEntry = {
  id: number | string;
  date: string;
  reference: string;
  description: string;
  category: string;
  branch_id: number | null;
  branch_name: string;
  party: string;
  credit: number | null;
  debit: number | null;
  running_balance: number;
  status: LedgerEntryStatus;
  direction: "in" | "out" | "opening";
};

export type BranchSummary = {
  id: number | "all";
  name: string;
  icon: "all" | "building" | "warehouse" | "home" | "tools" | "factory";
  balance: number;
  entry_count: number;
};

export type StatementSummary = {
  opening_balance: number;
  total_revenues: number;
  total_expenses: number;
  current_balance: number;
  available_in_cashbox: number;
  closing_balance: number;
  last_income_date: string | null;
  last_expense_date: string | null;
  entry_count: number;
};

export type StatementFilterParams = {
  search?: string;
  type?: string;
  branch_id?: number;
  category?: string;
  date_from?: string;
  date_to?: string;
};
