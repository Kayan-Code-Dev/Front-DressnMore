import { httpClient } from "@/shared/lib/http/client";
import { tenantPath } from "@/config/api";
import { buildQueryString } from "@/shared/lib/http/query";
import type { ListQueryParams, PaginatedResponse } from "@/shared/types/api";
import type {
  DailySalesRow,
  EmployeeSalesRow,
  ProductSalesRow,
  SaleInvoice,
  SalesReportSummary,
} from "@/features/sales/types/sales.types";

export async function getSalesReportSummary(): Promise<SalesReportSummary> {
  const response = await httpClient.get<SalesReportSummary>(tenantPath("/sales/reports/summary"));
  if (!response.success) throw new Error(response.message);
  return response.data;
}

export async function getDailySales(): Promise<DailySalesRow[]> {
  const response = await httpClient.get<DailySalesRow[]>(tenantPath("/sales/reports/daily"));
  if (!response.success) throw new Error(response.message);
  return response.data;
}

export async function getProductSales(): Promise<ProductSalesRow[]> {
  const response = await httpClient.get<ProductSalesRow[]>(tenantPath("/sales/reports/products"));
  if (!response.success) throw new Error(response.message);
  return response.data;
}

export async function getEmployeeSales(): Promise<EmployeeSalesRow[]> {
  const response = await httpClient.get<EmployeeSalesRow[]>(tenantPath("/sales/reports/by-employee"));
  if (!response.success) throw new Error(response.message);
  return response.data;
}

export async function listSalesInvoices(
  params: ListQueryParams = {},
): Promise<PaginatedResponse<SaleInvoice>> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | null | undefined>);
  const response = await httpClient.get<SaleInvoice[]>(tenantPath(`/sales/invoices${qs}`));
  if (!response.success) throw new Error(response.message);
  return response as PaginatedResponse<SaleInvoice>;
}

export async function createSale(payload: Record<string, unknown>): Promise<{ id: number }> {
  const response = await httpClient.post<{ id: number }>(tenantPath("/sales/invoices"), payload);
  if (!response.success) throw new Error(response.message);
  return response.data;
}
