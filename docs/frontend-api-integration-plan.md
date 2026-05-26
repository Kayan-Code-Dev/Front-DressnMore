# Frontend API Integration Plan

## Current stage

- Phase 2 foundation: completed.
- Migration Batch 2 screens: completed.
- Status: **mock services only**.

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
- Pagination contract is frozen (`current_page`, `per_page`, `total`, `last_page`, optional `total_pages`).
- Module endpoint names and status enums are frozen for migrated modules.

## Integration readiness after Batch 2

Ready modules for progressive integration:

1. Auth (login/session)
2. Dashboard
3. Customers
4. Dresses
5. Invoices
6. Categories
7. Subcategories
8. Branches
9. Deliveries
10. Returns
11. Expenses
12. Cash movements
13. Suppliers
14. Purchase orders

## Suggested integration order

1. Auth (login + session bootstrapping)
2. Dashboard read endpoints
3. Customers list + CRUD
4. Dresses list + filters
5. Invoices list + status transitions
6. Categories + Subcategories
7. Branches
8. Deliveries + Returns
9. Expenses
10. Cash Movements
11. Suppliers + Purchase Orders
12. Remaining modules (reports/settings/inventory advanced/tailoring)

## Integration strategy

- Replace each mock service with real service one module at a time.
- Keep feature-level service boundaries unchanged.
- Use shared `httpClient` and `ApiResponse` contracts for all modules.
- Validate each module against backend envelope before moving to the next one.
- Keep fallback mock fixtures for local UI verification during rollout.
