import { httpClient } from "@/shared/lib/http/client";
import { tenantPath } from "@/config/api";
import { buildQueryString } from "@/shared/lib/http/query";
import type { ListQueryParams, PaginatedResponse } from "@/shared/types/api";
import type { NotificationItem, NotificationStats } from "@/features/notifications/types/notifications.types";

export async function listNotifications(
  params: ListQueryParams = {},
): Promise<PaginatedResponse<NotificationItem> & { meta: { stats?: NotificationStats } }> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | null | undefined>);
  const response = await httpClient.get<NotificationItem[]>(tenantPath(`/notifications${qs}`));
  if (!response.success) throw new Error(response.message);
  return response as PaginatedResponse<NotificationItem> & { meta: { stats?: NotificationStats } };
}

export async function markNotificationRead(id: number): Promise<NotificationItem> {
  const response = await httpClient.patch<NotificationItem>(tenantPath(`/notifications/${id}/read`), {});
  if (!response.success) throw new Error(response.message);
  return response.data;
}

export async function markAllNotificationsRead(): Promise<void> {
  const response = await httpClient.post<null>(tenantPath("/notifications/read-all"), {});
  if (!response.success) throw new Error(response.message);
}

export async function deleteNotification(id: number): Promise<void> {
  const response = await httpClient.delete<null>(tenantPath(`/notifications/${id}`));
  if (!response.success) throw new Error(response.message);
}
