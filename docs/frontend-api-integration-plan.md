# Frontend API Integration Plan

## Current stage

- Phase 2 foundation: completed.
- Migration Batch 2 screens: completed.
- Migration Batch 3 screens: completed.
- Architecture/API readiness review: completed.
- Frontend ↔ backend reconciliation: completed (documentation-only phase).
- Status: **mock services only**.

## Review-based architecture notes

- Shared API types are in place and aligned with expected backend envelope.
- HTTP client is prepared and tenant-aware.
- Header consistency fix applied: `Authorization` and `X-Tenant` are now sent only when session values exist.
- Route-level permission enforcement is deferred; current gating is auth + nav permission visibility.

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
- Lookup endpoints are frozen for branches/categories/cashboxes/users/filters.

## Final reconciliation status

Reconciliation source:
- `docs/frontend-api-readiness-matrix.md`
- `docs/frontend-backend-reconciliation.md`

Status buckets:
- **ready_to_integrate:** auth, customers, categories, subcategories, branches, dresses, invoices, deliveries, returns, expenses, cash movements, suppliers.
- **backend_partial:** payments, overdue returns, cashboxes, purchase orders, supplier payments.
- **backend_deferred:** dashboard, reports, accounting, settings.
- **frontend_adjustment_needed:** lookups orchestration/caching and module swap pattern hardening.

## Final recommended integration order (do not start yet)

This is the approved order to use once real API integration starts:

1. Auth / Session
2. Lookups
3. Customers
4. Categories / Subcategories
5. Branches
6. Dresses
7. Invoices
8. Payments
9. Delivery / Returns
10. Expenses
11. Cash movements / Cashboxes
12. Suppliers / Purchase Orders / Supplier Payments

## Deferred modules

The following modules stay mock-only for now:

- Dashboard
- Reports
- Accounting
- Full settings/account management beyond basic profile scope
- Any module/action explicitly marked `backend_partial` or `backend_deferred` in reconciliation until backend confirmation is complete

## Frontend adjustments required before real integration

1. Implement route-level permission guard enforcement (currently deferred; nav is permission-aware but routes are auth-gated only).
2. Define and implement shared lookup wiring strategy (preload, cache, invalidation, and fallback).
3. Add a shared export/download helper for binary/file responses (`blob` handling, filename parsing, error fallback).
4. Add pagination adapter safeguards for backend meta shape differences (`total_pages` vs `last_page`, naming drift).
5. Standardize service swap pattern per module (`*.mock.service.ts` -> `*.api.service.ts`) with identical method signatures.

## Integration strategy

- Do not connect real endpoints in this phase.
- Replace each mock service with real service one module at a time only when integration phase officially starts.
- Keep feature-level service boundaries unchanged.
- Use shared `httpClient` and `ApiResponse` contracts for all modules.
- Validate each module against backend envelope before moving to the next module.
- Keep fallback mock fixtures for local UI verification during rollout.
