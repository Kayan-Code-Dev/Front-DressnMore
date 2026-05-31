import type { ApiSuccess, ListQueryParams, PaginatedResponse } from "@/shared/types/api";
import type {
  InvoiceDeliveryFilterParams,
  InvoiceDeliveryItem,
  InvoiceDeliveryStats,
} from "@/features/delivery/types/deliveries.types";
import {
  computeInvoiceDeliveryStats,
  invoiceDeliveriesFixture,
} from "@/features/delivery/mocks/deliveries.mock";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const PER_PAGE = 15;

function paginate<T>(items: T[], page = 1, perPage = PER_PAGE) {
  const total = items.length;
  const last_page = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  return { data: items.slice(start, start + perPage), meta: { total, last_page, current_page: page, per_page: perPage } };
}

function filterItems(
  items: InvoiceDeliveryItem[],
  search: string,
  filters: InvoiceDeliveryFilterParams,
) {
  const normalized = search.trim().toLowerCase();

  return items.filter((item) => {
    const customer = item.customer;
    if (normalized) {
      const haystack = [
        item.client_name,
        item.client_phone,
        item.invoice_number ?? "",
        String(item.id),
        customer?.national_id ?? "",
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(normalized)) return false;
    }
    if (filters.payment_status && item.payment_status !== filters.payment_status) return false;
    if (filters.delivery_status && item.delivery_status !== filters.delivery_status) return false;
    if (filters.employee_id && item.employee_name !== String(filters.employee_id)) return false;
    if (filters.branch_id && item.branch_name !== String(filters.branch_id)) return false;
    if (filters.event_date_from && item.event_date && item.event_date < filters.event_date_from) return false;
    if (filters.event_date_to && item.event_date && item.event_date > filters.event_date_to) return false;
    return true;
  });
}

export async function listInvoiceDeliveriesMock(
  params: ListQueryParams<InvoiceDeliveryFilterParams> = {},
): Promise<PaginatedResponse<InvoiceDeliveryItem>> {
  await delay(250);
  const search = params.search ?? "";
  const page = params.page ?? 1;
  const perPage = params.per_page ?? PER_PAGE;
  const filters: InvoiceDeliveryFilterParams = {
    payment_status: params.payment_status,
    delivery_status: params.delivery_status,
    employee_id: params.employee_id,
    branch_id: params.branch_id,
    event_date_from: params.event_date_from,
    event_date_to: params.event_date_to,
  };

  const data = filterItems(invoiceDeliveriesFixture, search, filters);
  const { data: pageData, meta } = paginate(data, page, perPage);
  return { success: true, message: "Success", data: pageData, meta };
}

export async function getInvoiceDeliveryStatsMock(
  params: InvoiceDeliveryFilterParams = {},
): Promise<ApiSuccess<InvoiceDeliveryStats>> {
  await delay(150);
  const data = filterItems(invoiceDeliveriesFixture, params.search ?? "", params);
  return { success: true, message: "Success", data: computeInvoiceDeliveryStats(data) };
}

/** @deprecated Use listInvoiceDeliveriesMock */
export async function listDeliveriesMock(search = "") {
  return listInvoiceDeliveriesMock({ search });
}
