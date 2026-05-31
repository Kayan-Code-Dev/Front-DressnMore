import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  ChevronLeft,
  Calendar,
  Search,
  Bell,
  Plus,
  Undo2,
  FileText,
  Key,
  Scissors,
  UserPlus,
  Coins,
} from "lucide-react";
import { getRouteInfo } from "./routeTitles";

interface ProjectTopBarProps {
  sidebarWidth: number;
  onMobileMenuToggle?: () => void;
}

const quickAddItems = [
  { label: "فاتورة بيع", to: "/sales/create", icon: FileText, color: "#3B82F6" },
  { label: "فاتورة إيجار", to: "/orders/choose-client", icon: Key, color: "#F59E0B" },
  { label: "أمر تفصيل", to: "/tailoring/orders", icon: Scissors, color: "#8B5CF6" },
  { label: "عميل جديد", to: "/customers", icon: UserPlus, color: "#10B981" },
  { label: "قيد مالي", to: "/cash-movements", icon: Coins, color: "#F97316" },
];

export default function ProjectTopBar({ sidebarWidth, onMobileMenuToggle }: ProjectTopBarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const route = getRouteInfo(location.pathname);
  const [addOpen, setAddOpen] = useState(false);
  const [quickSearch, setQuickSearch] = useState("");

  const handleQuickSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const q = quickSearch.trim();
    if (!q) return;
    navigate(`/customers?search=${encodeURIComponent(q)}`);
  };

  return (
    <header
      className="fixed top-0 left-0 z-30 flex items-center justify-between no-print transition-all duration-300"
      style={{
        height: "var(--topbar-height)",
        right: `${sidebarWidth}px`,
        background: "rgba(255,255,255,0.98)",
        borderBottom: "1px solid var(--color-border)",
        backdropFilter: "blur(10px)",
        paddingLeft: "16px",
        paddingRight: "16px",
        gap: "12px",
      }}
    >
      {/* Right: Mobile menu + Breadcrumb + back */}
      <div className="flex items-center gap-2.5 min-w-0 flex-shrink-0">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer flex-shrink-0 transition-colors"
          style={{ background: "#F4F7FB", color: "#4A5568", border: "1px solid var(--color-border)" }}
        >
          <Menu className="w-4 h-4" />
        </button>

        {route.parentPath && (
          <button
            type="button"
            onClick={() => navigate(route.parentPath!)}
            className="hidden sm:flex w-8 h-8 rounded-lg items-center justify-center flex-shrink-0 transition-opacity hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #0284C7, #0EA5E9)",
              boxShadow: "0 2px 8px rgba(14,165,233,0.35)",
            }}
            title="رجوع"
          >
            <Undo2 className="w-4 h-4 text-white" />
          </button>
        )}

        <div
          className="hidden sm:flex w-8 h-8 rounded-lg items-center justify-center flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, #0284C7, #0EA5E9)",
            boxShadow: "0 2px 8px rgba(14,165,233,0.35)",
          }}
        >
          <span className="text-white text-[13px] font-bold">{route.title.charAt(0)}</span>
        </div>

        <div className="min-w-0 flex-shrink">
          {route.parent ? (
            <p className="hidden md:flex items-center text-[11px] leading-none mb-0.5 gap-1" style={{ color: "var(--color-text-muted)" }}>
              <span>{route.parent}</span>
              <ChevronLeft className="w-3 h-3 text-slate-300" />
              <span style={{ color: "var(--color-text-secondary)" }}>{route.title}</span>
            </p>
          ) : (
            <p className="hidden md:block text-[11px] leading-none mb-0.5" style={{ color: "var(--color-text-muted)" }}>
              الرئيسية
              <ChevronLeft className="w-3 h-3 text-slate-300 inline mx-0.5" />
              {route.title}
            </p>
          )}
          <h2 className="font-black text-[15px] leading-tight truncate" style={{ color: "var(--color-text-primary)" }}>
            {route.title}
          </h2>
        </div>
      </div>

      {/* Center: Quick search */}
      <form onSubmit={handleQuickSearch} className="hidden lg:flex flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            value={quickSearch}
            onChange={(e) => setQuickSearch(e.target.value)}
            placeholder="بحث سريع..."
            className="w-full h-9 rounded-xl pr-9 pl-3 text-sm border outline-none focus:ring-2 focus:ring-sky-200"
            style={{ background: "#F4F7FB", borderColor: "var(--color-border)" }}
          />
        </div>
      </form>

      {/* Left: Date + notifications + add */}
      <div className="flex items-center gap-2 flex-shrink-0 relative">
        <div
          className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap"
          style={{ background: "#F4F7FB", color: "#64748B", border: "1px solid var(--color-border)" }}
        >
          <Calendar className="w-3.5 h-3.5" style={{ color: "var(--color-accent)" }} />
          {new Date().toLocaleDateString("ar-EG", { weekday: "long", month: "long", day: "numeric" })}
        </div>

        <button
          type="button"
          className="relative w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: "#F4F7FB", border: "1px solid var(--color-border)" }}
          title="الإشعارات"
        >
          <Bell className="w-4 h-4 text-slate-600" />
          <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            3
          </span>
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setAddOpen((v) => !v)}
            className="flex items-center gap-1.5 h-9 px-3 rounded-lg text-white text-sm font-bold transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #2563EB, #3B82F6)" }}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">إضافة</span>
          </button>

          {addOpen && (
            <>
              <button type="button" className="fixed inset-0 z-40" onClick={() => setAddOpen(false)} aria-label="إغلاق" />
              <div
                className="absolute left-0 top-full mt-2 z-50 w-56 rounded-xl border bg-white shadow-lg py-2"
                style={{ borderColor: "var(--color-border)" }}
              >
                <p className="px-3 py-1.5 text-[11px] font-bold text-cyan-600">إضافة سريعة</p>
                {quickAddItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setAddOpen(false)}
                      className="flex items-center justify-between px-3 py-2.5 hover:bg-muted/50 transition-colors"
                    >
                      <span className="text-sm font-medium">{item.label}</span>
                      <span
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: `${item.color}18`, color: item.color }}
                      >
                        <Icon className="w-4 h-4" />
                      </span>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
