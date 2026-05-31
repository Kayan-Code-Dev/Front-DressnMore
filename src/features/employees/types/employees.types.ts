export type EmployeeStatus = "active" | "on_leave" | "suspended" | "terminated";

export type EmployeeItem = {
  id: number;
  employee_code: string;
  name: string;
  email: string;
  phone: string;
  job_title: string;
  branch_name: string;
  employment_status: EmployeeStatus;
  base_salary: number;
  hire_date: string;
  transport_allowance?: number;
  housing_allowance?: number;
  other_allowances?: number;
  roles?: string[];
};

export type EmployeeCustodyStatus =
  | "active"
  | "expiring_soon"
  | "expired"
  | "returned"
  | "damaged"
  | "lost";

export type EmployeeCustodyItem = {
  id: number;
  employee_id: number;
  employee_name: string;
  type: string;
  description: string;
  value: number;
  issued_at: string;
  expires_at: string | null;
  status: EmployeeCustodyStatus;
};

export type EmployeeSalaryItem = {
  id: number;
  employee_id: number;
  employee_name: string;
  branch_name: string;
  period: string;
  base_salary: number;
  allowances: number;
  deductions: number;
  net_salary: number;
  status: "paid" | "unpaid";
};

export type EmployeeStats = {
  total: number;
  active: number;
  on_leave: number;
  salary_sum: number;
};

export type SalaryStats = {
  total_employees: number;
  paid_count: number;
  unpaid_count: number;
  total_net: number;
};
