# PRD: Search Experience — OOTB SitecoreAI Approach

**Label:** `ready-for-agent`

**Supersedes:** PRD: Search Components with Sitecore Cloud SDK (`docs/adr/prd-search-components.md`)

---

## Problem Statement

The basic-nextjs demo builder has no search functionality. An initial attempt used custom components with the Sitecore Cloud SDK (`@sitecore-cloudsdk/search`), but this bypasses SitecoreAI's built-in search experience capabilities. SitecoreAI provides an OOTB SearchExperience component in the starter kit that integrates natively with Page Builder, the Search Configuration Manager Marketplace app, and the Content SDK search hooks — requiring no custom search logic, no Cloud SDK dependency, and offering visual field mapping directly in the authoring UI.

The custom Cloud SDK approach must be removed and replaced with the OOTB SitecoreAI search experience.

## Solution

Copy the OOTB `SearchExperience` component from the upstream starter kit (`search-dev` branch or main), adapt it to this project's conventions, create the required Sitecore template and rendering, and remove the custom Cloud SDK search implementation.

SEs add the SearchExperience component to a page in Page Builder, assign a content item with a JSON template containing the search index ID and field mappings, then configure field mapping visually via the Search Configuration Manager Marketplace app tab. No custom search code, no Cloud SDK initialization, no separate preview/results components — one component handles the full experience.

The component uses Content SDK search hooks (`useSearch`, `useInfiniteSearch`) from `@sitecore-content-sdk/nextjs/search` — already part of the project's SDK ecosystem. Two variants are provided: `Default` (pagination) and `LoadMore` (infinite scroll).

## User Stories

1. As a Solution Engineer, I want to add a search experience to any page by dropping a single SearchExperience component in Page Builder, so that I can demo search without writing code.
2. As a Solution Engineer, I want to select a search source and map fields visually in the Search Configuration Manager tab, so that I can connect search to indexed content without editing JSON manually.
3. As a Solution Engineer, I want a Default variant with pagination and a LoadMore variant with infinite scroll, so that I can choose the UX pattern that fits the demo.
4. As a Solution Engineer, I want the search component to read the keyphrase from the URL query parameter (`?q=`), so that search results pages can be linked to directly.
5. As a content author, I want to configure the number of columns (1, 2, or 3) via rendering parameters, so that search results layout matches the page design.
6. As a content author, I want to configure results per page via rendering parameters, so that I control how many items appear.
7. As a site visitor, I want to type a search query and see results with title, description, image, and tags, so that I can find relevant content.
8. As a site visitor, I want to see a clear empty-state message when no results match, so that I understand the search found nothing.
9. As a site visitor, I want to paginate through search results, so that I can browse beyond the first page.
10. As a site visitor, I want to see a loading skeleton while results are fetching, so that I know content is coming.
11. As a Solution Engineer, I want the search component to track view and click events, so that Sitecore Search analytics work out of the box.
12. As a Solution Engineer, I want the component to show skeleton items in editing/preview mode, so that the component is visible and placeable even without live search data.
13. As a Solution Engineer, I want the custom Cloud SDK search components removed, so that there's no dead code or unnecessary dependencies in the project.
14. As a Solution Engineer, I want the Cloud SDK packages (`@sitecore-cloudsdk/core`, `events`, `search`) uninstalled, so that the bundle isn't bloated with unused dependencies.
15. As an AI agent, I want the ADR and documentation updated to reflect the pivot from Cloud SDK to OOTB search, so that future sessions don't repeat the wrong approach.

## Implementation Decisions

### Module 1: SearchExperience Component (copy + adapt from starter kit)

- Copy the `SearchExperience` component and its subcomponents (22 files) from the upstream starter kit at `examples/kit-nextjs-product-listing/src/components/search-experience/`
- Place at `src/components/search-experience/` — this is **not** a UIIM component. It's a starter kit component with its own internal structure, following the upstream pattern.
- Two named exports: `Default` (uses `useSearch` with pagination) and `LoadMore` (uses `useInfiniteSearch` with load-more button)
- The component reads its configuration from a `search` field on the datasource item — a JSON string containing `searchIndex` (GUID of the search source) and `fieldsMapping` (maps UI fields like title, description, images, tags to search index fields)
- Uses `useSearch` and `useInfiniteSearch` hooks from `@sitecore-content-sdk/nextjs/search` — part of the existing Content SDK, no new packages needed
- Uses `useTranslations` from `next-intl` for dictionary keys (results found, no results, load more, etc.)
- Tracks view and click events via Content SDK's event system
- Rendering parameters: `columns` (1/2/3), `pageSize`, `styles`, `RenderingIdentifier`
- Subcomponents: SearchInput, SearchItem (with card/list variants), SearchPagination, SearchEmptyResults, SearchError, SearchSkeletonItem
- SearchItem dynamically renders fields based on `fieldsMapping` — title, description, image, tags, link, type
- Adaption needed: verify imports work with this project's Content SDK 2.0 setup, ensure `@sitecore-content-sdk/nextjs/search` submodule is available

