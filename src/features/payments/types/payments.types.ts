export type PaymentItem = {
  id: number;
  invoice_id: number;
  customer_id: number | null;
  branch_id: number | null;
  amount: number;
  status: "pending" | "paid" | "cancelled";
  payment_type: "initial" | "normal" | "fee";
  method: string | null;
  reference: string | null;
  paid_at: string | null;
  cancelled_at: string | null;
  notes: string | null;
  created_at: string | null;
  payment_number?: string;
  invoice_number?: string;
  customer_name?: string;
  branch_name?: string;
};

export type PaymentFilterParams = {
  search?: string;
  invoice_id?: number;
  customer_id?: number;
  branch_id?: number;
  method?: string;
  status?: string;
  payment_type?: string;
  date_from?: string;
  date_to?: string;
};

export type PaymentStats = {
  total_count: number;
  total_amount: number;
  collected_amount: number;
  pending_amount: number;
  paid_count: number;
  pending_count: number;
  cancelled_count: number;
};
