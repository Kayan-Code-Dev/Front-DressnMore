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
  | "settings";

export const featureFlags = {
  useMockServices: true,

  modules: {
    auth: true,
    lookups: true,
    dashboard: false,
    customers: true,
    dresses: true,
    invoices: true,
    categories: true,
    subcategories: true,
    branches: true,
    deliveries: false,
    returns: false,
    payments: true,
    cashboxes: true,
    expenses: true,
    cashMovements: true,
    suppliers: false,
    purchaseOrders: false,
    supplierPayments: false,
    reports: false,
    accounting: false,
    settings: false,
  } satisfies Record<ModuleName, boolean>,
};

export function isModuleLive(module: ModuleName): boolean {
  return !featureFlags.useMockServices || featureFlags.modules[module];
}

export function resolveService<T>(module: ModuleName, mock: T, real: T): T {
  return isModuleLive(module) ? real : mock;
}
