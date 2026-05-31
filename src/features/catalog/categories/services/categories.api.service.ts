import { httpClient } from "@/shared/lib/http/client";
import { tenantPath } from "@/config/api";
import { buildQueryString } from "@/shared/lib/http/query";
import type { ApiSuccess, ListQueryParams, PaginatedResponse } from "@/shared/types/api";
import type {
  CategoryItem,
  CategoryPayload,
  DressCategoryFilterParams,
} from "@/features/catalog/categories/types/categories.types";

export async function listDressCategories(
  params: ListQueryParams<DressCategoryFilterParams> = {},
): Promise<PaginatedResponse<CategoryItem>> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | null | undefined>);
  const response = await httpClient.get<CategoryItem[]>(tenantPath(`/dress-categories${qs}`));
  return httpClient.unwrap(response) as PaginatedResponse<CategoryItem>;
}

export async function createDressCategory(payload: CategoryPayload): Promise<ApiSuccess<CategoryItem>> {
  const response = await httpClient.post<CategoryItem>(tenantPath("/dress-categories"), payload);
  return httpClient.unwrap(response);
}

export async function updateDressCategory(
  id: number,
  payload: CategoryPayload,
): Promise<ApiSuccess<CategoryItem>> {
  const response = await httpClient.put<CategoryItem>(tenantPath(`/dress-categories/${id}`), payload);
  return httpClient.unwrap(response);
}

export async function deleteDressCategory(id: number): Promise<ApiSuccess<null>> {
  const response = await httpClient.delete<null>(tenantPath(`/dress-categories/${id}`));
  return httpClient.unwrap(response);
}
