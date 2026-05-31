import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, ArrowRight } from "lucide-react";

export function CreateEmployeePage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #10B981, #34D399)" }}
            >
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-black">إضافة موظف جديد</CardTitle>
              <CardDescription>أدخل بيانات الموظف الأساسية والراتب.</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {submitted ? (
            <div className="py-8 text-center space-y-4">
              <p className="text-sm text-muted-foreground">سيتم تفعيل حفظ البيانات قريباً.</p>
              <Button variant="outline" asChild>
                <Link to="/employees">العودة للقائمة</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم الكامل</Label>
                  <Input id="name" placeholder="اسم الموظف" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input id="email" type="email" placeholder="email@example.com" required dir="ltr" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">الهاتف</Label>
                  <Input id="phone" placeholder="+201012345678" dir="ltr" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hire_date">تاريخ التوظيف</Label>
                  <Input id="hire_date" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label>الفرع</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="اختر الفرع" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Cairo Main</SelectItem>
                      <SelectItem value="2">Alex Branch</SelectItem>
                      <SelectItem value="3">Mansoura Branch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>المسمى الوظيفي</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="اختر المسمى" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manager">مدير فرع</SelectItem>
                      <SelectItem value="accountant">محاسبة</SelectItem>
                      <SelectItem value="tailor">خياط</SelectItem>
                      <SelectItem value="sales">مبيعات</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="base_salary">الراتب الأساسي</Label>
                  <Input id="base_salary" type="number" placeholder="0" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">كلمة المرور</Label>
                  <Input id="password" type="password" placeholder="••••••" required />
                </div>
              </div>
            </form>
          )}
        </CardContent>

        {!submitted && (
          <CardFooter className="flex justify-between gap-3">
            <Button variant="outline" asChild>
              <Link to="/employees">
                <ArrowRight className="h-4 w-4 ml-1.5" />
                إلغاء
              </Link>
            </Button>
            <Button onClick={handleSubmit}>حفظ الموظف</Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
