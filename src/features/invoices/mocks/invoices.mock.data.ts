import type { InvoiceItem } from "@/features/invoices/types/invoices.types";

export const invoicesFixture: InvoiceItem[] = [
  { id: 1, invoice_number: "INV-0001", customer_name: "Amina K", type: "rent", status: "open", total: 3200, issued_on: "2026-05-01" },
  { id: 2, invoice_number: "INV-0002", customer_name: "Laila M", type: "sale", status: "paid", total: 5400, issued_on: "2026-05-03" },
  { id: 3, invoice_number: "INV-0003", customer_name: "Nour H", type: "tailoring", status: "draft", total: 2600, issued_on: "2026-05-04" },
  { id: 4, invoice_number: "INV-0004", customer_name: "Sara T", type: "rent", status: "cancelled", total: 1800, issued_on: "2026-05-07" },
];
