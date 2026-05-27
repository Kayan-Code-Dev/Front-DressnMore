import { httpClient } from "@/shared/lib/http/client";
import { tenantPath } from "@/config/api";
import { buildQueryString } from "@/shared/lib/http/query";
import type { PaginatedResponse, ListQueryParams } from "@/shared/types/api";
import type { PurchaseOrderItem, PurchaseOrderFilterParams } from "@/features/suppliers/types/suppliers.types";

export async function listPurchaseOrders(
  params: ListQueryParams<PurchaseOrderFilterParams> = {},
): Promise<PaginatedResponse<PurchaseOrderItem>> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | null | undefined>);
  const response = await httpClient.get<PurchaseOrderItem[]>(tenantPath(`/purchase-orders${qs}`));

  if (!response.success) {
    throw new Error(response.message);
  }

  return response as PaginatedResponse<PurchaseOrderItem>;
}
