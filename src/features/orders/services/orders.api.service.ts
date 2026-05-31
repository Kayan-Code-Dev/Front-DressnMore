import { httpClient } from "@/shared/lib/http/client";
import { tenantPath } from "@/config/api";
import { buildQueryString } from "@/shared/lib/http/query";
import type { ListQueryParams, PaginatedResponse } from "@/shared/types/api";
import type {
  DeliverySearchRow,
  DressOption,
  OrderFilterParams,
  RentalOrder,
  RentalOrderStats,
} from "@/features/orders/types/orders.types";

export async function listRentalOrders(
  params: ListQueryParams<OrderFilterParams> = {},
): Promise<PaginatedResponse<RentalOrder>> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | null | undefined>);
  const response = await httpClient.get<RentalOrder[]>(tenantPath(`/orders/rental${qs}`));
  if (!response.success) throw new Error(response.message);
  return response as PaginatedResponse<RentalOrder>;
}

export async function getRentalOrderStats(): Promise<RentalOrderStats> {
  const response = await httpClient.get<RentalOrderStats>(tenantPath("/orders/rental/stats"));
  if (!response.success) throw new Error(response.message);
  return response.data;
}

export async function getRentalOrder(id: number): Promise<RentalOrder> {
  const response = await httpClient.get<RentalOrder>(tenantPath(`/orders/rental/${id}`));
  if (!response.success) throw new Error(response.message);
  return response.data;
}

export async function listDressOptions(search = ""): Promise<DressOption[]> {
  const qs = buildQueryString({ search });
  const response = await httpClient.get<DressOption[]>(tenantPath(`/dresses${qs}`));
  if (!response.success) throw new Error(response.message);
  return response.data;
}

export async function searchDeliveries(
  params: ListQueryParams = {},
): Promise<PaginatedResponse<DeliverySearchRow>> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | null | undefined>);
  const response = await httpClient.get<DeliverySearchRow[]>(tenantPath(`/orders/delivery-search${qs}`));
  if (!response.success) throw new Error(response.message);
  return response as PaginatedResponse<DeliverySearchRow>;
}
