import { useLocation } from "react-router-dom";
import { Menu, ChevronLeft, Calendar } from "lucide-react";
import { getRouteInfo } from "./routeTitles";

interface ProjectTopBarProps {
  sidebarWidth: number;
  onMobileMenuToggle?: () => void;
}

export default function ProjectTopBar({ sidebarWidth, onMobileMenuToggle }: ProjectTopBarProps) {
  const location = useLocation();
  const route = getRouteInfo(location.pathname);

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
      {/* Right: Mobile menu + Breadcrumb */}
      <div className="flex items-center gap-2.5 min-w-0 flex-shrink-0">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer flex-shrink-0 transition-colors"
          style={{ background: "#F4F7FB", color: "#4A5568", border: "1px solid var(--color-border)" }}
        >
          <Menu className="w-4 h-4" />
        </button>

        <div
          className="hidden sm:flex w-8 h-8 rounded-lg items-center justify-center flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, #0284C7, #0EA5E9)",
            boxShadow: "0 2px 8px rgba(14,165,233,0.35)",
          }}
        >
          <span className="text-white text-[13px] font-bold">
            {route.title.charAt(0)}
          </span>
        </div>

        <div className="min-w-0 flex-shrink">
          {route.parent ? (
            <p
              className="hidden sm:flex items-center text-[11px] leading-none mb-0.5 gap-1"
              style={{ color: "var(--color-text-muted)" }}
            >
              <span>{route.parent}</span>
              <ChevronLeft className="w-3 h-3 text-slate-300" />
              <span style={{ color: "var(--color-text-secondary)" }}>{route.title}</span>
            </p>
          ) : (
            <p className="hidden sm:block text-[11px] leading-none mb-0.5" style={{ color: "var(--color-text-muted)" }}>
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

      {/* Left: Date display */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <div
          className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap"
          style={{ background: "#F4F7FB", color: "#64748B", border: "1px solid var(--color-border)" }}
        >
          <Calendar className="w-3.5 h-3.5" style={{ color: "var(--color-accent)" }} />
          {new Date().toLocaleDateString("ar-EG", { weekday: "short", month: "short", day: "numeric" })}
        </div>
      </div>
    </header>
  );
}
