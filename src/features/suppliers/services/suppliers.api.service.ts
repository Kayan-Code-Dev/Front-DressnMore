import { httpClient } from "@/shared/lib/http/client";
import { tenantPath } from "@/config/api";
import { buildQueryString } from "@/shared/lib/http/query";
import type { PaginatedResponse, ListQueryParams } from "@/shared/types/api";
import type { SupplierItem, SupplierFilterParams } from "@/features/suppliers/types/suppliers.types";

export async function listSuppliers(
  params: ListQueryParams<SupplierFilterParams> = {},
): Promise<PaginatedResponse<SupplierItem>> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | null | undefined>);
  const response = await httpClient.get<SupplierItem[]>(tenantPath(`/suppliers${qs}`));

  if (!response.success) {
    throw new Error(response.message);
  }

  return response as PaginatedResponse<SupplierItem>;
}
