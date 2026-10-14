# PRD: Search Components with Sitecore Cloud SDK

**Label:** `ready-for-agent`

---

## Problem Statement

The basic-nextjs demo builder has no search functionality. Solution Engineers cannot demo content discovery workflows — a visitor searching for articles, filtering results by facets, or seeing typeahead suggestions — because there are no search components and no Sitecore Cloud SDK integration. Every demo that needs search requires building it from scratch.

## Solution

Introduce a complete search experience using the Sitecore Cloud SDK: a global SDK initialization layer, a PreviewSearch component (typeahead search bar with instant suggestions), and a SearchResults component (full-page results with dynamic facets, sorting, and pagination). Both components are simple datasource components with authorable labels and graceful degradation when Sitecore Search is not configured.

SEs drop PreviewSearch into any placeholder (typically the header) and SearchResults onto a search results page. Search configuration (domain, indexes, widgets) lives in Sitecore Search and is accessed via the Cloud SDK using the existing `SITECORE_EDGE_CONTEXT_ID`. No search-specific environment variables are needed beyond what the project already has.

When Sitecore Search isn't configured, both components render a clean placeholder state instead of breaking.

## User Stories

1. As a Solution Engineer, I want to drop a search bar component into the header, so that I can demo content discovery without building search from scratch.
2. As a Solution Engineer, I want a full search results page component with facets, so that I can show prospects how Sitecore Search delivers relevant results.
3. As a site visitor, I want to type in a search bar and see instant suggestions, so that I can find content quickly without navigating to a results page.
4. As a site visitor, I want to press Enter in the search bar and be taken to a full results page, so that I can browse all matching content.
5. As a site visitor, I want to filter search results using facets, so that I can narrow results to what's relevant to me.
6. As a site visitor, I want to sort search results, so that I can find the most relevant or newest content.
7. As a site visitor, I want to paginate through search results, so that I can browse beyond the first page of results.
8. As a site visitor, I want to see a clear message when no results match my query, so that I understand the search found nothing and can try different terms.
9. As a content author, I want to customize the search bar placeholder text (e.g., "Search articles..."), so that the search experience matches the site's tone.
10. As a content author, I want to customize the search results heading and no-results message, so that the search page feels branded and contextual.
11. As a content author, I want to configure where the search bar navigates on Enter via a General Link field, so that I can point it to whatever page has the SearchResults component.
12. As a content author, I want the search bar placeholder text to be editable in Experience Editor, so that I can preview my changes inline.
13. As a Solution Engineer, I want search components to render a graceful placeholder when Sitecore Search isn't configured, so that the site doesn't break during initial demo setup before search is wired up.
14. As a Solution Engineer, I want the Cloud SDK to initialize automatically when the site loads, so that I don't need to manually configure SDK initialization per component.
15. As a Solution Engineer, I want the Cloud SDK initialization to skip silently when the Edge Context ID is missing, so that local development without search credentials doesn't cause errors.
16. As a Solution Engineer, I want the Cloud SDK initialization to be global, so that future features (personalization, event tracking, recommendations) can use it without additional setup.
17. As a Solution Engineer, I want to place the PreviewSearch component in any placeholder (header, hero, main), so that I have flexibility in where the search bar appears.
18. As a Solution Engineer, I want facets to render dynamically from the Sitecore Search API response, so that I don't need to manually configure which facets appear — they come from the search domain configuration.
19. As a Solution Engineer, I want the SearchResults component to read the search keyphrase from a URL query parameter, so that the search bar and results page can work together via standard URL navigation.
20. As an AI agent, I want the search components registered in a capabilities registry separate from the component registry, so that cross-cutting platform features are cataloged independently from visual homepage sections.
21. As an AI agent, I want the PreviewSearch and SearchResults components to use the existing `sitecore-create-simple-component` skill, so that no new skill is needed for their Sitecore item creation.

## Implementation Decisions

### Module 1: Cloud SDK Initialization (global)

