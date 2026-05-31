import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Loader2, ArrowRight } from "lucide-react";
import dressnmoreLogo from "@/assets/dressnmore-logo.jpg";
import { Input } from "@/components/ui/input";

export function VerifyOtpPage() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (otp.length >= 4) {
        navigate("/auth/reset-password");
      } else {
        setError("رمز التحقق غير صحيح. جرّب 1234 للعرض التجريبي.");
      }
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
            <h1 className="text-xl font-bold text-white mb-2">التحقق من الرمز</h1>
            <p className="text-white/80 text-sm">أدخل الرمز المكوّن من 6 أرقام المرسل إلى بريدك</p>
          </div>

          <div className="p-8">
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="otp" className="text-right text-sm font-medium text-gray-700 block">
                  رمز التحقق
                </label>
                <Input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="••••••"
                  className="h-12 rounded-xl text-center text-lg tracking-[0.5em] font-mono"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  required
                />
                <p className="text-xs text-gray-500 text-center">للتجربة: أي رمز من 4 أرقام أو أكثر</p>
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
                    جاري التحقق...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-5 w-5" />
                    تحقق ومتابعة
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 flex flex-col gap-2 text-center text-sm">
              <Link to="/auth/forget-password" className="text-blue-600 hover:underline">
                إعادة إرسال الرمز
              </Link>
              <Link to="/login" className="text-gray-500 hover:text-gray-700 inline-flex items-center justify-center gap-1">
                <ArrowRight className="h-4 w-4" />
                العودة لتسجيل الدخول
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
