import { httpClient } from "@/shared/lib/http/client";
import { tenantPath } from "@/config/api";
import { buildQueryString } from "@/shared/lib/http/query";
import type { ListQueryParams, PaginatedResponse } from "@/shared/types/api";
import type {
  TailoringDelivery,
  TailoringMeasurement,
  TailoringOrder,
  TailoringOrderStats,
  TailoringFilterParams,
  CreateTailoringOrderPayload,
} from "@/features/tailoring/types/tailoring.types";

export async function listTailoringOrders(
  params: ListQueryParams<TailoringFilterParams> = {},
): Promise<PaginatedResponse<TailoringOrder>> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | null | undefined>);
  const response = await httpClient.get<TailoringOrder[]>(tenantPath(`/tailoring/orders${qs}`));
  if (!response.success) throw new Error(response.message);
  return response as PaginatedResponse<TailoringOrder>;
}

export async function getTailoringStats(): Promise<TailoringOrderStats> {
  const response = await httpClient.get<TailoringOrderStats>(tenantPath("/tailoring/orders/stats"));
  if (!response.success) throw new Error(response.message);
  return response.data;
}

export async function getTailoringOrder(id: number): Promise<TailoringOrder> {
  const response = await httpClient.get<TailoringOrder>(tenantPath(`/tailoring/orders/${id}`));
  if (!response.success) throw new Error(response.message);
  return response.data;
}

export async function listTailoringDeliveries(
  params: ListQueryParams = {},
): Promise<PaginatedResponse<TailoringDelivery>> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | null | undefined>);
  const response = await httpClient.get<TailoringDelivery[]>(tenantPath(`/tailoring/deliveries${qs}`));
  if (!response.success) throw new Error(response.message);
  return response as PaginatedResponse<TailoringDelivery>;
}

export async function updateMeasurements(
  orderId: number,
  measurements: TailoringMeasurement[],
): Promise<TailoringOrder> {
  const response = await httpClient.put<TailoringOrder>(
    tenantPath(`/tailoring/orders/${orderId}/measurements`),
    { measurements },
  );
  if (!response.success) throw new Error(response.message);
  return response.data;
}

export async function createTailoringOrder(payload: CreateTailoringOrderPayload): Promise<{ id: number }> {
  const body = {
    type: "tailoring" as const,
    customer_id: payload.customer_id,
    branch_id: payload.branch_id,
    tailoring_due_date: payload.tailoring_due_date,
    occasion_datetime: payload.occasion_datetime,
    visit_datetime: payload.visit_datetime ?? new Date().toISOString().slice(0, 10),
    order_notes: payload.order_notes,
    items: [
      {
        description: payload.garment_name,
        item_type: "tailoring_service",
        quantity: 1,
        unit_price: payload.unit_price,
      },
    ],
    initial_payment:
      payload.paid_amount && payload.paid_amount > 0
        ? { amount: payload.paid_amount, method: "cash" as const }
        : undefined,
  };

  const response = await httpClient.post<{ id: number }>(tenantPath("/invoices"), body);
  if (!response.success) throw new Error(response.message);
  return response.data;
}
