import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { FormField } from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { mockTenantLogin } from "@/features/auth/services/auth.mock.service";
import { sessionStore } from "@/shared/lib/auth/session.store";

export function LoginPage() {
  const navigate = useNavigate();
  const [workspace, setWorkspace] = useState("main-workspace");
  const [email, setEmail] = useState("demo@dressnmore.local");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await mockTenantLogin({ workspace, email, password });
      sessionStore.setSession({
        token: response.data.token,
        workspace: response.data.workspace,
        tenant: response.data.tenant,
        user: response.data.user,
        permissions: response.data.permissions,
        plan: response.data.plan,
      });
      navigate("/dashboard", { replace: true });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={onSubmit}>
        <h1>DressnMore Login</h1>
        <p>Foundation phase uses mock authentication only.</p>

        <FormField htmlFor="workspace" label="Workspace">
          <Input
            id="workspace"
            value={workspace}
            onChange={(event) => setWorkspace(event.target.value)}
            required
          />
        </FormField>

        <FormField htmlFor="email" label="Email">
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </FormField>

        <FormField htmlFor="password" label="Password">
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </FormField>

        {error ? <p className="form-error">{error}</p> : null}

        <Button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
