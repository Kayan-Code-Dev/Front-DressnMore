/** Maps frontend module names to backend `enabled_modules` keys from `/me`. */
export const moduleToPlanKey: Record<string, string> = {
  dashboard: "dashboard",
  customers: "customers",
  categories: "categories",
  subcategories: "subcategories",
  dresses: "dresses",
  inventory: "inventory",
  branches: "branches",
  invoices: "invoices",
  deliveries: "deliveries",
  returns: "returns",
  payments: "payments",
  cashboxes: "cashboxes",
  expenses: "expenses",
  cashMovements: "cash_movements",
  suppliers: "suppliers",
  purchaseOrders: "purchase_orders",
  supplierPayments: "supplier_payments",
  reports: "reports",
  accounting: "accounting",
};

const pathModuleEntries: Array<[string, string]> = [
  ["/dashboard", "dashboard"],
  ["/customers", "customers"],
  ["/categories", "categories"],
  ["/subcategories", "subcategories"],
  ["/dresses", "dresses"],
  ["/inventory", "inventory"],
  ["/branches", "branches"],
  ["/invoices", "invoices"],
  ["/orders", "invoices"],
  ["/deliveries", "deliveries"],
  ["/returns", "returns"],
  ["/overdue-returns", "returns"],
  ["/payments", "payments"],
  ["/cashboxes", "cashboxes"],
  ["/expenses", "expenses"],
  ["/cash-movements", "cashMovements"],
  ["/treasury/entries", "accounting"],
  ["/suppliers", "suppliers"],
  ["/purchase-orders", "purchaseOrders"],
  ["/supplier-payments", "supplierPayments"],
  ["/reports", "reports"],
  ["/accounting", "accounting"],
];

export function resolveModuleForPath(pathname: string): string | null {
  const path = pathname.split("?")[0] ?? pathname;

  for (const [prefix, module] of pathModuleEntries) {
    if (path === prefix || path.startsWith(`${prefix}/`)) {
      return module;
    }
  }

  return null;
}
