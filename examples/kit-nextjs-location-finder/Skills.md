# Skills: This Starter (Alaris – Location Finder)

## Purpose

This file provides a starter-specific capability view for the **kit-nextjs-location-finder** (Alaris) app. Use it with the repository skills map to choose the right patterns for location finder, dealer/locator, map integration, and editor-safe components.

---

## Repository capability map

Use the repository-level skill areas as the primary capability reference:

**[Repository Skills (docs/Skills.md)](../../docs/Skills.md)**

---

## This starter in short

- **Focus:** Location finder, dealer/locator, and GEO-style endpoints where implemented.
- **Router:** Next.js App Router (`src/app/`).
- **Route pattern:** Catch-all at `src/app/[site]/[locale]/[[...path]]/page.tsx`; pass `site` and `locale` into layout fetch. Uses next-intl; config in `src/i18n/`.
- **Capabilities:** All repo skill areas apply. Location search, map integration, and any dealer/locator APIs or GEO endpoints follow this starter’s patterns—use this Skills file and the repo Skills together when working on location or finder features.

---

## Starter-specific notes

Apply all **When to use**, **How to perform**, and **Hard rules** from the [Repository Skills](../../docs/Skills.md) (Component Registration, Data Strategy, Local Dev, Editing & Preview, Routing, Project Structure). In this starter only:

- **Location finder / dealer-locator:** Fetch location or layout data at the catch-all page; pass as props into finder components. Do not fetch location or layout inside child finder components. Use existing finder and locator components and types; extend rather than replace.
- **Map and GEO:** Use this starter’s map and GEO integration patterns; pass only serializable data to client components. Do not add location/GEO fetches inside non-route components unless the starter already does so.
- **Component maps:** Use server map (`.sitecore/component-map.ts`) and client map (`.sitecore/component-map.client.ts`); register with the same name as in the layout.
- **Props sidecars:** Keep component props in sidecar files (`*.props.ts` / `*.props.tsx`) and exclude those files from component-map generation in `sitecore.cli.config.ts`. Regenerate maps after props-file changes and confirm sidecars are not registered as components.
- **Project structure:** `src/app/`, `src/components/`, `src/lib/`, `src/i18n/`; follow existing patterns for new finder or map components.
- **Local dev:** Copy `.env.remote.example` to `.env.local` in this folder; set XM Cloud and any GEO/API keys; run the dev server from this folder.

---

## Stop conditions (for this starter)

- App loads with connected XM Cloud content locally.
- Location finder and dealer/locator flows resolve and render as expected.
- Map and GEO integration (where implemented) work per starter patterns.
- New/updated components resolve from component maps without binding errors.
- Editing and preview remain functional for finder and map components.

---

## Related

- [This starter's README](README.md)
- [Root README — How to run a starter locally](../../README.md#how-to-run-a-nextjs-starter-locally)
- [Root README — Getting started guide](../../README.md#getting-started-guide)
