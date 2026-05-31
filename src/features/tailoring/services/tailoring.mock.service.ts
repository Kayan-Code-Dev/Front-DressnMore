import type { ApiSuccess } from "@/shared/types/api";
import type {
  TailoringDelivery,
  TailoringMeasurement,
  TailoringOrder,
  TailoringOrderStats,
  TailoringFilterParams,
} from "@/features/tailoring/types/tailoring.types";
import {
  computeTailoringStats,
  tailoringDeliveriesFixture,
  tailoringOrdersFixture,
} from "@/features/tailoring/mocks/tailoring.mock";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const PER_PAGE = 10;

function paginate<T>(items: T[], page = 1, perPage = PER_PAGE) {
  const total = items.length;
  const last_page = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  return { data: items.slice(start, start + perPage), meta: { total, last_page, current_page: page, per_page: perPage } };
}

export async function listTailoringOrdersMock(
  search = "",
  page = 1,
  filters: TailoringFilterParams = {},
): Promise<ApiSuccess<TailoringOrder[]>> {
  await delay(250);
  const normalized = search.trim().toLowerCase();
  let data = tailoringOrdersFixture.filter((order) => {
    if (normalized && !order.client_name.toLowerCase().includes(normalized) && !String(order.id).includes(normalized)) {
      return false;
    }
    if (filters.status && order.status !== filters.status) return false;
    if (filters.stage && order.current_stage !== filters.stage) return false;
    if (filters.priority && order.priority !== filters.priority) return false;
    return true;
  });
  const { data: pageData, meta } = paginate(data, page);
  return { success: true, message: "Success", data: pageData, meta };
}

export async function getTailoringStatsMock(): Promise<ApiSuccess<TailoringOrderStats>> {
  await delay(150);
  return { success: true, message: "Success", data: computeTailoringStats(tailoringOrdersFixture) };
}

export async function getTailoringOrderMock(id: number): Promise<ApiSuccess<TailoringOrder | null>> {
  await delay(200);
  const order = tailoringOrdersFixture.find((o) => o.id === id) ?? null;
  return { success: true, message: "Success", data: order };
}

export async function listTailoringDeliveriesMock(
  search = "",
  page = 1,
): Promise<ApiSuccess<TailoringDelivery[]>> {
  await delay(250);
  const normalized = search.trim().toLowerCase();
  let data = tailoringDeliveriesFixture;
  if (normalized) {
    data = data.filter(
      (row) =>
        row.client_name.toLowerCase().includes(normalized) ||
        row.fabric_name.toLowerCase().includes(normalized) ||
        String(row.order_id).includes(normalized),
    );
  }
  const { data: pageData, meta } = paginate(data, page);
  return { success: true, message: "Success", data: pageData, meta };
}

export async function updateMeasurementsMock(
  orderId: number,
  measurements: TailoringMeasurement[],
): Promise<ApiSuccess<TailoringOrder | null>> {
  await delay(300);
  const order = tailoringOrdersFixture.find((o) => o.id === orderId);
  if (order) order.measurements = measurements;
  return { success: true, message: "تم حفظ القياسات بنجاح", data: order ?? null };
}
