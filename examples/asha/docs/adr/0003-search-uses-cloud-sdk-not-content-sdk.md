# ADR 0003: Search uses OOTB SitecoreAI SearchExperience component

## Status

Superseded in part (2026-07-28)

**Update:** Progressive Knowledge Management (PKM) also enables **Sitecore Search Legacy**
(`@sitecore-search/react` + `@sitecore-search/ui`) for header Preview Search and full results,
adapted from Prospera. See `src/components/search/`, `HeaderPreviewSearch`, and
`NEXT_PUBLIC_SEARCH_*` in `.env.remote.example`. The OOTB `SearchExperience` component remains
available; choose Legacy widgets when CEC-configured Preview Search / Q&A is required.

## Context

The project needs search functionality for demos. The project uses `@sitecore-content-sdk/nextjs` for all Sitecore integration.

An initial implementation used custom components with the Sitecore Cloud SDK (`@sitecore-cloudsdk/search`), introducing three new npm dependencies and ~600 lines of custom search logic. During review, it was discovered that SitecoreAI provides an OOTB SearchExperience component in the starter kit that integrates natively with Page Builder, uses the existing Content SDK search hooks, and offers visual field mapping via the Search Configuration Manager Marketplace app.

## Decision

Search uses the **OOTB SitecoreAI SearchExperience component** copied from the upstream starter kit. The component uses `useSearch` and `useInfiniteSearch` hooks from `@sitecore-content-sdk/nextjs/search` — already part of the project's SDK ecosystem. No new packages are needed.

The component is configured via a JSON field on a datasource content item containing `searchIndex` (the source GUID) and `fieldsMapping` (maps UI fields to search index fields). Authors configure this visually in Page Builder via the Search Configuration Manager Marketplace app.

Two variants are provided: `Default` (pagination) and `LoadMore` (infinite scroll).

The custom Cloud SDK implementation was removed.

## Alternatives considered and rejected

1. **Sitecore Cloud SDK** (`@sitecore-cloudsdk/search`) — custom PreviewSearch + SearchResults components wrapping the Cloud SDK's `getWidgetData` API. **Initially implemented, then removed.** Rejected because it bypasses SitecoreAI's native Page Builder integration, requires three new npm dependencies, global SDK initialization, and ~600 lines of custom search logic — all of which the OOTB component handles for free.

2. **Content SDK Search API directly** (`@sitecore-content-sdk/search`) — using `SearchService` class for programmatic queries. Part of the existing SDK but provides only raw search without UI, field mapping, or Page Builder integration. Rejected because the OOTB component already uses the same underlying hooks (`useSearch`, `useInfiniteSearch`) with full UI and configuration.

3. **Sitecore Search REST APIs** — maximum flexibility but maximum development effort. Rejected for the same reason as the Cloud SDK: the OOTB component exists.

4. **Sitecore Search JS SDK for React** (`@sitecore/search-react`) — pre-built React components with their own widget system. Rejected because it's a separate SDK family that doesn't integrate with SitecoreAI's Page Builder or Content SDK ecosystem.

## Consequences

- **Zero new dependencies** — the component uses hooks already available in `@sitecore-content-sdk/nextjs/search`.
- **One component, not two** — SearchExperience replaces both PreviewSearch and SearchResults.
- **Visual configuration** — field mapping done in Page Builder via the Search Configuration Manager tab, not in code.
- **Starter kit alignment** — the component matches the upstream starter kit pattern exactly, making upgrades straightforward.
- The Search Configuration Manager Marketplace app must be installed in the SitecoreAI environment.
- The feature is part of a phased rollout — may not be available in all environments yet.

## Lessons learned

Always check for OOTB capabilities in the SitecoreAI platform before building custom solutions. The Cloud SDK approach was technically correct but architecturally wrong — it duplicated functionality that SitecoreAI already provides with better integration.
