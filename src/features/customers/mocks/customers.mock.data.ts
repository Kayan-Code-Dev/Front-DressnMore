import type { CustomerItem } from "@/features/customers/types/customers.types";

export const customersFixture: CustomerItem[] = [
  { id: 1, name: "Amina K", phone: "+201000000001", city: "Cairo", status: "vip", joined_at: "2026-01-02" },
  { id: 2, name: "Laila M", phone: "+201000000002", city: "Giza", status: "active", joined_at: "2026-02-11" },
  { id: 3, name: "Nour H", phone: "+201000000003", city: "Alexandria", status: "inactive", joined_at: "2025-12-30" },
  { id: 4, name: "Sara T", phone: "+201000000004", city: "Mansoura", status: "active", joined_at: "2026-03-05" },
];
