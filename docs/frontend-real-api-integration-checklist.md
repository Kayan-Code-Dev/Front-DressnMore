# Frontend Real API Integration Checklist

This checklist is for the **actual integration phase** only.  
Current project status remains mock-only.

## 1) Environment setup

- [ ] `VITE_API_BASE_URL` points to the correct backend environment.
- [ ] `.env` is aligned with `.env.example`.
- [ ] Environment-specific tenant/workspace configuration is documented.
- [ ] Dev/stage environment response envelopes are confirmed identical.

## 2) Auth token and session handling

- [ ] Login response maps to session store shape: `token`, `workspace`, `tenant`, `user`, `permissions`, `plan`.
- [ ] Token persistence and logout clearing behavior are validated.
- [ ] Session restore on app reload is validated.
- [ ] Unauthorized/expired session behavior is handled consistently.

## 3) X-Tenant handling

- [ ] `X-Tenant` is sent only when workspace exists.
- [ ] `Authorization` is sent only when token exists.
- [ ] `Accept: application/json` is always sent.
- [ ] Cross-tenant switch flow updates headers and invalidates stale cache.

## 4) API client usage

- [ ] All new real services use shared `httpClient` (`src/shared/lib/http/client.ts`).
- [ ] Services consume shared `ApiResponse`/`ApiError` types.
- [ ] Module services preserve the same signatures as existing mock services.
- [ ] No direct `fetch`/custom ad-hoc client usage in feature pages.

## 5) Error toast and validation display

- [ ] Global API errors map to existing toast/message UX.
- [ ] Validation errors (`422`-style) map to field-level error rendering where applicable.
- [ ] Permission errors (`403`) display clear user-facing messaging.
- [ ] Not-found and conflict states have consistent fallback UI.

## 6) Pagination handling

- [ ] Backend pagination meta is mapped to shared table pagination shape.
- [ ] Adapter handles `last_page`/`total_pages` compatibility safely.
- [ ] Search/filter query params are preserved across page changes.
- [ ] Empty-state behavior is consistent between first page and filtered pages.

## 7) Lookup preload and caching

- [ ] Shared lookup service is introduced (or equivalent centralized strategy).
- [ ] Common lookups are cached and reused across modules.
- [ ] Cache invalidation strategy is documented (tenant switch, mutations, TTL/manual refresh).
- [ ] Lookup fetch errors degrade gracefully (fallback empty options + notice).

## 8) Export/download handler

- [ ] Shared export helper handles blob responses.
- [ ] Filename extraction from headers is supported.
- [ ] Errors in export flow are surfaced to users consistently.
- [ ] Export behavior is verified for all export-enabled modules.

## 9) Permission route guard

- [ ] Route-level permission guard is implemented and wired with existing permissions list.
- [ ] Guard behavior is consistent with sidebar visibility rules.
- [ ] Unauthorized route navigation has safe redirect/fallback behavior.
- [ ] Guard supports nested report/settings routes where applicable.

## 10) Module service swap pattern

For each integrated module:

- [ ] Keep page/component contracts unchanged.
- [ ] Replace only the service implementation (`*.mock.service.ts` -> `*.api.service.ts`).
- [ ] Keep mock fixtures available for fallback/testing during rollout.
- [ ] Document per-module endpoint map and any adapter logic.

## 11) Testing checklist per module

- [ ] List page load (default filters).
- [ ] Search/filter behavior.
- [ ] Pagination navigation.
- [ ] Create/update/delete or action flows (when applicable).
- [ ] Permission-denied behavior.
- [ ] Validation error rendering.
- [ ] Empty/loading/error states.
- [ ] Regression check: no UI behavior drift from mock baseline unless explicitly approved.
