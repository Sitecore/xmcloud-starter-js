# Skills: This Starter (Solterra & Co. – Article / Editorial)

## Purpose

This file provides a starter-specific capability view for the **kit-nextjs-article-starter** (Solterra & Co.) app. Use it with the repository skills map to choose the right patterns for editorial content, article layouts, localization, and editor-safe components.

---

## Repository capability map

Use the repository-level skill areas as the primary capability reference:

**[Repository Skills (docs/Skills.md)](../../docs/Skills.md)**

---

## This starter in short

- **Focus:** Editorial content, article layouts, modular content blocks, and localization (e.g. en, en-CA).
- **Router:** Next.js App Router (`src/app/`).
- **Route pattern:** Catch-all at `src/app/[site]/[locale]/[[...path]]/page.tsx`; pass `site` and `locale` into layout fetch and i18n. Uses next-intl; config in `src/i18n/`.
- **Dictionary:** Central keys in `src/variables/dictionary.tsx` (`dictionaryKeys`); component-level dictionary files (e.g. `article-header.dictionary`, `subscription-banner.dictionary`). Use `useI18n` and `t(dictionaryKeys.*)` for localized copy; do not hardcode locale strings.
- **Capabilities:** All repo skill areas apply. Article and listing pages, personalized homepage patterns, and dictionary/localization follow this starter’s conventions—use this Skills file and the repo Skills together when working on editorial or localized content.

---

## Starter-specific notes

Apply all **When to use**, **How to perform**, and **Hard rules** from the [Repository Skills](../../docs/Skills.md) (Component Registration, Data Strategy, Local Dev, Editing & Preview, Routing, Project Structure). In this starter only:

- **Editorial / article:** Fetch layout at the catch-all page; pass data into article and listing components. Do not fetch layout or article data inside child components. Use existing article components and types; extend rather than replace.
- **Localization and dictionary:** Add or change keys in `src/variables/dictionary.tsx` and (where used) component-level dictionary files; use `t(dictionaryKeys.*)` in components. Pass locale from route params; keep dictionary data serializable across server/client.
- **Component maps:** Use server map (`.sitecore/component-map.ts`) and client map (`.sitecore/component-map.client.ts`); register with the same name as in the layout.
- **Project structure:** `src/app/`, `src/components/`, `src/lib/`, `src/i18n/`, `src/variables/` (dictionary keys); follow existing patterns for new editorial components and dictionary keys.
- **Local dev:** Copy `.env.remote.example` to `.env.local` in this folder and run the dev server from this folder.

---

## Stop conditions (for this starter)

- App loads with connected XM Cloud content locally.
- Article and editorial pages resolve and render from layout data.
- Localization and dictionary behavior match starter patterns.
- New/updated components resolve from component maps without binding errors.
- Editing and preview remain functional for article and editorial components.

---

## Related

- [This starter's README](README.md)
- [Root README — How to run a starter locally](../../README.md#how-to-run-a-nextjs-starter-locally)
- [Root README — Getting started guide](../../README.md#getting-started-guide)