- A new client component (`'use client'`) that initializes the Sitecore Cloud SDK in a `useEffect` hook.
- Imports and chains: `CloudSDK({...}).addEvents().addSearch().initialize()`
- Requires three npm packages: `@sitecore-cloudsdk/core`, `@sitecore-cloudsdk/events`, `@sitecore-cloudsdk/search`
- Added to the app's site layout so it runs once per app load, before any search components render.
- Initialization is **conditional**: checks for `SITECORE_EDGE_CONTEXT_ID` env var. If missing, skips silently — no errors, no console noise.
- Uses `SITECORE_EDGE_CONTEXT_ID` and `NEXT_PUBLIC_DEFAULT_SITE_NAME` from existing environment variables. No new env vars needed.
- Does **not** include `addPersonalize()` — that's a future capability that can be chained on when needed.
- ADR 0003 documents why Cloud SDK was chosen over Content SDK Search API.

### Module 2: PreviewSearch Component (React + Sitecore)

- **Kind:** simple datasource component
- **Category:** search
- **Datasource template fields:**
  - `SearchPlaceholderText` (Single-Line Text) — input placeholder
  - `SearchLabel` (Single-Line Text) — accessible label / heading
  - `ResultsPageLink` (General Link) — URL to navigate on Enter
- **Cloud SDK integration:**
  - Uses `SearchWidgetItem` with widget type `rfkid_6` (preview search)
  - Uses `getWidgetData` from `@sitecore-cloudsdk/search/browser`
  - Debounces input to avoid excessive API calls
  - Renders suggestion results in a dropdown below the input
  - On Enter or suggestion click, navigates to `ResultsPageLink` URL with `?q=<keyphrase>` query param
- **Graceful degradation:**
  - If Cloud SDK is not initialized (no Edge Context ID), renders the search input visually but shows a "Search not available" message on interaction
  - If the API returns an error or no widgets, shows a fallback state
- **Sitecore editability:** `SearchPlaceholderText`, `SearchLabel`, and `ResultsPageLink` use SDK editable helpers (`Text`, `Link`). Edit-mode visibility guards applied.
- Standard UIIM patterns: extends `ComponentProps`, uses `params.styles` and `params.RenderingIdentifier`, Tailwind CSS, shadcn/ui primitives.

### Module 3: SearchResults Component (React + Sitecore)

- **Kind:** simple datasource component
- **Category:** search
- **Datasource template fields:**
  - `SearchHeading` (Single-Line Text) — e.g., "Search Results"
  - `NoResultsMessage` (Single-Line Text) — e.g., "No results found for your query."
  - `SearchPlaceholderText` (Single-Line Text) — placeholder for the search input on the results page
- **Cloud SDK integration:**
  - Uses `SearchWidgetItem` with widget type `rfkid_7` (search results)
  - Uses `getWidgetData` from `@sitecore-cloudsdk/search/browser`
  - Reads `keyphrase` from URL query parameter (`?q=...`)
  - Supports `limit` and `offset` for pagination
  - Renders facets dynamically from the API response — no authorable facet configuration
  - Supports sorting by relevance, date, or other fields returned by the API
- **Graceful degradation:**
  - Same pattern as PreviewSearch: renders structural UI with fallback message when search isn't configured
  - Shows `NoResultsMessage` from datasource when query returns zero results
- **Sitecore editability:** `SearchHeading`, `NoResultsMessage`, and `SearchPlaceholderText` use SDK editable helpers.
- Standard UIIM patterns apply.

### Module 4: Capabilities Registry + Documentation (already complete)

- `capabilities-registry.yaml` created with the search capability entry, including component specs, SDK dependencies, prerequisites, and graceful degradation notes.
- `CONTEXT.md` updated with Cloud SDK, PreviewSearch, SearchResults, Search Domain, and Capabilities Registry definitions.
- ADR 0003 documents the Cloud SDK vs Content SDK Search API decision.

### Sitecore Items (per component)

Both components follow the existing `sitecore-create-simple-component` skill:
- Datasource template with base templates (Standard Template + Grid Parameters)
- Template section + fields with explicit `Type`
- `__Standard Values`
- Folder template with `__Standard Values` and insert options
- Datasource folder under `dataRoot/` with insert options on the folder instance
- Example datasource item
- Rendering Parameters template with standard 4 base templates
- JSON Rendering with `componentName`, `Parameters Template`, datasource template/location
- Registered in Available Renderings

### Component Map

