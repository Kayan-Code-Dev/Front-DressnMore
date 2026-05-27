import { httpClient } from "@/shared/lib/http/client";
import { tenantPath } from "@/config/api";
import { buildQueryString } from "@/shared/lib/http/query";
import type { PaginatedResponse, ListQueryParams } from "@/shared/types/api";
import type { DressItem, DressFilterParams } from "@/features/catalog/dresses/types/dresses.types";

export async function listDresses(
  params: ListQueryParams<DressFilterParams> = {},
): Promise<PaginatedResponse<DressItem>> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | null | undefined>);
  const response = await httpClient.get<DressItem[]>(tenantPath(`/dresses${qs}`));

  if (!response.success) {
    throw new Error(response.message);
  }

  return response as PaginatedResponse<DressItem>;
}
