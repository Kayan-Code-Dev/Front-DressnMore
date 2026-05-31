import type { ApiSuccess } from "@/shared/types/api";
import type {
  DailySalesRow,
  EmployeeSalesRow,
  ProductSalesRow,
  SaleInvoice,
  SalesReportSummary,
} from "@/features/sales/types/sales.types";
import {
  computeSalesSummary,
  dailySalesFixture,
  employeeSalesFixture,
  productSalesFixture,
  salesInvoicesFixture,
} from "@/features/sales/mocks/sales.mock";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

export async function listSalesInvoicesMock(search = ""): Promise<ApiSuccess<SaleInvoice[]>> {
  await delay(250);
  const normalized = search.trim().toLowerCase();
  const data = normalized
    ? salesInvoicesFixture.filter((i) => i.client_name.toLowerCase().includes(normalized))
    : salesInvoicesFixture;
  return { success: true, message: "Success", data, meta: { total: data.length, last_page: 1 } };
}

export async function createSaleMock(): Promise<ApiSuccess<{ id: number }>> {
  await delay(400);
  return { success: true, message: "تم إنشاء فاتورة البيع بنجاح", data: { id: 506 } };
}
