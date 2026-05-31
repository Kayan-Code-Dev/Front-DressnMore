import { BrowserRouter } from "react-router-dom";
import { AppProviders } from "@/app/providers/app-providers";
import { AppRoutes } from "@/app/router/app-routes";

export function AppBootstrap() {
  return (
    <BrowserRouter>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </BrowserRouter>
  );
}
