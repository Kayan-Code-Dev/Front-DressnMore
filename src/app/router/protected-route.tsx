import type { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSession } from "@/shared/lib/auth/session.store";

export function ProtectedRoute({ children }: PropsWithChildren) {
  const isAuthenticated = useSession((state) => state.token !== null);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
