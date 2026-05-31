import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { KeyRound, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import dressnmoreLogo from "@/assets/dressnmore-logo.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("كلمة المرور يجب أن تكون 8 أحرف على الأقل.");
      return;
    }
    if (password !== confirm) {
      setError("كلمتا المرور غير متطابقتين.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessOpen(true);
    }, 500);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-blue-950 to-slate-900 relative overflow-hidden flex items-center justify-center px-4 py-12"
      dir="rtl"
    >
      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-3xl shadow-2xl overflow-hidden bg-white/95 backdrop-blur-xl border border-white/20">
          <div className="bg-gradient-to-l from-blue-900 to-blue-600 px-8 py-8 text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl overflow-hidden bg-white shadow-md">
                <img src={dressnmoreLogo} alt="DressnMore" className="h-full w-full object-cover" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">DressnMore</span>
            </div>
            <h1 className="text-xl font-bold text-white mb-2">إعادة تعيين كلمة المرور</h1>
            <p className="text-white/80 text-sm">اختر كلمة مرور قوية جديدة لحسابك</p>
          </div>

          <div className="p-8">
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="password" className="text-right text-sm font-medium text-gray-700 block">
                  كلمة المرور الجديدة
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="h-12 rounded-xl pl-11"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    aria-label="إظهار كلمة المرور"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirm" className="text-right text-sm font-medium text-gray-700 block">
                  تأكيد كلمة المرور
                </label>
                <Input
                  id="confirm"
                  type="password"
                  placeholder="••••••••"
                  className="h-12 rounded-xl"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
              </div>

              {error && <p className="text-sm text-red-500 text-center">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-gradient-to-l from-blue-900 to-blue-500 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <KeyRound className="h-5 w-5" />
                    حفظ كلمة المرور
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link to="/login" className="text-gray-500 hover:text-gray-700 text-sm inline-flex items-center gap-1">
                <ArrowRight className="h-4 w-4" />
                العودة لتسجيل الدخول
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6 text-center" dir="rtl">
          <div className="w-16 h-16 flex items-center justify-center bg-emerald-50 rounded-full mx-auto mb-4">
            <KeyRound className="h-8 w-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold mb-2">تم تحديث كلمة المرور</h2>
          <p className="text-sm text-gray-500 mb-6">يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.</p>
          <Button
            className="w-full rounded-xl bg-gradient-to-l from-blue-900 to-blue-500"
            onClick={() => navigate("/login")}
          >
            تسجيل الدخول
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
