export type NotificationCategory =
  | "sales"
  | "rental"
  | "tailoring"
  | "treasury"
  | "delivery"
  | "employees"
  | "suppliers"
  | "customers"
  | "inventory"
  | "system";

export type NotificationPriority = "urgent" | "high" | "normal" | "low";

export type NotificationItem = {
  id: number;
  title: string;
  message: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  read_at: string | null;
  created_at: string;
  action_url?: string;
};

export type NotificationStats = {
  total: number;
  read: number;
  unread: number;
};
