export type SalePaymentMethod = "cash" | "card" | "transfer";

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
  client_name: string;
  employee_name: string;
  branch_name: string;
  sale_date: string;
  payment_method: SalePaymentMethod;
  subtotal: number;
  discount: number;
  total: number;
  notes?: string;
  items: SaleLineItem[];
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
