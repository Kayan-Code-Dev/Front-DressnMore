import type { PropsWithChildren } from "react";
import { useSessionRestore } from "@/shared/lib/auth/use-session-restore";

export function AppProviders({ children }: PropsWithChildren) {
  const { restoring } = useSessionRestore();

  if (restoring) {
    return <div className="app-loading">Loading...</div>;
  }

  return <>{children}</>;
}
