import type {
  BranchSettingItem,
  ContentProfile,
  CurrencyItem,
  InvoiceRuleItem,
  ProductCategoryItem,
  SubscriptionSetting,
} from "@/features/content-management/types/content-management.types";

export const contentProfileFixture: ContentProfile = {
  name: "محمد أحمد",
  email: "admin@dressnmore.com",
  phone: "+201012345678",
  company_name: "Dress n More",
};

export const branchSettingsFixture: BranchSettingItem[] = [
  { id: 1, branch_name: "Cairo Main", currency: "EGP", vat_rate: "14%" },
  { id: 2, branch_name: "Alex Branch", currency: "EGP", vat_rate: "14%" },
  { id: 3, branch_name: "Mansoura Branch", currency: "EGP", vat_rate: "14%" },
];

export const currenciesFixture: CurrencyItem[] = [
  { id: 1, code: "EGP", name: "جنيه مصري", symbol: "ج.م", exchange_rate: 1, is_default: true },
  { id: 2, code: "USD", name: "دولار أمريكي", symbol: "$", exchange_rate: 48.5, is_default: false },
  { id: 3, code: "SAR", name: "ريال سعودي", symbol: "ر.س", exchange_rate: 12.9, is_default: false },
];

export const productCategoriesFixture: ProductCategoryItem[] = [
  { id: 1, name: "فساتين", subcategories_count: 5 },
  { id: 2, name: "عبايات", subcategories_count: 3 },
  { id: 3, name: "إكسسوارات", subcategories_count: 8 },
  { id: 4, name: "أقمشة", subcategories_count: 12 },
];

export const invoiceRulesFixture: InvoiceRuleItem[] = [
  {
    id: 1,
    name: "عرض الضريبة",
    description: "إظهار ضريبة القيمة المضافة في الفاتورة",
    enabled: true,
  },
  {
    id: 2,
    name: "خصم تلقائي",
    description: "تطبيق خصم على العملاء المميزين",
    enabled: false,
  },
  {
    id: 3,
    name: "طباعة الشعار",
    description: "طباعة شعار الشركة على الفاتورة",
    enabled: true,
  },
];

export const subscriptionSettingFixture: SubscriptionSetting = {
  plan_name: "الباقة الذهبية",
  status: "active",
  expires_at: "2026-01-15",
  max_branches: 10,
  max_users: 50,
};
