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
  const response = await httpClient.get<SubscriptionOverview>(tenantPath("/subscription"));
  if (!response.success) throw new Error(response.message);
  return response;
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
