import { httpClient } from "@/shared/lib/http/client";
import { tenantPath } from "@/config/api";
import type { ApiResponse } from "@/shared/types/api";
import type { LookupsData } from "./lookups.types";

export async function fetchLookups(): Promise<ApiResponse<LookupsData>> {
  return httpClient.get<LookupsData>(tenantPath("/lookups"));
}
