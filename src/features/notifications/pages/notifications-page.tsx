import { useEffect, useMemo, useState } from "react";
import { isModuleLive } from "@/config/feature-flags";
import type {
  NotificationCategory,
  NotificationItem,
  NotificationStats,
} from "@/features/notifications/types/notifications.types";
import {
  deleteNotification,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/features/notifications/services/notifications.api.service";
import {
  listNotificationsMock,
  markNotificationReadMock,
  markAllNotificationsReadMock,
  deleteNotificationMock,
} from "@/features/notifications/services/notifications.mock.service";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  Search,
  CheckCheck,
  Trash2,
  Store,
  Key,
  Scissors,
  Vault,
  Truck,
  Users,
  Building2,
  UserCircle,
  Package,
  Settings,
  Mail,
} from "lucide-react";

type FilterTab = "all" | "unread" | NotificationCategory;

const filterTabs: { id: FilterTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "all", label: "الكل", icon: Bell },
  { id: "unread", label: "غير مقروءة", icon: Mail },
  { id: "sales", label: "المبيعات", icon: Store },
  { id: "rental", label: "الإيجار", icon: Key },
  { id: "tailoring", label: "التفصيل", icon: Scissors },
  { id: "treasury", label: "الخزنة", icon: Vault },
  { id: "delivery", label: "التسليمات", icon: Truck },
  { id: "employees", label: "الموظفون", icon: Users },
  { id: "suppliers", label: "الموردون", icon: Building2 },
  { id: "customers", label: "العملاء", icon: UserCircle },
  { id: "inventory", label: "المخزون", icon: Package },
  { id: "system", label: "النظام", icon: Settings },
];

const categoryLabels: Record<NotificationCategory, string> = {
  sales: "المبيعات",
  rental: "الإيجار",
  tailoring: "التفصيل",
  treasury: "الخزنة",
  delivery: "التسليمات",
  employees: "الموظفون",
  suppliers: "الموردون",
  customers: "العملاء",
  inventory: "المخزون",
  system: "النظام",
};

const priorityBadge: Record<string, { label: string; variant: "destructive" | "outline" | "success" }> = {
  urgent: { label: "عاجل", variant: "destructive" },
  high: { label: "مهم", variant: "destructive" },
  normal: { label: "متوسط", variant: "outline" },
  low: { label: "عادي", variant: "success" },
};

export function NotificationsPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [stats, setStats] = useState<NotificationStats>({ total: 0, read: 0, unread: 0 });

  const loadNotifications = () => {
    setLoading(true);
    const load = isModuleLive("notifications")
      ? () => listNotifications({ search, per_page: 100 })
      : () => listNotificationsMock({
          search,
          unread_only: activeTab === "unread",
          category: activeTab !== "all" && activeTab !== "unread" ? activeTab : null,
        });

    load()
      .then((response) => {
        let data = response.data;
        if (activeTab === "unread") {
          data = data.filter((n) => !n.read_at);
        } else if (activeTab !== "all") {
          data = data.filter((n) => n.category === activeTab);
        }
        if (priorityFilter !== "all") {
          data = data.filter((n) => n.priority === priorityFilter);
        }
        setNotifications(data);
        const metaStats = response.meta?.stats as NotificationStats | undefined;
        if (metaStats) setStats(metaStats);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, search, priorityFilter]);

  const filteredCount = useMemo(() => notifications.length, [notifications]);

  const handleMarkRead = async (id: number) => {
    if (isModuleLive("notifications")) {
      await markNotificationRead(id);
    } else {
      await markNotificationReadMock(id);
    }
    loadNotifications();
  };

  const handleMarkAllRead = async () => {
    if (isModuleLive("notifications")) {
      await markAllNotificationsRead();
    } else {
      await markAllNotificationsReadMock();
    }
    loadNotifications();
  };

  const handleDelete = async (id: number) => {
    if (isModuleLive("notifications")) {
      await deleteNotification(id);
    } else {
      await deleteNotificationMock(id);
    }
    loadNotifications();
  };

  return (
    <div className="w-full space-y-4">
      <Card>
        <div className="px-6 py-4 flex items-center justify-between gap-4 flex-wrap border-b" style={{ borderColor: "var(--color-border)" }}>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #EF4444, #DC2626)" }}
            >
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black">مركز الإشعارات</h1>
              <p className="text-xs text-muted-foreground">
                {stats.unread > 0 ? `${stats.unread} إشعار غير مقروء` : "جميع الإشعارات مقروءة"}
              </p>
            </div>
          </div>
          {stats.unread > 0 && (
            <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
              <CheckCheck className="h-4 w-4 ml-1.5" />
              تحديد الكل كمقروء
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 pb-0">
          {[
            { label: "الإجمالي", value: stats.total },
            { label: "مقروء", value: stats.read },
            { label: "غير مقروء", value: stats.unread },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border p-4 text-center" style={{ borderColor: "var(--color-border)" }}>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-black">{s.value}</p>
            </div>
          ))}
        </div>

        <CardContent className="p-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            {filterTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <Button
                  key={tab.id}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon className="h-3.5 w-3.5 ml-1" />
                  {tab.label}
                </Button>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="بحث في الإشعارات..."
                className="pr-9"
              />
            </div>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="الأولوية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الأولويات</SelectItem>
                <SelectItem value="urgent">عاجل</SelectItem>
                <SelectItem value="high">مهم</SelectItem>
                <SelectItem value="normal">متوسط</SelectItem>
                <SelectItem value="low">عادي</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))
            ) : notifications.length > 0 ? (
              notifications.map((n) => {
                const isRead = !!n.read_at;
                const pBadge = priorityBadge[n.priority] ?? priorityBadge.normal;
                return (
                  <div
                    key={n.id}
                    className={`rounded-xl border p-4 transition-all ${isRead ? "bg-background" : "bg-muted/20"}`}
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-sm font-bold">{n.title}</span>
                          <Badge variant="outline">{categoryLabels[n.category]}</Badge>
                          <Badge variant={pBadge.variant}>{pBadge.label}</Badge>
                          {!isRead && <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />}
                        </div>
                        <p className="text-sm text-muted-foreground">{n.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">{n.created_at.slice(0, 16).replace("T", " ")}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {!isRead && (
                          <Button variant="ghost" size="icon" title="تحديد كمقروء" onClick={() => handleMarkRead(n.id)}>
                            <CheckCheck className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" title="حذف" onClick={() => handleDelete(n.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-muted-foreground">
                <Bell className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p>لا توجد إشعارات.</p>
              </div>
            )}
          </div>

          {!loading && (
            <p className="text-sm text-muted-foreground text-center">
              عرض {filteredCount} إشعار
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
