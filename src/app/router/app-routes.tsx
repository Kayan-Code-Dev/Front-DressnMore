import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardLayout } from "@/app/layouts/dashboard-layout";
import { ProtectedRoute } from "@/app/router/protected-route";
import { LoginPage } from "@/features/auth/pages/login-page";
import { DashboardPage } from "@/features/dashboard/pages/dashboard-page";
import { CustomersPage } from "@/features/customers/pages/customers-page";
import { DressesPage } from "@/features/catalog/dresses/pages/dresses-page";
import { InvoicesPage } from "@/features/invoices/pages/invoices-page";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/dresses" element={<DressesPage />} />
        <Route path="/invoices" element={<InvoicesPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
