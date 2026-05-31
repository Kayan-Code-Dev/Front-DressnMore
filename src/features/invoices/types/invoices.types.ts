export type InvoiceItem = {
  id: number;
  invoice_number: string;
  customer_id: number;
  branch_id: number | null;
  type: "rent" | "sale" | "tailoring";
  status:
    | "draft"
    | "confirmed"
    | "partially_paid"
    | "paid"
    | "delivered"
    | "returned"
    | "cancelled";
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paid_amount: number;
  remaining_amount: number;
  rent_start_date: string | null;
  rent_end_date: string | null;
  delivery_date: string | null;
  return_date: string | null;
  notes: string | null;
  created_at: string | null;
  branch?: { id: number; name: string } | null;
};

export type InvoiceFilterParams = {
  invoice_number?: string;
  customer_id?: number;
  branch_id?: number;
  type?: string;
  status?: string;
  payment_status?: string;
  date_from?: string;
  date_to?: string;
  visit_date_from?: string;
  visit_date_to?: string;
  delivery_date_from?: string;
  delivery_date_to?: string;
  occasion_date_from?: string;
  occasion_date_to?: string;
};

export type InvoicePaymentPayload = {
  amount: number;
  method?: string | null;
  reference?: string | null;
  paid_at?: string | null;
  notes?: string | null;
};

export type InvoiceDeliverPayload = {
  delivered_at?: string | null;
  receiver_name?: string | null;
  receiver_phone?: string | null;
  notes?: string | null;
};

export type InvoiceReturnPayload = {
  returned_at?: string | null;
  notes?: string | null;
  dress_status_after_return?: "available" | "maintenance" | null;
};
