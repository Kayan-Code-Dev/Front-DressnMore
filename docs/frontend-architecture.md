# Frontend Architecture Foundation (Phase 2+)

This document describes the clean frontend architecture baseline prepared for future backend integration.

## Implemented structure

- `src/app`: bootstrap, providers, router, layouts.
- `src/shared`: reusable ui primitives, shared components, layout, lib, types, utils.
- `src/features`: feature-first slices with pages/components/services/types/mocks.
- `src/mocks`: fixtures and adapters.
- `src/config`: app-level config and flags.
- `src/styles`: global and theme styles.

## Key principles

1. Feature-driven modules with shared reusable foundations.
2. No dependency on legacy API or auth services.
3. Mock-first services in migration phases.
4. HTTP client prepared but not connected to real backend flows yet.
5. Session model aligned with future tenant-based backend contract.

## Session model

```ts
{
  token: string | null;
  workspace: string | null;
  tenant: unknown | null;
  user: unknown | null;
  permissions: string[];
  plan: unknown | null;
}
```

## Current routing surface

- `/login`
- `/dashboard`
- `/customers`
- `/dresses`
- `/invoices`
- `/categories`
- `/subcategories`
- `/branches`
- `/deliveries`
- `/returns`
- `/overdue-returns`
- `/payments`
- `/cashboxes`
- `/expenses`
- `/cash-movements`
- `/suppliers`
- `/purchase-orders`
- `/supplier-payments`
- `/reports`
- `/reports/sales`
- `/reports/tailoring`
- `/accounting`
- `/settings/account`

Protected routes currently rely on local mock session state.

## Architecture review summary

Review scope: structure consistency, routing consistency, sidebar permissions consistency, API readiness contracts, mock envelope consistency, shared component reuse, forbidden legacy code scan.

### Issues found

1. HTTP client previously included empty `Authorization` and `X-Tenant` headers when session values were missing.
2. Route-level permission guard is not yet implemented (navigation is permission-aware, routes are auth-protected only).
3. Lookups/endpoints for dropdown dependencies are still placeholders by design (mock phase).

### Issues fixed

- Updated `src/shared/lib/http/client.ts` to send:
  - `Accept: application/json` always
  - `Authorization` only when token exists
  - `X-Tenant` only when workspace exists

### Issues deferred

- Per-route permission guard enforcement is deferred until API integration phase (to avoid changing current mock navigation behavior unexpectedly).
- Lookup orchestration (branches, categories, statuses, users) deferred until backend endpoint freeze.

## API contract readiness

- `ApiSuccess<T>`, `ApiError`, `ApiResponse<T>`, `ValidationErrors`, pagination meta are defined in `src/shared/types/api.ts`.
- Env contract is centralized in `src/shared/lib/env/env.ts` with `.env.example`.
- API base source is `VITE_API_BASE_URL` only.
- HTTP client includes tenant-ready headers and envelope unwrapping helpers.

## Shared component consistency

- Shared table foundation: `shared/ui/table` + `shared/components/data-table`.
- Shared empty/loading/dialog/filter blocks are reused across migrated modules.
- No duplicate ad-hoc HTML table implementations were introduced in feature pages.

## Legacy code exclusion status

- No imports from legacy `src/api`, `api/v2`, `api-contants`.
- No old echo/websocket logic.
- No hardcoded old backend domain.
