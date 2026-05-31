import type { TenantSubscription } from "@/features/subscriptions/types/subscription.types";

export type LoginFormValues = {
  email: string;
  password: string;
};

export type LoginResult = {
  token: string;
  tenant: {
    id: string;
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

export type MockLoginResult = LoginResult;

export type MeResult = {
  tenant: {
    id: string;
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
