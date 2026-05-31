import { httpClient } from "@/shared/lib/http/client";
import { tenantPath } from "@/config/api";
import { buildQueryString } from "@/shared/lib/http/query";
import type { ApiSuccess, ListQueryParams, PaginatedResponse } from "@/shared/types/api";
import type {
  CustomerFilterParams,
  CustomerItem,
  CustomerPayload,
} from "@/features/customers/types/customers.types";

export async function listCustomers(
  params: ListQueryParams<CustomerFilterParams> = {},
): Promise<PaginatedResponse<CustomerItem>> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | null | undefined>);
  const response = await httpClient.get<CustomerItem[]>(tenantPath(`/customers${qs}`));
  return httpClient.unwrap(response) as PaginatedResponse<CustomerItem>;
}

export async function createCustomer(payload: CustomerPayload): Promise<ApiSuccess<CustomerItem>> {
  const response = await httpClient.post<CustomerItem>(tenantPath("/customers"), payload);
  return httpClient.unwrap(response);
}

export async function updateCustomer(
  id: number,
  payload: CustomerPayload,
): Promise<ApiSuccess<CustomerItem>> {
  const response = await httpClient.put<CustomerItem>(tenantPath(`/customers/${id}`), payload);
  return httpClient.unwrap(response);
}

export async function deleteCustomer(id: number): Promise<ApiSuccess<null>> {
  const response = await httpClient.delete<null>(tenantPath(`/customers/${id}`));
  return httpClient.unwrap(response);
}
