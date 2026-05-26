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
