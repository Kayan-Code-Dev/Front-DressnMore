import React from "react";
import {
  LayoutDashboard,
  Wallet,
  Receipt,
  Wallet2,
  FileText,
  Truck,
  RotateCcw,
  Clock,
  Banknote,
  Users,
  Package,
  Settings,
  ArrowRightLeft,
  Tags,
  FolderTree,
  Building2,
  ShoppingCart,
  FileBarChart,
} from "lucide-react";

const iconSize = 20;
const createIcon = (Icon: React.ComponentType<{ size?: number; className?: string }>, size = iconSize) =>
  React.createElement(Icon, { size, className: "shrink-0 text-current" });

export type SidebarLabel = {
  icon: string | null;
  label: string;
  path: string;
  level: number;
  subItems?: SidebarLabel[];
  permission?: string;
  permissions?: string[];
  iconComponent?: React.ReactNode | null;
  section?: string;
};

export const sidebarLabels: SidebarLabel[] = [
  {
    icon: null,
    label: "لوحة التحكم",
    path: "/dashboard",
    level: 1,
    section: "الرئيسية",
    permissions: ["dashboard.view"],
    iconComponent: createIcon(LayoutDashboard),
  },
  {
    icon: null,
    label: "العملاء",
    path: "/customers",
    level: 1,
    section: "العملاء",
    permissions: ["customers.view"],
    iconComponent: createIcon(Users),
  },
  {
    icon: null,
    label: "إدارة المنتجات",
    path: "/dresses",
    level: 1,
    section: "العمليات",
    permissions: ["dresses.view", "dress_categories.view"],
    iconComponent: createIcon(Package),
    subItems: [
      {
        icon: null,
        label: "المنتجات",
        path: "/dresses",
        level: 2,
        permissions: ["dresses.view"],
        iconComponent: createIcon(Package),
      },
      {
        icon: null,
        label: "الأقسام",
        path: "/categories",
        level: 2,
        permissions: ["dress_categories.view"],
        iconComponent: createIcon(Tags),
      },
      {
        icon: null,
        label: "الأقسام الفرعية",
        path: "/subcategories",
        level: 2,
        permissions: ["dress_categories.view"],
        iconComponent: createIcon(FolderTree),
      },
    ],
  },
  {
    icon: null,
    label: "الفواتير",
    path: "/invoices",
    level: 1,
    permissions: ["invoices.view"],
    iconComponent: createIcon(FileText),
  },
  {
    icon: null,
    label: "التسليم والارجاع",
    path: "/deliveries",
    level: 1,
    permissions: ["invoice_delivery.view"],
    iconComponent: createIcon(Truck),
    subItems: [
      {
        icon: null,
        label: "التسليمات",
        path: "/deliveries",
        level: 2,
        permissions: ["invoice_delivery.view"],
        iconComponent: createIcon(Truck),
      },
      {
        icon: null,
        label: "الارجاعات",
        path: "/returns",
        level: 2,
        permissions: ["invoice_delivery.view"],
        iconComponent: createIcon(RotateCcw),
      },
      {
        icon: null,
        label: "الارجاعات المتأخرة",
        path: "/overdue-returns",
        level: 2,
        permissions: ["invoice_delivery.view"],
        iconComponent: createIcon(Clock),
      },
    ],
  },
  {
    icon: null,
    label: "إدارة الحسابات",
    path: "/payments",
    level: 1,
    section: "المالية",
    permissions: ["payments.view", "cashboxes.view", "expenses.view", "cash_movements.view"],
    iconComponent: createIcon(Wallet),
    subItems: [
      {
        icon: null,
        label: "المدفوعات",
        path: "/payments",
        level: 2,
        permissions: ["payments.view"],
        iconComponent: createIcon(Receipt),
      },
      {
        icon: null,
        label: "المصروفات",
        path: "/expenses",
        level: 2,
        permissions: ["expenses.view"],
        iconComponent: createIcon(Wallet2),
      },
      {
        icon: null,
        label: "الخزنة",
        path: "/cashboxes",
        level: 2,
        permissions: ["cashboxes.view"],
        iconComponent: createIcon(Banknote),
      },
      {
        icon: null,
        label: "حركات النقد",
        path: "/cash-movements",
        level: 2,
        permissions: ["cash_movements.view"],
        iconComponent: createIcon(ArrowRightLeft),
      },
    ],
  },
  {
    icon: null,
    label: "الموردين",
    path: "/suppliers",
    level: 1,
    section: "الإدارة",
    permissions: ["suppliers.view", "purchase_orders.view", "supplier_payments.view"],
    iconComponent: createIcon(ShoppingCart),
    subItems: [
      {
        icon: null,
        label: "قائمة الموردين",
        path: "/suppliers",
        level: 2,
        permissions: ["suppliers.view"],
        iconComponent: createIcon(ShoppingCart),
      },
      {
        icon: null,
        label: "طلبيات الشراء",
        path: "/purchase-orders",
        level: 2,
        permissions: ["purchase_orders.view"],
        iconComponent: createIcon(FileText),
      },
      {
        icon: null,
        label: "مدفوعات الموردين",
        path: "/supplier-payments",
        level: 2,
        permissions: ["supplier_payments.view"],
        iconComponent: createIcon(Receipt),
      },
    ],
  },
  {
    icon: null,
    label: "الفروع",
    path: "/branches",
    level: 1,
    permissions: ["branches.view"],
    iconComponent: createIcon(Building2),
  },
  {
    icon: null,
    label: "التقارير",
    path: "/reports",
    level: 1,
    section: "التقارير",
    permissions: ["reports.view"],
    iconComponent: createIcon(FileBarChart),
  },
  {
    icon: null,
    label: "الإعدادات",
    path: "/settings/account",
    level: 1,
    section: "النظام",
    permissions: ["settings.profile"],
    iconComponent: createIcon(Settings),
  },
];
