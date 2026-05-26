# Frontend API Integration Plan

## Current stage

- Phase 2 foundation: completed.
- Migration Batch 2 screens: completed.
- Migration Batch 3 screens: completed.
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
- Status enums and action transitions are frozen per module.

## Integration readiness after Batch 3

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
11. Overdue Returns
12. Payments
13. Cashboxes
14. Expenses
15. Cash Movements
16. Suppliers
17. Purchase Orders
18. Supplier Payments
19. Reports (sales/tailoring)
20. Accounting summary
21. Account settings

## Suggested integration order

1. Auth (login + session bootstrapping)
2. Dashboard
3. Customers + Dresses + Invoices
4. Categories + Subcategories + Branches
5. Deliveries + Returns + Overdue Returns
6. Payments + Cashboxes + Expenses + Cash Movements
7. Suppliers + Purchase Orders + Supplier Payments
8. Reports + Accounting summary
9. Account settings
10. Remaining advanced modules (inventory/tailoring/workshop)

## Integration strategy

- Replace each mock service with real service one module at a time.
- Keep feature-level service boundaries unchanged.
- Use shared `httpClient` and `ApiResponse` contracts for all modules.
- Validate each module against backend envelope before moving to the next module.
- Keep fallback mock fixtures for local UI verification during rollout.
