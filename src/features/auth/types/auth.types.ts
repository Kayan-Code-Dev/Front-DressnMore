export type TenantSubscription = {
  account_type: "free" | "paid";
  lifecycle_status: "active" | "expired" | "grace";
  plan_code: string;
  plan_name: string;
  starts_at: string;
  expires_at: string | null;
  can_renew: boolean;
  days_remaining: number | null;
};

export type LoginFormValues = {
  email: string;
  password: string;
};

export type LoginResult = {
  token: string;
  tenant: {
    id: number;
    slug: string;
    name: string;
  };
  user: {
    id: number;
    name: string;
    email: string;
  };
  permissions: string[];
  subscription: TenantSubscription;
};

export type MeResult = {
  tenant: {
    id: number;
    slug: string;
    name: string;
  };
  user: {
    id: number;
    name: string;
    email: string;
  };
  permissions: string[];
  subscription: TenantSubscription;
};
