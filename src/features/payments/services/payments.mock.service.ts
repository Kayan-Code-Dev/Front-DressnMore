import type { ApiSuccess, ListQueryParams, PaginatedResponse } from "@/shared/types/api";
import type { PaymentFilterParams, PaymentItem, PaymentStats } from "@/features/payments/types/payments.types";
import { computePaymentStats, paymentsFixture } from "@/features/payments/mocks/payments.mock";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const PER_PAGE = 15;

function paginate<T>(items: T[], page = 1, perPage = PER_PAGE) {
  const total = items.length;
  const last_page = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  return { data: items.slice(start, start + perPage), meta: { total, last_page, current_page: page, per_page: perPage } };
}

function filterPayments(items: PaymentItem[], params: PaymentFilterParams) {
  const normalized = (params.search ?? "").trim().toLowerCase();

  return items.filter((item) => {
    if (normalized) {
      const haystack = [
        item.payment_number,
        item.invoice_number,
        item.customer_name,
        item.branch_name,
        item.notes,
        String(item.id),
        String(item.invoice_id),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(normalized)) return false;
    }
    if (params.status && item.status !== params.status) return false;
    if (params.branch_id && item.branch_id !== params.branch_id) return false;
    if (params.method && item.method !== params.method) return false;
    if (params.payment_type && item.payment_type !== params.payment_type) return false;
    if (params.date_from && (item.paid_at ?? item.created_at ?? "").slice(0, 10) < params.date_from) return false;
    if (params.date_to && (item.paid_at ?? item.created_at ?? "").slice(0, 10) > params.date_to) return false;
    return true;
  });
}

export async function listPaymentsMock(
  params: ListQueryParams<PaymentFilterParams> = {},
): Promise<PaginatedResponse<PaymentItem>> {
  await delay(240);
  const page = params.page ?? 1;
  const data = filterPayments(paymentsFixture, params);
  const { data: pageData, meta } = paginate(data, page);
  return { success: true, message: "Success", data: pageData, meta };
}

export async function getPaymentStatsMock(): Promise<ApiSuccess<PaymentStats>> {
  await delay(150);
  return { success: true, message: "Success", data: computePaymentStats(paymentsFixture) };
}
