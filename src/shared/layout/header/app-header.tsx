import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { useSession, sessionStore } from "@/shared/lib/auth/session.store";
import { isModuleLive } from "@/config/feature-flags";
import { tenantLogout } from "@/features/auth/services/auth.api.service";

export function AppHeader() {
  const navigate = useNavigate();
  const tenant = useSession((state) => state.tenant as { name?: string } | null);
  const user = useSession((state) => state.user as { name?: string } | null);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      if (isModuleLive("auth")) {
        await tenantLogout();
      }
    } finally {
      sessionStore.clearSession();
      navigate("/login", { replace: true });
    }
  };

  return (
    <header className="app-header">
      <div>
        <h1>Front Foundation</h1>
        <p>{tenant?.name ? `Tenant: ${tenant.name}` : "No tenant selected"}</p>
      </div>

      <div className="header-actions">
        <span className="header-user">{user?.name ?? "Guest"}</span>
        <Button variant="secondary" onClick={handleLogout} disabled={loggingOut}>
          {loggingOut ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </header>
  );
}
