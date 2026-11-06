# ADR 0015: A publish webhook revalidates every page

## Status

Accepted (2026-11-06). Environment: `sitecore-demo` (`sitecore-live-demo.vercel.app`). Builds on the 60-second ISR on the catch-all page (commit `8c8f60e1`).

## Context

- **Pages are cached HTML.** They're rendered from Experience Edge and cached by Vercel. Since `8c8f60e1` they re-render at most 60 seconds after their last render. Before that, they changed only on redeploy.
- **Edge can call a webhook after each publish** (Admin API `POST /api/admin/v1/webhooks`). There are two modes:
  - `OnEnd`: one debounced call after the publish job and Edge's own cache purge.
  - `OnUpdate`: the same call, plus the changed entities.
- **Edge drops failing webhooks.** It disables a webhook after 10 consecutive failures, and a call fails if it doesn't answer within 30 seconds.
- **The SDK's handler doesn't fit this app.** Content SDK 2.4.1 ships `createSitecoreRevalidateRouteHandler`, which maps `OnUpdate` rows to `sc:item:<id>:<locale>` and `sc:dict:<site>:<locale>` tags and calls `revalidateTag`. Those tags only exist when page reads register them through Next 16 Cache Components (`use cache` + `cacheTag`). This app doesn't use Cache Components, so the handler would clear nothing.

## Decision

1. **`POST /api/revalidate`** (`src/app/api/revalidate/route.ts`):
   - It checks the `x-revalidate-secret` header against `SITECORE_REVALIDATE_SECRET` in constant time. A wrong or missing header gets 401; with no configured secret the route answers 503 and is never open.
   - It calls `revalidatePath('/', 'layout')`, so every page re-renders from Edge on its next request.
   - It answers immediately and accepts any body.
2. **Clear everything, not the changed items' pages.**
   - A page's HTML depends on many items: its route, datasources, partial designs and the Dictionary, in 5 languages.
   - The site is small (about 35 pages × 5 languages), and pages re-render lazily, only when requested.
3. **One `OnEnd` webhook per environment**, created with `npm run edge:webhook -- create --site-url https://<host>`.
   - The script uses an Edge administration client (SitecoreAI Deploy) from `.env.local`.
   - It sends the secret as a webhook header and never prints it.
4. **Keep `revalidate = 60` as a safety net** for a missed or disabled webhook. It can be raised (for example to 3600) once the webhook has proved reliable.

## Consequences

- Published content reaches the live site within seconds, in every language.
- **Setup per environment:** an Edge administration client, the `SITECORE_REVALIDATE_SECRET` Vercel env var (the same value as in `.env.local`), a deploy, then `edge:webhook create`.
- **Every publish re-renders the whole site lazily.** On a much larger site, move to the SDK's tag-based handler with Cache Components.
- **The webhook targets one host URL.** A new production domain needs a new webhook (`edge:webhook delete <id>` and `create`).
- **Check with:** `npm run edge:webhook -- ping --site-url https://<host>` (expects 200) and `npm run edge:webhook -- list` (look for `disabled: true` and the recent `lastRuns`).
