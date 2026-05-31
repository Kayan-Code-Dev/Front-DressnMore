import { httpClient } from "@/shared/lib/http/client";
import { tenantPath } from "@/config/api";
import { buildQueryString } from "@/shared/lib/http/query";
import type { ListQueryParams, PaginatedResponse } from "@/shared/types/api";
import type {
  EmployeeCustodyItem,
  EmployeeItem,
  EmployeeSalaryItem,
  EmployeeStats,
  SalaryStats,
} from "@/features/employees/types/employees.types";

export async function listEmployees(
  params: ListQueryParams = {},
): Promise<PaginatedResponse<EmployeeItem> & { meta: { stats?: EmployeeStats } }> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | null | undefined>);
  const response = await httpClient.get<EmployeeItem[]>(tenantPath(`/employees${qs}`));
  if (!response.success) throw new Error(response.message);
  return response as PaginatedResponse<EmployeeItem> & { meta: { stats?: EmployeeStats } };
}

export async function getEmployee(id: number): Promise<EmployeeItem> {
  const response = await httpClient.get<EmployeeItem>(tenantPath(`/employees/${id}`));
  if (!response.success) throw new Error(response.message);
  return response.data;
}

export async function listEmployeeCustodies(
  params: ListQueryParams = {},
): Promise<PaginatedResponse<EmployeeCustodyItem>> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | null | undefined>);
  const response = await httpClient.get<EmployeeCustodyItem[]>(tenantPath(`/employees/custodies${qs}`));
  if (!response.success) throw new Error(response.message);
  return response as PaginatedResponse<EmployeeCustodyItem>;
}

export async function listEmployeeSalaries(
  params: ListQueryParams = {},
): Promise<PaginatedResponse<EmployeeSalaryItem> & { meta: { stats?: SalaryStats } }> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | null | undefined>);
  const response = await httpClient.get<EmployeeSalaryItem[]>(tenantPath(`/employees/salaries${qs}`));
  if (!response.success) throw new Error(response.message);
  return response as PaginatedResponse<EmployeeSalaryItem> & { meta: { stats?: SalaryStats } };
}
