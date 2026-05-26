import { Outlet } from "react-router-dom";
import { AppHeader } from "@/shared/layout/header/app-header";
import { AppSidebar } from "@/shared/layout/sidebar/app-sidebar";

export function DashboardLayout() {
  return (
    <div className="app-shell">
      <AppSidebar />
      <div className="app-content">
        <AppHeader />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
