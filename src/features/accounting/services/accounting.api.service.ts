import { httpClient } from "@/shared/lib/http/client";
import { tenantPath } from "@/config/api";
import { buildQueryString } from "@/shared/lib/http/query";
import type { ApiSuccess } from "@/shared/types/api";
import type { AccountingSummary, LedgerEntry } from "@/features/accounting/types/accounting.types";

export type AccountingFilterParams = {
  period?: string;
  date_from?: string;
  date_to?: string;
  branch_id?: number;
  search?: string;
};

function qs(params: AccountingFilterParams = {}) {
  return buildQueryString(params as Record<string, string | number | boolean | null | undefined>);
}

export async function getAccountingSummary(
  params: AccountingFilterParams = {},
): Promise<ApiSuccess<AccountingSummary>> {
  const response = await httpClient.get<AccountingSummary>(tenantPath(`/accounting/summary${qs(params)}`));
  if (!response.success) throw new Error(response.message);
  return response;
}

export async function listLedger(
  params: AccountingFilterParams = {},
): Promise<ApiSuccess<LedgerEntry[]>> {
  const response = await httpClient.get<LedgerEntry[]>(tenantPath(`/accounting/ledger${qs(params)}`));
  if (!response.success) throw new Error(response.message);
  return response;
}
