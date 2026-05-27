import { httpClient } from "@/shared/lib/http/client";
import { tenantPath } from "@/config/api";
import { buildQueryString } from "@/shared/lib/http/query";
import type { PaginatedResponse, ListQueryParams } from "@/shared/types/api";
import type { CategoryItem, DressCategoryFilterParams } from "@/features/catalog/categories/types/categories.types";

export async function listDressCategories(
  params: ListQueryParams<DressCategoryFilterParams> = {},
): Promise<PaginatedResponse<CategoryItem>> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | null | undefined>);
  const response = await httpClient.get<CategoryItem[]>(tenantPath(`/dress-categories${qs}`));

  if (!response.success) {
    throw new Error(response.message);
  }

  return response as PaginatedResponse<CategoryItem>;
}
