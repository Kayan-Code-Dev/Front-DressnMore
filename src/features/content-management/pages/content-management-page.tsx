import { useEffect, useState } from "react";
import type { ContentTabId } from "@/features/content-management/types/content-management.types";
import { getContentManagementDataMock } from "@/features/content-management/services/content-management.mock.service";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Settings,
  User,
  MapPin,
  FolderTree,
  DollarSign,
  FileText,
  Crown,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
} from "lucide-react";

const TAB_DEFS: {
  id: ContentTabId;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}[] = [
  { id: "profile", label: "البروفايل الشخصي", description: "بيانات الحساب", icon: User, color: "#3B82F6" },
  { id: "branches", label: "إعدادات الفروع", description: "الضريبة والعملة", icon: MapPin, color: "#C2964A" },
  { id: "product-taxonomy", label: "الأصناف والتصنيفات", description: "أقسام المنتجات", icon: FolderTree, color: "#10B981" },
  { id: "currencies", label: "العملات", description: "العملات المعتمدة", icon: DollarSign, color: "#0C1A3E" },
  { id: "invoice-rules", label: "قواعد الفواتير", description: "شروط العرض", icon: FileText, color: "#6366F1" },
  { id: "subscription", label: "الاشتراك والباقة", description: "معاينة الباقة", icon: Crown, color: "#8B5CF6" },
];

