import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isModuleLive, type ModuleName } from "@/config/feature-flags";
import { resolveModuleForPath } from "@/config/plan-modules";

const ALWAYS_ALLOWED_PREFIXES = ["/settings", "/how-it-works", "/content"];

export function PlanGatedOutlet() {
  const location = useLocation();
  const path = location.pathname;

  if (ALWAYS_ALLOWED_PREFIXES.some((prefix) => path.startsWith(prefix))) {
    return <Outlet />;
  }

  const module = resolveModuleForPath(path);

  if (module && !isModuleLive(module as ModuleName)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
