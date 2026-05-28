import { Outlet } from "react-router-dom";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app/new-sidebar/AppSideBar";
import Header from "@/components/app/header";

const SIDEBAR_WIDTH_OPEN = "17rem";
const SIDEBAR_WIDTH_ICON = "3.5rem";
const SIDEBAR_GAP_COLLAPSED = "1.5rem";

function MainContent() {
  const { open, isMobile } = useSidebar();
  return (
    <div
      className="flex-1 min-w-0 flex flex-col min-h-screen transition-[margin] duration-200 ease-linear overflow-x-hidden"
      style={{
        marginRight: isMobile
          ? 0
          : open
            ? SIDEBAR_WIDTH_OPEN
            : `calc(${SIDEBAR_WIDTH_ICON} + ${SIDEBAR_GAP_COLLAPSED})`,
      }}
    >
      <Header />
      <div className="p-4 sm:p-5 md:p-6 flex-1 min-w-0 w-full max-w-full overflow-x-hidden">
        <Outlet />
      </div>
    </div>
  );
}

export function DashboardLayout() {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen bg-[linear-gradient(180deg,hsl(220_20%_98%)_0%,hsl(220_14%_96%)_100%)] w-full min-w-0 flex flex-row overflow-x-hidden">
        <AppSidebar />
        <MainContent />
      </div>
    </SidebarProvider>
  );
}
