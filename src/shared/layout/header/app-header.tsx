import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { useSession, sessionStore } from "@/shared/lib/auth/session.store";

export function AppHeader() {
  const navigate = useNavigate();
  const workspace = useSession((state) => state.workspace);
  const user = useSession((state) => state.user as { name?: string } | null);

  return (
    <header className="app-header">
      <div>
        <h1>Front Foundation</h1>
        <p>{workspace ? `Workspace: ${workspace}` : "No workspace selected"}</p>
      </div>

      <div className="header-actions">
        <span className="header-user">{user?.name ?? "Guest"}</span>
        <Button
          variant="secondary"
          onClick={() => {
            sessionStore.clearSession();
            navigate("/login", { replace: true });
          }}
        >
          Logout
        </Button>
      </div>
    </header>
  );
}
