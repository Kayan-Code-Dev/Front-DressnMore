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

## Pending screens after Batch 2

- Reports
- Settings
- HR-related modules
- Inventory advanced operations pages
- Payments dedicated screen
- Tailoring dedicated screens
- Notifications
- Factory/workshop flows

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

All migrated screens in Batch 1 + Batch 2 use mock services only.

- No real API calls were introduced.
- No old API service directories were imported.
- No legacy auth/websocket/base-url logic was restored.

## Old API files not copied

No legacy `src/api/*` or `api/v2/*` services were copied into feature modules.

## Integration readiness notes

- Routes and nav are now in place for core operations modules.
- Feature-level `types + mocks + mock services + pages` structure is in place.
- Modules are ready to switch from mock services to real services one module at a time once backend contracts are frozen.

## Next recommended migration batch

1. Reports and settings pages (UI + mocks)
2. Payments dedicated page migration
3. Tailoring pages migration
4. Inventory advanced pages migration
