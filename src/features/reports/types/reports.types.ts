export type ReportsOverview = {
  total_sales: number;
  invoices_count: number;
  average_invoice_value: number;
  total_orders: number;
  ready_orders: number;
  late_orders: number;
  in_progress_orders: number;
  total_revenue: number;
};

export type SalesReportSummary = {
  total_sales: number;
  invoices_count: number;
  average_invoice_value: number;
};

export type TailoringReportSummary = {
  total_orders: number;
  ready_orders: number;
  late_orders: number;
  in_progress_orders: number;
  total_revenue: number;
};
