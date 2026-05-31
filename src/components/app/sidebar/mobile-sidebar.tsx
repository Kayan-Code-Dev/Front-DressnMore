import { NavLink } from "react-router-dom";
import { sidebarLabels } from "./constants";
import useSidebarLabel, { useSidebarPermissions } from "./useSidebarLabel";
import { cn } from "@/lib/utils";

export function MobileSidebar() {
  const permissions = useSidebarPermissions();
  const filteredLabels = useSidebarLabel(sidebarLabels, permissions);

  return (
    <nav className="flex flex-col gap-1 p-4 pt-6">
      {filteredLabels.map((item, i) => (
        <div key={`mobile-${i}-${item.label}`}>
          <NavLink
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-slate-600 hover:bg-slate-50"
              )
            }
          >
            {item.iconComponent && (
              <span className="flex h-6 w-6 items-center justify-center [&_svg]:w-4 [&_svg]:h-4">
                {item.iconComponent}
              </span>
            )}
            <span>{item.label}</span>
          </NavLink>
          {item.subItems?.map((sub, j) => (
            <NavLink
              key={`mobile-${i}-sub-${j}-${sub.label}`}
              to={sub.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2.5 px-3 py-1.5 pr-8 rounded-lg text-xs transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-slate-500 hover:bg-slate-50"
                )
              }
            >
              {sub.iconComponent && (
                <span className="flex h-5 w-5 items-center justify-center [&_svg]:w-3.5 [&_svg]:h-3.5">
                  {sub.iconComponent}
                </span>
              )}
              <span>{sub.label}</span>
            </NavLink>
          ))}
        </div>
      ))}
    </nav>
  );
}