export function ContentManagementPage() {
  const [activeTab, setActiveTab] = useState<ContentTabId>("profile");
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState<null | "create" | "edit" | "delete">(null);
  const [data, setData] = useState<Awaited<ReturnType<typeof getContentManagementDataMock>>["data"] | null>(null);

  useEffect(() => {
    getContentManagementDataMock()
      .then((response) => setData(response.data))
      .finally(() => setLoading(false));
  }, []);

  const currentTab = TAB_DEFS.find((t) => t.id === activeTab)!;

  return (
    <div className="w-full flex gap-0 min-h-[600px]" dir="rtl">
      <aside
        className="w-64 shrink-0 border-l py-5 px-4 space-y-1.5 hidden md:block"
        style={{ borderColor: "var(--color-border)" }}
      >
        <p className="text-[10px] font-black text-muted-foreground px-2 mb-3 tracking-widest uppercase">
          أقسام الإعدادات
        </p>
        {TAB_DEFS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-right transition-all ${
                isActive ? "bg-muted font-bold" : "hover:bg-muted/50 text-muted-foreground"
              }`}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: isActive ? tab.color : `${tab.color}20` }}
              >
              <span style={isActive ? undefined : { color: tab.color }}>
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : ""}`} />
              </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm truncate">{tab.label}</p>
                <p className="text-[10px] text-muted-foreground truncate">{tab.description}</p>
              </div>
            </button>
          );
        })}
      </aside>

      <div className="flex-1 p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #0C1A3E, #1E3A7B)" }}
          >
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black">الإعدادات</h1>
            <p className="text-xs text-muted-foreground">{currentTab.label}</p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap md:hidden mb-4">
          {TAB_DEFS.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {loading ? (
          <Skeleton className="h-96 w-full rounded-xl" />
        ) : (
          <>
            {activeTab === "profile" && data && (
              <Card>
                <CardHeader>
                  <CardTitle>البروفايل الشخصي</CardTitle>
                  <CardDescription>بيانات الحساب وكلمة المرور</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>الاسم</Label>
                    <Input defaultValue={data.profile.name} />
                  </div>
                  <div className="space-y-2">
                    <Label>البريد الإلكتروني</Label>
                    <Input defaultValue={data.profile.email} dir="ltr" />
                  </div>
                  <div className="space-y-2">
                    <Label>الهاتف</Label>
                    <Input defaultValue={data.profile.phone} dir="ltr" />
                  </div>
                  <div className="space-y-2">
                    <Label>اسم الشركة</Label>
                    <Input defaultValue={data.profile.company_name} />
                  </div>
                  <div className="md:col-span-2">
                    <Button disabled>حفظ التغييرات</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "branches" && data && (
              <Card>
                <CardHeader>
                  <CardTitle>إعدادات الفروع</CardTitle>
                  <CardDescription>الضريبة والعملة لكل فرع</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/30">
                          <TableHead className="text-center">الفرع</TableHead>
                          <TableHead className="text-center">العملة</TableHead>
                          <TableHead className="text-center">الضريبة</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.branches.map((b) => (
                          <TableRow key={b.id}>
                            <TableCell className="text-center font-medium">{b.branch_name}</TableCell>
                            <TableCell className="text-center">{b.currency}</TableCell>
                            <TableCell className="text-center">{b.vat_rate}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "product-taxonomy" && data && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>الأصناف والتصنيفات</CardTitle>
                    <CardDescription>أقسام المنتجات والأقسام الفرعية</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/categories">
                      <ExternalLink className="h-4 w-4 ml-1" />
                      إدارة التصنيفات
                    </a>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/30">
                          <TableHead className="text-center">القسم</TableHead>
                          <TableHead className="text-center">عدد الأقسام الفرعية</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.categories.map((c) => (
                          <TableRow key={c.id}>
                            <TableCell className="text-center font-medium">{c.name}</TableCell>
                            <TableCell className="text-center">
                              <Badge variant="outline">{c.subcategories_count}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "currencies" && data && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>العملات</CardTitle>
                    <CardDescription>العملات المعتمدة في النظام</CardDescription>
                  </div>
                  <Button size="sm" onClick={() => setDialog("create")}>
                    <Plus className="h-4 w-4 ml-1" />
                    إضافة عملة
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/30">
                          <TableHead className="text-center">الكود</TableHead>
                          <TableHead className="text-center">الاسم</TableHead>
                          <TableHead className="text-center">الرمز</TableHead>
                          <TableHead className="text-center">سعر الصرف</TableHead>
                          <TableHead className="text-center">افتراضي</TableHead>
                          <TableHead className="text-center">إجراءات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.currencies.map((c) => (
                          <TableRow key={c.id}>
                            <TableCell className="text-center"><Badge variant="outline">{c.code}</Badge></TableCell>
                            <TableCell className="text-center">{c.name}</TableCell>
                            <TableCell className="text-center">{c.symbol}</TableCell>
                            <TableCell className="text-center">{c.exchange_rate}</TableCell>
                            <TableCell className="text-center">
                              {c.is_default && <Badge variant="success">افتراضي</Badge>}
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex justify-center gap-1">
                                <Button variant="ghost" size="icon" onClick={() => setDialog("edit")}><Pencil className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" onClick={() => setDialog("delete")}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "invoice-rules" && data && (
              <Card>
                <CardHeader>
                  <CardTitle>قواعد الفواتير</CardTitle>
                  <CardDescription>شروط وقواعد العرض (واجهة تجريبية)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data.invoiceRules.map((rule) => (
                    <div
                      key={rule.id}
                      className="flex items-center justify-between gap-4 p-4 rounded-xl border"
                      style={{ borderColor: "var(--color-border)" }}
                    >
                      <div>
                        <p className="font-bold text-sm">{rule.name}</p>
                        <p className="text-xs text-muted-foreground">{rule.description}</p>
                      </div>
                      <Switch checked={rule.enabled} disabled />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {activeTab === "subscription" && data && (
              <Card>
                <CardHeader>
                  <CardTitle>الاشتراك والباقة</CardTitle>
                  <CardDescription>معاينة الباقة (واجهة تجريبية)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: "الباقة", value: data.subscription.plan_name },
                      { label: "الحالة", value: data.subscription.status === "active" ? "نشط" : data.subscription.status },
                      { label: "تاريخ الانتهاء", value: data.subscription.expires_at },
                      { label: "الحد الأقصى للفروع", value: data.subscription.max_branches },
                      { label: "الحد الأقصى للمستخدمين", value: data.subscription.max_users },
                    ].map((item) => (
                      <div key={item.label} className="rounded-xl p-4 border" style={{ borderColor: "var(--color-border)" }}>
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                        <p className="text-lg font-black">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>

      <Dialog open={dialog !== null} onOpenChange={() => setDialog(null)}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>
              {dialog === "create" ? "إضافة" : dialog === "edit" ? "تعديل" : "حذف"}
            </DialogTitle>
            <DialogDescription>سيتم تفعيل هذه الميزة قريباً.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog(null)}>إغلاق</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
