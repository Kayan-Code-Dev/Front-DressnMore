import { useEffect, useState } from "react";
import { isModuleLive } from "@/config/feature-flags";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AccountProfile } from "@/features/settings/types/settings.types";
import { getAccountSettingsMock } from "@/features/settings/services/settings.mock.service";
import { getAccountProfile } from "@/features/settings/services/settings.api.service";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Settings, User, Lock, Trash2 } from "lucide-react";

export function AccountSettingsPage() {
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const load = isModuleLive("settings") ? getAccountProfile : getAccountSettingsMock;
    load().then((response) => {
      setProfile(response.data);
      setName(response.data.name);
      setEmail(response.data.email);
    });
  }, []);

  return (
    <div className="w-full space-y-6">
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #6366F1, #818CF8)" }}>
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-black" style={{ color: "var(--color-text-primary)" }}>إعدادات الحساب</CardTitle>
              <CardDescription>إدارة الملف الشخصي وإعدادات الأمان.</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <CardTitle className="text-base font-bold" style={{ color: "var(--color-text-primary)" }}>الملف الشخصي</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {!profile ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
                <div className="space-y-2">
                  <Label htmlFor="settings-name">الاسم</Label>
                  <Input id="settings-name" value={name} onChange={(event) => setName(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-email">البريد الإلكتروني</Label>
                  <Input id="settings-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-avatar">الصورة الشخصية</Label>
                  <Input id="settings-avatar" type="file" disabled className="text-sm" />
                  <p className="text-xs text-muted-foreground">رفع الصور غير متاح حالياً.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-logo">الشعار</Label>
                  <Input id="settings-logo" type="file" disabled className="text-sm" />
                  <p className="text-xs text-muted-foreground">رفع الشعار غير متاح حالياً.</p>
                </div>
                <Button disabled={!profile}>حفظ الملف الشخصي</Button>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-muted-foreground" />
                <CardTitle className="text-base font-bold" style={{ color: "var(--color-text-primary)" }}>تغيير كلمة المرور</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
                <div className="space-y-2">
                  <Label htmlFor="current-password">كلمة المرور الحالية</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">تأكيد كلمة المرور</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                <Button>تحديث كلمة المرور</Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-destructive/30">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-destructive" />
                <CardTitle className="text-base font-bold text-destructive">حذف الحساب</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">هذا الإجراء غير قابل للتراجع. سيتم حذف جميع البيانات المرتبطة بحسابك.</p>
              <Button variant="destructive" disabled>حذف الحساب</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
