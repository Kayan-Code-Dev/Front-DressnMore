import type { ApiSuccess } from "@/shared/types/api";
import type {
  EmployeeCustodyItem,
  EmployeeItem,
  EmployeeSalaryItem,
  EmployeeStats,
  SalaryStats,
} from "@/features/employees/types/employees.types";
import {
  employeeCustodiesFixture,
  employeeSalariesFixture,
  employeesFixture,
} from "@/features/employees/mocks/employees.mock";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function filterBySearch<T extends Record<string, unknown>>(
  items: T[],
  search: string,
  fields: (keyof T)[]
): T[] {
  const normalized = search.trim().toLowerCase();
  if (!normalized) return items;
  return items.filter((item) =>
    fields.some((field) => String(item[field] ?? "").toLowerCase().includes(normalized))
  );
}

export async function listEmployeesMock(search = ""): Promise<ApiSuccess<EmployeeItem[]>> {
  await delay(220);
  const data = filterBySearch(employeesFixture, search, [
    "name",
    "employee_code",
    "email",
    "job_title",
    "branch_name",
  ]);
  const stats: EmployeeStats = {
    total: data.length,
    active: data.filter((e) => e.employment_status === "active").length,
    on_leave: data.filter((e) => e.employment_status === "on_leave").length,
    salary_sum: data.reduce((s, e) => s + e.base_salary, 0),
  };
  return {
    success: true,
    message: "Success",
    data,
    meta: { total: data.length, stats },
  };
}

export async function getEmployeeMock(id: number): Promise<ApiSuccess<EmployeeItem | null>> {
  await delay(180);
  const employee = employeesFixture.find((e) => e.id === id) ?? null;
  return { success: true, message: "Success", data: employee };
}

export async function listEmployeeCustodiesMock(
  search = ""
): Promise<ApiSuccess<EmployeeCustodyItem[]>> {
  await delay(220);
  const data = filterBySearch(employeeCustodiesFixture, search, [
    "employee_name",
    "type",
    "description",
  ]);
  return { success: true, message: "Success", data, meta: { total: data.length } };
}

export async function listEmployeeSalariesMock(
  search = ""
): Promise<ApiSuccess<EmployeeSalaryItem[]>> {
  await delay(220);
  const data = filterBySearch(employeeSalariesFixture, search, [
    "employee_name",
    "branch_name",
    "period",
  ]);
  const stats: SalaryStats = {
    total_employees: data.length,
    paid_count: data.filter((s) => s.status === "paid").length,
    unpaid_count: data.filter((s) => s.status === "unpaid").length,
    total_net: data.reduce((s, r) => s + r.net_salary, 0),
  };
  return {
    success: true,
    message: "Success",
    data,
    meta: { total: data.length, stats },
  };
}
