import type { RentalOrderCustomer, RentalOrderItemPreview, RentalPaymentStatus } from "@/features/orders/types/orders.types";

export type InvoiceReturnStatus = "waiting" | "returned" | "late";

export type InvoiceReturnType = "scheduled" | "instant" | "late";

export type InvoiceReturnItem = {
  id: number;
  invoice_number?: string;
  client_name: string;
  client_phone: string;
  customer?: RentalOrderCustomer;
  employee_name: string;
  branch_name?: string;
  invoice_date?: string;
  event_date?: string;
  return_date: string;
  actual_return_date?: string;
  total_price: number;
  paid: number;
  remaining: number;
  payment_status?: RentalPaymentStatus;
  return_status: InvoiceReturnStatus;
  return_type: InvoiceReturnType;
  delay_days?: number;
  penalty_per_day?: number;
  penalty_amount?: number;
  penalty_paid?: number;
  penalty_due?: number;
  product_condition?: string;
  return_note?: string;
  items_preview?: RentalOrderItemPreview[];
};

export type InvoiceReturnStats = {
  total: number;
  late_returns: number;
  returned: number;
  waiting: number;
  max_delay_days: number;
  penalties_total: number;
  penalties_due: number;
  penalties_collected: number;
  revenue: number;
  status_distribution: Record<InvoiceReturnStatus, number>;
};

export type InvoiceReturnFilterParams = {
  search?: string;
  return_status?: InvoiceReturnStatus | "";
  return_type?: InvoiceReturnType | "";
  payment_status?: RentalPaymentStatus | "";
  employee_id?: number;
  branch_id?: number;
  return_date_from?: string;
  return_date_to?: string;
};

export type InvoiceReturnStatusFilter = InvoiceReturnStatus | "all";

/** @deprecated */
export type ReturnItem = {
  id: number;
  order_id: string;
  client: string;
  employee: string;
  cloth_name: string;
  cloth_code: string;
  return_date: string;
  status: "requested" | "returned";
};

export type OverdueReturnItem = {
  id: number;
  customer: string;
  invoice_number: string;
  item: string;
  delivery_date: string;
  expected_return_date: string;
  overdue_days: number;
  amount: number;
  status: "overdue" | "contacted" | "returned";
};
