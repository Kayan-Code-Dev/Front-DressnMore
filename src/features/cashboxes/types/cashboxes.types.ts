export type CashboxItem = {
  id: number;
  name: string;
  branch_id: number | null;
  initial_balance: number;
  current_balance: number;
  is_active: boolean;
  description: string | null;
  created_at: string | null;
};

export type CashboxFilterParams = {
  branch_id?: number;
  status?: string;
};

export type CashboxPayload = {
  name: string;
  branch_id?: number | null;
  initial_balance?: number | null;
  description?: string | null;
  is_active?: boolean;
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
