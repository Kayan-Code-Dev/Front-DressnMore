import { httpClient } from "@/shared/lib/http/client";
import { tenantPath } from "@/config/api";
import { buildQueryString } from "@/shared/lib/http/query";
import type { PaginatedResponse, ListQueryParams } from "@/shared/types/api";
import type { BranchItem, BranchFilterParams } from "@/features/branches/types/branches.types";

export async function listBranches(
  params: ListQueryParams<BranchFilterParams> = {},
): Promise<PaginatedResponse<BranchItem>> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | null | undefined>);
  const response = await httpClient.get<BranchItem[]>(tenantPath(`/branches${qs}`));

  if (!response.success) {
    throw new Error(response.message);
  }

  return response as PaginatedResponse<BranchItem>;
}
