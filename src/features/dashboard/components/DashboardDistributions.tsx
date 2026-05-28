import { Activity } from "lucide-react";

export function DashboardDistributions() {
  return (
    <div
      className="rounded-2xl overflow-hidden border"
      style={{ background: "white", borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }}
    >
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: "1px solid var(--color-border)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 flex items-center justify-center rounded-lg"
            style={{ background: "#F4F7FB", color: "var(--color-text-muted)" }}
          >
            <Activity className="w-4 h-4" />
          </div>
          <h3 className="font-black text-sm" style={{ color: "var(--color-text-primary)" }}>
            آخر الطلبات
          </h3>
        </div>
      </div>

      <div className="py-12 text-center text-sm" style={{ color: "var(--color-text-muted)" }}>
        سيتم عرض آخر الطلبات عند تفعيل واجهة لوحة التحكم
      </div>
    </div>
  );
}
