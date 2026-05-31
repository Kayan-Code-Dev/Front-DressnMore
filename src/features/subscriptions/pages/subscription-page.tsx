import { useEffect, useState } from "react";
import { isModuleLive } from "@/config/feature-flags";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { sessionStore, useSession } from "@/shared/lib/auth/session.store";
import type { SubscriptionOverview, SubscriptionPlanOption } from "@/features/subscriptions/types/subscription.types";
import {
  getSubscriptionOverviewMock,
  renewSubscriptionMock,
  upgradeSubscriptionMock,
} from "@/features/subscriptions/services/subscription.mock.service";
import {
  getSubscriptionOverview,
  renewSubscription,
  upgradeSubscription,
} from "@/features/subscriptions/services/subscription.api.service";
import { Check, Crown, RefreshCw, Sparkles } from "lucide-react";
import { formatNumber } from "@/shared/lib/format/numbers";

function fetchOverview() {
  return isModuleLive("subscription") ? getSubscriptionOverview() : getSubscriptionOverviewMock();
}

function renewPlan(payload = {}) {
  return isModuleLive("subscription") ? renewSubscription(payload) : renewSubscriptionMock(payload);
}

function upgradePlan(planCode: string) {
  const payload = { plan_code: planCode };
  return isModuleLive("subscription") ? upgradeSubscription(payload) : upgradeSubscriptionMock(payload);
}

const statusLabels = {
  active: { label: "نشط", variant: "success" as const },
  expired: { label: "منتهي", variant: "destructive" as const },
  grace: { label: "فترة سماح", variant: "warning" as const },
};

const accountTypeLabels = {
  free: "مجاني",
  paid: "مدفوع",
};

function PlanCard({
  plan,
  loading,
  onSelect,
}: {
  plan: SubscriptionPlanOption;
  loading: boolean;
  onSelect: (code: string) => void;
}) {
  const isFree = plan.account_type === "free";

  return (
    <Card className={plan.is_current ? "border-blue-500 ring-2 ring-blue-100" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-lg font-black">{plan.name}</CardTitle>
          {plan.is_current && <Badge variant="info">الحالية</Badge>}
        </div>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-3xl font-black" style={{ color: "var(--color-text-primary)" }}>
            {plan.price === 0 ? "مجاناً" : `${formatNumber(plan.price)} ${plan.currency}`}
          </p>
          {plan.billing_period_days && (
            <p className="text-xs text-muted-foreground">/ {plan.billing_period_days} يوم</p>
          )}
        </div>
        <ul className="space-y-2">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <Button
          className="w-full"
          variant={plan.is_current ? "outline" : isFree ? "secondary" : "default"}
          disabled={plan.is_current || loading}
          onClick={() => onSelect(plan.code)}
        >
          {plan.is_current ? "الباقة الحالية" : isFree ? "تجديد مجاني" : "اختيار الباقة"}
        </Button>
      </CardContent>
    </Card>
  );
}

export function SubscriptionPage() {
  const sessionSubscription = useSession((state) => state.subscription);
  const [data, setData] = useState<SubscriptionOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const loadOverview = () => {
    setLoading(true);
    fetchOverview()
      .then((response) => setData(response.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOverview();
  }, []);

  const subscription = data?.subscription ?? sessionSubscription;
  const status = subscription ? statusLabels[subscription.lifecycle_status] : null;

  const syncSessionSubscription = (next: SubscriptionOverview["subscription"]) => {
    const session = sessionStore.getState();
    sessionStore.setSession({
      token: session.token,
      tenant: session.tenant,
      user: session.user,
      permissions: session.permissions,
      subscription: next,
    });
  };

  const handlePlanSelect = async (planCode: string) => {
    setActionLoading(true);
    setMessage(null);
    try {
      const plan = data?.available_plans.find((item) => item.code === planCode);
      const response = plan?.account_type === "free"
        ? await renewPlan({ extension_days: plan.billing_period_days ?? 30 })
        : await upgradePlan(planCode);

      syncSessionSubscription(response.data);
      setMessage(response.message);
      loadOverview();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "حدث خطأ");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #6366F1, #818CF8)" }}
            >
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-black">الاشتراك والباقات</CardTitle>
              <CardDescription>إدارة حالة الحساب والترقية بين الباقات المجانية والمدفوعة.</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold">الاشتراك الحالي</CardTitle>
        </CardHeader>
        <CardContent>
          {!subscription || loading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-20 w-full" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <div className="rounded-xl border p-4">
                <p className="text-xs text-muted-foreground mb-1">نوع الحساب</p>
                <div className="flex items-center gap-2">
                  {subscription.account_type === "paid" ? (
                    <Sparkles className="h-4 w-4 text-amber-500" />
                  ) : (
                    <RefreshCw className="h-4 w-4 text-sky-500" />
                  )}
                  <p className="font-black">{accountTypeLabels[subscription.account_type]}</p>
                </div>
              </div>
              <div className="rounded-xl border p-4">
                <p className="text-xs text-muted-foreground mb-1">الباقة</p>
                <p className="font-black">{subscription.plan_name}</p>
              </div>
              <div className="rounded-xl border p-4">
                <p className="text-xs text-muted-foreground mb-1">الحالة</p>
                {status && <Badge variant={status.variant}>{status.label}</Badge>}
              </div>
              <div className="rounded-xl border p-4">
                <p className="text-xs text-muted-foreground mb-1">تاريخ الانتهاء</p>
                <p className="font-black">{subscription.expires_at ?? "—"}</p>
                {subscription.days_remaining != null && (
                  <p className="text-xs text-muted-foreground mt-1">
                    متبقي {subscription.days_remaining} يوم
                  </p>
                )}
              </div>
            </div>
          )}

          {subscription?.account_type === "free" && subscription.can_renew && (
            <div className="mt-4">
              <Button
                variant="outline"
                disabled={actionLoading}
                onClick={() => handlePlanSelect("free")}
              >
                <RefreshCw className="h-4 w-4 ml-2" />
                تجديد الفترة المجانية
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {message && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {message}
        </div>
      )}

      <div>
        <h2 className="text-base font-black mb-4" style={{ color: "var(--color-text-primary)" }}>
          الباقات المتاحة
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-72 w-full" />)
            : (data?.available_plans ?? []).map((plan) => (
                <PlanCard
                  key={plan.code}
                  plan={plan}
                  loading={actionLoading}
                  onSelect={handlePlanSelect}
                />
              ))}
        </div>
      </div>
    </div>
  );
}
