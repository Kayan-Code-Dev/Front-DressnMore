# Frontend API Readiness Matrix

This matrix reflects architecture review after Foundation + Batch 2 + Batch 3.

| Module | Route | Mock service | Expected backend endpoint | Permissions needed | Lookups needed | Integration status | Backend dependency | Notes |
|---|---|---|---|---|---|---|---|---|
| auth | `/login` | `auth.mock.service.ts` | `POST /api/tenant/login` | none | none | Mock-ready | Login contract freeze | Session shape aligned: token/workspace/tenant/user/permissions/plan |
| dashboard | `/dashboard` | `dashboard.mock.service.ts` | `GET /api/tenant/dashboard/overview` | (optional) `dashboard.view` | branches, departments | Mock-ready | KPI payload + filters freeze | Supports period/date/branch/department filter placeholders |
| customers | `/customers` | `customers.mock.service.ts` | `GET/POST/PUT/DELETE /api/tenant/customers` | `customers.view` | cities, customer status/source | Mock-ready | CRUD + pagination + validation freeze | Uses shared DataTable and search bar |
| categories | `/categories` | `categories.mock.service.ts` | `GET/POST/PUT/DELETE /api/tenant/categories` | `dress_categories.view` | category status | Mock-ready | CRUD + status enum freeze | Create/Edit/Delete are UI placeholders |
| subcategories | `/subcategories` | `subcategories.mock.service.ts` | `GET/POST/PUT/DELETE /api/tenant/subcategories` | `dress_categories.view` | categories list, subcategory status | Mock-ready | CRUD + category relation freeze | Category filter placeholder already present |
| branches | `/branches` | `branches.mock.service.ts` | `GET/POST/PUT/DELETE /api/tenant/branches` | `branches.view` | currencies, cities, branch status | Mock-ready | branch schema + VAT fields freeze | Columns aligned with branch design contract |
| dresses | `/dresses` | `dresses.mock.service.ts` | `GET/POST/PUT/DELETE /api/tenant/dresses` | `dresses.view` | branches, categories, statuses | Mock-ready | inventory linkage + status enums freeze | Filter placeholders available |
| invoices | `/invoices` | `invoices.mock.service.ts` | `GET /api/tenant/invoices` (+ actions later) | `invoices.view` | customers, types, statuses, branches | Mock-ready | invoice listing/status contract freeze | Action placeholders only |
| payments | `/payments` | `payments.mock.service.ts` | `GET/POST /api/tenant/payments`, `POST /{id}/pay`, `POST /{id}/cancel` | `payments.view` | branches, customers, payment types/status | Mock-ready | payment lifecycle + filters freeze | View/pay/cancel/export placeholders |
| deliveries | `/deliveries` | `deliveries.mock.service.ts` | `GET /api/tenant/deliveries`, `POST /{id}/deliver` | `invoice_delivery.view` | customers, employees, date filters | Mock-ready | delivery action + filter contract freeze | Deliver action placeholder |
| returns | `/returns` | `returns.mock.service.ts` | `GET /api/tenant/returns`, `POST /{id}/return` | `invoice_delivery.view` | customers, employees, date filters | Mock-ready | return action + statuses freeze | Return action placeholder |
| overdue returns | `/overdue-returns` | `returns.mock.service.ts` | `GET /api/tenant/returns/overdue` | `invoice_delivery.view` | customers, overdue days range | Mock-ready | overdue computation contract freeze | Contact/mark-returned/view-invoice placeholders |
| expenses | `/expenses` | `expenses.mock.service.ts` | `GET/POST/PUT/DELETE /api/tenant/expenses`, approve/pay/cancel actions | `expenses.view` | branches, cashboxes, categories, statuses | Mock-ready | expense action endpoints + enums freeze | Full action placeholders present |
| cash movements | `/cash-movements` | `cash-movements.mock.service.ts` | `GET /api/tenant/cash-movements` | `cash_movements.view` | cashboxes, movement types | Mock-ready | ledger schema + filters freeze | Table and filters placeholders consistent |
| cashboxes | `/cashboxes` | `cashboxes.mock.service.ts` | `GET/PUT /api/tenant/cashboxes`, recalculate/export endpoints | `cashboxes.view` | branches, active status | Mock-ready | recalculate/export behavior freeze | Transactions/recalculate/edit/export placeholders |
| suppliers | `/suppliers` | `suppliers.mock.service.ts` | `GET/POST/PUT/DELETE /api/tenant/suppliers` | `suppliers.view` | supplier statuses, branches | Mock-ready | supplier CRUD + balances freeze | Uses shared table and dialog placeholders |
| purchase orders | `/purchase-orders` | `suppliers.mock.service.ts` | `GET/POST /api/tenant/purchase-orders`, add-payment/return/export actions | `purchase_orders.view` | suppliers, statuses, date ranges | Mock-ready | PO lifecycle + totals contract freeze | Actions are placeholders |
| supplier payments | `/supplier-payments` | `suppliers.mock.service.ts` | `GET/POST /api/tenant/supplier-payments`, export endpoint | `supplier_payments.view` | suppliers, purchase orders, methods | Mock-ready | payment methods + reference schema freeze | Add payment/export placeholders |
| reports | `/reports`, `/reports/sales`, `/reports/tailoring` | `reports.mock.service.ts` | `GET /api/tenant/reports/overview`, `/sales`, `/tailoring` | `reports.view`, `reports.sales`, `reports.tailoring` | branches, employees, date ranges | Mock-ready | report aggregates and filter contract freeze | Placeholder cards/tables; no chart lib dependency |
| accounting | `/accounting` | `accounting.mock.service.ts` | `GET /api/tenant/accounting/summary`, `GET /api/tenant/accounting/ledger` | `accounting.view` | cashboxes, movement types, date ranges | Mock-ready | summary + ledger schema freeze | UI foundation only, no real accounting logic |
| settings | `/settings/account` | `settings.mock.service.ts` | `GET/PUT /api/tenant/settings/account`, `POST change-password`, delete-account endpoint | `settings.profile` (and `settings.view` for future settings area) | none (optional profile metadata) | Mock-ready | account update/password contracts freeze | Upload/delete are placeholders only |

## Global readiness notes

- Shared API types are present in `src/shared/types/api.ts`.
- HTTP client is prepared in `src/shared/lib/http/client.ts` and now conditionally sends `Authorization` and `X-Tenant` only when present.
- Env config uses `VITE_API_BASE_URL` + `VITE_APP_NAME`; no hardcoded backend domain.
- All current feature modules remain mock-based until backend API freeze.
