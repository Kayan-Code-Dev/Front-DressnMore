import { useEffect, useState } from "react";
import { isModuleLive } from "@/config/feature-flags";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { sessionStore, useSession } from "@/shared/lib/auth/session.store";
import type {
  SubscriptionOverview,
  SubscriptionPaymentGateway,
  SubscriptionPlanOption,
} from "@/features/subscriptions/types/subscription.types";
import {
  getSubscriptionOverviewMock,
  renewSubscriptionMock,
  upgradeSubscriptionMock,
} from "@/features/subscriptions/services/subscription.mock.service";
import {
  getSubscriptionOverview,
  listSubscriptionPaymentGateways,
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

function upgradePlan(payload: { plan_code: string; payment_gateway_id?: number; mock_payment_confirmed?: boolean }) {
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

const gatewayTypeLabels: Record<string, string> = {
  bank: "تحويل بنكي",
  vodafone_cash: "فودافون كاش",
  instapay: "انستاباي",
  orange_cash: "أورنج كاش",
  etisalat_cash: "اتصالات كاش",
  fawry: "فوري",
  other: "أخرى",
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
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanOption | null>(null);
  const [gateways, setGateways] = useState<SubscriptionPaymentGateway[]>([]);
  const [selectedGatewayId, setSelectedGatewayId] = useState<string>("");
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

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

  const completeUpgrade = async (planCode: string, gatewayId?: number) => {
    const response = await upgradePlan({
      plan_code: planCode,
      payment_gateway_id: gatewayId,
      mock_payment_confirmed: gatewayId ? true : undefined,
    });
    syncSessionSubscription(response.data);
    setMessage(response.message);
    setPaymentOpen(false);
    setSelectedPlan(null);
    setPaymentConfirmed(false);
    loadOverview();
  };

  const handlePlanSelect = async (planCode: string) => {
    setActionLoading(true);
    setMessage(null);
    try {
      const plan = data?.available_plans.find((item) => item.code === planCode);
      if (!plan) return;

      if (plan.account_type === "free") {
        const response = await renewPlan({ extension_days: plan.billing_period_days ?? 30 });
        syncSessionSubscription(response.data);
        setMessage(response.message);
        loadOverview();
        return;
      }

      if (!isModuleLive("subscription")) {
        const response = await upgradePlan({ plan_code: planCode });
        syncSessionSubscription(response.data);
        setMessage(response.message);
        loadOverview();
        return;
      }

      const rows = await listSubscriptionPaymentGateways();
      setGateways(rows);
      setSelectedPlan(plan);
      setSelectedGatewayId("");
      setPaymentConfirmed(false);
      setPaymentOpen(true);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "حدث خطأ");
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!selectedPlan || !selectedGatewayId || !paymentConfirmed) return;
    setActionLoading(true);
    setMessage(null);
    try {
      await completeUpgrade(selectedPlan.code, Number(selectedGatewayId));
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

      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogContent className="sm:max-w-lg" dir="rtl">
          <DialogHeader>
            <DialogTitle>إتمام الدفع — {selectedPlan?.name}</DialogTitle>
            <DialogDescription>
              اختر بوابة الدفع المتاحة من الإدارة. الدفع حالياً وهمي لحين ربط بوابة الدفع الفعلية.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 max-h-72 overflow-y-auto">
            {(gateways.length > 0 ? gateways : []).map((gateway) => (
              <button
                key={gateway.id}
                type="button"
                onClick={() => setSelectedGatewayId(gateway.id)}
                className={`w-full text-right rounded-xl border p-4 transition-colors ${
                  selectedGatewayId === gateway.id ? "border-blue-500 bg-blue-50" : "border-border"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold">{gateway.name}</span>
                  <Badge variant="outline">{gatewayTypeLabels[gateway.type] ?? gateway.type}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{gateway.account_holder}</p>
                <p className="text-sm font-mono mt-1" dir="ltr">{gateway.account_number}</p>
                {gateway.instructions ? (
                  <p className="text-xs text-muted-foreground mt-2">{gateway.instructions}</p>
                ) : null}
              </button>
            ))}
            {gateways.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                لا توجد بوابات دفع مفعّلة. يرجى التواصل مع الإدارة.
              </p>
            )}
          </div>

          <label className="flex items-start gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={paymentConfirmed}
              onChange={(e) => setPaymentConfirmed(e.target.checked)}
              className="mt-1"
            />
            <span>أؤكد أنني أتممت التحويل / الدفع (وضع تجريبي حتى ربط بوابة الدفع).</span>
          </label>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setPaymentOpen(false)} disabled={actionLoading}>
              إلغاء
            </Button>
            <Button
              onClick={handleConfirmPayment}
              disabled={actionLoading || !selectedGatewayId || !paymentConfirmed}
            >
              {actionLoading ? "جاري التفعيل..." : `تأكيد ودفع ${selectedPlan ? formatNumber(selectedPlan.price) : ""} ج.م`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
