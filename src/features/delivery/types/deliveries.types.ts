import type {
  RentalOrderCustomer,
  RentalOrderItemPreview,
  RentalPaymentStatus,
} from "@/features/orders/types/orders.types";

export type InvoiceDeliveryStatus =
  | "waiting"
  | "received"
  | "delivered"
  | "returned"
  | "late";

export type InvoiceDeliveryItem = {
  id: number;
  invoice_number?: string;
  client_name: string;
  client_phone: string;
  customer?: RentalOrderCustomer;
  employee_name: string;
  branch_name?: string;
  invoice_date?: string;
  visit_date: string;
  delivery_date: string;
  event_date?: string;
  return_date: string;
  total_price: number;
  tax?: number;
  paid: number;
  remaining: number;
  payment_status?: RentalPaymentStatus;
  delivery_status: InvoiceDeliveryStatus;
  delay_days?: number;
  items_count: number;
  items_preview?: RentalOrderItemPreview[];
};

export type InvoiceDeliveryStats = {
  total: number;
  today_weddings: number;
  waiting_delivery: number;
  late_returns: number;
  revenue: number;
  collected: number;
  remaining: number;
  status_distribution: Record<InvoiceDeliveryStatus, number>;
};

export type InvoiceDeliveryFilterParams = {
  search?: string;
  payment_status?: RentalPaymentStatus | "";
  delivery_status?: InvoiceDeliveryStatus | "";
  employee_id?: number;
  branch_id?: number;
  event_date_from?: string;
  event_date_to?: string;
};

export type InvoiceDeliveryStatusFilter = InvoiceDeliveryStatus | "all";

/** @deprecated Use InvoiceDeliveryItem */
export type DeliveryItem = {
  id: number;
  order_id: string;
  client: string;
  employee: string;
  cloth_name: string;
  cloth_code: string;
  delivery_date: string;
  status: "ready" | "delivered";
};
