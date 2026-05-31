export type TailoringOrderStatus = "active" | "completed" | "overdue" | "cancelled";
export type TailoringPriority = "VIP" | "urgent" | "normal";
export type TailoringStage =
  | "new_order"
  | "fabric_receipt"
  | "cutting"
  | "sewing"
  | "finishing"
  | "quality_review"
  | "ready_for_delivery"
  | "delivered";

export type TailoringPaymentStatus = "paid" | "partial" | "unpaid";

export type TailoringMeasurement = {
  id: number;
  label: string;
  value: string;
  unit: string;
};

export type TailoringCustomer = {
  name: string;
  phone?: string;
  whatsapp?: string;
  national_id?: string;
  address?: string;
  district?: string;
  neighborhood?: string;
  tag?: string;
};

export type TailoringProgressEntry = {
  id: number;
  stage: TailoringStage;
  stage_label: string;
  date: string;
  by: string;
  note?: string;
};

export type TailoringOrder = {
  id: number;
  order_number: string;
  client_name: string;
  client_phone: string;
  employee_name: string;
  tailor_name?: string;
  branch_name?: string;
  garment_name: string;
  fabric_name: string;
  fabric_code: string;
  fabric_type?: string;
  fabric_color?: string;
  fabric_color_hex?: string;
  fabric_quantity?: string;
  fabric_supplier?: string;
  design_description?: string;
  design_style?: string;
  order_date: string;
  due_date: string;
  delivery_date?: string;
  occasion_date?: string;
  visit_date?: string;
  status: TailoringOrderStatus;
  priority: TailoringPriority;
  payment_status: TailoringPaymentStatus;
  current_stage: TailoringStage;
  days_remaining?: number;
  days_remaining_label?: string;
  total_price: number;
  paid: number;
  remaining: number;
  notes?: string;
  stages_completed?: number;
  stages_total?: number;
  progress_percent?: number;
  customer?: TailoringCustomer;
  measurements?: TailoringMeasurement[];
  progress_log?: TailoringProgressEntry[];
  payments_count?: number;
};

export type TailoringDelivery = {
  id: number;
  order_id: number;
  client_name: string;
  fabric_name: string;
  garment_name?: string;
  scheduled_date: string;
  status: "pending" | "delivered" | "overdue";
  employee_name: string;
  total_price?: number;
  whatsapp?: string;
};

export type TailoringOrderStats = {
  total: number;
  active: number;
  in_progress: number;
  overdue: number;
  ready: number;
  completed: number;
  vip_count: number;
  revenue: number;
  collected: number;
  remaining: number;
  unpaid_count: number;
  stage_distribution: Partial<Record<TailoringStage, number>>;
};

export type TailoringFilterParams = {
  status?: TailoringOrderStatus | "all";
  stage?: TailoringStage | "all";
  priority?: TailoringPriority | "all";
  search?: string;
};

export type CreateTailoringOrderPayload = {
  customer_id: number;
  branch_id: number;
  garment_name: string;
  fabric_description?: string;
  tailoring_due_date: string;
  occasion_datetime?: string;
  visit_datetime?: string;
  unit_price: number;
  paid_amount?: number;
  order_notes?: string;
  priority?: TailoringPriority;
};
