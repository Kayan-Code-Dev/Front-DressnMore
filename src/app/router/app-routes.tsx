import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardLayout } from "@/app/layouts/dashboard-layout";
import { ProtectedRoute } from "@/app/router/protected-route";
import { LoginPage } from "@/features/auth/pages/login-page";
import { DashboardPage } from "@/features/dashboard/pages/dashboard-page";
import { CustomersPage } from "@/features/customers/pages/customers-page";
import { DressesPage } from "@/features/catalog/dresses/pages/dresses-page";
import { InvoicesPage } from "@/features/invoices/pages/invoices-page";
import { CategoriesPage } from "@/features/catalog/categories/pages/categories-page";
import { SubcategoriesPage } from "@/features/catalog/subcategories/pages/subcategories-page";
import { BranchesPage } from "@/features/branches/pages/branches-page";
import { DeliveriesPage } from "@/features/delivery/pages/deliveries-page";
import { ReturnsPage } from "@/features/returns/pages/returns-page";
import { ExpensesPage } from "@/features/expenses/pages/expenses-page";
import { CashMovementsPage } from "@/features/cash-movements/pages/cash-movements-page";
import { SuppliersPage } from "@/features/suppliers/pages/suppliers-page";
import { PurchaseOrdersPage } from "@/features/suppliers/pages/purchase-orders-page";

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

        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/subcategories" element={<SubcategoriesPage />} />
        <Route path="/branches" element={<BranchesPage />} />
        <Route path="/deliveries" element={<DeliveriesPage />} />
        <Route path="/returns" element={<ReturnsPage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/cash-movements" element={<CashMovementsPage />} />
        <Route path="/suppliers" element={<SuppliersPage />} />
        <Route path="/purchase-orders" element={<PurchaseOrdersPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
