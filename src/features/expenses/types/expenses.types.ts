export type ExpenseItem = {
  id: number;
  branch: string;
  cashbox: string;
  category: string;
  vendor: string;
  amount: number;
  expense_date: string;
  status: "pending" | "approved" | "paid" | "cancelled";
};
