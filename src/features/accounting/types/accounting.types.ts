export type AccountingSummary = {
  total_income: number;
  total_expenses: number;
  net_change: number;
  cashbox_balances: Array<{
    name: string;
    balance: number;
  }>;
};

export type LedgerEntry = {
  id: number;
  date: string;
  type: "debit" | "credit";
  reference: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
};

export type TreasuryEntry = {
  id: number;
  entry_number: string;
  date: string;
  account: string;
  description: string;
  debit: number;
  credit: number;
  status: "posted" | "draft" | "cancelled";
  created_by: string;
};
