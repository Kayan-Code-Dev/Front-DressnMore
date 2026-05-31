import axios from "axios";
import { inferDressnTenantApiBaseUrl } from "@/lib/dressn-tenant-api-base";

/**
 * 1) استنتاج من سب دومين dressnmore (test.dressnmore.it.com → test.backend…/api/v1)
 * 2) أو VITE_TENANT_RELATIVE_API: نفس أصل الصفحة + /api/v1
 * 3) أو VITE_BACKEND_URL (الهب / التطوير)
 *
 * بعد تسجيل الدخول يُضبط axios عبر `endpoints.backend_api_url` من الاستجابة.
 */
export function getDefaultApiBaseUrl(): string {
  const inferred = inferDressnTenantApiBaseUrl();
  if (inferred) return inferred;

  const envUrl = String(import.meta.env.VITE_BACKEND_URL ?? "").replace(
    /\/+$/,
    "",
  );
  const tenantRelative =
    String(import.meta.env.VITE_TENANT_RELATIVE_API ?? "")
      .toLowerCase()
      .trim() === "true";
  if (tenantRelative && typeof window !== "undefined" && window.location?.origin) {
    return `${window.location.origin}/api/v1`.replace(/\/+$/, "");
  }
  return envUrl;
}

export const api = axios.create({
  baseURL: getDefaultApiBaseUrl() || undefined,
  withCredentials: true,
});

export function applyTenantApiBaseUrl(url?: string | null) {
  const next = (url?.trim() || getDefaultApiBaseUrl()).replace(/\/+$/, "");
  api.defaults.baseURL = next || undefined;
}

export function resetTenantApiBaseUrl() {
  api.defaults.baseURL = getDefaultApiBaseUrl() || undefined;
}
