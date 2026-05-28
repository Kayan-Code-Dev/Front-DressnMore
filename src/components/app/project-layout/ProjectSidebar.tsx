import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { LogOut, ChevronDown, PanelRightClose, PanelRightOpen } from "lucide-react";
import { sidebarLabels } from "@/components/app/sidebar/constants";
import useSidebarLabel, { useSidebarPermissions } from "@/components/app/sidebar/useSidebarLabel";
import { sessionStore, useSession } from "@/shared/lib/auth/session.store";
import type { SidebarLabel } from "@/components/app/sidebar/constants";

function navEntryIsActive(
  config: Pick<SidebarLabel, "path">,
  loc: { pathname: string }
): boolean {
  if (config.path === "/dashboard") return loc.pathname === "/dashboard";
  return loc.pathname === config.path || loc.pathname.startsWith(config.path + "/");
}

interface ProjectSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

function flattenSubItems(item: SidebarLabel): SidebarLabel[] {
  if (!item.subItems?.length) return [];
  return item.subItems.flatMap((sub) => {
    if (sub.subItems?.length) return sub.subItems;
    return [sub];
  });
}

export default function ProjectSidebar({
  collapsed,
  onToggle,
  mobileOpen = false,
  onMobileClose,
}: ProjectSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const permissions = useSidebarPermissions();
  const navItems = useSidebarLabel(sidebarLabels, permissions);
  const [openGroups, setOpenGroups] = useState<string[]>([]);
  const user = useSession((s) => s.user) as { name?: string } | null;
  const displayName = user?.name ?? "المستخدم";
  const userInitials = (displayName || "م")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .substring(0, 2);

  useEffect(() => {
    navItems.forEach((item) => {
      const flat = flattenSubItems(item);
      if (flat.some((sub) => navEntryIsActive(sub, location))) {
        setOpenGroups((prev) => (prev.includes(item.label) ? prev : [...prev, item.label]));
      }
    });
  }, [location, navItems]);

  const toggleGroup = (label: string) => {
    if (collapsed) return;
    setOpenGroups((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const isGroupActive = (item: SidebarLabel) => {
    const flat = flattenSubItems(item);
    return flat.some((sub) => navEntryIsActive(sub, location));
  };

  const renderedSections = new Set<string>();
  const sidebarBg = "linear-gradient(160deg, #0369A1 0%, #0284C7 35%, #0EA5E9 100%)";
  const activeItemStyle = {
    color: "#ffffff",
    background: "rgba(255,255,255,0.22)",
    fontWeight: "700" as const,
  };
  const inactiveItemStyle = {
    color: "rgba(255,255,255,0.72)",
    background: "transparent",
    fontWeight: "500" as const,
  };
  const hoverStyle = { background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.95)" };

  const sidebarContent = (
    <aside
      className="fixed top-0 right-0 bottom-0 z-40 flex flex-col no-print transition-all duration-300"
      style={{
        width: collapsed ? 70 : 260,
        background: sidebarBg,
        borderLeft: "1px solid rgba(255,255,255,0.05)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2.5 px-3 flex-shrink-0"
        style={{
          height: "var(--topbar-height)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {!collapsed && (
          <div
            className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #B8862A 0%, #E8BF7A 50%, #B8862A 100%)",
              boxShadow: "0 2px 10px rgba(194,150,74,0.45)",
            }}
          >
            <span className="text-white text-sm font-bold">D</span>
          </div>
        )}

        {!collapsed && (
          <div className="flex-1 min-w-0 fade-in overflow-hidden">
            <p className="text-white font-black text-[13px] leading-tight truncate">DressnMore</p>
            <p
              className="text-[10px] truncate mt-0.5 font-semibold"
              style={{ color: "#C2964A", letterSpacing: "0.04em" }}
            >
              نظام إدارة الأتيليه
            </p>
          </div>
        )}

        <button
          onClick={onToggle}
          className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-150"
          style={{
            color: "rgba(255,255,255,0.50)",
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.09)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.14)";
            e.currentTarget.style.color = "rgba(255,255,255,0.90)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.07)";
            e.currentTarget.style.color = "rgba(255,255,255,0.50)";
          }}
        >
          {collapsed ? (
            <PanelRightOpen className="w-4 h-4" />
          ) : (
            <PanelRightClose className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 overflow-y-auto overflow-x-hidden py-2 px-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>{`nav::-webkit-scrollbar { display: none; }`}</style>
        <ul className="space-y-px">
          {navItems.map((item) => {
            const flatSubs = flattenSubItems(item);
            const hasSubItems = flatSubs.length > 0;
            const groupActive = isGroupActive(item);
            const isOpen = openGroups.includes(item.label) || groupActive;
            const showSection = item.section && !renderedSections.has(item.section);
            if (item.section) renderedSections.add(item.section);

            return (
              <li key={item.label || item.path}>
                {showSection && !collapsed && (
                  <div className="sidebar-section-label">{item.section}</div>
                )}
                {showSection && collapsed && (
                  <div className="my-2 mx-auto w-7 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
                )}

                {hasSubItems ? (
                  <>
                    <div className="relative sidebar-nav-item">
                      <button
                        onClick={() => toggleGroup(item.label)}
                        className="flex items-center gap-2.5 w-full px-2.5 py-2.5 rounded-xl cursor-pointer transition-all duration-150 text-right relative"
                        style={groupActive ? activeItemStyle : inactiveItemStyle}
                        onMouseEnter={(e) => {
                          if (!groupActive) Object.assign(e.currentTarget.style, hoverStyle);
                        }}
                        onMouseLeave={(e) => {
                          if (!groupActive) Object.assign(e.currentTarget.style, inactiveItemStyle);
                        }}
                      >
                        {groupActive && <span className="sidebar-active-bar" />}
                        <span className="w-[20px] h-[20px] flex items-center justify-center flex-shrink-0">
                          <span className="[&>svg]:w-4 [&>svg]:h-4">{item.iconComponent}</span>
                        </span>
                        {!collapsed && (
                          <>
                            <span className="text-[12.5px] flex-1 text-right leading-tight font-semibold">
                              {item.label}
                            </span>
                            <ChevronDown
                              className="w-3 h-3 flex-shrink-0 transition-transform duration-200"
                              style={{
                                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                                color: "rgba(255,255,255,0.22)",
                              }}
                            />
                          </>
                        )}
                      </button>
                        {collapsed && <span className="sidebar-tooltip">{item.label}</span>}
                    </div>

                    {!collapsed && isOpen && (
                      <ul
                        className="mt-0.5 mb-1 mr-[30px] space-y-px fade-in"
                        style={{ borderRight: "1.5px solid rgba(255,255,255,0.07)", paddingRight: "10px" }}
                      >
                        {flatSubs.map((sub) => {
                          const subActive = navEntryIsActive(sub, location);
                          return (
                            <li key={sub.path}>
                              <NavLink
                                to={sub.path}
                                className="flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer transition-all duration-150 whitespace-nowrap"
                                style={{
                                  color: subActive ? "#ffffff" : "rgba(255,255,255,0.55)",
                                  background: subActive ? "rgba(255,255,255,0.18)" : "transparent",
                                  fontWeight: subActive ? "700" : "500",
                                }}
                                onMouseEnter={(e) => {
                                  if (!subActive) {
                                    e.currentTarget.style.background = "rgba(255,255,255,0.10)";
                                    e.currentTarget.style.color = "rgba(255,255,255,0.90)";
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (!subActive) {
                                    e.currentTarget.style.background = "transparent";
                                    e.currentTarget.style.color = "rgba(255,255,255,0.55)";
                                  }
                                }}
                              >
                                <span className="text-[12px]">{sub.label}</span>
                              </NavLink>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </>
                ) : (
                  <div className="relative sidebar-nav-item">
                    {item.path ? (
                      <NavLink
                        to={item.path}
                        className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl cursor-pointer transition-all duration-150 whitespace-nowrap relative"
                        style={navEntryIsActive(item, location) ? activeItemStyle : inactiveItemStyle}
                        onMouseEnter={(e) => {
                          if (!navEntryIsActive(item, location)) Object.assign(e.currentTarget.style, hoverStyle);
                        }}
                        onMouseLeave={(e) => {
                          if (!navEntryIsActive(item, location)) Object.assign(e.currentTarget.style, inactiveItemStyle);
                        }}
                      >
                        {navEntryIsActive(item, location) && <span className="sidebar-active-bar" />}
                        <span className="w-[20px] h-[20px] flex items-center justify-center flex-shrink-0">
                          <span className="[&>svg]:w-4 [&>svg]:h-4">{item.iconComponent}</span>
                        </span>
                        {!collapsed && (
                          <span className="text-[12.5px] font-semibold">{item.label}</span>
                        )}
                      </NavLink>
                    ) : null}
                    {collapsed && <span className="sidebar-tooltip">{item.label}</span>}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User footer */}
      <div
        className="flex-shrink-0 px-2.5 py-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-all duration-150 cursor-pointer"
          onClick={() => {
            sessionStore.clearSession();
            navigate("/login");
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.06)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          <div
            className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center font-black text-sm"
            style={{
              background: "linear-gradient(135deg, #B8862A, #E8BF7A)",
              color: "white",
              boxShadow: "0 1px 5px rgba(194,150,74,0.40)",
            }}
          >
            {userInitials}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0 fade-in">
              <p className="text-white text-[12px] font-bold truncate">{displayName}</p>
              <p className="text-[11px] truncate mt-0.5 flex items-center gap-1" style={{ color: "rgba(255,255,255,0.35)" }}>
                <LogOut className="w-3 h-3" />
                تسجيل الخروج
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {mobileOpen && (
        <div
          className="sidebar-backdrop lg:hidden"
          onClick={onMobileClose}
        />
      )}
      {mobileOpen && (
        <aside
          className="fixed top-0 right-0 bottom-0 z-50 flex flex-col lg:hidden slide-down"
          style={{
            width: 260,
            background: sidebarBg,
            borderLeft: "1px solid rgba(255,255,255,0.05)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
          }}
        >
          {sidebarContent.props.children}
        </aside>
      )}
      <div className="hidden lg:block">
        {sidebarContent}
      </div>
    </>
  );
}
