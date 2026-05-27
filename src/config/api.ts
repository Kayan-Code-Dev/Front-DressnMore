import { env } from "@/shared/lib/env/env";

const TENANT_PREFIX = "/api/tenant";

export const API_CONFIG = Object.freeze({
  baseUrl: env.apiBaseUrl,
  tenantPrefix: TENANT_PREFIX,
  timeoutMs: 15_000,
  endpoints: {
    tenantLogin: `${TENANT_PREFIX}/login`,
    tenantMe: `${TENANT_PREFIX}/me`,
    tenantLogout: `${TENANT_PREFIX}/logout`,
    tenantLookups: `${TENANT_PREFIX}/lookups`,
  },
});

export function tenantPath(resource: string): string {
  return `${TENANT_PREFIX}${resource.startsWith("/") ? resource : `/${resource}`}`;
}
