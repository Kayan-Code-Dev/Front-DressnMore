import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AppBootstrap } from "@/app/bootstrap/app-bootstrap";
import "@/api/api-contants";
import { installMockApiInterceptor } from "@/api/mock-interceptor";
import {
  consumeTenantBootstrapFromHash,
  discardPersistedAuthIfBootstrapRedirect,
  syncApiBaseUrlWithAuthState,
} from "@/lib/tenant-bootstrap";
import { useAuthStore } from "@/zustand-stores/auth.store";
import "@fontsource/cairo/400.css";
import "@fontsource/cairo/600.css";
import "@fontsource/cairo/700.css";
import "@fontsource/cairo/900.css";
import "remixicon/fonts/remixicon.css";
import "@/index.css";

installMockApiInterceptor();

discardPersistedAuthIfBootstrapRedirect();

void Promise.resolve(useAuthStore.persist.rehydrate()).then(() => {
  consumeTenantBootstrapFromHash();
  syncApiBaseUrlWithAuthState();
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <BrowserRouter>
        <AppBootstrap />
      </BrowserRouter>
    </StrictMode>,
  );
});