Both components registered in `.sitecore/component-map.ts` and `.sitecore/component-map.client.ts`. Both are `componentType: 'client'` since they use Cloud SDK browser modules and `useState`/`useEffect`.

## Testing Decisions

### What makes a good test

Tests verify external behavior from the component consumer's perspective: what renders, what's visible, what's hidden, how interactions behave. Tests do NOT verify Cloud SDK internal state, exact API request shapes, or CSS class names.

### Prior art

The `src/__tests__/components/article-hero/` and `src/__tests__/components/article-body/` test suites established the testing pattern: mock props file with multiple combinations, SDK components mocked as simple HTML with `data-testid`, `@testing-library/react` with `render`, `screen`, `fireEvent`, `waitFor`.

### Modules to test

**CloudSDKInit:**
- Calls `CloudSDK().addEvents().addSearch().initialize()` when Edge Context ID is available
- Does not call initialization when Edge Context ID is missing
- Renders null (no visible UI)
- Mock the Cloud SDK module to verify initialization calls

**PreviewSearch:**
- Renders search input with placeholder text from datasource
- Shows suggestion dropdown when API returns results
- Hides suggestion dropdown when input is empty
- Navigates to results page URL (from `ResultsPageLink`) with `?q=` query param on Enter
- Shows fallback state when Cloud SDK is not initialized
- Handles API errors gracefully
- Renders empty-state fallback when no datasource
- All datasource fields editable in editing mode
- Accessible: input has label, dropdown has appropriate ARIA attributes

**SearchResults:**
- Renders heading and search input from datasource
- Displays search results from API response
- Renders facets dynamically from API response
- Shows `NoResultsMessage` when query returns zero results
- Shows fallback state when Cloud SDK is not initialized
- Handles pagination (limit/offset)
- Reads keyphrase from URL query parameter
- Renders empty-state fallback when no datasource
- All datasource fields editable in editing mode

### Test file structure

```
src/__tests__/components/cloud-sdk/
  CloudSDKInit.test.tsx

src/__tests__/components/preview-search/
  PreviewSearch.mockProps.ts
  PreviewSearch.test.tsx

src/__tests__/components/search-results/
  SearchResults.mockProps.ts
  SearchResults.test.tsx
```

## Out of Scope

- **Q&A widget** — AI-generated answers to natural language questions (`rfkid_qa`). Can be added as a separate component later using the same Cloud SDK integration.
- **Recommendation widgets** — Content/product recommendations based on behavior. Future capability using the same SDK.
- **Event tracking beyond search** — The Cloud SDK `events` package is initialized (required for search) but tracking page views, clicks, etc. is out of scope for this PRD.
- **Personalization** — `addPersonalize()` is not chained in the Cloud SDK initialization. Can be added to `CloudSDKInit` when needed.
- **Search domain configuration** — Setting up crawlers, indexes, attributes, and widgets in Sitecore Search is an SE task, not a component concern.
- **Variants** — Both components ship with `Default` only. Additional variants (Expanded preview, TopFilters results) can be added later via `sitecore-add-variants`.
- **Server-side search** — Both components use the Cloud SDK browser module. Server-side rendering of search results (e.g., for SEO) is out of scope.
- **Search analytics dashboard** — Viewing search analytics is done in the Sitecore Search UI, not in the Next.js app.

## Further Notes

- The Cloud SDK initialization is a **platform investment**, not just a search concern. By installing `core` and `events` globally, future capabilities (personalization, tracking, recommendations) can be enabled by adding one line (`.addPersonalize()`) to `CloudSDKInit` and installing the package — no architectural changes needed.
- The search components use `rfkid_6` (preview) and `rfkid_7` (results) — these are standard Sitecore Search widget IDs. Custom widget IDs configured in Sitecore Search would require the SE to update the component code or add a rendering parameter. For demos, the standard IDs are sufficient.
- Facets are rendered dynamically from the API response. This means the component automatically adapts to whatever facets are configured in the Sitecore Search domain — no code changes needed when facets change.
- The `ResultsPageLink` field on PreviewSearch uses a General Link rather than hardcoding a `/search` path. This lets the SE point to whatever page they've placed the SearchResults component on, which could be `/search`, `/results`, or any localized path.
- ADR 0003 documents why the Cloud SDK was chosen over the Content SDK Search API and other alternatives.
