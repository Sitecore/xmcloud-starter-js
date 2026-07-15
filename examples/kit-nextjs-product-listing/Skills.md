# Skills: This Starter (SYNC – Product Listing)

## Purpose

This file provides a starter-specific capability view for the **kit-nextjs-product-listing** (SYNC) app. Use it with the repository skills map to choose the right patterns for product and catalog features, layout-driven rendering, and editor-safe components.

---

## Repository capability map

Use the repository-level skill areas as the primary capability reference:

**[Repository Skills (docs/Skills.md)](../../docs/Skills.md)**

---

## This starter in short

- **Focus:** Product listing, catalog, product-detail experiences, and product-related filtering.
- **Router:** Next.js App Router (`src/app/`).
- **Route pattern:** Catch-all at `src/app/[site]/[locale]/[[...path]]/page.tsx`; pass `site` and `locale` into layout fetch. Uses next-intl; config in `src/i18n/`.
- **Capabilities:** All repo skill areas apply. Product listing and filtering, product data and variants, and any catalog-specific APIs or endpoints follow this starter’s patterns—use this Skills file and the repo Skills together when working on product or listing features.

---

## Starter-specific notes

Apply all **When to use**, **How to perform**, and **Hard rules** from the [Repository Skills](../../docs/Skills.md) (Component Registration, Data Strategy, Local Dev, Editing & Preview, Routing, Project Structure). In this starter only:

- **Product listing / catalog:** Fetch catalog or layout data at the catch-all page; pass as props into listing components. Do not fetch catalog or layout inside child listing components. Use existing product and listing components and types; extend rather than replace.
- **Product data and variants:** Use this starter’s product data structures and field patterns; pass only serializable product data to client components. Do not add product fetches inside non-route components.
- **Component maps:** Use server map (`.sitecore/component-map.ts`) and client map (`.sitecore/component-map.client.ts`); register with the same name as in the layout.
- **Project structure:** `src/app/`, `src/components/`, `src/lib/`, `src/i18n/`; follow existing patterns for new product or listing components.
- **Local dev:** Copy `.env.remote.example` to `.env.local` in this folder; set XM Cloud and any catalog/API values; run the dev server from this folder.

---

## Stop conditions (for this starter)

- App loads with connected XM Cloud content locally.
- Product listing and catalog pages resolve and render from layout data.
- Product data and variants display correctly; filtering/listing behavior matches starter patterns.
- New or updated components resolve from component maps without binding errors.
- Editing and preview remain functional for product and listing components.

---

## Related

- [This starter's README](README.md)
- [Root README — How to run a starter locally](../../README.md#how-to-run-a-nextjs-starter-locally)
- [Root README — Getting started guide](../../README.md#getting-started-guide)
