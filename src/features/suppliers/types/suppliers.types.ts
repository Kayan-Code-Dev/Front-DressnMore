export type SupplierItem = {
  id: number;
  code: string;
  name: string;
  phone: string;
  address: string;
  current_balance: number;
  status: "active" | "inactive";
};

export type PurchaseOrderItem = {
  id: number;
  purchase_order_number: string;
  supplier: string;
  status: "open" | "partially_paid" | "paid" | "returned";
  total: number;
  paid_amount: number;
  remaining_amount: number;
  order_date: string;
};
