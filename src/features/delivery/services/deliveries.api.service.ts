import { httpClient } from "@/shared/lib/http/client";
import { tenantPath } from "@/config/api";
import { buildQueryString } from "@/shared/lib/http/query";
import type { ListQueryParams, PaginatedResponse } from "@/shared/types/api";
import type {
  InvoiceDeliveryFilterParams,
  InvoiceDeliveryItem,
  InvoiceDeliveryStats,
} from "@/features/delivery/types/deliveries.types";

export async function listInvoiceDeliveries(
  params: ListQueryParams<InvoiceDeliveryFilterParams> = {},
): Promise<PaginatedResponse<InvoiceDeliveryItem>> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | null | undefined>);
  const response = await httpClient.get<InvoiceDeliveryItem[]>(tenantPath(`/deliveries${qs}`));
  if (!response.success) throw new Error(response.message);
  return response as PaginatedResponse<InvoiceDeliveryItem>;
}

export async function getInvoiceDeliveryStats(
  params: InvoiceDeliveryFilterParams = {},
): Promise<InvoiceDeliveryStats> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | null | undefined>);
  const response = await httpClient.get<InvoiceDeliveryStats>(tenantPath(`/deliveries/stats${qs}`));
  if (!response.success) throw new Error(response.message);
  return response.data;
}

/** @deprecated Use listInvoiceDeliveries */
export async function listDeliveries(
  params: ListQueryParams = {},
): Promise<PaginatedResponse<InvoiceDeliveryItem>> {
  return listInvoiceDeliveries(params);
}
