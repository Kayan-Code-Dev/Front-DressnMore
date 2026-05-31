import ReactECharts from "echarts-for-react";
import type { DashboardSalesByStatus } from "@/features/dashboard/types/dashboard.types";

const statusLabels: Record<string, string> = {
  draft: "مسودة",
  open: "مفتوحة",
  paid: "مدفوعة",
  cancelled: "ملغاة",
};

const statusColors: Record<string, string> = {
  draft: "#94A3B8",
  open: "#0EA5E9",
  paid: "#10B981",
  cancelled: "#EF4444",
};

type DashboardSalesChartProps = {
  data: DashboardSalesByStatus;
};

export function DashboardSalesChart({ data }: DashboardSalesChartProps) {
  const entries = Object.entries(data).filter(([, value]) => value > 0);

  const option = {
    tooltip: {
      trigger: "item" as const,
      formatter: "{b}: {c} ({d}%)",
    },
    legend: {
      orient: "horizontal" as const,
      bottom: 0,
      textStyle: { fontSize: 11, color: "#64748B" },
    },
    series: [
      {
        type: "pie" as const,
        radius: ["42%", "68%"],
        center: ["50%", "44%"],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 6,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: { show: false },
        data: entries.map(([key, value]) => ({
          name: statusLabels[key] ?? key,
          value,
          itemStyle: { color: statusColors[key] ?? "#6366F1" },
        })),
      },
    ],
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: 280, width: "100%" }}
      opts={{ renderer: "svg" }}
    />
  );
}
