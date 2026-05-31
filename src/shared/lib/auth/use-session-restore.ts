import { useEffect, useState } from "react";
import { isModuleLive } from "@/config/feature-flags";
import { fetchMe } from "@/features/auth/services/auth.api.service";
import { sessionStore } from "@/shared/lib/auth/session.store";
import { isApiError } from "@/shared/types/api";

export function useSessionRestore(): { restoring: boolean } {
  const [restoring, setRestoring] = useState(() => {
    return isModuleLive("auth") && sessionStore.isAuthenticated();
  });

  useEffect(() => {
    if (!isModuleLive("auth") || !sessionStore.isAuthenticated()) {
      return;
    }

    let cancelled = false;

    fetchMe().then((response) => {
      if (cancelled) return;

      if (isApiError(response)) {
        sessionStore.clearSession();
      } else {
        const session = sessionStore.getState();
        sessionStore.setSession({
          token: session.token,
          tenant: response.data.tenant,
          user: response.data.user,
          permissions: response.data.permissions,
          subscription: response.data.subscription ?? session.subscription,
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
