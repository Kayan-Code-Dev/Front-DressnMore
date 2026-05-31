import { httpClient } from "@/shared/lib/http/client";
import { tenantPath } from "@/config/api";
import { buildQueryString } from "@/shared/lib/http/query";
import type { ListQueryParams, PaginatedResponse } from "@/shared/types/api";
import type { OverdueReturnItem, ReturnItem } from "@/features/returns/types/returns.types";

export async function listReturns(
  params: ListQueryParams = {},
): Promise<PaginatedResponse<ReturnItem>> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | null | undefined>);
  const response = await httpClient.get<ReturnItem[]>(tenantPath(`/returns${qs}`));
  return httpClient.unwrap(response) as PaginatedResponse<ReturnItem>;
}

export async function listOverdueReturns(
  params: ListQueryParams = {},
): Promise<PaginatedResponse<OverdueReturnItem>> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | null | undefined>);
  const response = await httpClient.get<OverdueReturnItem[]>(tenantPath(`/returns/overdue${qs}`));
  return httpClient.unwrap(response) as PaginatedResponse<OverdueReturnItem>;
}
