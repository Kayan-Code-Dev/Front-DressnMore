import { useState } from "react";
import { Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useSession, sessionStore } from "@/shared/lib/auth/session.store";
import { isModuleLive } from "@/config/feature-flags";
import { tenantLogout } from "@/features/auth/services/auth.api.service";
import { MobileSidebar } from "./sidebar/mobile-sidebar";

export default function Header() {
  const navigate = useNavigate();
  const user = useSession((s) => s.user as { name?: string } | null);
  const workspace = useSession((s) => s.workspace);
  const [loggingOut, setLoggingOut] = useState(false);

  const displayName = user?.name ?? "المستخدم";
  const userInitials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      if (isModuleLive("auth")) {
        await tenantLogout();
      }
    } finally {
      sessionStore.clearSession();
      navigate("/login", { replace: true });
    }
  };

  return (
    <header className="sticky top-0 z-10 shrink-0 bg-white/98 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-6 py-3 flex items-center gap-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          onClick={() => navigate("/settings/account")}
          className="rounded-full transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
          title="إعدادات الحساب"
        >
          <Avatar className="h-9 w-9 cursor-pointer ring-1 ring-slate-200/60">
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </button>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold text-slate-900 truncate">{displayName}</span>
          {workspace && (
            <span className="text-[11px] text-slate-400 truncate">{workspace}</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="ghost"
          className="hidden sm:inline-flex items-center gap-2 text-slate-600 hover:text-red-600"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          <LogOut className="h-4 w-4" />
          {loggingOut ? "جاري الخروج..." : "تسجيل خروج"}
        </Button>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0 w-64">
              <SheetTitle className="sr-only">القائمة الجانبية</SheetTitle>
              <SheetDescription className="sr-only">القائمة الجانبية للتنقل</SheetDescription>
              <MobileSidebar />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
