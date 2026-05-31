import { NavLink } from "react-router-dom";
import { navConfig } from "@/shared/layout/sidebar/nav-config";
import { sessionStore } from "@/shared/lib/auth/session.store";
import { env } from "@/shared/lib/env/env";

export function AppSidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">{env.appName}</div>
      <nav className="sidebar-nav">
        {navConfig.map((item) => {
          if (!item.enabled) {
            return (
              <div className="sidebar-link sidebar-link-disabled" key={item.key}>
                <span>{item.label}</span>
                <small>{item.note ?? "Disabled"}</small>
              </div>
            );
          }

          if (item.permission && !sessionStore.hasPermission(item.permission)) {
            return null;
          }

          return (
            <NavLink
              className={({ isActive }) =>
                isActive ? "sidebar-link sidebar-link-active" : "sidebar-link"
              }
              key={item.key}
              to={item.to}
            >
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
