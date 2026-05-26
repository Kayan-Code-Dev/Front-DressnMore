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
