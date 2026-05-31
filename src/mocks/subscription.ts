export type PlanId = "basic" | "pro" | "enterprise";

export type SubscriptionPlan = {
  id: PlanId;
  name: string;
  nameEn: string;
  price: number;
  period: string;
  color: string;
  badge?: string;
  branches: number | "unlimited";
  employees: number | "unlimited";
  features: string[];
};

export type PaymentHistoryItem = {
  id: string;
  date: string;
  plan: string;
  method: string;
  amount: number;
  status: string;
};

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "basic",
    name: "أساسي",
    nameEn: "Basic",
    price: 99,
    period: "شهرياً",
    color: "#6366F1",
    branches: 1,
    employees: 10,
    features: ["فرع واحد", "تقارير أساسية", "دعم بريد إلكتروني", "حتى 100 فستان"],
  },
  {
    id: "pro",
    name: "احترافي",
    nameEn: "Professional",
    price: 299,
    period: "شهرياً",
    color: "#C2964A",
    badge: "الأكثر شعبية",
    branches: 5,
    employees: 50,
    features: ["فروع متعددة", "تقارير متقدمة", "دعم 24/7", "API access"],
  },
  {
    id: "enterprise",
    name: "مؤسسات",
    nameEn: "Enterprise",
    price: 599,
    period: "شهرياً",
    color: "#0C1A3E",
    badge: "Enterprise",
    branches: "unlimited",
    employees: "unlimited",
    features: ["فروع غير محدودة", "مدير حساب", "SLA مخصص", "تكامل ERP"],
  },
];

export const currentSubscription = {
  plan: "pro" as PlanId,
  daysRemaining: 45,
  totalDays: 365,
  autoRenew: true,
  nextBillingAmount: 299,
  nextBillingDate: "2026-06-30",
};

export const paymentHistory: PaymentHistoryItem[] = [
  {
    id: "pay-001",
    date: "2026-01-01",
    plan: "احترافي",
    method: "بطاقة ائتمان",
    amount: 299,
    status: "ناجح",
  },
  {
    id: "pay-002",
    date: "2025-12-01",
    plan: "احترافي",
    method: "بطاقة ائتمان",
    amount: 299,
    status: "ناجح",
  },
  {
    id: "pay-003",
    date: "2025-11-01",
    plan: "أساسي",
    method: "تحويل بنكي",
    amount: 99,
    status: "ناجح",
  },
];
