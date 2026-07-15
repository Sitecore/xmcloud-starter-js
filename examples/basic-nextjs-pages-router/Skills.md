# Skills: This Starter (Empty Pages Router)

## Purpose

This file provides a starter-specific capability view for the **basic-nextjs-pages-router** app. Use it with the repository skills map to choose the correct implementation pattern for Pages Router, XM Cloud layout rendering, and editor-safe component work.

---

## Repository capability map

Use the repository-level skill areas as the primary capability reference:

**[Repository Skills (docs/Skills.md)](../../docs/Skills.md)**

---

## This starter in short

- **Router:** Next.js Pages Router (`src/pages/`).
- **Type:** Minimal XM Cloud-connected starter used as a baseline for Pages Router implementations.
- **Core flow:** Route-level layout data fetch in getStaticProps (or getServerSideProps where used), component-map-driven rendering, and editor-compatible field rendering.
- **Route pattern:** Catch-all at `src/pages/[[...path]].tsx`; layout and page data are fetched in getStaticProps (and getStaticPaths for SSG). Locale comes from Next.js context (`context.locale`) and is passed into the layout client.

---

## Starter-specific notes

Apply all **When to use**, **How to perform**, and **Hard rules** from the [Repository Skills](../../docs/Skills.md) (Component Registration, Data Strategy, Local Dev, Editing & Preview, Routing, Project Structure). In this starter only:

- **Route-level data:** Fetch layout at the catch-all page (`src/pages/[[...path]].tsx`) in getStaticProps (or getServerSideProps where used) and pass `page`, `componentProps`, and optional `dictionary` into the page component; do not fetch layout inside child components. Use `context.locale` and path from `extractPath(context)` for the layout/client call.
- **Component map:** Register components in `.sitecore/component-map`; use the same name as in the layout. This starter uses a single component map for the layout pipeline.
- **Project structure:** `src/pages/`, `src/components/`, `src/Layout`, `lib/`; follow existing patterns for new components and utilities.
- **Local dev:** Copy `.env.remote.example` to `.env.local` in this folder and run the dev server from this folder.

---

## Stop conditions (for this starter)

- App loads with connected XM Cloud content locally.
- CMS-managed routes resolve through Pages Router and render expected layout.
- New/updated components resolve from component maps without binding errors.
- Editing and preview remain functional after changes.

---

## Related

- [This starter's README](README.md)
- [Root README — How to run a starter locally](../../README.md#how-to-run-a-nextjs-starter-locally)
- [Root README — Getting started guide](../../README.md#getting-started-guide)
