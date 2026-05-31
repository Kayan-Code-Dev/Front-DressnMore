import { useState } from "react";
import {
  subscriptionPlans,
  currentSubscription,
  paymentHistory,
  PlanId,
} from "@/mocks/subscription";

export default function SubscriptionSettingsTab() {
  const [activeSection, setActiveSection] = useState<'overview' | 'plans' | 'history'>('overview');
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);
  const [autoRenew, setAutoRenew] = useState(currentSubscription.autoRenew);
  const [showUpgradeConfirm, setShowUpgradeConfirm] = useState(false);
  const [upgraded, setUpgraded] = useState(false);

  const current = subscriptionPlans.find((p) => p.id === currentSubscription.plan)!;
  const progress = Math.round(
    ((currentSubscription.totalDays - currentSubscription.daysRemaining) /
      currentSubscription.totalDays) *
      100
  );
  const daysPercent = Math.round(
    (currentSubscription.daysRemaining / currentSubscription.totalDays) * 100
  );

  const progressColor =
    daysPercent > 50 ? '#22C55E' : daysPercent > 20 ? '#F59E0B' : '#EF4444';

  const statusColor: Record<string, { color: string; bg: string }> = {
    ناجح: { color: '#22C55E', bg: '#F0FDF4' },
    فاشل: { color: '#EF4444', bg: '#FEF2F2' },
    'مُسترد': { color: '#F59E0B', bg: '#FFFBEB' },
  };

  const handleUpgrade = () => {
    setShowUpgradeConfirm(false);
    setUpgraded(true);
    setTimeout(() => setUpgraded(false), 3000);
  };

  return (
    <div className="space-y-5">
      <div
        className="rounded-xl p-4 flex items-start gap-3"
        style={{ background: "#EEF2FF", border: "1px solid #C7D2FE" }}
      >
        <i className="ri-information-line mt-0.5 shrink-0 text-indigo-500" />
        <div>
          <p className="text-sm font-black text-indigo-900">
            بيانات تجريبية — غير مربوطة بالخادم
          </p>
          <p className="text-xs text-indigo-700/80 mt-1 leading-relaxed">
            الباقة والمدفوعات المعروضة من ملف وهمي للمعاينة فقط؛ لا يتم إرسال أو استقبال أي بيانات اشتراك حقيقية.
          </p>
        </div>
      </div>

      {/* Current plan banner */}
      <div
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0C1A3E 0%, #1E3A7B 100%)' }}
      >
        {/* Decorative circles */}
        <div
          className="absolute -top-10 -left-10 w-40 h-40 rounded-full opacity-10"
          style={{ background: current.color }}
        />
        <div
          className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full opacity-10"
          style={{ background: current.color }}
        />

        <div className="relative flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${current.color}25` }}
            >
              <i className="ri-vip-crown-2-line text-2xl" style={{ color: current.color }} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white font-black text-xl">{current.name}</span>
                {current.badge && (
                  <span
                    className="text-[10px] px-2.5 py-0.5 rounded-full font-bold"
                    style={{ background: `${current.color}30`, color: current.color }}
                  >
                    {current.badge}
                  </span>
                )}
                <span
                  className="text-[10px] px-2.5 py-1 rounded-full font-bold"
                  style={{ background: '#22C55E20', color: '#22C55E' }}
                >
                  <i className="ri-checkbox-circle-fill ml-1" />
                  نشط
                </span>
              </div>
              <p className="text-white/50 text-xs">
                {current.price} ج.م {current.period} — ينتهي في 01 أبريل 2026
              </p>
            </div>
          </div>
          <div className="text-center flex-shrink-0">
            <p
              className="text-4xl font-black"
              style={{ color: progressColor }}
            >
              {currentSubscription.daysRemaining}
            </p>
            <p className="text-white/50 text-xs mt-0.5">يوم متبقي</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative mt-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-white/50 text-[11px]">
              مضى {currentSubscription.totalDays - currentSubscription.daysRemaining} يوم
            </span>
            <span className="text-white/50 text-[11px]">
              {currentSubscription.daysRemaining} يوم متبقي من {currentSubscription.totalDays}
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: progressColor }}
            />
          </div>
        </div>

        {/* Auto renew toggle */}
        <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-2">
            <i className="ri-refresh-line text-sm text-white/40" />
            <span className="text-white/60 text-xs">التجديد التلقائي</span>
            <button
              onClick={() => setAutoRenew((p) => !p)}
              className="relative w-10 h-5 rounded-full cursor-pointer transition-all duration-200"
              style={{ background: autoRenew ? '#22C55E' : 'rgba(255,255,255,0.2)' }}
            >
              <span
                className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200"
                style={{ right: autoRenew ? '2px' : 'calc(100% - 18px)' }}
              />
            </button>
            <span className="text-xs" style={{ color: autoRenew ? '#86EFAC' : 'rgba(255,255,255,0.4)' }}>
              {autoRenew ? 'مفعّل' : 'معطّل'}
            </span>
          </div>
          {autoRenew && (
            <span className="text-white/40 text-xs">
              الفاتورة القادمة: {currentSubscription.nextBillingAmount} ج.م في {currentSubscription.nextBillingDate}
            </span>
          )}
        </div>
      </div>

      {/* Sub nav */}
      <div
        className="flex items-center gap-1 p-1 rounded-xl"
        style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}
      >
        {(
          [
            { id: 'overview', label: 'نظرة عامة', icon: 'ri-dashboard-3-line' },
            { id: 'plans', label: 'تغيير الباقة', icon: 'ri-exchange-line' },
            { id: 'history', label: 'سجل المدفوعات', icon: 'ri-receipt-line' },
          ] as { id: 'overview' | 'plans' | 'history'; label: string; icon: string }[]
        ).map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className="flex items-center gap-2 flex-1 justify-center py-2.5 rounded-lg text-sm font-bold cursor-pointer transition-all duration-150 whitespace-nowrap"
            style={
              activeSection === s.id
                ? { background: '#0C1A3E', color: '#FFFFFF' }
                : { color: '#64748B' }
            }
          >
            <i className={s.icon} />
            {s.label}
          </button>
        ))}
      </div>

      {/* ── Overview section ── */}
      {activeSection === 'overview' && (
        <div className="space-y-4">
          {/* Included features */}
          <div className="rounded-2xl p-5 bg-white border border-slate-100">
            <h4 className="font-black text-slate-800 text-sm mb-4 flex items-center gap-2">
              <i className="ri-star-line" style={{ color: current.color }} />
              ما يتضمنه اشتراكك الحالي
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {current.features.map((f) => (
                <div key={f} className="flex items-center gap-2 p-3 rounded-xl" style={{ background: '#F8FAFC' }}>
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: `${current.color}15` }}
                  >
                    <i className="ri-check-line text-xs" style={{ color: current.color }} />
                  </span>
                  <span className="text-xs text-slate-600 font-medium">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Usage stats */}
          <div className="rounded-2xl p-5 bg-white border border-slate-100">
            <h4 className="font-black text-slate-800 text-sm mb-4 flex items-center gap-2">
              <i className="ri-bar-chart-2-line" style={{ color: '#0EA5E9' }} />
              استخدامك الحالي
            </h4>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'الفروع', used: 5, total: typeof current.branches === 'number' ? current.branches : 99, icon: 'ri-map-pin-2-line', color: '#C2964A' },
                { label: 'الموظفون', used: 41, total: typeof current.employees === 'number' ? current.employees : 99, icon: 'ri-user-star-line', color: '#6366F1' },
                { label: 'الفواتير هذا الشهر', used: 148, total: 500, icon: 'ri-file-list-3-line', color: '#22C55E' },
              ].map((stat) => {
                const pct = Math.min(Math.round((stat.used / stat.total) * 100), 100);
                const barColor = pct > 90 ? '#EF4444' : pct > 70 ? '#F59E0B' : stat.color;
                return (
                  <div key={stat.label} className="p-4 rounded-xl" style={{ background: '#F8FAFC' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <i className={`${stat.icon} text-sm`} style={{ color: stat.color }} />
                      <span className="text-xs font-bold text-slate-500">{stat.label}</span>
                    </div>
                    <p className="text-slate-800 font-black text-lg leading-tight">
                      {stat.used}
                      <span className="text-slate-400 text-xs font-normal"> / {stat.total === 99 ? '∞' : stat.total}</span>
                    </p>
                    <div className="mt-2 h-1.5 rounded-full" style={{ background: '#E2E8F0' }}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, background: barColor }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">{pct}% مستخدم</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick renew */}
          <div
            className="rounded-2xl p-5 flex items-center justify-between gap-4"
            style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}
          >
            <div className="flex items-center gap-3">
              <i className="ri-alarm-warning-line text-xl" style={{ color: '#D97706' }} />
              <div>
                <p className="text-sm font-black" style={{ color: '#92400E' }}>
                  تجديد الاشتراك قريباً
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#78350F' }}>
                  باقي {currentSubscription.daysRemaining} يوم — التجديد بـ {currentSubscription.nextBillingAmount} ج.م
                </p>
              </div>
            </div>
            <button
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-all duration-150 whitespace-nowrap"
              style={{ background: '#D97706', color: '#FFFFFF' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#B45309'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#D97706'; }}
            >
              <i className="ri-refresh-line" />
              تجديد الآن
            </button>
          </div>
        </div>
      )}

      {/* ── Plans section ── */}
      {activeSection === 'plans' && (
        <div className="space-y-4">
          {upgraded && (
            <div
              className="rounded-xl p-4 flex items-center gap-3"
              style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}
            >
              <i className="ri-checkbox-circle-fill text-lg" style={{ color: '#22C55E' }} />
              <p className="text-sm font-bold" style={{ color: '#166534' }}>
                تم طلب تغيير الباقة بنجاح — سيتم التطبيق عند انتهاء الفترة الحالية
              </p>
            </div>
          )}
          <div className="grid grid-cols-3 gap-4">
            {subscriptionPlans.map((plan) => {
              const isCurrent = plan.id === currentSubscription.plan;
              const isSelected = selectedPlan === plan.id;
              return (
                <div
                  key={plan.id}
                  onClick={() => !isCurrent && setSelectedPlan(plan.id)}
                  className="rounded-2xl p-5 transition-all duration-150 relative overflow-hidden"
                  style={{
                    background: isSelected
                      ? `${plan.color}08`
                      : isCurrent
                      ? `${plan.color}05`
                      : '#FFFFFF',
                    border: isSelected
                      ? `2px solid ${plan.color}`
                      : isCurrent
                      ? `2px solid ${plan.color}60`
                      : '2px solid #E2E8F0',
                    cursor: isCurrent ? 'default' : 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    if (!isCurrent && !isSelected)
                      (e.currentTarget as HTMLElement).style.borderColor = `${plan.color}80`;
                  }}
                  onMouseLeave={(e) => {
                    if (!isCurrent && !isSelected)
                      (e.currentTarget as HTMLElement).style.borderColor = '#E2E8F0';
                  }}
                >
                  {isCurrent && (
                    <div
                      className="absolute top-3 left-3 text-[10px] px-2 py-1 rounded-full font-bold"
                      style={{ background: `${plan.color}20`, color: plan.color }}
                    >
                      باقتك الحالية
                    </div>
                  )}
                  {plan.badge && !isCurrent && (
                    <div
                      className="absolute top-3 left-3 text-[10px] px-2 py-1 rounded-full font-bold"
                      style={{ background: `${plan.color}20`, color: plan.color }}
                    >
                      {plan.badge}
                    </div>
                  )}

                  <div className="mb-4 mt-1">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                      style={{ background: `${plan.color}15` }}
                    >
                      <i className="ri-vip-crown-2-line text-lg" style={{ color: plan.color }} />
                    </div>
                    <h3 className="font-black text-slate-800 text-lg">{plan.name}</h3>
                    <p className="text-xs text-slate-400 font-medium">{plan.nameEn}</p>
                  </div>

                  <div className="mb-4">
                    <span className="font-black text-2xl" style={{ color: plan.color }}>
                      {plan.price}
                    </span>
                    <span className="text-xs text-slate-400 mr-1">ج.م / شهر</span>
                  </div>

                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center gap-1.5">
                      <i className="ri-map-pin-2-line text-xs" style={{ color: plan.color }} />
                      <span className="text-xs text-slate-600">
                        {typeof plan.branches === 'number' ? `${plan.branches} فروع` : 'فروع غير محدودة'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <i className="ri-user-line text-xs" style={{ color: plan.color }} />
                      <span className="text-xs text-slate-600">
                        {typeof plan.employees === 'number' ? `${plan.employees} موظفاً` : 'موظفون غير محدودون'}
                      </span>
                    </div>
                    {plan.features.slice(2, 4).map((f) => (
                      <div key={f} className="flex items-center gap-1.5">
                        <i className="ri-check-line text-xs" style={{ color: plan.color }} />
                        <span className="text-xs text-slate-500">{f}</span>
                      </div>
                    ))}
                  </div>

                  {!isCurrent && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPlan(plan.id);
                        setShowUpgradeConfirm(true);
                      }}
                      className="w-full py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all duration-150 whitespace-nowrap"
                      style={{
                        background: isSelected ? plan.color : `${plan.color}15`,
                        color: isSelected ? '#FFFFFF' : plan.color,
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = plan.color;
                        (e.currentTarget as HTMLElement).style.color = '#FFFFFF';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = isSelected
                          ? plan.color
                          : `${plan.color}15`;
                        (e.currentTarget as HTMLElement).style.color = isSelected
                          ? '#FFFFFF'
                          : plan.color;
                      }}
                    >
                      الانتقال إلى {plan.name}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Payment history section ── */}
      {activeSection === 'history' && (
        <div className="rounded-2xl bg-white border border-slate-100 overflow-hidden">
          <div
            className="px-5 py-4 flex items-center justify-between"
            style={{ borderBottom: '1px solid #EEF2F8' }}
          >
            <h4 className="font-black text-slate-800 text-sm flex items-center gap-2">
              <i className="ri-receipt-line" style={{ color: '#6366F1' }} />
              سجل المدفوعات
            </h4>
            <span className="text-xs text-slate-400">{paymentHistory.length} عملية</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: '#1E293B' }}>
                  {['رقم الفاتورة', 'التاريخ', 'الباقة', 'طريقة الدفع', 'المبلغ', 'الحالة', ''].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-right text-xs font-bold"
                      style={{ color: 'rgba(255,255,255,0.7)', borderLeft: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((pay, idx) => {
                  const st = statusColor[pay.status] || { color: '#64748B', bg: '#F1F5F9' };
                  return (
                    <tr
                      key={pay.id}
                      className="transition-colors duration-100"
                      style={{
                        background: idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC',
                        borderBottom: '1px solid #EEF2F8',
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#F5F8FF'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC'; }}
                    >
                      <td className="px-4 py-3 text-xs font-bold text-slate-700" style={{ borderLeft: '1px solid #EEF2F8' }}>
                        {pay.invoiceNo}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500" style={{ borderLeft: '1px solid #EEF2F8' }}>
                        {pay.date}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600" style={{ borderLeft: '1px solid #EEF2F8' }}>
                        {pay.plan}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500" style={{ borderLeft: '1px solid #EEF2F8' }}>
                        {pay.method}
                      </td>
                      <td className="px-4 py-3 text-xs font-black" style={{ borderLeft: '1px solid #EEF2F8', color: '#0C1A3E' }}>
                        {pay.amount.toLocaleString("en-US")} ج.م
                      </td>
                      <td className="px-4 py-3" style={{ borderLeft: '1px solid #EEF2F8' }}>
                        <span
                          className="text-[11px] px-2.5 py-1 rounded-full font-bold"
                          style={{ color: st.color, background: st.bg }}
                        >
                          {pay.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          className="text-xs flex items-center gap-1 cursor-pointer transition-opacity hover:opacity-70 whitespace-nowrap font-semibold"
                          style={{ color: '#6366F1' }}
                        >
                          <i className="ri-download-2-line" />
                          فاتورة
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Upgrade confirmation modal */}
      {showUpgradeConfirm && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
            {(() => {
              const plan = subscriptionPlans.find((p) => p.id === selectedPlan)!;
              return (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: `${plan.color}15` }}
                    >
                      <i className="ri-vip-crown-2-line text-xl" style={{ color: plan.color }} />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-800 text-base">
                        الانتقال إلى باقة {plan.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">{plan.price} ج.م شهرياً</p>
                    </div>
                  </div>
                  <div
                    className="rounded-xl p-4 mb-5 space-y-1.5"
                    style={{ background: '#F8FAFC' }}
                  >
                    {plan.features.map((f) => (
                      <div key={f} className="flex items-center gap-2">
                        <i className="ri-check-line text-xs" style={{ color: plan.color }} />
                        <span className="text-xs text-slate-600">{f}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mb-4">
                    سيتم التحويل إلى الباقة الجديدة فور انتهاء فترة اشتراكك الحالية، وسيُخصم المبلغ من طريقة الدفع المسجّلة.
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleUpgrade}
                      className="flex-1 py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-all duration-150 whitespace-nowrap"
                      style={{ background: plan.color, color: '#FFFFFF' }}
                    >
                      تأكيد التغيير
                    </button>
                    <button
                      onClick={() => setShowUpgradeConfirm(false)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-all duration-150 whitespace-nowrap"
                      style={{ background: '#F1F5F9', color: '#64748B' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#E2E8F0'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#F1F5F9'; }}
                    >
                      إلغاء
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
