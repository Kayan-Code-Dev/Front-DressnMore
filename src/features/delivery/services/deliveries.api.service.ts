import { httpClient } from "@/shared/lib/http/client";
import { tenantPath } from "@/config/api";
import { buildQueryString } from "@/shared/lib/http/query";
import type { ListQueryParams, PaginatedResponse } from "@/shared/types/api";
import type { DeliveryItem } from "@/features/delivery/types/deliveries.types";

export async function listDeliveries(
  params: ListQueryParams = {},
): Promise<PaginatedResponse<DeliveryItem>> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | null | undefined>);
  const response = await httpClient.get<DeliveryItem[]>(tenantPath(`/deliveries${qs}`));
  return httpClient.unwrap(response) as PaginatedResponse<DeliveryItem>;
}
