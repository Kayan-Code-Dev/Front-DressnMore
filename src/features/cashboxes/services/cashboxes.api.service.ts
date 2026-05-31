import { httpClient } from "@/shared/lib/http/client";
import { tenantPath } from "@/config/api";
import { buildQueryString } from "@/shared/lib/http/query";
import type { PaginatedResponse, ListQueryParams } from "@/shared/types/api";
import type { CashboxItem, CashboxFilterParams } from "@/features/cashboxes/types/cashboxes.types";

export async function listCashboxes(
  params: ListQueryParams<CashboxFilterParams> = {},
): Promise<PaginatedResponse<CashboxItem>> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | null | undefined>);
  const response = await httpClient.get<CashboxItem[]>(tenantPath(`/cashboxes${qs}`));

  if (!response.success) {
    throw new Error(response.message);
  }

  return response as PaginatedResponse<CashboxItem>;
}
