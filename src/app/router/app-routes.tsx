import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardLayout } from "@/app/layouts/dashboard-layout";
import { ProtectedRoute } from "@/app/router/protected-route";
import { PlanGatedOutlet } from "@/app/router/plan-gated-outlet";
import { LoginPage } from "@/features/auth/pages/login-page";
import { ForgetPasswordPage } from "@/features/auth/pages/forget-password-page";
import { VerifyOtpPage } from "@/features/auth/pages/verify-otp-page";
import { ResetPasswordPage } from "@/features/auth/pages/reset-password-page";
import { LandingPage } from "@/features/landing/pages/landing-page";
import { HowItWorksPage } from "@/features/landing/pages/how-it-works-page";
import { DashboardPage } from "@/features/dashboard/pages/dashboard-page";
import { CustomersPage } from "@/features/customers/pages/customers-page";
import { DressesPage } from "@/features/catalog/dresses/pages/dresses-page";
import { DressDetailsPage } from "@/features/catalog/dresses/pages/dress-details-page";
import { DressTransferPage } from "@/features/catalog/dresses/pages/dress-transfer-page";
import { InvoicesPage } from "@/features/invoices/pages/invoices-page";
import { CategoriesPage } from "@/features/catalog/categories/pages/categories-page";
import { SubcategoriesPage } from "@/features/catalog/subcategories/pages/subcategories-page";
import { BranchesPage } from "@/features/branches/pages/branches-page";
import { DeliveriesPage } from "@/features/delivery/pages/deliveries-page";
import { ReturnsPage } from "@/features/returns/pages/returns-page";
import { ExpensesPage } from "@/features/expenses/pages/expenses-page";
import { CashMovementsPage } from "@/features/cash-movements/pages/cash-movements-page";
import { SuppliersPage } from "@/features/suppliers/pages/suppliers-page";
import { SupplierAccountsPage } from "@/features/suppliers/pages/supplier-accounts-page";
import { PurchaseOrdersPage } from "@/features/suppliers/pages/purchase-orders-page";
import { PaymentsPage } from "@/features/payments/pages/payments-page";
import { CashboxesPage } from "@/features/cashboxes/pages/cashboxes-page";
import { CashboxDetailsPage } from "@/features/cashboxes/pages/cashbox-details-page";
import { CashboxTransactionsPage } from "@/features/cashboxes/pages/cashbox-transactions-page";
import { SupplierPaymentsPage } from "@/features/suppliers/pages/supplier-payments-page";
import { OverdueReturnsPage } from "@/features/returns/pages/overdue-returns-page";
import { ReportsPage } from "@/features/reports/pages/reports-page";
import { SalesReportsPage } from "@/features/reports/pages/sales-reports-page";
import { TailoringReportsPage } from "@/features/reports/pages/tailoring-reports-page";
import { AccountingSummaryPage } from "@/features/accounting/pages/accounting-summary-page";
import { TreasuryEntriesPage } from "@/features/accounting/pages/treasury-entries-page";
import { AccountSettingsPage } from "@/features/settings/pages/account-settings-page";
import { SubscriptionPage } from "@/features/subscriptions/pages/subscription-page";
import { RentalOrdersPage } from "@/features/orders/pages/rental-orders-page";
import { OrderDetailsPage } from "@/features/orders/pages/order-details-page";
import { ChooseClientPage } from "@/features/orders/pages/choose-client-page";
import { ChooseDressesPage } from "@/features/orders/pages/choose-dresses-page";
import { CreateOrderPage } from "@/features/orders/pages/create-order-page";
import { DeliverySearchPage } from "@/features/orders/pages/delivery-search-page";
import { CreateSalePage } from "@/features/sales/pages/create-sale-page";
import { SalesInvoicesPage } from "@/features/sales/pages/sales-invoices-page";
import { SalesReportsFullPage } from "@/features/sales/pages/sales-reports-full-page";
import { TailoringOrdersPage } from "@/features/tailoring/pages/tailoring-orders-page";
import { TailoringDeliveriesPage } from "@/features/tailoring/pages/tailoring-deliveries-page";
import { TailoringOrderDetailsPage } from "@/features/tailoring/pages/tailoring-order-details-page";
import { CreateTailoringOrderPage } from "@/features/tailoring/pages/create-tailoring-order-page";
import { EditMeasurementsPage } from "@/features/tailoring/pages/edit-measurements-page";
import { EmployeesPage } from "@/features/employees/pages/employees-page";
import { CreateEmployeePage } from "@/features/employees/pages/create-employee-page";
import { EmployeeDetailPage } from "@/features/employees/pages/employee-detail-page";
import { EmployeeCustodiesPage } from "@/features/employees/pages/employee-custodies-page";
import { EmployeeSalariesPage } from "@/features/employees/pages/employee-salaries-page";
import { WorkshopPage } from "@/features/workshop/pages/workshop-page";
import { WorkshopDetailsPage } from "@/features/workshop/pages/workshop-details-page";
import { FactoryPage } from "@/features/factory/pages/factory-page";
import { NotificationsPage } from "@/features/notifications/pages/notifications-page";
import { ContentManagementPage } from "@/features/content-management/pages/content-management-page";
import { InventoryPage } from "@/features/inventory/pages/inventory-page";
import { BranchesInventoryPage } from "@/features/inventory/pages/branches-inventory-page";
import { TransferOperationsPage } from "@/features/inventory/pages/transfer-operations-page";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forget-password" element={<ForgetPasswordPage />} />
      <Route path="/verify-otp" element={<VerifyOtpPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route element={<PlanGatedOutlet />}>
        <Route path="/dashboard" element={<DashboardPage />} />

        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/dresses" element={<DressesPage />} />
        <Route path="/dresses/transfer" element={<DressTransferPage />} />
        <Route path="/dresses/:id" element={<DressDetailsPage />} />
        <Route path="/invoices" element={<InvoicesPage />} />

        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/subcategories" element={<SubcategoriesPage />} />
        <Route path="/branches" element={<BranchesPage />} />
        <Route path="/deliveries" element={<DeliveriesPage />} />
        <Route path="/returns" element={<ReturnsPage />} />
        <Route path="/overdue-returns" element={<OverdueReturnsPage />} />

        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/cashboxes" element={<CashboxesPage />} />
        <Route path="/cashboxes/transactions" element={<CashboxTransactionsPage />} />
        <Route path="/cashboxes/:id" element={<CashboxDetailsPage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/cash-movements" element={<CashMovementsPage />} />
        <Route path="/treasury/entries" element={<TreasuryEntriesPage />} />

        <Route path="/suppliers" element={<SuppliersPage />} />
        <Route path="/suppliers/accounts" element={<SupplierAccountsPage />} />
        <Route path="/purchase-orders" element={<PurchaseOrdersPage />} />
        <Route path="/supplier-payments" element={<SupplierPaymentsPage />} />

        <Route path="/orders/list" element={<RentalOrdersPage />} />
        <Route path="/orders/search-deliveries-returns" element={<DeliverySearchPage />} />
        <Route path="/orders/choose-client" element={<ChooseClientPage />} />
        <Route path="/orders/choose-clothes" element={<ChooseDressesPage />} />
        <Route path="/orders/create-order" element={<CreateOrderPage />} />
        <Route path="/orders/:id" element={<OrderDetailsPage />} />

        <Route path="/sales/invoices" element={<SalesInvoicesPage />} />
        <Route path="/sales/create" element={<CreateSalePage />} />
        <Route path="/sales/reports" element={<SalesReportsFullPage />} />

        <Route path="/tailoring" element={<Navigate to="/tailoring/orders" replace />} />
        <Route path="/tailoring/orders" element={<TailoringOrdersPage />} />
        <Route path="/tailoring/deliveries" element={<TailoringDeliveriesPage />} />
        <Route path="/tailoring/orders/create" element={<CreateTailoringOrderPage />} />
        <Route path="/tailoring/orders/:id" element={<TailoringOrderDetailsPage />} />
        <Route path="/tailoring/orders/:id/edit-measurements" element={<EditMeasurementsPage />} />

        <Route path="/employees" element={<EmployeesPage />} />
        <Route path="/employees/add" element={<CreateEmployeePage />} />
        <Route path="/employees/guarantees" element={<EmployeeCustodiesPage />} />
        <Route path="/employees/salaries" element={<EmployeeSalariesPage />} />
        <Route path="/employees/:id" element={<EmployeeDetailPage />} />

        <Route path="/workshop" element={<WorkshopPage />} />
        <Route path="/workshop/:id" element={<WorkshopDetailsPage />} />
        <Route path="/factory" element={<FactoryPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />

        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/inventory/branches" element={<BranchesInventoryPage />} />
        <Route path="/inventory/transfers" element={<TransferOperationsPage />} />

        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/reports/sales" element={<SalesReportsPage />} />
        <Route path="/reports/tailoring" element={<TailoringReportsPage />} />

        <Route path="/accounting" element={<AccountingSummaryPage />} />
        <Route path="/content" element={<ContentManagementPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/settings/account" element={<AccountSettingsPage />} />
        <Route path="/settings/subscription" element={<SubscriptionPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

