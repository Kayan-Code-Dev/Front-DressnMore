import type { ApiSuccess } from "@/shared/types/api";
import type {
  DeliverySearchRow,
  DressOption,
  OrderFilterParams,
  RentalOrder,
  RentalOrderStats,
} from "@/features/orders/types/orders.types";
import {
  computeRentalStats,
  deliverySearchFixture,
  dressOptionsFixture,
  rentalOrdersFixture,
} from "@/features/orders/mocks/orders.mock";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const PER_PAGE = 10;

function paginate<T>(items: T[], page = 1, perPage = PER_PAGE) {
  const total = items.length;
  const last_page = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  return { data: items.slice(start, start + perPage), meta: { total, last_page, current_page: page, per_page: perPage } };
}

export async function listRentalOrdersMock(
  search = "",
  page = 1,
  filters: OrderFilterParams = {},
  perPage = PER_PAGE,
): Promise<ApiSuccess<RentalOrder[]>> {
  await delay(250);
  const normalized = search.trim().toLowerCase();
  let data = rentalOrdersFixture.filter((order) => {
    const customer = order.customer;
    if (normalized) {
      const haystack = [
        order.client_name,
        order.client_phone,
        String(order.id),
        order.invoice_number ?? "",
        customer?.national_id ?? "",
        customer?.whatsapp ?? "",
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(normalized)) return false;
    }
    if (filters.status && order.status !== filters.status) return false;
    return true;
  });
  const { data: pageData, meta } = paginate(data, page, perPage);
  return { success: true, message: "Success", data: pageData, meta };
}

export async function getRentalOrderStatsMock(): Promise<ApiSuccess<RentalOrderStats>> {
  await delay(150);
  return { success: true, message: "Success", data: computeRentalStats(rentalOrdersFixture) };
}

export async function getRentalOrderMock(id: number): Promise<ApiSuccess<RentalOrder | null>> {
  await delay(200);
  const order = rentalOrdersFixture.find((o) => o.id === id) ?? null;
  return { success: true, message: "Success", data: order };
}

export async function listDressOptionsMock(search = ""): Promise<ApiSuccess<DressOption[]>> {
  await delay(200);
  const normalized = search.trim().toLowerCase();
  const data = normalized
    ? dressOptionsFixture.filter((d) => d.name.toLowerCase().includes(normalized) || d.code.toLowerCase().includes(normalized))
    : dressOptionsFixture;
  return { success: true, message: "Success", data, meta: { total: data.length, last_page: 1 } };
}

export async function searchDeliveriesMock(
  search = "",
  page = 1,
): Promise<ApiSuccess<DeliverySearchRow[]>> {
  await delay(250);
  const normalized = search.trim().toLowerCase();
  let data = deliverySearchFixture;
  if (normalized) {
    data = data.filter(
      (row) =>
        row.client_name.toLowerCase().includes(normalized) ||
        row.cloth_name.toLowerCase().includes(normalized) ||
        row.cloth_code.toLowerCase().includes(normalized) ||
        String(row.order_id).includes(normalized),
    );
  }
  const { data: pageData, meta } = paginate(data, page);
  return { success: true, message: "Success", data: pageData, meta };
}
