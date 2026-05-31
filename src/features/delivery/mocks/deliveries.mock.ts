import type { DeliveryItem } from "@/features/delivery/types/deliveries.types";

export const deliveriesFixture: DeliveryItem[] = [
  {
    id: 1,
    order_id: "ORD-1001",
    client: "Amina K",
    employee: "Mona",
    cloth_name: "Classic Black",
    cloth_code: "DR-1001",
    delivery_date: "2026-06-10",
    status: "ready",
  },
  {
    id: 2,
    order_id: "ORD-1002",
    client: "Laila M",
    employee: "Hana",
    cloth_name: "Royal Blue",
    cloth_code: "DR-1002",
    delivery_date: "2026-06-12",
    status: "delivered",
  },
];
