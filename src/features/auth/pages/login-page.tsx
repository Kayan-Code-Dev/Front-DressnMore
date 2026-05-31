import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { FormField } from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { isModuleLive } from "@/config/feature-flags";
import { mockTenantLogin } from "@/features/auth/services/auth.mock.service";
import { tenantLogin } from "@/features/auth/services/auth.api.service";
import { sessionStore } from "@/shared/lib/auth/session.store";
import { readTenantSlug } from "@/shared/lib/auth/tenant-slug";
import { isApiError, getFieldError, getValidationErrors } from "@/shared/types/api";
import type { ValidationErrors } from "@/shared/types/api";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors>({});

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setFieldErrors({});
    setLoading(true);

    try {
      const payload = { email, password };
      const response = isModuleLive("auth")
        ? await tenantLogin(payload)
        : await mockTenantLogin(payload);

      if (isApiError(response)) {
        const errors = getValidationErrors(response);
        if (Object.keys(errors).length > 0) {
          setFieldErrors(errors);
        }
        setError(response.message);
        return;
      }

      const tenantSlug = readTenantSlug(response.data.tenant, null);

      sessionStore.setSession({
        token: response.data.token,
        workspace: tenantSlug,
        tenant: response.data.tenant,
        user: response.data.user,
        permissions: response.data.permissions,
        subscription: response.data.subscription,
      });

      const destination =
        response.data.subscription?.lifecycle_status === "expired"
          ? "/settings/subscription"
          : "/dashboard";

      navigate(destination, { replace: true });
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

        <FormField htmlFor="email" label="Email" error={getFieldError(fieldErrors, "email")}>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </FormField>

        <FormField htmlFor="password" label="Password" error={getFieldError(fieldErrors, "password")}>
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
