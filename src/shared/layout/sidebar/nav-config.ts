export type NavItem = {
  key: string;
  label: string;
  to: string;
  permission?: string;
  enabled: boolean;
  note?: string;
};

export const navConfig: NavItem[] = [
  { key: "dashboard", label: "Dashboard", to: "/dashboard", enabled: true },

  { key: "customers", label: "Customers", to: "/customers", permission: "customers.view", enabled: true },
  { key: "dresses", label: "Dresses", to: "/dresses", permission: "dresses.view", enabled: true },
  { key: "invoices", label: "Invoices", to: "/invoices", permission: "invoices.view", enabled: true },

  { key: "categories", label: "Categories", to: "/categories", permission: "dress_categories.view", enabled: true },
  { key: "subcategories", label: "Subcategories", to: "/subcategories", permission: "dress_categories.view", enabled: true },
  { key: "branches", label: "Branches", to: "/branches", permission: "branches.view", enabled: true },

  { key: "deliveries", label: "Deliveries", to: "/deliveries", permission: "invoice_delivery.view", enabled: true },
  { key: "returns", label: "Returns", to: "/returns", permission: "invoice_delivery.view", enabled: true },
  { key: "overdue-returns", label: "Overdue Returns", to: "/overdue-returns", permission: "invoice_delivery.view", enabled: true },

  { key: "payments", label: "Payments", to: "/payments", permission: "payments.view", enabled: true },
  { key: "cashboxes", label: "Cashboxes", to: "/cashboxes", permission: "cashboxes.view", enabled: true },
  { key: "expenses", label: "Expenses", to: "/expenses", permission: "expenses.view", enabled: true },
  { key: "cash-movements", label: "Cash Movements", to: "/cash-movements", permission: "cash_movements.view", enabled: true },

  { key: "suppliers", label: "Suppliers", to: "/suppliers", permission: "suppliers.view", enabled: true },
  { key: "purchase-orders", label: "Purchase Orders", to: "/purchase-orders", permission: "purchase_orders.view", enabled: true },
  { key: "supplier-payments", label: "Supplier Payments", to: "/supplier-payments", permission: "supplier_payments.view", enabled: true },

  { key: "reports", label: "Reports", to: "/reports", permission: "reports.view", enabled: true },
  { key: "reports-sales", label: "Sales Reports", to: "/reports/sales", permission: "reports.sales", enabled: true },
  { key: "reports-tailoring", label: "Tailoring Reports", to: "/reports/tailoring", permission: "reports.tailoring", enabled: true },

  { key: "accounting", label: "Accounting", to: "/accounting", permission: "accounting.view", enabled: true },
  { key: "settings-account", label: "Account Settings", to: "/settings/account", permission: "settings.profile", enabled: true },

  { key: "settings-future", label: "Settings (Future)", to: "#", permission: "settings.view", enabled: false, note: "TODO" },
];
