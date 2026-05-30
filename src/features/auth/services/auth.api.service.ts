import { httpClient } from "@/shared/lib/http/client";
import { tenantPath } from "@/config/api";
import type { ApiResponse } from "@/shared/types/api";
import type { LoginFormValues, LoginResult, MeResult } from "@/features/auth/types/auth.types";

export async function tenantLogin(payload: LoginFormValues): Promise<ApiResponse<LoginResult>> {
  return httpClient.post<LoginResult>(tenantPath("/login"), payload);
}

export async function fetchMe(): Promise<ApiResponse<MeResult>> {
  return httpClient.get<MeResult>(tenantPath("/me"));
}

export async function tenantLogout(): Promise<ApiResponse<null>> {
  return httpClient.post<null>(tenantPath("/logout"));
}
