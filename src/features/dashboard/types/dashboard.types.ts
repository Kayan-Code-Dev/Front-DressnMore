export type DashboardKpi = {
  key: string;
  label: string;
  value: string;
  trend: string;
};

export type DashboardKpiData = {
  orderCount?: number;
  totalRevenue?: number;
  averageOrderValue?: number;
  activeClients?: number;
  totalClients?: number;
  newClients?: number;
  clientGrowthRate?: number;
  availableItems?: number;
  totalItems?: number;
  outOfBranch?: number;
  utilizationRate?: number;
  totalPayments?: number;
  paymentCount?: number;
  totalActivities?: number;
};

export type DashboardCashboxBalance = {
  cashbox_id: number;
  name: string;
  balance: number;
};

export type DashboardFinancialData = {
  totalIncome?: number;
  totalExpenses?: number;
  profit?: number;
  profitMargin?: number;
  cashboxBalances?: DashboardCashboxBalance[];
  totalCashboxBalance?: number;
};

export type DashboardGrowthRates = {
  revenue?: number;
  sales?: number;
  rental?: number;
  tailoring?: number;
};

export type DashboardSalesByStatus = Record<string, number>;

export type DashboardRecentOrder = {
  id: number;
  invoice_number: string;
  customer_name: string;
  type: "rent" | "sale" | "tailoring";
  status: "draft" | "open" | "paid" | "cancelled";
  total: number;
  issued_on: string;
};

export type DashboardPeriod = {
  from: string;
  to: string;
};

export type DashboardFilterParams = {
  period?: "today" | "week" | "month" | "year" | "last_week" | "last_month";
  date_from?: string;
  date_to?: string;
  branch_id?: number;
};

export type DashboardSummary = {
  kpis: DashboardKpi[];
  cards: Array<{
    title: string;
    value: string;
    note: string;
  }>;
  kpiData?: DashboardKpiData;
  financialData?: DashboardFinancialData;
  growthRates?: DashboardGrowthRates;
  salesByStatus?: DashboardSalesByStatus;
  recentOrders?: DashboardRecentOrder[];
  period?: DashboardPeriod;
};
