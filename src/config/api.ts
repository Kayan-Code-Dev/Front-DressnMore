import { env } from "@/shared/lib/env/env";

export const API_CONFIG = Object.freeze({
  baseUrl: env.apiBaseUrl,
  timeoutMs: 15_000,
  endpoints: {
    tenantLogin: "/api/tenant/login",
  },
});
