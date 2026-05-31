export type SalePaymentMethod = "cash" | "card" | "transfer";

export type SalePaymentStatus = "paid" | "partially_paid" | "unpaid";

export type SaleInvoiceStatus = "completed" | "in_progress" | "pending" | "cancelled";

export type SaleLineItem = {
  id: number;
  product_name: string;
  product_code: string;
  quantity: number;
  unit_price: number;
  total: number;
};

export type SaleInvoice = {
  id: number;
  invoice_number?: string;
  client_name: string;
  client_phone?: string;
  employee_name: string;
  branch_name: string;
  sale_date: string;
  payment_method: SalePaymentMethod;
  subtotal: number;
  discount: number;
  tax?: number;
  total: number;
  paid?: number;
  remaining?: number;
  collected_percent?: number;
  payment_status?: SalePaymentStatus;
  invoice_status?: SaleInvoiceStatus;
  notes?: string;
  items?: SaleLineItem[];
};

export type SaleInvoiceStats = {
  total: number;
  completed: number;
  in_progress: number;
  revenue: number;
  collected: number;
  remaining: number;
};

export type SaleInvoiceFilterParams = {
  search?: string;
  payment_status?: SalePaymentStatus | "";
  invoice_status?: SaleInvoiceStatus | "";
  branch_id?: number;
  date_from?: string;
  date_to?: string;
};

export type SalesReportSummary = {
  total_sales: number;
  invoices_count: number;
  average_invoice_value: number;
};

export type DailySalesRow = {
  date: string;
  invoices_count: number;
  total: number;
};

export type ProductSalesRow = {
  product_name: string;
  product_code: string;
  quantity_sold: number;
  revenue: number;
};

export type EmployeeSalesRow = {
  employee_name: string;
  invoices_count: number;
  total_sales: number;
};

export type SalesReportTab = "daily" | "products" | "by-employee";

export type CreateSaleFormData = {
  client_name: string;
  employee_name: string;
  branch_name: string;
  payment_method: SalePaymentMethod;
  discount: number;
  notes: string;
  items: SaleLineItem[];
};
