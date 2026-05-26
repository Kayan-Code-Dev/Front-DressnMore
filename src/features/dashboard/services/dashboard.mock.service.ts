import type { ApiSuccess } from "@/shared/types/api";
import type { DashboardSummary } from "@/features/dashboard/types/dashboard.types";
import { dashboardMockData } from "@/features/dashboard/mocks/dashboard.mock.data";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getDashboardMock(): Promise<ApiSuccess<DashboardSummary>> {
  await delay(200);
  return {
    success: true,
    message: "Success",
    data: dashboardMockData,
    meta: {
      generated_at: new Date().toISOString(),
    },
  };
}
