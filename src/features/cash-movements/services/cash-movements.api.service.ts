import { httpClient } from "@/shared/lib/http/client";
import { tenantPath } from "@/config/api";
import { buildQueryString } from "@/shared/lib/http/query";
import type { ApiSuccess, ListQueryParams, PaginatedResponse } from "@/shared/types/api";
import type {
  CashMovementFilterParams,
  CashMovementItem,
  CashMovementPayload,
} from "@/features/cash-movements/types/cash-movements.types";

export async function listCashMovements(
  params: ListQueryParams<CashMovementFilterParams> = {},
): Promise<PaginatedResponse<CashMovementItem>> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | null | undefined>);
  const response = await httpClient.get<CashMovementItem[]>(tenantPath(`/cash-movements${qs}`));
  return httpClient.unwrap(response) as PaginatedResponse<CashMovementItem>;
}

export async function createCashMovement(
  payload: CashMovementPayload,
): Promise<ApiSuccess<CashMovementItem>> {
  const response = await httpClient.post<CashMovementItem>(tenantPath("/cash-movements"), payload);
  return httpClient.unwrap(response);
}
