import { httpClient } from "@/shared/lib/http/client";
import { tenantPath } from "@/config/api";
import { buildQueryString } from "@/shared/lib/http/query";
import type { ListQueryParams, PaginatedResponse } from "@/shared/types/api";
import type { ExpenseCategoryItem } from "@/features/expenses/types/expenses.types";

export async function listExpenseCategories(
  params: ListQueryParams<{ search?: string; status?: string }> = {},
): Promise<PaginatedResponse<ExpenseCategoryItem>> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | null | undefined>);
  const response = await httpClient.get<ExpenseCategoryItem[]>(tenantPath(`/expense-categories${qs}`));
  return httpClient.unwrap(response) as PaginatedResponse<ExpenseCategoryItem>;
}
