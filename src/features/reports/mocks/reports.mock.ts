import type {
  ReportsOverview,
  SalesReportSummary,
  TailoringReportSummary,
} from "@/features/reports/types/reports.types";

export const reportsOverviewFixture: ReportsOverview = {
  total_sales: 312000,
  invoices_count: 126,
  average_invoice_value: 2476,
  total_orders: 94,
  ready_orders: 31,
  late_orders: 8,
  in_progress_orders: 55,
  total_revenue: 198400,
};

export const salesReportFixture: SalesReportSummary = {
  total_sales: 312000,
  invoices_count: 126,
  average_invoice_value: 2476,
};

export const tailoringReportFixture: TailoringReportSummary = {
  total_orders: 94,
  ready_orders: 31,
  late_orders: 8,
  in_progress_orders: 55,
  total_revenue: 198400,
};
