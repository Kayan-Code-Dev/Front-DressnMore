export type TailoringOrderStatus = "active" | "completed" | "overdue" | "cancelled";
export type TailoringPriority = "VIP" | "urgent" | "normal";
export type TailoringStage = "measurements" | "cutting" | "sewing" | "finishing" | "ready_for_delivery";

export type TailoringMeasurement = {
  id: number;
  label: string;
  value: string;
  unit: string;
};

export type TailoringOrder = {
  id: number;
  client_name: string;
  client_phone: string;
  employee_name: string;
  fabric_name: string;
  fabric_code: string;
  order_date: string;
  due_date: string;
  delivery_date?: string;
  status: TailoringOrderStatus;
  priority: TailoringPriority;
  current_stage: TailoringStage;
  total_price: number;
  paid: number;
  remaining: number;
  notes?: string;
  measurements?: TailoringMeasurement[];
};

export type TailoringDelivery = {
  id: number;
  order_id: number;
  client_name: string;
  fabric_name: string;
  scheduled_date: string;
  status: "pending" | "delivered" | "overdue";
  employee_name: string;
};

export type TailoringOrderStats = {
  total: number;
  active: number;
  overdue: number;
  ready: number;
  revenue: number;
};

export type TailoringFilterParams = {
  status?: TailoringOrderStatus;
  stage?: TailoringStage;
  priority?: TailoringPriority;
};
