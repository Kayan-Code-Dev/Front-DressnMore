import { httpClient } from "@/shared/lib/http/client";
import { tenantPath } from "@/config/api";
import { buildQueryString } from "@/shared/lib/http/query";
import type { ApiSuccess, ListQueryParams, PaginatedResponse } from "@/shared/types/api";
import type {
  InvoiceDeliverPayload,
  InvoiceFilterParams,
  InvoiceItem,
  InvoicePaymentPayload,
  InvoiceReturnPayload,
} from "@/features/invoices/types/invoices.types";

export async function listInvoices(
  params: ListQueryParams<InvoiceFilterParams> = {},
): Promise<PaginatedResponse<InvoiceItem>> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | null | undefined>);
  const response = await httpClient.get<InvoiceItem[]>(tenantPath(`/invoices${qs}`));
  return httpClient.unwrap(response) as PaginatedResponse<InvoiceItem>;
}

export async function cancelInvoice(id: number): Promise<ApiSuccess<InvoiceItem>> {
  const response = await httpClient.post<InvoiceItem>(tenantPath(`/invoices/${id}/cancel`), {});
  return httpClient.unwrap(response);
}

export async function addInvoicePayment(
  id: number,
  payload: InvoicePaymentPayload,
): Promise<ApiSuccess<InvoiceItem>> {
  const response = await httpClient.post<InvoiceItem>(tenantPath(`/invoices/${id}/payments`), payload);
  return httpClient.unwrap(response);
}

export async function deliverInvoice(
  id: number,
  payload: InvoiceDeliverPayload = {},
): Promise<ApiSuccess<InvoiceItem>> {
  const response = await httpClient.post<InvoiceItem>(tenantPath(`/invoices/${id}/deliver`), payload);
  return httpClient.unwrap(response);
}

export async function returnInvoice(
  id: number,
  payload: InvoiceReturnPayload = {},
): Promise<ApiSuccess<InvoiceItem>> {
  const response = await httpClient.post<InvoiceItem>(tenantPath(`/invoices/${id}/return`), payload);
  return httpClient.unwrap(response);
}
