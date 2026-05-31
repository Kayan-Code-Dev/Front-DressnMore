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
};

export type PaymentFilterParams = {
  invoice_id?: number;
  customer_id?: number;
  branch_id?: number;
  method?: string;
  status?: string;
  payment_type?: string;
  date_from?: string;
  date_to?: string;
};
