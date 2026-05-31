import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isModuleLive } from "@/config/feature-flags";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AccountProfile } from "@/features/settings/types/settings.types";
import { getAccountSettingsMock } from "@/features/settings/services/settings.mock.service";
import {
  deleteAccount,
  getAccountProfile,
  updateAccountProfile,
  updatePassword,
} from "@/features/settings/services/settings.api.service";
import { sessionStore } from "@/shared/lib/auth/session.store";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Settings, User, Lock, Trash2 } from "lucide-react";

export function AccountSettingsPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);

  useEffect(() => {
    const load = isModuleLive("settings") ? getAccountProfile : getAccountSettingsMock;
    load().then((response) => {
      setProfile(response.data);
      setName(response.data.name);
      setEmail(response.data.email);
    });
  }, []);

  const handleSaveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    setSaveMessage(null);
    try {
      if (isModuleLive("settings")) {
        const response = await updateAccountProfile({ name, email });
        setProfile(response.data);
        setSaveMessage("تم حفظ الملف الشخصي.");
      } else {
        setProfile({ ...profile, name, email });
        setSaveMessage("تم حفظ الملف الشخصي (وضع تجريبي).");
      }
    } catch (err: unknown) {
      setSaveMessage(err instanceof Error ? err.message : "تعذر حفظ الملف الشخصي.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordMessage("كلمة المرور الجديدة غير متطابقة.");
      return;
    }
    setPasswordSaving(true);
    setPasswordMessage(null);
    try {
      if (isModuleLive("settings")) {
        await updatePassword({
          current_password: currentPassword,
          password: newPassword,
          password_confirmation: confirmPassword,
        });
      }
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordMessage("تم تحديث كلمة المرور.");
    } catch (err: unknown) {
      setPasswordMessage(err instanceof Error ? err.message : "تعذر تحديث كلمة المرور.");
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setDeleteMessage("أدخل كلمة المرور للتأكيد.");
      return;
    }
    setDeleting(true);
    setDeleteMessage(null);
    try {
      if (isModuleLive("settings")) {
        await deleteAccount({ password: deletePassword });
      }
      sessionStore.clearSession();
      navigate("/login", { replace: true });
    } catch (err: unknown) {
      setDeleteMessage(err instanceof Error ? err.message : "تعذر حذف الحساب.");
    } finally {
      setDeleting(false);
    }
  };

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
                <Button type="button" disabled={!profile || saving} onClick={handleSaveProfile}>
                  {saving ? "جاري الحفظ..." : "حفظ الملف الشخصي"}
                </Button>
                {saveMessage ? <p className="text-sm text-muted-foreground">{saveMessage}</p> : null}
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
                  <Input id="current-password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
                  <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">تأكيد كلمة المرور</Label>
                  <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
                <Button type="button" disabled={passwordSaving} onClick={handleUpdatePassword}>
                  {passwordSaving ? "جاري التحديث..." : "تحديث كلمة المرور"}
                </Button>
                {passwordMessage ? <p className="text-sm text-muted-foreground">{passwordMessage}</p> : null}
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
              <div className="space-y-3">
                <Input
                  type="password"
                  placeholder="كلمة المرور للتأكيد"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                />
                <Button variant="destructive" disabled={deleting} onClick={handleDeleteAccount}>
                  {deleting ? "جاري الحذف..." : "حذف الحساب"}
                </Button>
                {deleteMessage ? <p className="text-sm text-destructive">{deleteMessage}</p> : null}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
