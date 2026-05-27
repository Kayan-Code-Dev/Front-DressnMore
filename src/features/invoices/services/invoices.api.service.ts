import { httpClient } from "@/shared/lib/http/client";
import { tenantPath } from "@/config/api";
import { buildQueryString } from "@/shared/lib/http/query";
import type { PaginatedResponse, ListQueryParams } from "@/shared/types/api";
import type { InvoiceItem, InvoiceFilterParams } from "@/features/invoices/types/invoices.types";

export async function listInvoices(
  params: ListQueryParams<InvoiceFilterParams> = {},
): Promise<PaginatedResponse<InvoiceItem>> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | null | undefined>);
  const response = await httpClient.get<InvoiceItem[]>(tenantPath(`/invoices${qs}`));

  if (!response.success) {
    throw new Error(response.message);
  }

  return response as PaginatedResponse<InvoiceItem>;
}
