# Frontend Architecture Foundation (Phase 2)

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
3. Mock-first services in this phase.
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

## Routing baseline

- `/login`
- `/`
- `/dashboard`
- `/customers`
- `/dresses`
- `/invoices`

Protected routes currently rely on local mock session state.
