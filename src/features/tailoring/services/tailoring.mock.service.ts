import type { ApiSuccess, ListQueryParams, PaginatedResponse } from "@/shared/types/api";
import type {
  TailoringDelivery,
  TailoringMeasurement,
  TailoringOrder,
  TailoringOrderStats,
  TailoringFilterParams,
  CreateTailoringOrderPayload,
} from "@/features/tailoring/types/tailoring.types";
import {
  computeTailoringStats,
  tailoringDeliveriesFixture,
  tailoringOrdersFixture,
} from "@/features/tailoring/mocks/tailoring.mock";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const PER_PAGE = 15;

function paginate<T>(items: T[], page = 1, perPage = PER_PAGE) {
  const total = items.length;
  const last_page = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  return { data: items.slice(start, start + perPage), meta: { total, last_page, current_page: page, per_page: perPage } };
}

function filterOrders(items: TailoringOrder[], search = "", filters: TailoringFilterParams = {}) {
  const normalized = search.trim().toLowerCase();

  return items.filter((order) => {
    if (normalized) {
      const haystack = [
        order.client_name,
        order.order_number,
        order.garment_name,
        order.fabric_name,
        String(order.id),
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(normalized)) return false;
    }
    if (filters.status && filters.status !== "all" && order.status !== filters.status) return false;
    if (filters.stage && filters.stage !== "all" && order.current_stage !== filters.stage) return false;
    if (filters.priority && filters.priority !== "all" && order.priority !== filters.priority) return false;
    return true;
  });
}

export async function listTailoringOrdersMock(
  params: ListQueryParams<TailoringFilterParams> = {},
): Promise<PaginatedResponse<TailoringOrder>> {
  await delay(250);
  const search = params.search ?? "";
  const page = params.page ?? 1;
  const perPage = params.per_page ?? PER_PAGE;
  const data = filterOrders(tailoringOrdersFixture, search, params);
  const { data: pageData, meta } = paginate(data, page, perPage);
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

export function getAllTailoringOrdersMock(): TailoringOrder[] {
  return tailoringOrdersFixture;
}

export async function createTailoringOrderMock(
  payload: CreateTailoringOrderPayload,
): Promise<ApiSuccess<{ id: number }>> {
  await delay(350);
  const nextId = Math.max(...tailoringOrdersFixture.map((o) => o.id), 0) + 1;
  const orderNumber = `T${String(nextId).padStart(3, "0")}`;
  const paid = payload.paid_amount ?? 0;
  const total = payload.unit_price;

  tailoringOrdersFixture.unshift({
    id: nextId,
    order_number: orderNumber,
    client_name: `عميل #${payload.customer_id}`,
    client_phone: "",
    employee_name: "—",
    branch_name: `فرع #${payload.branch_id}`,
    garment_name: payload.garment_name,
    fabric_name: payload.fabric_description ?? payload.garment_name,
    fabric_code: "",
    order_date: new Date().toISOString().slice(0, 10),
    due_date: payload.tailoring_due_date,
    occasion_date: payload.occasion_datetime,
    visit_date: payload.visit_datetime,
    status: "active",
    priority: payload.priority ?? "normal",
    payment_status: paid <= 0 ? "unpaid" : paid >= total ? "paid" : "partial",
    current_stage: "new_order",
    days_remaining: 30,
    days_remaining_label: "30 يوم متبقي",
    total_price: total,
    paid,
    remaining: Math.max(0, total - paid),
    notes: payload.order_notes,
    stages_completed: 1,
    stages_total: 8,
    progress_percent: 0,
    payments_count: paid > 0 ? 1 : 0,
    progress_log: [{ id: 1, stage: "new_order", stage_label: "طلب جديد", date: new Date().toLocaleDateString("en-GB").slice(0, 5), by: "النظام" }],
  });

  return { success: true, message: "تم إنشاء أمر التفصيل", data: { id: nextId } };
}
