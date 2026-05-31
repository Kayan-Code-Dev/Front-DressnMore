import { httpClient } from "@/shared/lib/http/client";
import { tenantPath } from "@/config/api";
import { buildQueryString } from "@/shared/lib/http/query";
import type { ApiSuccess } from "@/shared/types/api";
import type {
  ReportsOverview,
  SalesReportSummary,
  TailoringReportSummary,
} from "@/features/reports/types/reports.types";

export type ReportFilterParams = {
  period?: string;
  date_from?: string;
  date_to?: string;
  branch_id?: number;
};

function qs(params: ReportFilterParams = {}) {
  return buildQueryString(params as Record<string, string | number | boolean | null | undefined>);
}

export async function getReportsOverview(
  params: ReportFilterParams = {},
): Promise<ApiSuccess<ReportsOverview>> {
  const response = await httpClient.get<ReportsOverview>(tenantPath(`/reports/overview${qs(params)}`));
  if (!response.success) throw new Error(response.message);
  return response;
}

export async function getSalesReport(
  params: ReportFilterParams = {},
): Promise<ApiSuccess<SalesReportSummary>> {
  const response = await httpClient.get<SalesReportSummary>(tenantPath(`/reports/sales${qs(params)}`));
  if (!response.success) throw new Error(response.message);
  return response;
}

export async function getTailoringReport(
  params: ReportFilterParams = {},
): Promise<ApiSuccess<TailoringReportSummary>> {
  const response = await httpClient.get<TailoringReportSummary>(tenantPath(`/reports/tailoring${qs(params)}`));
  if (!response.success) throw new Error(response.message);
  return response;
}
