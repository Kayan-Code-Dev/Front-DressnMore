import { httpClient } from "@/shared/lib/http/client";
import { tenantPath } from "@/config/api";
import { buildQueryString } from "@/shared/lib/http/query";
import type { ApiSuccess, ListQueryParams, PaginatedResponse } from "@/shared/types/api";
import type {
  CashboxDailySummary,
  CashboxFilterParams,
  CashboxItem,
  CashboxPayload,
  CashboxTransaction,
} from "@/features/cashboxes/types/cashboxes.types";

function toApiParams(params: ListQueryParams<CashboxFilterParams> = {}) {
  const { status, is_active, ...rest } = params;
  const mapped: Record<string, string | number | boolean | null | undefined> = { ...rest };

  if (status === "active") mapped.is_active = true;
  else if (status === "inactive") mapped.is_active = false;
  else if (is_active !== undefined) mapped.is_active = is_active;

  return mapped;
}

export async function listCashboxes(
  params: ListQueryParams<CashboxFilterParams> = {},
): Promise<PaginatedResponse<CashboxItem>> {
  const qs = buildQueryString(toApiParams(params));
  const response = await httpClient.get<CashboxItem[]>(tenantPath(`/cashboxes${qs}`));
  return httpClient.unwrap(response) as PaginatedResponse<CashboxItem>;
}

export async function getCashboxDailySummary(
  params: Pick<CashboxFilterParams, "branch_id"> & { cashbox_id?: number; date_from?: string; date_to?: string } = {},
): Promise<ApiSuccess<CashboxDailySummary>> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | null | undefined>);
  const response = await httpClient.get<CashboxDailySummary>(tenantPath(`/cashboxes/daily-summary${qs}`));
  return httpClient.unwrap(response);
}

export async function createCashbox(payload: CashboxPayload): Promise<ApiSuccess<CashboxItem>> {
  const response = await httpClient.post<CashboxItem>(tenantPath("/cashboxes"), payload);
  return httpClient.unwrap(response);
}

export async function updateCashbox(
  id: number,
  payload: CashboxPayload,
): Promise<ApiSuccess<CashboxItem>> {
  const response = await httpClient.put<CashboxItem>(tenantPath(`/cashboxes/${id}`), payload);
  return httpClient.unwrap(response);
}

export async function deleteCashbox(id: number): Promise<ApiSuccess<null>> {
  const response = await httpClient.delete<null>(tenantPath(`/cashboxes/${id}`));
  return httpClient.unwrap(response);
}

export async function getCashbox(id: number): Promise<ApiSuccess<CashboxItem>> {
  const response = await httpClient.get<CashboxItem>(tenantPath(`/cashboxes/${id}`));
  return httpClient.unwrap(response);
}

type ApiCashMovement = {
  id: number;
  cashbox_id: number;
  movement_date?: string | null;
  direction?: string | null;
  reference?: string | null;
  description?: string | null;
  amount: number;
  balance_after?: number | null;
  created_by?: number | string | null;
};

export async function listCashboxTransactions(
  cashboxId: number,
  params: ListQueryParams = {},
): Promise<PaginatedResponse<CashboxTransaction>> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | null | undefined>);
  const response = await httpClient.get<ApiCashMovement[]>(
    tenantPath(`/cashboxes/${cashboxId}/transactions${qs}`),
  );
  const unwrapped = httpClient.unwrap(response) as PaginatedResponse<ApiCashMovement>;

  return {
    ...unwrapped,
    data: (unwrapped.data ?? []).map((row) => ({
      id: row.id,
      cashbox_id: row.cashbox_id,
      date: row.movement_date?.slice(0, 10) ?? "",
      type: row.direction === "in" ? "in" : "out",
      reference: row.reference ?? "",
      description: row.description ?? "",
      amount: Number(row.amount),
      balance_after: Number(row.balance_after ?? 0),
      created_by: String(row.created_by ?? ""),
    })),
  };
}
