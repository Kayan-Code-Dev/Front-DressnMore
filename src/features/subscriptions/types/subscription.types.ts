export type SubscriptionAccountType = "free" | "paid";

export type SubscriptionLifecycleStatus = "active" | "expired" | "grace";

export type TenantSubscription = {
  account_type: SubscriptionAccountType;
  lifecycle_status: SubscriptionLifecycleStatus;
  plan_code: string;
  plan_name: string;
  plan_id?: number | null;
  starts_at: string;
  expires_at: string | null;
  can_renew: boolean;
  days_remaining: number | null;
  enabled_modules?: string[];
  features?: Record<string, string>;
};

export type SubscriptionPlanOption = {
  code: string;
  name: string;
  account_type: SubscriptionAccountType;
  price: number;
  currency: string;
  billing_period_days: number | null;
  description: string;
  features: string[];
  is_current: boolean;
};

export type SubscriptionOverview = {
  subscription: TenantSubscription;
  tenant: {
    id: string;
    name: string;
    slug: string;
  };
  available_plans: SubscriptionPlanOption[];
};

export type RenewSubscriptionPayload = {
  extension_days?: number;
};

export type UpgradeSubscriptionPayload = {
  plan_code: string;
  payment_gateway_id?: number;
  mock_payment_confirmed?: boolean;
};

export type SubscriptionPaymentGateway = {
  id: string;
  name: string;
  type: string;
  account_holder: string;
  account_number: string;
  bank_name?: string | null;
  iban?: string | null;
  instructions?: string | null;
  is_active: boolean;
  display_order: number;
};
