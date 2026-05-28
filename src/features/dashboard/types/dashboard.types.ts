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

export type DashboardFinancialData = {
  totalIncome?: number;
  totalExpenses?: number;
  profit?: number;
  profitMargin?: number;
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
};
