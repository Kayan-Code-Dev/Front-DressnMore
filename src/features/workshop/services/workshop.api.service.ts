import { httpClient } from "@/shared/lib/http/client";
import { tenantPath } from "@/config/api";
import { buildQueryString } from "@/shared/lib/http/query";
import type { ListQueryParams, PaginatedResponse } from "@/shared/types/api";
import type {
  WorkshopClothItem,
  WorkshopItem,
  WorkshopTransferItem,
} from "@/features/workshop/types/workshop.types";

export async function listWorkshops(
  params: ListQueryParams = {},
): Promise<PaginatedResponse<WorkshopItem>> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | null | undefined>);
  const response = await httpClient.get<WorkshopItem[]>(tenantPath(`/workshops${qs}`));
  if (!response.success) throw new Error(response.message);
  return response as PaginatedResponse<WorkshopItem>;
}

export async function getWorkshop(id: number): Promise<WorkshopItem> {
  const response = await httpClient.get<WorkshopItem>(tenantPath(`/workshops/${id}`));
  if (!response.success) throw new Error(response.message);
  return response.data;
}

export async function listWorkshopTransfers(
  workshopId: number,
  params: ListQueryParams = {},
): Promise<PaginatedResponse<WorkshopTransferItem>> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | null | undefined>);
  const response = await httpClient.get<WorkshopTransferItem[]>(
    tenantPath(`/workshops/${workshopId}/transfers${qs}`),
  );
  if (!response.success) throw new Error(response.message);
  return response as PaginatedResponse<WorkshopTransferItem>;
}

export async function listWorkshopCloths(
  workshopId: number,
  params: ListQueryParams = {},
): Promise<PaginatedResponse<WorkshopClothItem>> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | null | undefined>);
  const response = await httpClient.get<WorkshopClothItem[]>(
    tenantPath(`/workshops/${workshopId}/cloths${qs}`),
  );
  if (!response.success) throw new Error(response.message);
  return response as PaginatedResponse<WorkshopClothItem>;
}
