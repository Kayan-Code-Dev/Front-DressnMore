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
