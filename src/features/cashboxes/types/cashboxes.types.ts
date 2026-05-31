export type CashboxItem = {
  id: number;
  name: string;
  branch: string;
  initial_balance: number;
  current_balance: number;
  is_active: boolean;
  description: string;
};

export type CashboxFilterParams = {
  branch_id?: number;
  status?: string;
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
