export type RentalOrderStatus = "active" | "returned" | "overdue" | "cancelled" | "pending";

export type RentalPaymentStatus = "paid" | "partially_paid" | "unpaid";

export type RentalOrderCustomer = {
  name: string;
  national_id: string;
  phone: string;
  whatsapp: string;
  address: string;
};

export type RentalOrderItemPreview = {
  id: number;
  name: string;
};

export type RentalOrderItem = {
  id: number;
  cloth_name: string;
  cloth_code: string;
  size: string;
  color: string;
  rental_price: number;
  return_date: string;
};

export type OrderPayment = {
  id: number;
  amount: number;
  method: "cash" | "card" | "transfer";
  paid_at: string;
  notes?: string;
};

export type OrderCustody = {
  id: number;
  item_name: string;
  value: number;
  status: "held" | "returned";
  received_at: string;
};

export type RentalOrder = {
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
  status: RentalOrderStatus;
  payment_status?: RentalPaymentStatus;
  items_count: number;
  items_preview?: RentalOrderItemPreview[];
  items?: RentalOrderItem[];
  payments?: OrderPayment[];
  custodies?: OrderCustody[];
  notes?: string;
};

export type RentalOrderStats = {
  total: number;
  active: number;
  returned: number;
  overdue: number;
  revenue: number;
  collected: number;
  remaining: number;
};

export type DeliverySearchRow = {
  id: number;
  order_id: number;
  client_name: string;
  cloth_name: string;
  cloth_code: string;
  type: "delivery" | "return";
  scheduled_date: string;
  status: "pending" | "done" | "overdue";
  employee_name: string;
};

export type OrderFilterParams = {
  status?: RentalOrderStatus | "";
  client_name?: string;
  date_from?: string;
  date_to?: string;
};

export type DressOption = {
  id: number;
  name: string;
  code: string;
  category: string;
  size: string;
  color: string;
  rental_price: number;
  available: boolean;
};

export type CreateOrderDraft = {
  client_id?: number;
  client_name: string;
  client_phone: string;
  visit_date: string;
  delivery_date: string;
  return_date: string;
  employee_name: string;
  notes?: string;
  items: DressOption[];
};

export type RentalStatusFilter = RentalOrderStatus | "all";
