import { useMemo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useMyPermissions } from "@/api/auth/auth.hooks";

type ContentTabId =
  | "profile"
  | "branches"
  | "product-taxonomy"
  | "currencies"
  | "invoice-rules"
  | "subscription";

type TabDef = {
  id: ContentTabId;
  path: string;
  label: string;
  description: string;
  icon: string;
  color: string;
  /** فارغ = يظهر لأي مستخدم مسجّل (ضمن `/content`) */
  permissions: string[];
};

const TAB_DEFS: TabDef[] = [
  {
    id: "profile",
    path: "/content/profile",
    label: "البروفايل الشخصي",
    description: "بيانات الحساب وكلمة المرور والشعار",
    icon: "ri-user-3-line",
    color: "#3B82F6",
    permissions: [],
  },
  {
    id: "branches",
    path: "/content/branches",
    label: "إعدادات الفروع",
    description: "الضريبة والعملة لكل فرع",
    icon: "ri-map-pin-2-line",
    color: "#C2964A",
    permissions: ["branches.view"],
  },
  {
    id: "product-taxonomy",
    path: "/content/product-taxonomy",
    label: "الأصناف والتصنيفات",
    description: "أقسام المنتجات والأقسام الفرعية",
    icon: "ri-folder-3-line",
    color: "#10B981",
    permissions: ["categories.view", "subcategories.view"],
  },
  {
    id: "currencies",
    path: "/content/currencies",
    label: "العملات",
    description: "العملات المعتمدة في النظام",
    icon: "ri-exchange-dollar-line",
    color: "#0C1A3E",
    permissions: ["currencies.view"],
  },
  {
    id: "invoice-rules",
    path: "/content/invoice-rules",
    label: "قواعد الفواتير",
    description: "شروط وقواعد العرض (واجهة تجريبية)",
    icon: "ri-file-list-3-line",
    color: "#6366F1",
    permissions: [],
  },
  {
    id: "subscription",
    path: "/content/subscription",
    label: "الاشتراك والباقة",
    description: "معاينة الباقة (واجهة تجريبية)",
    icon: "ri-vip-crown-2-line",
    color: "#8B5CF6",
    permissions: [],
  },
];

function tabVisible(tab: TabDef, perms: string[] | undefined): boolean {
  if (!tab.permissions.length) return true;
  if (!perms?.length) return false;
  return tab.permissions.some((p) => perms.includes(p));
}

function ContentManagementPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: perms, isSuccess } = useMyPermissions();

  const visibleTabs = useMemo(() => {
    if (!isSuccess || !perms) return TAB_DEFS;
    return TAB_DEFS.filter((t) => tabVisible(t, perms));
  }, [isSuccess, perms]);

  const sortedByPathLen = [...TAB_DEFS].sort(
    (a, b) => b.path.length - a.path.length
  );
  const current =
    sortedByPathLen.find((t) => location.pathname.startsWith(t.path)) ??
    visibleTabs[0] ??
    TAB_DEFS[0];

  return (
    <div className="min-h-screen" style={{ background: "#F8FAFC" }} dir="rtl">
      <div
        className="px-6 py-5"
        style={{ background: "#FFFFFF", borderBottom: "1px solid #EEF2F8" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #0C1A3E, #1E3A7B)",
            }}
          >
            <i className="ri-settings-3-line text-white text-base" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-800">الإعدادات</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              البروفايل، الفروع، التصنيفات، العملات، ومعاينة قواعد الفواتير والاشتراك
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-0 min-h-[calc(100vh-73px)]">
        <aside
          className="w-64 flex-shrink-0 py-5 px-4 space-y-1.5 hidden md:block"
          style={{
            background: "#FFFFFF",
            borderLeft: "1px solid #EEF2F8",
            minHeight: "calc(100vh - 73px)",
          }}
        >
          <p className="text-[10px] font-black text-slate-400 px-2 mb-3 tracking-widest uppercase">
            أقسام الإعدادات
          </p>
          {visibleTabs.length === 0 ? (
            <p className="text-xs text-slate-400 px-2">
              لا توجد أقسام متاحة لصلاحياتك.
            </p>
          ) : (
            visibleTabs.map((tab) => {
              const isActive = location.pathname.startsWith(tab.path);
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => navigate(tab.path)}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-150 text-right relative"
                  style={
                    isActive
                      ? {
                          background: `${tab.color}10`,
                          border: `1.5px solid ${tab.color}30`,
                        }
                      : {
                          background: "transparent",
                          border: "1.5px solid transparent",
                        }
                  }
                  onMouseEnter={(e) => {
                    if (!isActive)
                      (e.currentTarget as HTMLElement).style.background =
                        "#F8FAFC";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive)
                      (e.currentTarget as HTMLElement).style.background =
                        "transparent";
                  }}
                >
                  {isActive ? (
                    <span
                      className="absolute right-0 top-2 bottom-2 w-0.5 rounded-full"
                      style={{ background: tab.color }}
                    />
                  ) : null}
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: isActive ? `${tab.color}18` : "#F1F5F9",
                    }}
                  >
                    <i
                      className={`${tab.icon} text-sm`}
                      style={{ color: isActive ? tab.color : "#94A3B8" }}
                    />
                  </div>
                  <div className="flex-1 min-w-0 text-right">
                    <p
                      className="text-sm font-bold truncate"
                      style={{ color: isActive ? "#1E293B" : "#475569" }}
                    >
                      {tab.label}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {tab.description}
                    </p>
                  </div>
                </button>
              );
            })
          )}

          <div className="pt-4 mt-4 border-t border-slate-100 space-y-2 px-2">
            <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase mb-2">
              معلومات النظام
            </p>
            {[
              {
                label: "الإصدار",
                value: "v2.4.0",
                icon: "ri-code-s-slash-line",
              },
            ].map((info) => (
              <div
                key={info.label}
                className="flex items-center justify-between gap-2"
              >
                <span className="text-xs text-slate-400 flex items-center gap-1.5 min-w-0">
                  <i className={`${info.icon} text-[11px] shrink-0`} />
                  <span className="truncate">{info.label}</span>
                </span>
                <span
                  className="text-xs font-bold text-slate-600 truncate max-w-[45%] text-left"
                  dir="ltr"
                >
                  {info.value}
                </span>
              </div>
            ))}
          </div>
        </aside>

        <main className="flex-1 p-4 md:p-6 overflow-y-auto min-w-0">
          <div className="flex md:hidden gap-2 overflow-x-auto pb-3 mb-4 -mx-1 px-1">
            {visibleTabs.map((tab) => {
              const isActive = location.pathname.startsWith(tab.path);
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => navigate(tab.path)}
                  className="shrink-0 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap"
                  style={
                    isActive
                      ? {
                          background: `${tab.color}18`,
                          color: tab.color,
                          border: `1px solid ${tab.color}40`,
                        }
                      : {
                          background: "#fff",
                          color: "#64748B",
                          border: "1px solid #EEF2F8",
                        }
                  }
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 mb-5 text-xs text-slate-400">
            <i className="ri-settings-3-line" />
            <span>الإعدادات</span>
            <i className="ri-arrow-left-s-line" />
            <span className="font-bold" style={{ color: current.color }}>
              {current.label}
            </span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: `${current.color}15` }}
            >
              <i
                className={`${current.icon} text-lg`}
                style={{ color: current.color }}
              />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800">
                {current.label}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {current.description}
              </p>
            </div>
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default ContentManagementPage;
