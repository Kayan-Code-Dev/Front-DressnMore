---
name: testing-dressnmore-frontend
description: Test the DressnMore tenant frontend (Front-DressnMore) locally. Use when verifying UI design migration, layout, sidebar, topbar, dashboard, or login page changes.
---

# Testing DressnMore Tenant Frontend

## Prerequisites

- Node.js 22+
- Playwright (install locally: `npm install playwright` in a temp directory)
- Chrome browser running with CDP on `http://localhost:29229`

## Running the Dev Server

```bash
cd /home/ubuntu/repos/Front-DressnMore
npm install
npm run dev
# Vite starts on port 5173 (or next available port like 5174)
```

## Login Bypass

The app uses real auth (`isModuleLive("auth")` returns `true` when `auth: true` in feature flags). The session restore hook (`useSessionRestore`) calls `GET /api/tenant/me` to validate tokens. If this fails (CORS from localhost, invalid token), the session is cleared and user is redirected to `/login`.

**To bypass login without modifying files**, use Playwright CDP to intercept API calls:

```javascript
import { chromium } from 'playwright';

const browser = await chromium.connectOverCDP('http://localhost:29229');
const context = browser.contexts()[0];
const page = context.pages()[0];

// IMPORTANT: Use a SINGLE route handler for all API calls.
// Multiple handlers with overlapping patterns cause ordering issues
// (last registered matches first in Playwright).
await page.route('**/api/tenant/**', async (route) => {
  const url = route.request().url();
  if (url.includes('/api/tenant/me')) {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        message: 'OK',
        data: {
          tenant: { slug: 'test', name: 'Test Tenant', id: 1 },
          user: { name: 'المدير العام', email: 'admin@test.com', id: 1 },
          permissions: ['dashboard.view','customers.view','dresses.view','invoices.view',
            'payments.view','expenses.view','cashboxes.view','cash-movements.view',
            'suppliers.view','purchase-orders.view','branches.view','categories.view'],
          plan: null,
        },
        meta: null,
      }),
    });
  } else {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: [], meta: { current_page: 1, last_page: 1, per_page: 15, total: 0 } }),
    });
  }
});

// Set session in localStorage
await page.evaluate(() => {
  localStorage.setItem('dressnmore.session', JSON.stringify({
    token: 'mock-test-token',
    workspace: 'test',
    tenant: { slug: 'test', name: 'Test Tenant', id: 1 },
    user: { name: 'المدير العام', email: 'admin@test.com', id: 1 },
    permissions: ['dashboard.view','customers.view','dresses.view','invoices.view',
      'payments.view','expenses.view','cashboxes.view','cash-movements.view',
      'suppliers.view','purchase-orders.view','branches.view','categories.view'],
    plan: null,
  }));
});

await page.goto('http://localhost:5174/dashboard', { waitUntil: 'networkidle' });
```

### Common Pitfalls

1. **Playwright route ordering**: If you register multiple `page.route()` handlers with overlapping patterns, the LAST registered one matches first. Use a single handler with `if/else` inside.
2. **fetch interceptor via console doesn't persist**: `window.fetch` overrides are lost on page navigation. Use Playwright CDP route interception instead.
3. **Session cleared on reload**: The `useSessionRestore` hook validates the token on every page load. Without API interception, mock sessions get cleared immediately.
4. **CORS from localhost**: The real API (`api.dressnmore.it.com` or `staging-api.dressnmore.it.com`) blocks requests from `localhost`. This is expected — use Playwright interception.

## Key UI Elements to Test

### Layout
- RTL direction (`direction: rtl`)
- Sidebar on RIGHT side, fixed position
- Topbar fixed at top, 60px height (`--topbar-height`)
- Main content uses `marginRight` matching sidebar width
- Background: `#F0F9FF` (`--color-bg`)

### Sidebar
- Expanded: 260px width
- Collapsed: 70px width (icons only)
- Toggle button is small (28x28px) — might need Playwright click
- Blue gradient: `linear-gradient(160deg, #0369A1, #0284C7, #0EA5E9)`
- Active item: `rgba(255,255,255,0.22)` background
- Auto-collapse on tablet (768-1280px), mobile overlay (<1024px)

### Dashboard
- 6 KPI cards in grid (`grid-cols-2 md:grid-cols-3 xl:grid-cols-6`)
- Dark growth section (`#0A1628 → #0F1C36`)
- Cashbox overview with blue gradient balance card
- Charts and recent orders show placeholder text (dashboard API not integrated)

## Design Reference

The approved design ZIP is at `/home/ubuntu/zip-design-ref/dressnmore/` (if extracted). Key differences between ZIP and implementation:
- ZIP uses remixicon (`ri-*`), implementation uses lucide-react
- ZIP has full notification panel in topbar, implementation is simplified
- ZIP has ECharts, implementation has placeholder text

## Build Verification

```bash
npm run lint    # Should be 0 errors
npm run build   # Runs tsc -b && vite build
```

## API Files That Must Not Change

Verify with:
```bash
git diff --name-only <base-branch>..HEAD -- \
  src/shared/lib/http/ \
  src/shared/lib/auth/session.store.ts \
  src/config/feature-flags.ts \
  src/config/api.ts \
  src/features/*/services/*.ts
```

## Devin Secrets Needed

For real API testing (not mock bypass):
- `DRESSNMORE_WORKSPACE` — tenant workspace slug
- `DRESSNMORE_EMAIL` — login email
- `DRESSNMORE_PASSWORD` — login password

For visual-only testing with mock bypass, no secrets are needed.
