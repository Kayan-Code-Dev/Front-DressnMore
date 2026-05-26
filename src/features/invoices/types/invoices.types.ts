export type InvoiceItem = {
  id: number;
  invoice_number: string;
  customer_name: string;
  type: "rent" | "sale" | "tailoring";
  status: "draft" | "open" | "paid" | "cancelled";
  total: number;
  issued_on: string;
};
