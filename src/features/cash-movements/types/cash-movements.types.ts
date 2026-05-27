export type CashMovementItem = {
  id: number;
  cashbox: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  balance_after: number;
  reference: string;
  created_at: string;
};

export type CashMovementFilterParams = {
  cashbox_id?: number;
  branch_id?: number;
  type?: string;
  direction?: string;
  date_from?: string;
  date_to?: string;
};
