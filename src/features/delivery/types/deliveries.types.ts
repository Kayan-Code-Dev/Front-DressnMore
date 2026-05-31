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
