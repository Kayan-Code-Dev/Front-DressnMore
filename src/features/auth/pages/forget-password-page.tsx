import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { Mail, Loader2, ArrowRight } from "lucide-react";
import dressnmoreLogo from "@/assets/dressnmore-logo.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

export function ForgetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sentOpen, setSentOpen] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSentOpen(true);
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
            <h1 className="text-xl font-bold text-white mb-2">نسيت كلمة المرور؟</h1>
            <p className="text-white/80 text-sm">أدخل بريدك الإلكتروني وسنرسل لك رمز التحقق</p>
          </div>

          <div className="p-8">
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="text-right text-sm font-medium text-gray-700 block">
                  البريد الإلكتروني
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@dressnmore.com"
                  className="h-12 rounded-xl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-gradient-to-l from-blue-900 to-blue-500 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                    <Mail className="h-5 w-5" />
                    إرسال رمز التحقق
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 flex flex-col gap-2 text-center text-sm">
              <Link to="/auth/verify-otp" className="text-blue-600 hover:underline">
                لدي رمز بالفعل — التحقق
              </Link>
              <Link to="/login" className="text-gray-500 hover:text-gray-700 inline-flex items-center justify-center gap-1">
                <ArrowRight className="h-4 w-4" />
                العودة لتسجيل الدخول
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={sentOpen} onOpenChange={setSentOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6 text-center" dir="rtl">
          <div className="w-16 h-16 flex items-center justify-center bg-emerald-50 rounded-full mx-auto mb-4">
            <Mail className="h-8 w-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold mb-2">تم إرسال الرمز</h2>
          <p className="text-sm text-gray-500 mb-6">
            تحقق من بريدك {email ? `(${email})` : ""} وأدخل الرمز في صفحة التحقق.
          </p>
          <Button asChild className="w-full rounded-xl bg-gradient-to-l from-blue-900 to-blue-500">
            <Link to="/auth/verify-otp">متابعة للتحقق</Link>
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
