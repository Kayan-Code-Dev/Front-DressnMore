import { lazy, Suspense, useEffect, useState, type ReactElement } from "react";
import AppLayout from "@/components/layout/app-layout";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Route, Routes } from "react-router-dom";
import { loadAuthenticatedLayoutRoutesModule } from "@/routes/authenticated-layout-routes.loader";
import { Toaster } from "sonner";
import { useAuthStore } from "@/zustand-stores/auth.store";
import getAuthRoutes from "@/routes/auth.routes";

const LandingPage = lazy(() => import("@/pages/landing/LandingPage"));
const AboutPage = lazy(() => import("@/pages/landing/AboutPage"));
const TermsPage = lazy(() => import("@/pages/landing/TermsPage"));
const PrivacyPage = lazy(() => import("@/pages/landing/PrivacyPage"));

function AuthenticatedAppBootSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}

export default function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [authenticatedRouteTree, setAuthenticatedRouteTree] = useState<ReactElement | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setAuthenticatedRouteTree(null);
      return;
    }
    let cancelled = false;
    void loadAuthenticatedLayoutRoutesModule().then((m) => {
      if (!cancelled) {
        setAuthenticatedRouteTree(m.getAuthenticatedLayoutRouteElements());
      }
    });
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />

          <Route element={<AppLayout />}>
            {authenticatedRouteTree ?? (
              <Route path="*" element={<AuthenticatedAppBootSpinner />} />
            )}
          </Route>

          {getAuthRoutes()}

          <Route
            path="*"
            element={<h1 className="text-4xl font-bold text-center">Not Found</h1>}
          />
        </Routes>
      </Suspense>
      <Toaster className="no-print" />
    </ErrorBoundary>
  );
}
