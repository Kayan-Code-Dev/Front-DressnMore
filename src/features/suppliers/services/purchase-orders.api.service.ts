import { httpClient } from "@/shared/lib/http/client";
import { tenantPath } from "@/config/api";
import { buildQueryString } from "@/shared/lib/http/query";
import type { PaginatedResponse, ListQueryParams } from "@/shared/types/api";
import type { PurchaseOrderItem, PurchaseOrderFilterParams } from "@/features/suppliers/types/suppliers.types";

type ApiPurchaseOrder = Omit<PurchaseOrderItem, "supplier"> & {
  supplier?: string | { name?: string } | null;
};

function mapPurchaseOrder(row: ApiPurchaseOrder): PurchaseOrderItem {
  let supplier = "";
  if (typeof row.supplier === "string") {
    supplier = row.supplier;
  } else if (row.supplier && typeof row.supplier === "object") {
    supplier = row.supplier.name ?? "";
  }

  return {
    id: row.id,
    purchase_order_number: row.purchase_order_number,
    supplier,
    status: row.status,
    total: Number(row.total),
    paid_amount: Number(row.paid_amount),
    remaining_amount: Number(row.remaining_amount),
    order_date: row.order_date,
  };
}

export async function listPurchaseOrders(
  params: ListQueryParams<PurchaseOrderFilterParams> = {},
): Promise<PaginatedResponse<PurchaseOrderItem>> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | null | undefined>);
  const response = await httpClient.get<ApiPurchaseOrder[]>(tenantPath(`/purchase-orders${qs}`));

  if (!response.success) {
    throw new Error(response.message);
  }

  const paginated = response as PaginatedResponse<ApiPurchaseOrder>;

  return {
    ...paginated,
    data: (paginated.data ?? []).map(mapPurchaseOrder),
  };
}
