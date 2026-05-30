import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn, Loader2 } from "lucide-react";
import { isModuleLive } from "@/config/feature-flags";
import { mockTenantLogin } from "@/features/auth/services/auth.mock.service";
import { tenantLogin } from "@/features/auth/services/auth.api.service";
import { sessionStore } from "@/shared/lib/auth/session.store";
import { isApiError, getFieldError, getValidationErrors } from "@/shared/types/api";
import type { ValidationErrors } from "@/shared/types/api";
import dressnmoreLogo from "@/assets/dressnmore-logo.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

export function LoginPage() {
  const navigate = useNavigate();
  const [workspace, setWorkspace] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors>({});
  const [loginError, setLoginError] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setFieldErrors({});
    setLoading(true);

    try {
      const payload = { workspace, email, password };
      const response = isModuleLive("auth")
        ? await tenantLogin(payload)
        : await mockTenantLogin(payload);

      if (isApiError(response)) {
        const errors = getValidationErrors(response);
        if (Object.keys(errors).length > 0) {
          setFieldErrors(errors);
        }
        setLoginErrorMessage(response.message);
        setLoginError(true);
        return;
      }

      sessionStore.setSession({
        token: response.data.token,
        workspace: response.data.tenant.slug,
        tenant: response.data.tenant,
        user: response.data.user,
        permissions: response.data.permissions,
        plan: response.data.plan,
      });
      navigate("/dashboard", { replace: true });
    } catch (submitError) {
      const msg = submitError instanceof Error ? submitError.message : "Login failed";
      setLoginErrorMessage(msg);
      setLoginError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-blue-950 to-slate-900 relative overflow-hidden flex items-center justify-center px-4 py-12"
      dir="rtl"
    >
      <style>{`
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes blob { 0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%} 50%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%} }
        .blob { animation: blob 8s ease-in-out infinite; }
        .glass-card { background: rgba(255,255,255,0.95); backdrop-filter: blur(24px); border: 1px solid rgba(255,255,255,0.2); }
      `}</style>

      {/* Background effects */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, rgba(59,130,246,0.5) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(14,165,233,0.3) 0%, transparent 50%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.05) 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 blob"
        style={{ filter: "blur(60px)" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-400/10 blob"
        style={{ filter: "blur(50px)", animationDelay: "3s" }}
      />

      <div className="relative z-10 w-full max-w-md">
        <div className="glass-card rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-l from-blue-900 to-blue-600 px-8 py-8 text-center">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl overflow-hidden bg-white shadow-md">
                <img src={dressnmoreLogo} alt="DressnMore" className="h-full w-full object-cover" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">DressnMore</span>
            </div>
            <h1 className="text-xl font-bold text-white mb-2">تسجيل الدخول</h1>
            <p className="text-white/80 text-sm">أدخل بياناتك للوصول إلى لوحة التحكم</p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={onSubmit} className="space-y-5" dir="rtl">
              {/* Workspace */}
              <div className="space-y-2">
                <label htmlFor="workspace" className="text-right text-sm font-medium text-gray-700 block">
                  مساحة العمل
                </label>
                <div className="relative">
                  <Input
                    id="workspace"
                    placeholder="workspace-slug"
                    className="pr-4 pl-11 text-right h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                    value={workspace}
                    onChange={(e) => setWorkspace(e.target.value)}
                    required
                    dir="ltr"
                  />
                </div>
                {getFieldError(fieldErrors, "workspace") && (
                  <p className="text-right text-xs text-red-500">{getFieldError(fieldErrors, "workspace")}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-right text-sm font-medium text-gray-700 block">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@dressnmore.com"
                    className="pr-4 pl-11 text-right h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {getFieldError(fieldErrors, "email") && (
                  <p className="text-right text-xs text-red-500">{getFieldError(fieldErrors, "email")}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-right text-sm font-medium text-gray-700 block">
                  كلمة المرور
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pr-4 pl-11 h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={showPassword ? "إخفاء كلمة السر" : "إظهار كلمة السر"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {getFieldError(fieldErrors, "password") && (
                  <p className="text-right text-xs text-red-500">{getFieldError(fieldErrors, "password")}</p>
                )}
              </div>

              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="text-gray-500">جلسات آمنة ومشفرة</span>
              </div>

              {error ? <p className="text-sm text-red-500 text-center">{error}</p> : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-gradient-to-l from-blue-900 to-blue-500 text-white font-bold text-base hover:shadow-lg hover:shadow-blue-500/40 hover:scale-[1.02] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    جاري التحقق...
                  </>
                ) : (
                  <>
                    <LogIn className="h-5 w-5" />
                    تسجيل الدخول
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-xs text-gray-500 text-center">
              يتم تأمين البيانات وتشفيرها لحماية معلوماتك
            </p>
          </div>
        </div>
      </div>

      {/* Login Error Dialog */}
      <Dialog open={loginError} onOpenChange={setLoginError}>
        <DialogContent className="max-w-md rounded-2xl p-6 text-center border-0 shadow-2xl" dir="rtl">
          <div className="w-16 h-16 flex items-center justify-center bg-red-50 rounded-full mx-auto mb-4">
            <span className="text-red-500 text-3xl">!</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">فشل تسجيل الدخول</h2>
          <p className="mb-6 text-sm text-gray-500">
            {loginErrorMessage ||
              "تأكد من صحة البريد الإلكتروني وكلمة المرور ثم حاول مرة أخرى."}
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setLoginError(false);
                setLoginErrorMessage("");
              }}
              className="flex-1 rounded-xl"
            >
              إلغاء
            </Button>
            <Button
              onClick={() => {
                setWorkspace("");
                setEmail("");
                setPassword("");
                setError(null);
                setFieldErrors({});
                setLoginError(false);
                setLoginErrorMessage("");
              }}
              className="flex-1 rounded-xl bg-gradient-to-l from-blue-900 to-blue-500"
            >
              إعادة المحاولة
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
