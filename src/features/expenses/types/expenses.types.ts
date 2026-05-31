export type ExpenseCategoryRef = {
  id: number;
  name: string;
  slug: string;
  status: string;
};

export type ExpenseItem = {
  id: number;
  expense_category_id: number | null;
  branch_id: number | null;
  cashbox_id: number | null;
  category: ExpenseCategoryRef | null;
  amount: number;
  status: "pending" | "approved" | "paid" | "cancelled";
  method: string | null;
  vendor: string | null;
  reference: string | null;
  reference_number: string | null;
  expense_date: string;
  description: string | null;
  notes: string | null;
  transaction_id: string | null;
  paid_at: string | null;
  created_at: string | null;
};

export type ExpenseFilterParams = {
  expense_category_id?: number;
  branch_id?: number;
  cashbox_id?: number;
  status?: string;
  method?: string;
  date_from?: string;
  date_to?: string;
};

export type ExpensePayload = {
  expense_category_id?: number | null;
  branch_id?: number | null;
  cashbox_id?: number | null;
  amount: number;
  status?: "pending" | "approved" | "paid" | "cancelled";
  method?: string | null;
  vendor?: string | null;
  reference?: string | null;
  reference_number?: string | null;
  expense_date: string;
  description?: string | null;
  notes?: string | null;
  transaction_id?: string | null;
};

export type ExpensePayPayload = {
  cashbox_id?: number | null;
  method?: string | null;
  paid_at?: string | null;
  transaction_id?: string | null;
  notes?: string | null;
};

export type ExpenseCategoryItem = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  status: string;
};
