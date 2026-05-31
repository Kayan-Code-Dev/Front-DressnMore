# Frontend Migration Status

## Migrated screens

### Batch 1 (completed)
1. Login (`/login`)
2. Dashboard (`/dashboard`)
3. Customers list (`/customers`)
4. Dresses list (`/dresses`)
5. Invoices list (`/invoices`)

### Batch 2 (completed)
6. Categories (`/categories`)
7. Subcategories (`/subcategories`)
8. Branches (`/branches`)
9. Deliveries (`/deliveries`)
10. Returns (`/returns`)
11. Expenses (`/expenses`)
12. Cash Movements (`/cash-movements`)
13. Suppliers (`/suppliers`)
14. Purchase Orders (`/purchase-orders`)

### Batch 3 (completed)
15. Payments (`/payments`)
16. Cashboxes (`/cashboxes`)
17. Supplier Payments (`/supplier-payments`)
18. Overdue Returns (`/overdue-returns`)
19. Reports landing (`/reports`)
20. Sales Reports (`/reports/sales`)
21. Tailoring Reports (`/reports/tailoring`)
22. Accounting Summary (`/accounting`)
23. Account Settings (`/settings/account`)

## Pending screens after Batch 3

- Inventory advanced operations pages
- Tailoring transactional screens (full flow)
- Notifications
- Factory/workshop flows
- Additional settings modules (beyond account settings)
- Any remaining tenant operational screens not yet migrated

## Shared UI/components migrated or built

- `button`, `input`, `select`, `table`, `dialog`, `form`
- shared `data-table`
- shared `pagination`
- shared `search filter bar`
- shared `table skeleton`
- shared `confirmation dialog`
- shared `empty state`
- shared app header/sidebar layout foundation

## Mock-only confirmation

All migrated screens in Batch 1 + Batch 2 + Batch 3 use mock services only.

- No real API calls were introduced.
- No old API service directories were imported.
- No legacy auth/websocket/base-url logic was restored.

## Architecture/API readiness review outcome

### Issues found
1. HTTP client header behavior needed normalization for empty session values.
2. Route-level permission guard enforcement is not yet implemented (nav-level permission filtering is implemented).
3. Backend lookups are still placeholders by design.

### Issues fixed
- HTTP client now conditionally sends `Authorization` and `X-Tenant` only when values exist.

### Issues deferred
- Route-level permission guard enforcement deferred to API integration phase.
- Lookup endpoint wiring deferred until backend freeze.

## Integration readiness notes

- Routes and sidebar navigation cover the main tenant UI surface.
- Feature-level `types + mocks + mock services + pages` is consistently implemented.
- Batch 1/2/3 modules are integration-ready to switch to real APIs progressively once backend contracts are frozen.

## Next phase recommendation after review

1. Begin controlled API integration for high-priority modules (auth/dashboard/customers/dresses/invoices).
2. Keep remaining modules on mocks until endpoint freeze per module.
3. Add route-level permission guard when permission contract is frozen.
