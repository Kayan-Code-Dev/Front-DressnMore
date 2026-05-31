import type { OverdueReturnItem, ReturnItem } from "@/features/returns/types/returns.types";

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

export const overdueReturnsFixture: OverdueReturnItem[] = [
  {
    id: 1,
    customer: "Amina K",
    invoice_number: "INV-0781",
    item: "Classic Black",
    delivery_date: "2026-05-20",
    expected_return_date: "2026-05-28",
    overdue_days: 8,
    amount: 1400,
    status: "overdue",
  },
  {
    id: 2,
    customer: "Laila M",
    invoice_number: "INV-0782",
    item: "Royal Blue",
    delivery_date: "2026-05-18",
    expected_return_date: "2026-05-24",
    overdue_days: 12,
    amount: 1800,
    status: "contacted",
  },
];
