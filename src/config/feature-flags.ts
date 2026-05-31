import { env } from "@/shared/lib/env/env";import { sessionStore } from "@/shared/lib/auth/session.store";
import { moduleToPlanKey } from "@/config/plan-modules";

const hasApiBackend = Boolean(env.apiBaseUrl && env.apiBaseUrl !== "http://localhost:3000");

export type ModuleName =
  | "auth"
  | "lookups"
  | "dashboard"
  | "customers"
  | "dresses"
  | "invoices"
  | "categories"
  | "subcategories"
  | "branches"
  | "deliveries"
  | "returns"
  | "payments"
  | "cashboxes"
  | "expenses"
  | "cashMovements"
  | "suppliers"
  | "purchaseOrders"
  | "supplierPayments"
  | "reports"
  | "accounting"
  | "settings"
  | "subscription"
  | "orders"
  | "sales"
  | "tailoring"
  | "employees"
  | "workshop"
  | "factory"
  | "notifications"
  | "contentManagement"
  | "inventory";

export const featureFlags = {
  useMockServices: !hasApiBackend,

  modules: {
    auth: true,
    lookups: true,
    dashboard: true,
    customers: true,
    dresses: true,
    invoices: true,
    categories: true,
    subcategories: true,
    branches: true,
    deliveries: true,
    returns: true,
    payments: true,
    cashboxes: true,
    expenses: true,
    cashMovements: true,
    suppliers: true,
    purchaseOrders: true,
    supplierPayments: false,
    reports: true,
    accounting: true,
    settings: true,
    subscription: true,
    orders: true,
    sales: false,
    tailoring: false,
    employees: false,
    workshop: false,
    factory: false,
    notifications: false,
    contentManagement: false,
    inventory: false,
  } satisfies Record<ModuleName, boolean>,
};

export function isModuleEnabledByPlan(module: ModuleName): boolean {
  const planKey = moduleToPlanKey[module];
  if (!planKey) {
    return featureFlags.modules[module];
  }

  return sessionStore.isPlanModuleEnabled(planKey);
}

export function isModuleLive(module: ModuleName): boolean {
  if (featureFlags.useMockServices) {
    return featureFlags.modules[module];
  }

  return isModuleEnabledByPlan(module);
}

export function resolveService<T>(module: ModuleName, mock: T, real: T): T {
  return isModuleLive(module) ? real : mock;
}

