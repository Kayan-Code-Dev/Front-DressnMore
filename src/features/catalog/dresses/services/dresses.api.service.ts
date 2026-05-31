import { httpClient } from "@/shared/lib/http/client";
import { tenantPath } from "@/config/api";
import { buildQueryString } from "@/shared/lib/http/query";
import type { ApiSuccess, ListQueryParams, PaginatedResponse } from "@/shared/types/api";
import type {
  DressFilterParams,
  DressItem,
  DressPayload,
} from "@/features/catalog/dresses/types/dresses.types";

export async function listDresses(
  params: ListQueryParams<DressFilterParams> = {},
): Promise<PaginatedResponse<DressItem>> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | null | undefined>);
  const response = await httpClient.get<DressItem[]>(tenantPath(`/dresses${qs}`));
  return httpClient.unwrap(response) as PaginatedResponse<DressItem>;
}

export async function createDress(payload: DressPayload): Promise<ApiSuccess<DressItem>> {
  const response = await httpClient.post<DressItem>(tenantPath("/dresses"), payload);
  return httpClient.unwrap(response);
}

export async function updateDress(id: number, payload: DressPayload): Promise<ApiSuccess<DressItem>> {
  const response = await httpClient.put<DressItem>(tenantPath(`/dresses/${id}`), payload);
  return httpClient.unwrap(response);
}

export async function deleteDress(id: number): Promise<ApiSuccess<null>> {
  const response = await httpClient.delete<null>(tenantPath(`/dresses/${id}`));
  return httpClient.unwrap(response);
}

export async function getDress(id: number): Promise<ApiSuccess<DressItem>> {
  const response = await httpClient.get<DressItem>(tenantPath(`/dresses/${id}`));
  return httpClient.unwrap(response);
}
