import { httpClient } from "@/shared/lib/http/client";
import { tenantPath } from "@/config/api";
import { buildQueryString } from "@/shared/lib/http/query";
import type { PaginatedResponse, ListQueryParams } from "@/shared/types/api";
import type { CashMovementItem, CashMovementFilterParams } from "@/features/cash-movements/types/cash-movements.types";

export async function listCashMovements(
  params: ListQueryParams<CashMovementFilterParams> = {},
): Promise<PaginatedResponse<CashMovementItem>> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | null | undefined>);
  const response = await httpClient.get<CashMovementItem[]>(tenantPath(`/cash-movements${qs}`));

  if (!response.success) {
    throw new Error(response.message);
  }

  return response as PaginatedResponse<CashMovementItem>;
}
