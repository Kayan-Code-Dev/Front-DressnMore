import { httpClient } from "@/shared/lib/http/client";
import { tenantPath } from "@/config/api";
import { buildQueryString } from "@/shared/lib/http/query";
import type { ListQueryParams, PaginatedResponse } from "@/shared/types/api";
import type {
  InvoiceReturnFilterParams,
  InvoiceReturnItem,
  InvoiceReturnStats,
  OverdueReturnItem,
} from "@/features/returns/types/returns.types";

export async function listInvoiceReturns(
  params: ListQueryParams<InvoiceReturnFilterParams> = {},
): Promise<PaginatedResponse<InvoiceReturnItem>> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | null | undefined>);
  const response = await httpClient.get<InvoiceReturnItem[]>(tenantPath(`/returns${qs}`));
  if (!response.success) throw new Error(response.message);
  return response as PaginatedResponse<InvoiceReturnItem>;
}

export async function getInvoiceReturnStats(
  params: InvoiceReturnFilterParams = {},
): Promise<InvoiceReturnStats> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | null | undefined>);
  const response = await httpClient.get<InvoiceReturnStats>(tenantPath(`/returns/stats${qs}`));
  if (!response.success) throw new Error(response.message);
  return response.data;
}

/** @deprecated Use listInvoiceReturns */
export async function listReturns(params: ListQueryParams = {}) {
  return listInvoiceReturns(params);
}

export async function listOverdueReturns(
  params: ListQueryParams = {},
): Promise<PaginatedResponse<OverdueReturnItem>> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | null | undefined>);
  const response = await httpClient.get<OverdueReturnItem[]>(tenantPath(`/returns/overdue${qs}`));
  return httpClient.unwrap(response) as PaginatedResponse<OverdueReturnItem>;
}
