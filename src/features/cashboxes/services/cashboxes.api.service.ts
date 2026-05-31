import { httpClient } from "@/shared/lib/http/client";
import { tenantPath } from "@/config/api";
import { buildQueryString } from "@/shared/lib/http/query";
import type { ApiSuccess, ListQueryParams, PaginatedResponse } from "@/shared/types/api";
import type {
  CashboxFilterParams,
  CashboxItem,
  CashboxPayload,
} from "@/features/cashboxes/types/cashboxes.types";

export async function listCashboxes(
  params: ListQueryParams<CashboxFilterParams> = {},
): Promise<PaginatedResponse<CashboxItem>> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | null | undefined>);
  const response = await httpClient.get<CashboxItem[]>(tenantPath(`/cashboxes${qs}`));
  return httpClient.unwrap(response) as PaginatedResponse<CashboxItem>;
}

export async function createCashbox(payload: CashboxPayload): Promise<ApiSuccess<CashboxItem>> {
  const response = await httpClient.post<CashboxItem>(tenantPath("/cashboxes"), payload);
  return httpClient.unwrap(response);
}

export async function updateCashbox(
  id: number,
  payload: CashboxPayload,
): Promise<ApiSuccess<CashboxItem>> {
  const response = await httpClient.put<CashboxItem>(tenantPath(`/cashboxes/${id}`), payload);
  return httpClient.unwrap(response);
}

export async function deleteCashbox(id: number): Promise<ApiSuccess<null>> {
  const response = await httpClient.delete<null>(tenantPath(`/cashboxes/${id}`));
  return httpClient.unwrap(response);
}
