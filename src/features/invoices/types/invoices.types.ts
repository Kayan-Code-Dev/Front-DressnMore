export type InvoiceItem = {
  id: number;
  invoice_number: string;
  customer_name: string;
  type: "rent" | "sale" | "tailoring";
  status: "draft" | "open" | "paid" | "cancelled";
  total: number;
  issued_on: string;
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
