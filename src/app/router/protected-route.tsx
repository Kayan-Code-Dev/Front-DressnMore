import type { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSession } from "@/shared/lib/auth/session.store";

const SUBSCRIPTION_ALLOWED_PATHS = ["/settings/subscription", "/login"];

export function ProtectedRoute({ children }: PropsWithChildren) {
  const isAuthenticated = useSession((state) => state.token !== null);
  const subscription = useSession((state) => state.subscription);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (
    subscription?.lifecycle_status === "expired" &&
    !SUBSCRIPTION_ALLOWED_PATHS.some((path) => location.pathname.startsWith(path))
  ) {
    return <Navigate to="/settings/subscription" replace />;
  }

  return <>{children}</>;
}
