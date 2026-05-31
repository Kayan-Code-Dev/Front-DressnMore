import type { InternalAxiosRequestConfig } from "axios";
import { api } from "./api-instance";
import { featureFlags } from "@/config/feature-flags";

const emptyPage = {
  data: [],
  current_page: 1,
  total_pages: 1,
  total: 0,
  per_page: 15,
  meta: { total: 0, read: 0, unread: 0 },
};

const mockLoginResponse = {
  token: "mock-token",
  user: { id: 1, name: "مدير النظام", email: "admin@dressnmore.com" },
  roles: ["branches_manager", "branches_basic_view_create"],
  permissions: [
    "dashboard.view",
    "dashboard.activity.view",
    "dashboard.business.view",
    "dashboard.hr.view",
    "clients.view",
    "clients.create",
    "clients.update",
    "clients.delete",
    "clients.export",
    "clients.measurements.view",
    "clients.measurements.update",
    "clothes.view",
    "clothes.create",
    "clothes.update",
    "clothes.delete",
    "clothes.export",
    "inventories.view",
    "transfers.view",
    "transfers.create",
    "transfers.update",
    "transfers.delete",
    "transfers.approve",
    "transfers.reject",
    "transfers.export",
    "orders.view",
    "orders.create",
    "orders.update",
    "orders.delete",
    "orders.export",
    "orders.deliver",
    "orders.return",
    "orders.finish",
    "orders.cancel",
    "payments.view",
    "payments.create",
    "payments.pay",
    "payments.cancel",
    "payments.export",
    "expenses.view",
    "expenses.create",
    "expenses.update",
    "expenses.delete",
    "expenses.approve",
    "expenses.pay",
    "expenses.export",
    "cashbox.view",
    "cashbox.manage",
    "cashbox.recalculate",
    "transactions.view",
    "suppliers.view",
    "suppliers.create",
    "suppliers.update",
    "suppliers.delete",
    "suppliers.export",
    "supplier-orders.view",
    "supplier-orders.create",
    "supplier-orders.update",
    "supplier-orders.delete",
    "supplier-orders.export",
    "branches.view",
    "branches.create",
    "branches.update",
    "branches.delete",
    "branches.export",
    "workshops.view",
    "workshops.create",
    "workshops.update",
    "workshops.delete",
    "workshops.export",
    "workshops.manage-clothes",
    "workshops.approve-transfers",
    "workshops.update-status",
    "workshops.return-cloth",
    "workshops.view-logs",
    "factories.view",
    "factories.create",
    "factories.update",
    "factories.delete",
    "factories.export",
    "factories.manage",
    "notifications.view",
    "notifications.manage",
    "hr.employees.view",
    "hr.employees.create",
    "hr.employees.update",
    "hr.employees.delete",
    "hr.custody.view",
    "hr.payroll.view",
    "roles.view",
    "roles.create",
    "roles.update",
    "roles.delete",
    "categories.view",
    "subcategories.view",
    "currencies.view",
  ],
  account_type: "tenant",
  endpoints: {
    frontend_app_url: typeof window !== "undefined" ? window.location.origin : "",
    backend_api_url: typeof window !== "undefined" ? `${window.location.origin}/api/v1` : "",
    backend_api_origin: typeof window !== "undefined" ? window.location.origin : "",
    reverb_public_url: "",
  },
};

function mockResponse(config: InternalAxiosRequestConfig) {
  const url = config.url ?? "";
  const method = (config.method ?? "get").toLowerCase();

  if (method === "post" && url.includes("/login")) {
    return { data: mockLoginResponse, status: 200, statusText: "OK", headers: {}, config };
  }

  if (method === "get") {
    if (url.includes("/export")) {
      return { data: new Blob(["mock"], { type: "text/csv" }), status: 200, statusText: "OK", headers: {}, config };
    }
    if (url.match(/\/\d+$/)) {
      return { data: { id: 1, name: "Mock Item" }, status: 200, statusText: "OK", headers: {}, config };
    }
    return { data: emptyPage, status: 200, statusText: "OK", headers: {}, config };
  }

  if (method === "post" || method === "put" || method === "patch") {
    return { data: { id: 1, ...(typeof config.data === "object" && config.data ? config.data : {}) }, status: 200, statusText: "OK", headers: {}, config };
  }

  if (method === "delete") {
    return { data: null, status: 204, statusText: "No Content", headers: {}, config };
  }

  return { data: emptyPage, status: 200, statusText: "OK", headers: {}, config };
}

export function installMockApiInterceptor() {
  if (!featureFlags.useMockServices) return;

  api.interceptors.request.use(async (config) => {
    const adapter = async (cfg: InternalAxiosRequestConfig) => mockResponse(cfg);
    config.adapter = adapter as typeof config.adapter;
    return config;
  });
}
