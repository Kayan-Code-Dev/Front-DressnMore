import { httpClient } from "@/shared/lib/http/client";
import { tenantPath } from "@/config/api";
import { buildQueryString } from "@/shared/lib/http/query";
import type { ListQueryParams, PaginatedResponse } from "@/shared/types/api";
import type { FactoryItem } from "@/features/factory/types/factory.types";

export async function listFactories(
  params: ListQueryParams = {},
): Promise<PaginatedResponse<FactoryItem>> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | null | undefined>);
  const response = await httpClient.get<FactoryItem[]>(tenantPath(`/factories${qs}`));
  if (!response.success) throw new Error(response.message);
  return response as PaginatedResponse<FactoryItem>;
}
