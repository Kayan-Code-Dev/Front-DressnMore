export type DashboardKpi = {
  key: string;
  label: string;
  value: string;
  trend: string;
};

export type DashboardSummary = {
  kpis: DashboardKpi[];
  cards: Array<{
    title: string;
    value: string;
    note: string;
  }>;
};
