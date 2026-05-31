import { fetchMe } from "@/features/auth/services/auth.api.service";
import { httpClient } from "@/shared/lib/http/client";
import { tenantPath } from "@/config/api";
import type { AccountProfile } from "@/features/settings/types/settings.types";
import type { ApiSuccess } from "@/shared/types/api";

export async function getAccountProfile(): Promise<ApiSuccess<AccountProfile>> {
  const response = await fetchMe();
  if (!response.success || !response.data) {
    throw new Error(response.message ?? "Failed to load profile");
  }

  return {
    success: true,
    message: response.message,
    data: {
      name: response.data.user.name,
      email: response.data.user.email,
      avatar: null,
      logo: null,
    },
    meta: null,
  };
}

export async function updateAccountProfile(payload: {
  name: string;
  email: string;
}): Promise<ApiSuccess<AccountProfile>> {
  const response = await httpClient.put<{ name: string; email: string }>(
    tenantPath("/settings/profile"),
    payload,
  );
  if (!response.success || !response.data) {
    throw new Error(response.message ?? "Failed to update profile");
  }

  return {
    success: true,
    message: response.message,
    data: {
      name: response.data.name,
      email: response.data.email,
      avatar: null,
      logo: null,
    },
    meta: null,
  };
}
