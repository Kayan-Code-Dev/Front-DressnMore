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

export type ExpenseFilterParams = {
  branch_id?: number;
  category_id?: number;
  status?: string;
  date_from?: string;
  date_to?: string;
};
