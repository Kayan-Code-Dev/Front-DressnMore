export type CashMovementItem = {
  id: number;
  type: string;
  direction: "in" | "out";
  amount: number;
  balance_after: number;
  method: string | null;
  cashbox_id: number | null;
  branch_id?: number | null;
  branch_name?: string | null;
  category?: string | null;
  party?: string | null;
  status?: string | null;
  reference: string | null;
  movement_date: string | null;
  description: string | null;
  notes: string | null;
  is_reversed: boolean;
  created_at: string | null;
};

export type CashMovementFilterParams = {
  cashbox_id?: number;
  branch_id?: number;
  type?: string;
  direction?: string;
  date_from?: string;
  date_to?: string;
};

export type CashMovementPayload = {
  type: "manual_adjustment" | "income" | "expense";
  direction: "in" | "out";
  amount: number;
  method?: string | null;
  cashbox_id?: number | null;
  reference?: string | null;
  movement_date?: string | null;
  description?: string | null;
  notes?: string | null;
};
