# Skills: This Starter (Empty App Router)

## Purpose

This file provides a starter-specific capability view for the **basic-nextjs** app. Use it with the repository skills map to quickly choose the correct implementation pattern for App Router, XM Cloud layout rendering, and editor-safe component work.

---

## Repository capability map

Use the repository-level skill areas as the primary capability reference:

**[Repository Skills (docs/Skills.md)](../../docs/Skills.md)**

---

## This starter in short

- **Router:** Next.js App Router (`src/app/`).
- **Type:** Minimal XM Cloud-connected starter used as a baseline for new implementations.
- **Core flow:** Route-level layout data fetch, component-map-driven rendering, and editor-compatible field rendering.
- **Route pattern:** Catch-all at `src/app/[site]/[locale]/[[...path]]/page.tsx`; `site` and `locale` are dynamic segments—pass them into layout/data fetch and i18n.
- **i18n:** Uses next-intl; locale comes from the route. Config in `src/i18n/` (routing, request); use `setRequestLocale` and pass `site`/`locale` where the starter expects them.

---

## Starter-specific notes

Apply all **When to use**, **How to perform**, and **Hard rules** from the [Repository Skills](../../docs/Skills.md) (Component Registration, Data Strategy, Local Dev, Editing & Preview, Routing, Project Structure). In this starter only:

- **Route-level data:** Fetch layout at the catch-all page (`src/app/[site]/[locale]/[[...path]]/page.tsx`) and pass into components; do not fetch layout inside child components. Use `site` and `locale` from route params for the layout/client call.
- **Component maps:** Use server map (`.sitecore/component-map.ts`) and client map (`.sitecore/component-map.client.ts`); register with the same name as in the layout.
- **Project structure:** `src/app/`, `src/components/`, `src/lib/`, `src/i18n/`; follow existing patterns for new components and utilities.
- **Local dev:** Copy `.env.remote.example` to `.env.local` in this folder and run the dev server from this folder.

---

## Stop conditions (for this starter)

- App loads with connected XM Cloud content locally.
- CMS-managed routes resolve through App Router and render expected layout.
- New/updated components resolve from component maps without binding errors.
- Editing and preview remain functional after changes.

---

## Related

- [This starter's README](README.md)
- [Root README — How to run a starter locally](../../README.md#how-to-run-a-nextjs-starter-locally)
- [Root README — Getting started guide](../../README.md#getting-started-guide)
