import type { ApiSuccess, ListQueryParams, PaginatedResponse } from "@/shared/types/api";
import type {
  InvoiceReturnFilterParams,
  InvoiceReturnItem,
  InvoiceReturnStats,
  OverdueReturnItem,
} from "@/features/returns/types/returns.types";
import {
  computeInvoiceReturnStats,
  invoiceReturnsFixture,
  overdueReturnsFixture,
} from "@/features/returns/mocks/returns.mock";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const PER_PAGE = 15;

function paginate<T>(items: T[], page = 1, perPage = PER_PAGE) {
  const total = items.length;
  const last_page = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  return { data: items.slice(start, start + perPage), meta: { total, last_page, current_page: page, per_page: perPage } };
}

function filterItems(items: InvoiceReturnItem[], filters: InvoiceReturnFilterParams) {
  const normalized = (filters.search ?? "").trim().toLowerCase();

  return items.filter((item) => {
    if (normalized) {
      const haystack = [item.client_name, item.client_phone ?? "", item.invoice_number ?? "", String(item.id), item.customer?.national_id ?? ""]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(normalized)) return false;
    }
    if (filters.return_status && item.return_status !== filters.return_status) return false;
    if (filters.return_type && item.return_type !== filters.return_type) return false;
    if (filters.payment_status && item.payment_status !== filters.payment_status) return false;
    if (filters.return_date_from && item.return_date < filters.return_date_from) return false;
    if (filters.return_date_to && item.return_date > filters.return_date_to) return false;
    return true;
  });
}

export async function listInvoiceReturnsMock(
  params: ListQueryParams<InvoiceReturnFilterParams> = {},
): Promise<PaginatedResponse<InvoiceReturnItem>> {
  await delay(250);
  const data = filterItems(invoiceReturnsFixture, params);
  const { data: pageData, meta } = paginate(data, params.page ?? 1, params.per_page ?? PER_PAGE);
  return { success: true, message: "Success", data: pageData, meta };
}

export async function getInvoiceReturnStatsMock(
  params: InvoiceReturnFilterParams = {},
): Promise<ApiSuccess<InvoiceReturnStats>> {
  await delay(150);
  const data = filterItems(invoiceReturnsFixture, params);
  return { success: true, message: "Success", data: computeInvoiceReturnStats(data) };
}

/** @deprecated */
export async function listReturnsMock(search = "") {
  return listInvoiceReturnsMock({ search });
}

export async function listOverdueReturnsMock(search = ""): Promise<ApiSuccess<OverdueReturnItem[]>> {
  await delay(220);
  const normalized = search.trim().toLowerCase();
  const data = normalized
    ? overdueReturnsFixture.filter((item) =>
        `${item.customer} ${item.invoice_number} ${item.item}`.toLowerCase().includes(normalized),
      )
    : overdueReturnsFixture;
  return { success: true, message: "Success", data, meta: { total: data.length } };
}
