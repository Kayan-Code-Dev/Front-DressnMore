import { httpClient } from "@/shared/lib/http/client";
import { tenantPath } from "@/config/api";
import { buildQueryString } from "@/shared/lib/http/query";
import type { ApiSuccess, ListQueryParams, PaginatedResponse } from "@/shared/types/api";
import type { BranchFilterParams, BranchItem, BranchPayload } from "@/features/branches/types/branches.types";

export async function listBranches(
  params: ListQueryParams<BranchFilterParams> = {},
): Promise<PaginatedResponse<BranchItem>> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | null | undefined>);
  const response = await httpClient.get<BranchItem[]>(tenantPath(`/branches${qs}`));
  return httpClient.unwrap(response) as PaginatedResponse<BranchItem>;
}

export async function createBranch(payload: BranchPayload): Promise<ApiSuccess<BranchItem>> {
  const response = await httpClient.post<BranchItem>(tenantPath("/branches"), payload);
  return httpClient.unwrap(response);
}

export async function updateBranch(id: number, payload: BranchPayload): Promise<ApiSuccess<BranchItem>> {
  const response = await httpClient.put<BranchItem>(tenantPath(`/branches/${id}`), payload);
  return httpClient.unwrap(response);
}

export async function deleteBranch(id: number): Promise<ApiSuccess<null>> {
  const response = await httpClient.delete<null>(tenantPath(`/branches/${id}`));
  return httpClient.unwrap(response);
}
