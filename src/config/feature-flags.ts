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
    dresses: false,
    invoices: false,
    categories: false,
    subcategories: false,
    branches: false,
    deliveries: false,
    returns: false,
    payments: false,
    cashboxes: false,
    expenses: false,
    cashMovements: false,
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
