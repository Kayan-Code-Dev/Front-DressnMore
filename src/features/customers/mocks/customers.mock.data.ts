import type { CustomerItem } from "@/features/customers/types/customers.types";

export const customersFixture: CustomerItem[] = [
  { id: 1, name: "Amina K", phone: "+201000000001", email: null, city_id: 1, status: "active", created_at: "2026-01-02T00:00:00.000Z" },
  { id: 2, name: "Laila M", phone: "+201000000002", email: null, city_id: 2, status: "active", created_at: "2026-02-11T00:00:00.000Z" },
  { id: 3, name: "Nour H", phone: "+201000000003", email: null, city_id: 3, status: "inactive", created_at: "2025-12-30T00:00:00.000Z" },
  { id: 4, name: "Sara T", phone: "+201000000004", email: "sara@example.com", city_id: 4, status: "active", created_at: "2026-03-05T00:00:00.000Z" },
];
