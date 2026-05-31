import { httpClient } from "@/shared/lib/http/client";
import { tenantPath } from "@/config/api";
import { buildQueryString } from "@/shared/lib/http/query";
import type { ApiSuccess } from "@/shared/types/api";
import type { DashboardFilterParams, DashboardSummary } from "@/features/dashboard/types/dashboard.types";

export async function getDashboardOverview(
  params: DashboardFilterParams = {},
): Promise<ApiSuccess<DashboardSummary>> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | null | undefined>);
  const response = await httpClient.get<DashboardSummary>(tenantPath(`/dashboard/overview${qs}`));

  if (!response.success) {
    throw new Error(response.message);
  }

  return response;
}
