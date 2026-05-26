export type NavItem = {
  key: string;
  label: string;
  to: string;
  permission?: string;
  enabled: boolean;
  note?: string;
};

export const navConfig: NavItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    to: "/dashboard",
    enabled: true,
  },
  {
    key: "customers",
    label: "Customers",
    to: "/customers",
    permission: "customers.view",
    enabled: true,
  },
  {
    key: "dresses",
    label: "Dresses",
    to: "/dresses",
    permission: "dresses.view",
    enabled: true,
  },
  {
    key: "invoices",
    label: "Invoices",
    to: "/invoices",
    permission: "invoices.view",
    enabled: true,
  },
  {
    key: "branches",
    label: "Branches",
    to: "#",
    enabled: false,
    note: "TODO",
  },
  {
    key: "categories",
    label: "Categories",
    to: "#",
    enabled: false,
    note: "TODO",
  },
  {
    key: "subcategories",
    label: "Subcategories",
    to: "#",
    enabled: false,
    note: "TODO",
  },
  {
    key: "delivery-returns",
    label: "Delivery & Returns",
    to: "#",
    enabled: false,
    note: "TODO",
  },
  {
    key: "expenses",
    label: "Expenses",
    to: "#",
    enabled: false,
    note: "TODO",
  },
  {
    key: "cash-movements",
    label: "Cash Movements",
    to: "#",
    enabled: false,
    note: "TODO",
  },
  {
    key: "suppliers",
    label: "Suppliers",
    to: "#",
    enabled: false,
    note: "TODO",
  },
  {
    key: "reports",
    label: "Reports",
    to: "#",
    enabled: false,
    note: "TODO",
  },
  {
    key: "settings",
    label: "Settings",
    to: "#",
    enabled: false,
    note: "TODO",
  },
];
