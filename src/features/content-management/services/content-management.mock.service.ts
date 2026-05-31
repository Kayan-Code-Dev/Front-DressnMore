import type { ApiSuccess } from "@/shared/types/api";
import type {
  BranchSettingItem,
  ContentProfile,
  CurrencyItem,
  InvoiceRuleItem,
  ProductCategoryItem,
  SubscriptionSetting,
} from "@/features/content-management/types/content-management.types";
import {
  branchSettingsFixture,
  contentProfileFixture,
  currenciesFixture,
  invoiceRulesFixture,
  productCategoriesFixture,
  subscriptionSettingFixture,
} from "@/features/content-management/mocks/content-management.mock";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getContentProfileMock(): Promise<ApiSuccess<ContentProfile>> {
  await delay(180);
  return { success: true, message: "Success", data: contentProfileFixture };
}

export async function listBranchSettingsMock(): Promise<ApiSuccess<BranchSettingItem[]>> {
  await delay(200);
  return { success: true, message: "Success", data: branchSettingsFixture, meta: { total: branchSettingsFixture.length } };
}

export async function listCurrenciesMock(): Promise<ApiSuccess<CurrencyItem[]>> {
  await delay(200);
  return { success: true, message: "Success", data: currenciesFixture, meta: { total: currenciesFixture.length } };
}

export async function listProductCategoriesMock(): Promise<ApiSuccess<ProductCategoryItem[]>> {
  await delay(200);
  return { success: true, message: "Success", data: productCategoriesFixture, meta: { total: productCategoriesFixture.length } };
}

export async function listInvoiceRulesMock(): Promise<ApiSuccess<InvoiceRuleItem[]>> {
  await delay(200);
  return { success: true, message: "Success", data: invoiceRulesFixture, meta: { total: invoiceRulesFixture.length } };
}

export async function getSubscriptionSettingMock(): Promise<ApiSuccess<SubscriptionSetting>> {
  await delay(180);
  return { success: true, message: "Success", data: subscriptionSettingFixture };
}

export async function getContentManagementDataMock(): Promise<
  ApiSuccess<{
    profile: ContentProfile;
    branches: BranchSettingItem[];
    currencies: CurrencyItem[];
    categories: ProductCategoryItem[];
    invoiceRules: InvoiceRuleItem[];
    subscription: SubscriptionSetting;
  }>
> {
  await delay(250);
  return {
    success: true,
    message: "Success",
    data: {
      profile: contentProfileFixture,
      branches: branchSettingsFixture,
      currencies: currenciesFixture,
      categories: productCategoriesFixture,
      invoiceRules: invoiceRulesFixture,
      subscription: subscriptionSettingFixture,
    },
  };
}
