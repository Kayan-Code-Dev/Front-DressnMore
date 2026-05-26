# Frontend API Integration Plan

## When real API integration starts

Real integration should start only after:

1. Backend contract for phase modules is stabilized.
2. Tenant login and common response envelopes are finalized.
3. Pagination and validation error structures are consistent.
4. Required permissions naming is confirmed by backend.

## Required backend stability / freeze checkpoints

- Auth (`POST /api/tenant/login`) is frozen.
- Tenant headers behavior is frozen:
  - `Authorization: Bearer <token>`
  - `X-Tenant: <workspace>`
  - `Accept: application/json`
- Success/error response formats are frozen.
- Module endpoints for phase modules are frozen.

## Suggested integration order

1. Auth (login + session bootstrapping)
2. Dashboard read endpoints
3. Customers list + CRUD
4. Dresses list + filters
5. Invoices list + status transitions
6. Catalog modules (categories/subcategories)
7. Branches
8. Financial modules (payments/expenses/cash movements)
9. Delivery/returns
10. Suppliers
11. Reports
12. Settings

## Integration strategy

- Replace each mock service with real service one module at a time.
- Keep feature-level service boundaries unchanged.
- Use shared `httpClient` helpers and `ApiResponse` types for all modules.
- Validate each module against backend envelope before moving to next module.
