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

export type SupplierPaymentItem = {
  id: number;
  supplier: string;
  purchase_order_number: string;
  amount: number;
  method: "cash" | "bank_transfer" | "check";
  reference: string;
  paid_at: string;
  notes: string;
};
