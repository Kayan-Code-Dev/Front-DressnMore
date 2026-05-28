import { useEffect, useState } from "react";
import { isModuleLive } from "@/config/feature-flags";
import { fetchMe } from "@/features/auth/services/auth.api.service";
import { sessionStore } from "@/shared/lib/auth/session.store";
import { mockLoginData } from "@/features/auth/mocks/auth.mock.data";
import { isApiError } from "@/shared/types/api";

/**
 * Preview / Mock Mode:
 * When featureFlags.useMockServices is true and the auth module is not live,
 * we skip the real fetchMe() call and seed the session with demo data so that
 * protected routes and sidebar permissions work for visual testing.
 */

export function useSessionRestore(): { restoring: boolean } {
  const [restoring, setRestoring] = useState(() => {
    return isModuleLive("auth") && sessionStore.isAuthenticated();
  });

  useEffect(() => {
    if (!sessionStore.isAuthenticated()) {
      return;
    }

    // --- Preview / Mock Mode ---
    // Skip real API verification; keep existing session intact.
    if (!isModuleLive("auth")) {
      const session = sessionStore.getState();
      const hasPermissions = session.permissions && session.permissions.length > 0;
      if (!hasPermissions) {
        sessionStore.setSession({
          token: session.token ?? mockLoginData.token,
          workspace: session.workspace ?? mockLoginData.workspace,
          tenant: session.tenant ?? mockLoginData.tenant,
          user: session.user ?? mockLoginData.user,
          permissions: mockLoginData.permissions,
          plan: session.plan ?? mockLoginData.plan,
        });
      }
      return;
    }

    // --- Real API Mode ---
    let cancelled = false;

    fetchMe().then((response) => {
      if (cancelled) return;

      if (isApiError(response)) {
        sessionStore.clearSession();
      } else {
        const session = sessionStore.getState();
        sessionStore.setSession({
          token: session.token,
          workspace: response.data.tenant.slug,
          tenant: response.data.tenant,
          user: response.data.user,
          permissions: response.data.permissions,
          plan: response.data.plan,
        });
      }

      setRestoring(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return { restoring };
}
