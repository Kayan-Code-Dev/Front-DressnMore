export type CurrencyItem = {
  id: number;
  code: string;
  name: string;
  symbol: string;
  exchange_rate: number;
  is_default: boolean;
};

export type ContentProfile = {
  name: string;
  email: string;
  phone: string;
  company_name: string;
};

export type BranchSettingItem = {
  id: number;
  branch_name: string;
  currency: string;
  vat_rate: string;
};

export type ProductCategoryItem = {
  id: number;
  name: string;
  subcategories_count: number;
};

export type InvoiceRuleItem = {
  id: number;
  name: string;
  description: string;
  enabled: boolean;
};

export type SubscriptionSetting = {
  plan_name: string;
  status: string;
  expires_at: string;
  max_branches: number;
  max_users: number;
};

export type ContentTabId =
  | "profile"
  | "branches"
  | "product-taxonomy"
  | "currencies"
  | "invoice-rules"
  | "subscription";
