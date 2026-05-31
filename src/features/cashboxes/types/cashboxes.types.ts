export type CashboxItem = {
  id: number;
  name: string;
  branch_id: number | null;
  branch_name?: string | null;
  manager_name?: string | null;
  initial_balance: number;
  current_balance: number;
  balance_change?: number;
  total_in?: number;
  total_out?: number;
  is_active: boolean;
  description: string | null;
  created_at: string | null;
};

export type CashboxFilterParams = {
  search?: string;
  branch_id?: number;
  status?: string;
  is_active?: boolean;
};

export type CashboxPayload = {
  name: string;
  branch_id?: number | null;
  initial_balance?: number | null;
  description?: string | null;
  is_active?: boolean;
};

export type CashboxStats = {
  total_balances: number;
  total_revenues: number;
  total_expenses: number;
  active_count: number;
  total_count: number;
};

export type CashboxDailySummary = {
  total_in: number;
  total_out: number;
  net: number;
};

export type CashboxTransaction = {
  id: number;
  cashbox_id: number;
  date: string;
  type: "in" | "out";
  reference: string;
  description: string;
  amount: number;
  balance_after: number;
  created_by: string;
};
