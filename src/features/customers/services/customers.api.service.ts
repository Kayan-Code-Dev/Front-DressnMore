import { httpClient } from "@/shared/lib/http/client";
import { tenantPath } from "@/config/api";
import { buildQueryString } from "@/shared/lib/http/query";
import type { PaginatedResponse, ListQueryParams } from "@/shared/types/api";
import type { CustomerItem, CustomerFilterParams } from "@/features/customers/types/customers.types";

export async function listCustomers(
  params: ListQueryParams<CustomerFilterParams> = {},
): Promise<PaginatedResponse<CustomerItem>> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | null | undefined>);
  const response = await httpClient.get<CustomerItem[]>(tenantPath(`/customers${qs}`));

  if (!response.success) {
    throw new Error(response.message);
  }

  return response as PaginatedResponse<CustomerItem>;
}
