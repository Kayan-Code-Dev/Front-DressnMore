import { fetchMe } from "@/features/auth/services/auth.api.service";
import { httpClient } from "@/shared/lib/http/client";
import { tenantPath } from "@/config/api";
import type { ApiSuccess } from "@/shared/types/api";
import type {
  RenewSubscriptionPayload,
  SubscriptionOverview,
  TenantSubscription,
  UpgradeSubscriptionPayload,
} from "@/features/subscriptions/types/subscription.types";

export async function getSubscriptionOverview(): Promise<ApiSuccess<SubscriptionOverview>> {
  const response = await fetchMe();
  if (!response.success || !response.data) {
    throw new Error(response.message ?? "Failed to load subscription");
  }

  return {
    success: true,
    message: response.message,
    data: {
      subscription: response.data.subscription,
      tenant: response.data.tenant,
      available_plans: [],
    },
    meta: null,
  };
}

export async function renewSubscription(
  payload: RenewSubscriptionPayload = {},
): Promise<ApiSuccess<TenantSubscription>> {
  const response = await httpClient.post<TenantSubscription>(
    tenantPath("/subscription/renew"),
    payload,
  );
  if (!response.success) throw new Error(response.message);
  return response;
}

export async function upgradeSubscription(
  payload: UpgradeSubscriptionPayload,
): Promise<ApiSuccess<TenantSubscription>> {
  const response = await httpClient.post<TenantSubscription>(
    tenantPath("/subscription/upgrade"),
    payload,
  );
  if (!response.success) throw new Error(response.message);
  return response;
}
