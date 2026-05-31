import { httpClient } from "@/shared/lib/http/client";
import { tenantPath } from "@/config/api";
import { buildQueryString } from "@/shared/lib/http/query";
import type { ApiSuccess, ListQueryParams, PaginatedResponse } from "@/shared/types/api";
import type {
  SupplierFilterParams,
  SupplierItem,
  SupplierPayload,
} from "@/features/suppliers/types/suppliers.types";

export async function listSuppliers(
  params: ListQueryParams<SupplierFilterParams> = {},
): Promise<PaginatedResponse<SupplierItem>> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | null | undefined>);
  const response = await httpClient.get<SupplierItem[]>(tenantPath(`/suppliers${qs}`));
  return httpClient.unwrap(response) as PaginatedResponse<SupplierItem>;
}

export async function createSupplier(payload: SupplierPayload): Promise<ApiSuccess<SupplierItem>> {
  const response = await httpClient.post<SupplierItem>(tenantPath("/suppliers"), payload);
  return httpClient.unwrap(response);
}

export async function updateSupplier(
  id: number,
  payload: SupplierPayload,
): Promise<ApiSuccess<SupplierItem>> {
  const response = await httpClient.put<SupplierItem>(tenantPath(`/suppliers/${id}`), payload);
  return httpClient.unwrap(response);
}

export async function deleteSupplier(id: number): Promise<ApiSuccess<null>> {
  const response = await httpClient.delete<null>(tenantPath(`/suppliers/${id}`));
  return httpClient.unwrap(response);
}
