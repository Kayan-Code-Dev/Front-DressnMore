import { httpClient } from "@/shared/lib/http/client";
import { tenantPath } from "@/config/api";
import { buildQueryString } from "@/shared/lib/http/query";
import type { ApiSuccess, ListQueryParams, PaginatedResponse } from "@/shared/types/api";
import type {
  ExpenseFilterParams,
  ExpenseItem,
  ExpensePayPayload,
  ExpensePayload,
  ExpenseSummary,
} from "@/features/expenses/types/expenses.types";

export async function listExpenses(
  params: ListQueryParams<ExpenseFilterParams> = {},
): Promise<PaginatedResponse<ExpenseItem>> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | null | undefined>);
  const response = await httpClient.get<ExpenseItem[]>(tenantPath(`/expenses${qs}`));
  return httpClient.unwrap(response) as PaginatedResponse<ExpenseItem>;
}

export async function getExpensesSummary(
  params: ExpenseFilterParams = {},
): Promise<ExpenseSummary> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | null | undefined>);
  const response = await httpClient.get<ExpenseSummary>(tenantPath(`/expenses/summary${qs}`));
  if (!response.success) throw new Error(response.message);
  return response.data;
}

export async function createExpense(payload: ExpensePayload): Promise<ApiSuccess<ExpenseItem>> {
  const response = await httpClient.post<ExpenseItem>(tenantPath("/expenses"), payload);
  return httpClient.unwrap(response);
}

export async function updateExpense(
  id: number,
  payload: ExpensePayload,
): Promise<ApiSuccess<ExpenseItem>> {
  const response = await httpClient.put<ExpenseItem>(tenantPath(`/expenses/${id}`), payload);
  return httpClient.unwrap(response);
}

export async function deleteExpense(id: number): Promise<ApiSuccess<null>> {
  const response = await httpClient.delete<null>(tenantPath(`/expenses/${id}`));
  return httpClient.unwrap(response);
}

export async function approveExpense(id: number): Promise<ApiSuccess<ExpenseItem>> {
  const response = await httpClient.post<ExpenseItem>(tenantPath(`/expenses/${id}/approve`), {});
  return httpClient.unwrap(response);
}

export async function cancelExpense(id: number): Promise<ApiSuccess<ExpenseItem>> {
  const response = await httpClient.post<ExpenseItem>(tenantPath(`/expenses/${id}/cancel`), {});
  return httpClient.unwrap(response);
}

export async function payExpense(
  id: number,
  payload: ExpensePayPayload = {},
): Promise<ApiSuccess<ExpenseItem>> {
  const response = await httpClient.post<ExpenseItem>(tenantPath(`/expenses/${id}/pay`), payload);
  return httpClient.unwrap(response);
}
