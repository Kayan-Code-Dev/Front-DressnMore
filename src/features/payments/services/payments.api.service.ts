import { httpClient } from "@/shared/lib/http/client";
import { tenantPath } from "@/config/api";
import { buildQueryString } from "@/shared/lib/http/query";
import type { ApiSuccess, ListQueryParams, PaginatedResponse } from "@/shared/types/api";
import type { PaymentFilterParams, PaymentItem } from "@/features/payments/types/payments.types";

export async function listPayments(
  params: ListQueryParams<PaymentFilterParams> = {},
): Promise<PaginatedResponse<PaymentItem>> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | null | undefined>);
  const response = await httpClient.get<PaymentItem[]>(tenantPath(`/payments${qs}`));
  return httpClient.unwrap(response) as PaginatedResponse<PaymentItem>;
}

export async function payPayment(id: number): Promise<ApiSuccess<PaymentItem>> {
  const response = await httpClient.post<PaymentItem>(tenantPath(`/payments/${id}/pay`), {});
  return httpClient.unwrap(response);
}

export async function cancelPayment(id: number): Promise<ApiSuccess<PaymentItem>> {
  const response = await httpClient.post<PaymentItem>(tenantPath(`/payments/${id}/cancel`), {});
  return httpClient.unwrap(response);
}
