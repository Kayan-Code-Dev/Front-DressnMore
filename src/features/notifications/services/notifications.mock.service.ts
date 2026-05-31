import type { ApiSuccess } from "@/shared/types/api";
import type {
  NotificationItem,
  NotificationStats,
  NotificationCategory,
} from "@/features/notifications/types/notifications.types";
import { notificationsFixture } from "@/features/notifications/mocks/notifications.mock";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type ListNotificationsParams = {
  search?: string;
  unread_only?: boolean;
  category?: NotificationCategory | null;
};

export async function listNotificationsMock(
  params: ListNotificationsParams = {}
): Promise<ApiSuccess<NotificationItem[]>> {
  await delay(220);
  let data = [...notificationsFixture];

  if (params.unread_only) {
    data = data.filter((n) => !n.read_at);
  }
  if (params.category) {
    data = data.filter((n) => n.category === params.category);
  }
  if (params.search?.trim()) {
    const q = params.search.trim().toLowerCase();
    data = data.filter(
      (n) => n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q)
    );
  }

  const stats: NotificationStats = {
    total: notificationsFixture.length,
    read: notificationsFixture.filter((n) => n.read_at).length,
    unread: notificationsFixture.filter((n) => !n.read_at).length,
  };

  return { success: true, message: "Success", data, meta: { total: data.length, stats } };
}

export async function markNotificationReadMock(id: number): Promise<ApiSuccess<null>> {
  await delay(120);
  const item = notificationsFixture.find((n) => n.id === id);
  if (item) item.read_at = new Date().toISOString();
  return { success: true, message: "Success", data: null };
}

export async function markAllNotificationsReadMock(): Promise<ApiSuccess<null>> {
  await delay(150);
  const now = new Date().toISOString();
  notificationsFixture.forEach((n) => {
    if (!n.read_at) n.read_at = now;
  });
  return { success: true, message: "Success", data: null };
}

export async function deleteNotificationMock(id: number): Promise<ApiSuccess<null>> {
  await delay(120);
  const idx = notificationsFixture.findIndex((n) => n.id === id);
  if (idx >= 0) notificationsFixture.splice(idx, 1);
  return { success: true, message: "Success", data: null };
}
