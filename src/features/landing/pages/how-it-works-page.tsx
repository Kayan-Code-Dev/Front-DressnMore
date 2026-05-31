import { Link } from "react-router-dom";
import { ArrowRight, UserPlus, Settings, Rocket, HeadphonesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import dressnmoreLogo from "@/assets/dressnmore-logo.jpg";

const steps = [
  {
    step: 1,
    icon: UserPlus,
    title: "إنشاء حساب",
    description: "سجّل نشاطك التجاري وأضف بيانات المحل والفروع الأساسية.",
  },
  {
    step: 2,
    icon: Settings,
    title: "إعداد النظام",
    description: "أضف الفساتين، الصناديق، الموظفين، والموردين حسب احتياجك.",
  },
  {
    step: 3,
    icon: Rocket,
    title: "ابدأ العمل",
    description: "أنشئ طلبات الإيجار، تابع المدفوعات، وأغلق الصندوق يومياً.",
  },
  {
    step: 4,
    icon: HeadphonesIcon,
    title: "دعم مستمر",
    description: "فريق الدعم يساعدك في التوسع وربط التكاملات لاحقاً.",
  },
];

const faqs = [
  { q: "هل يدعم النظام فروعاً متعددة؟", a: "نعم، يمكنك إدارة مخزون وصناديق كل فرع بشكل منفصل." },
  { q: "هل الواجهة بالعربية؟", a: "نعم، الواجهة بالكامل باللغة العربية مع دعم RTL." },
  { q: "هل يمكن تجربة النظام؟", a: "يمكنك تسجيل الدخول بحساب تجريبي من صفحة تسجيل الدخول." },
];

/** صفحة شرح آلية العمل — مكوّن عام بدون تخطيط لوحة التحكم */
export function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <header className="border-b bg-white">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={dressnmoreLogo} alt="DressnMore" className="w-8 h-8 rounded-lg object-cover" />
            <span className="font-bold">DressnMore</span>
          </Link>
          <Button variant="outline" size="sm" asChild>
            <Link to="/login">تسجيل الدخول</Link>
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-3">دليل البدء</Badge>
          <h1 className="text-3xl font-black text-slate-900 mb-3">كيف يعمل DressnMore؟</h1>
          <p className="text-slate-600 max-w-lg mx-auto">
            أربع خطوات بسيطة لتشغيل محل الفساتين رقمياً من اليوم الأول.
          </p>
        </div>

        <div className="space-y-6 mb-16">
          {steps.map((item, index) => (
            <Card key={item.step} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-24 flex items-center justify-center bg-gradient-to-b from-blue-900 to-blue-600 text-white py-6 sm:py-0">
                    <span className="text-3xl font-black">{item.step}</span>
                  </div>
                  <div className="flex-1 p-6 flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                      <item.icon className="h-6 w-6 text-blue-700" />
                    </div>
                    <div>
                      <h2 className="font-bold text-lg mb-1">{item.title}</h2>
                      <p className="text-sm text-slate-600">{item.description}</p>
                      {index < steps.length - 1 && (
                        <p className="text-xs text-blue-600 mt-2 hidden sm:block">← الخطوة التالية</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <section className="mb-12">
          <h2 className="text-xl font-black mb-6 text-slate-900">أسئلة شائعة</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.q}>
                <CardContent className="pt-6">
                  <h3 className="font-bold mb-2">{faq.q}</h3>
                  <p className="text-sm text-slate-600">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="text-center rounded-2xl bg-gradient-to-l from-blue-900 to-blue-600 text-white p-8">
          <h2 className="text-xl font-bold mb-2">جاهز للبدء؟</h2>
          <p className="text-blue-100 text-sm mb-6">انضم لمئات محلات الفساتين التي تدير أعمالها عبر DressnMore.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild className="bg-white text-blue-900 hover:bg-blue-50">
              <Link to="/login">ابدأ مجاناً</Link>
            </Button>
            <Button variant="outline" asChild className="border-white/50 text-white hover:bg-white/10">
              <Link to="/">
                <ArrowRight className="h-4 w-4 ml-1" />
                الصفحة الرئيسية
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
