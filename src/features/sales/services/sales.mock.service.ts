import type { ApiSuccess, ListQueryParams, PaginatedResponse } from "@/shared/types/api";
import type {
  DailySalesRow,
  EmployeeSalesRow,
  ProductSalesRow,
  SaleInvoice,
  SaleInvoiceFilterParams,
  SaleInvoiceStats,
  SalesReportSummary,
} from "@/features/sales/types/sales.types";
import {
  computeSaleInvoiceStats,
  computeSalesSummary,
  dailySalesFixture,
  employeeSalesFixture,
  productSalesFixture,
  salesInvoicesFixture,
} from "@/features/sales/mocks/sales.mock";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const PER_PAGE = 15;

function paginate<T>(items: T[], page = 1, perPage = PER_PAGE) {
  const total = items.length;
  const last_page = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  return { data: items.slice(start, start + perPage), meta: { total, last_page, current_page: page, per_page: perPage } };
}

function filterInvoices(items: SaleInvoice[], filters: SaleInvoiceFilterParams) {
  const normalized = (filters.search ?? "").trim().toLowerCase();

  return items.filter((item) => {
    if (normalized) {
      const haystack = [
        item.client_name,
        item.client_phone ?? "",
        item.invoice_number ?? "",
        String(item.id),
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(normalized)) return false;
    }
    if (filters.payment_status && item.payment_status !== filters.payment_status) return false;
    if (filters.invoice_status && item.invoice_status !== filters.invoice_status) return false;
    return true;
  });
}

export async function getSalesReportSummaryMock(): Promise<ApiSuccess<SalesReportSummary>> {
  await delay(200);
  return { success: true, message: "Success", data: computeSalesSummary(salesInvoicesFixture) };
}

export async function getDailySalesMock(): Promise<ApiSuccess<DailySalesRow[]>> {
  await delay(200);
  return { success: true, message: "Success", data: dailySalesFixture, meta: { total: dailySalesFixture.length, last_page: 1 } };
}

export async function getProductSalesMock(): Promise<ApiSuccess<ProductSalesRow[]>> {
  await delay(200);
  return { success: true, message: "Success", data: productSalesFixture, meta: { total: productSalesFixture.length, last_page: 1 } };
}

export async function getEmployeeSalesMock(): Promise<ApiSuccess<EmployeeSalesRow[]>> {
  await delay(200);
  return { success: true, message: "Success", data: employeeSalesFixture, meta: { total: employeeSalesFixture.length, last_page: 1 } };
}

export async function listSalesInvoicesMock(
  params: ListQueryParams<SaleInvoiceFilterParams> = {},
): Promise<PaginatedResponse<SaleInvoice>> {
  await delay(250);
  const page = params.page ?? 1;
  const perPage = params.per_page ?? PER_PAGE;
  const data = filterInvoices(salesInvoicesFixture, params);
  const { data: pageData, meta } = paginate(data, page, perPage);
  return { success: true, message: "Success", data: pageData, meta };
}

export async function getSaleInvoiceStatsMock(
  params: SaleInvoiceFilterParams = {},
): Promise<ApiSuccess<SaleInvoiceStats>> {
  await delay(150);
  const data = filterInvoices(salesInvoicesFixture, params);
  return { success: true, message: "Success", data: computeSaleInvoiceStats(data) };
}

export async function createSaleMock(): Promise<ApiSuccess<{ id: number }>> {
  await delay(400);
  return { success: true, message: "تم إنشاء فاتورة البيع بنجاح", data: { id: 506 } };
}
