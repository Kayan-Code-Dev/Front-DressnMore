import type { MockLoginResult } from "@/features/auth/types/auth.types";

export const mockLoginData: MockLoginResult = {
  token: "mock-token-001",
  workspace: "main-workspace",
  tenant: {
    id: "tenant-001",
    slug: "main-workspace",
    name: "DressnMore Tenant",
  },
  user: {
    id: 1,
    name: "Demo User",
    email: "demo@dressnmore.local",
  },
  permissions: [
    "customers.view",
    "dresses.view",
    "invoices.view",
    "dress_categories.view",
    "branches.view",
    "invoice_delivery.view",
    "expenses.view",
    "cash_movements.view",
    "suppliers.view",
    "purchase_orders.view",
  ],
  plan: {
    code: "pro",
    name: "Pro",
  },
};