### Module 2: Sitecore Template + Rendering (MCP)

- **Search Experience template** at `projectTemplatesRoot/Components/Search/Search Experience`
  - One field: `Search` (Multi-Line Text or similar) — stores the JSON config with `searchIndex` and `fieldsMapping`
  - Set `Marketplace Types` field value to `Plugin` on the template — this enables the Search Configuration Manager tab in Page Builder
  - Set `Source` to the Search Configuration Manager Marketplace app ID
  - `__Standard Values` created
  - Base templates: Standard Template + Grid Parameters
- **Folder template** for Search Experience items
- **Data folder** at `dataRoot/Search Experiences` with insert options
- **Rendering Parameters template** with `columns` and `pageSize` fields (in addition to standard 4 base templates)
- **JSON Rendering** at `renderingsRoot/Search/SearchExperience`
  - `componentName = SearchExperience`
  - Datasource Template and Datasource Location set
  - Registered in Available Renderings
- **Example content item** with JSON template:
  ```json
  {
    "searchIndex": "",
    "fieldsMapping": {
      "tags": "",
      "images": "",
      "description": "",
      "title": "",
      "type": "",
      "link": ""
    }
  }
  ```

### Module 3: Cleanup — Remove Cloud SDK Approach

- **Uninstall packages:** `npm uninstall @sitecore-cloudsdk/core @sitecore-cloudsdk/events @sitecore-cloudsdk/search`
- **Delete files:**
  - `src/components/cloud-sdk/CloudSDKInit.tsx`
  - `src/components/uiim/search/PreviewSearch.tsx`
  - `src/components/uiim/search/SearchResults.tsx`
  - `src/__tests__/components/cloud-sdk/`
  - `src/__tests__/components/preview-search/`
  - `src/__tests__/components/search-results/`
- **Revert layout:** Remove `CloudSDKInit` from `src/app/[site]/layout.tsx`
- **Update component maps:** Remove PreviewSearch, SearchResults, CloudSDKInit entries. Add SearchExperience entry.
- **Sitecore items:** The custom PreviewSearch/SearchResults templates, folders, and renderings created via MCP can be left in place (harmless) or deleted. The custom renderings should be removed from Available Renderings when the new SearchExperience rendering is added.
- **Close PR #22** without merging

### Module 4: Documentation Updates

- **ADR 0003:** Rewrite to document the pivot — why OOTB SitecoreAI SearchExperience was chosen over Cloud SDK. The original alternatives (Content SDK Search API, Cloud SDK, Search JS SDK for React, REST APIs) are still documented, but the decision is now OOTB starter kit component.
- **CONTEXT.md:** Update Search terms — replace Cloud SDK, PreviewSearch, SearchResults definitions with SearchExperience, Search Configuration Manager, Search Source definitions
- **Capabilities registry:** Update the search capability entry to reflect the OOTB approach — no Cloud SDK dependencies, uses Content SDK search hooks, starter kit component
- **Manifest:** Update to reflect new Sitecore items, remove references to custom search items

## Testing Decisions

No dedicated tests for the SearchExperience component. It is copied from the OOTB starter kit and is Sitecore's own reference implementation. Testing is limited to:
- Build verification (`npm run build` passes)
- Smoke test (component renders in Page Builder, shows skeleton in editing mode)

## Out of Scope

- **Preview Search (typeahead)** — The OOTB SearchExperience is a full results component, not a typeahead bar. A preview/typeahead search in the header would require a separate component and is out of scope for this PRD.
- **Search Configuration Manager Marketplace app installation** — This is an environment-level operation done by an admin, not a code change.
- **Search source creation and indexing** — Creating crawlers and indexing content is an SE task in the Sitecore Search UI.
- **Custom search styling beyond Tailwind** — The component uses Tailwind, matching the project convention. Custom themes or brand-specific styling is a separate concern.
- **Faceted search** — The OOTB component does not include facets. This could be a future enhancement using the Search JS SDK for React.

## Further Notes

- The OOTB SearchExperience component is on a **phased rollout** from Sitecore. The feature may not be available in all environments yet. If the Search Configuration Manager tab doesn't appear in Page Builder, the Marketplace app needs to be installed and the environment needs to be included in the rollout.
- The first time a content item is created for the search experience, the JSON template must be manually added to the `Search` field. After that, the Search Configuration Manager tab in Page Builder handles the configuration visually.
- The component supports two layout modes via the `columns` rendering parameter: grid (2-3 columns) for card layouts, and list (1 column) for traditional search results. The SearchItem subcomponent switches between card and list variants automatically.
- The `LoadMore` variant uses `useInfiniteSearch` which progressively loads results — better for mobile and content-heavy experiences. The `Default` variant uses `useSearch` with traditional page numbers — better for SEO and direct linking to specific result pages.
- This pivot validates the importance of checking for OOTB capabilities before building custom solutions. ADR 0003 will document this learning for future reference.
