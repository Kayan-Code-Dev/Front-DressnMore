import { httpClient } from "@/shared/lib/http/client";
import { tenantPath } from "@/config/api";
import { buildQueryString } from "@/shared/lib/http/query";
import type { PaginatedResponse, ListQueryParams } from "@/shared/types/api";
import type { ExpenseItem, ExpenseFilterParams } from "@/features/expenses/types/expenses.types";

export async function listExpenses(
  params: ListQueryParams<ExpenseFilterParams> = {},
): Promise<PaginatedResponse<ExpenseItem>> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | null | undefined>);
  const response = await httpClient.get<ExpenseItem[]>(tenantPath(`/expenses${qs}`));

  if (!response.success) {
    throw new Error(response.message);
  }

  return response as PaginatedResponse<ExpenseItem>;
}
