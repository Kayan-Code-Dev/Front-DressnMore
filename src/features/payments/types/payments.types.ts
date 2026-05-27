export type PaymentItem = {
  id: number;
  customer: string;
  branch: string;
  amount: number;
  status: "pending" | "paid" | "cancelled";
  payment_type: "initial" | "normal" | "fee";
  payment_date: string;
  created_at: string;
  notes: string;
  order_number: string;
};

export type PaymentFilterParams = {
  invoice_id?: number;
  customer_id?: number;
  branch_id?: number;
  method?: string;
  status?: string;
  type?: string;
  date_from?: string;
  date_to?: string;
};
