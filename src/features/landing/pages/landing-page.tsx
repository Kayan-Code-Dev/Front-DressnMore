import { Link } from "react-router-dom";
import {
  Shirt,
  BarChart3,
  Users,
  Shield,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import dressnmoreLogo from "@/assets/dressnmore-logo.jpg";

const features = [
  {
    icon: Shirt,
    title: "إدارة الفساتين والمخزون",
    description: "تتبع الفساتين بين الفروع مع حالات الجاهزية والحجز والصيانة.",
  },
  {
    icon: BarChart3,
    title: "تقارير ومبيعات",
    description: "لوحة تحكم وإحصائيات لإيجاراتك ومبيعاتك في مكان واحد.",
  },
  {
    icon: Users,
    title: "عملاء وموردون",
    description: "إدارة العملاء وأوامر الشراء وحسابات الموردين بسهولة.",
  },
  {
    icon: Shield,
    title: "أمان وصلاحيات",
    description: "صلاحيات موظفين واشتراكات متعددة الفروع لكل نشاط تجاري.",
  },
];

const plans = [
  { name: "أساسي", price: "499", period: "شهرياً", highlight: false },
  { name: "احترافي", price: "899", period: "شهرياً", highlight: true },
  { name: "مؤسسات", price: "تواصل", period: "مخصص", highlight: false },
];

/** صفحة هبوط تسويقية عامة — مكوّن مستقل بدون تخطيط لوحة التحكم */
export function LandingPage() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={dressnmoreLogo} alt="DressnMore" className="w-9 h-9 rounded-lg object-cover" />
            <span className="font-black text-lg text-slate-900">DressnMore</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
            <a href="#features" className="hover:text-blue-700">المميزات</a>
            <Link to="/how-it-works" className="hover:text-blue-700">كيف يعمل</Link>
            <a href="#pricing" className="hover:text-blue-700">الأسعار</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link to="/login">تسجيل الدخول</Link>
            </Button>
            <Button asChild className="bg-gradient-to-l from-blue-900 to-blue-600">
              <Link to="/login">ابدأ الآن</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-b from-blue-950 via-blue-900 to-slate-900 text-white py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <Badge className="mb-4 bg-white/10 text-white border-white/20">نظام إدارة محلات الفساتين</Badge>
          <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight">
            أدر محل الفساتين من مكان واحد
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">
            DressnMore يساعدك على إدارة الإيجار، المخزون، الصناديق، الموردين، والخياطة — بواجهة عربية سهلة.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" asChild className="bg-white text-blue-900 hover:bg-blue-50">
              <Link to="/login">
                جرّب النظام
                <ArrowLeft className="h-4 w-4 mr-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white/40 text-white hover:bg-white/10">
              <Link to="/how-it-works">كيف يعمل؟</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="features" className="py-16 md:py-24 max-w-6xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-black text-center mb-2 text-slate-900">لماذا DressnMore؟</h2>
        <p className="text-center text-slate-500 mb-12 max-w-xl mx-auto">
          حل متكامل مصمم لمحلات تأجير وبيع الفساتين في المنطقة العربية.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="border-slate-200 hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-700" />
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="pricing" className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-black text-center mb-10 text-slate-900">خطط الاشتراك</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={plan.highlight ? "border-blue-500 ring-2 ring-blue-500/20" : ""}
              >
                <CardContent className="pt-6 text-center">
                  {plan.highlight && (
                    <Badge className="mb-3 bg-blue-600">الأكثر طلباً</Badge>
                  )}
                  <h3 className="font-bold text-lg">{plan.name}</h3>
                  <p className="text-3xl font-black my-3 text-blue-900">{plan.price}</p>
                  <p className="text-sm text-slate-500 mb-4">{plan.period}</p>
                  <ul className="text-sm text-slate-600 space-y-2 text-right mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      فروع متعددة
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      دعم فني
                    </li>
                  </ul>
                  <Button variant={plan.highlight ? "default" : "outline"} className="w-full" asChild>
                    <Link to="/login">اختر الخطة</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t py-8 text-center text-sm text-slate-500">
        <p>© {new Date().getFullYear()} DressnMore — جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
}
