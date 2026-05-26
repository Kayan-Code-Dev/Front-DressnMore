import type { ReturnItem } from "@/features/returns/types/returns.types";

export const returnsFixture: ReturnItem[] = [
  {
    id: 1,
    order_id: "ORD-0901",
    client: "Nour H",
    employee: "Hana",
    cloth_name: "Pearl White",
    cloth_code: "DR-2001",
    return_date: "2026-06-15",
    status: "requested",
  },
  {
    id: 2,
    order_id: "ORD-0902",
    client: "Sara T",
    employee: "Mona",
    cloth_name: "Emerald Green",
    cloth_code: "DR-2002",
    return_date: "2026-06-17",
    status: "returned",
  },
];
