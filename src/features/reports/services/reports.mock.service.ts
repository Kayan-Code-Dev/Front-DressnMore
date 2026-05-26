import type { ApiSuccess } from "@/shared/types/api";
import type {
  ReportsOverview,
  SalesReportSummary,
  TailoringReportSummary,
} from "@/features/reports/types/reports.types";
import {
  reportsOverviewFixture,
  salesReportFixture,
  tailoringReportFixture,
} from "@/features/reports/mocks/reports.mock";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getReportsOverviewMock(): Promise<ApiSuccess<ReportsOverview>> {
  await delay(180);
  return {
    success: true,
    message: "Success",
    data: reportsOverviewFixture,
    meta: null,
  };
}

export async function getSalesReportMock(): Promise<ApiSuccess<SalesReportSummary>> {
  await delay(180);
  return {
    success: true,
    message: "Success",
    data: salesReportFixture,
    meta: null,
  };
}

export async function getTailoringReportMock(): Promise<ApiSuccess<TailoringReportSummary>> {
  await delay(180);
  return {
    success: true,
    message: "Success",
    data: tailoringReportFixture,
    meta: null,
  };
}
