export type PaymentItem = {
  id: number;
  customer: string;
  branch: string;
  amount: number;
  status: "pending" | "paid" | "cancelled";
  payment_type: "initial" | "normal" | "fee";
  payment_date: string;
  created_at: string;
  notes: string;
  order_number: string;
};
