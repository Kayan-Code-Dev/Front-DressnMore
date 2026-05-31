import type { DashboardSummary } from "@/features/dashboard/types/dashboard.types";

export const dashboardMockData: DashboardSummary = {
  kpis: [
    { key: "revenue", label: "Revenue", value: "128,400", trend: "+8.2%" },
    { key: "orders", label: "Orders", value: "1,248", trend: "+5.1%" },
    { key: "customers", label: "Customers", value: "436", trend: "+3.7%" },
    { key: "returns", label: "Returns", value: "42", trend: "-1.2%" },
  ],
  cards: [
    { title: "Sales overview", value: "Stable", note: "Visual placeholder from old dashboard style" },
    { title: "Inventory health", value: "82%", note: "Mock metric only" },
    { title: "Payments summary", value: "64 pending", note: "Mock metric only" },
  ],
};
