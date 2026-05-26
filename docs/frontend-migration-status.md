# Frontend Migration Status

## Migrated screens (Phase 2 batch)

1. Login (`/login`)
2. Dashboard (`/dashboard`)
3. Customers list (`/customers`)
4. Dresses list (`/dresses`)
5. Invoices list (`/invoices`)

## Pending screens

- Branches
- Categories
- Subcategories
- Delivery / Returns
- Expenses
- Cash movements
- Suppliers
- Reports
- Settings
- HR-related screens
- Inventory advanced flows

## Old UI components migrated/refactored

- `button` primitive
- `input` primitive
- `select` primitive
- `dialog` primitive
- `form` field wrapper
- `table` primitive
- `table skeleton`
- `confirmation dialog`
- shared `data-table`
- shared `search filter bar`

## Old API files not copied

No legacy API service directories were copied.

## Screens currently using mock data

- Login
- Dashboard
- Customers list
- Dresses list
- Invoices list

## Next recommended migration batch

1. Categories + Subcategories pages (CRUD with mock services)
2. Branches list page
3. Shared advanced filter components
4. Shared status badge and table actions components
