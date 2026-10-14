# PRD: SearchExperienceV2 — Proper Template Fields, Project Conventions, Design System

**Label:** `ready-for-agent`

**Supersedes:** PRD: Search Experience — OOTB SitecoreAI Approach (`docs/adr/prd-search-ootb.md`) for new development. The original SearchExperience component is preserved for comparison.

**ADR:** `docs/adr/0004-search-experience-v2-proper-fields.md`

---

## Problem Statement

The OOTB SearchExperience component (V1), copied from the SitecoreAI starter kit, works but conflicts with project conventions in several ways:

1. **JSON blob configuration** — Search index ID and field mappings are stored as a JSON string in a single Multi-Line Text field. This bypasses Sitecore's template system, makes configuration invisible to standard queries, and depends on the Search Configuration Manager Marketplace app (phased rollout, not reliably available) for a decent authoring experience. SEs who don't have the Marketplace app must hand-edit JSON.

2. **Hardcoded product types** — The `SearchDocument` type contains SYNC audio gear fields (`Price`, `ProductName`, `AmpPower`) that are meaningless in a multi-demo context.

3. **Non-conforming component structure** — Props don't extend `ComponentProps`, the component lives outside `src/components/uiim/`, variants are split across two files, and 7 tiny files make up a single SearchItem.

4. **Generic styling** — Hardcoded `gray-*`, `blue-500`, `red-600` classes instead of the project's theme tokens. No shadcn/ui primitives. Inline SVGs instead of Lucide icons.

5. **Accessibility gaps** — No `role="search"`, no `aria-current="page"` on active pagination, no `aria-live` on results count, no semantic `<nav>` around pagination.

6. **Incomplete URL state** — Only `?q=` syncs to the URL. Page number is local state, so deep-linking to a specific results page is impossible.

## Solution

Create **SearchExperienceV2** as a new, project-owned component that replaces the JSON configuration with 7 individual Sitecore template fields, conforms to all project conventions (`ComponentProps`, UIIM file placement, named exports, Locality of Behavior), and uses the project's design system (shadcn/ui primitives, theme tokens, Lucide icons).

The original SearchExperience is preserved at `src/components/search-experience/` for side-by-side comparison. Both components coexist — the component map points to V2.

SEs add SearchExperienceV2 to a page in Page Builder, create a datasource item with 7 clearly labeled fields (SearchIndex, TitleMapping, DescriptionMapping, ImageMapping, TagsMapping, LinkMapping, TypeMapping), and configure the search source and field mapping directly — no Marketplace app, no JSON editing.

## User Stories

1. As a Solution Engineer, I want search configuration stored in individual Sitecore template fields instead of a JSON blob, so that I can configure search without editing JSON or depending on the Search Configuration Manager Marketplace app.
2. As a Solution Engineer, I want a `SearchIndex` field where I paste the search source GUID, so that connecting to a search source is a single field edit.
3. As a Solution Engineer, I want individual `TitleMapping`, `DescriptionMapping`, `ImageMapping`, `TagsMapping`, `LinkMapping`, and `TypeMapping` fields, so that I can map search index fields to UI slots without understanding JSON structure.
4. As a Solution Engineer, I want each mapping field to have help text explaining what value to enter (a search index field name), so that configuration is self-documenting.
5. As a Solution Engineer, I want the component to use the project's theme tokens, so that search results match whatever client theme is active without manual style overrides.
6. As a Solution Engineer, I want to choose between Default (pagination) and LoadMore (infinite scroll) variants, so that I can pick the UX pattern that fits the demo.
7. As a Solution Engineer, I want the Default variant to sync both `?q=` and `?page=` to the URL, so that I can share links to specific search result pages.
8. As a Solution Engineer, I want the LoadMore variant to sync only `?q=` to the URL, so that the search query is shareable without meaningless page state.
9. As a Solution Engineer, I want to configure the number of columns (1, 2, or 3) via rendering parameters, so that the results grid matches the page layout.
10. As a Solution Engineer, I want to configure results per page via rendering parameters, so that I control how many items appear before pagination or load-more.
11. As a site visitor, I want to type a search query and see results with title, description, image, tags, and a link, so that I can find relevant content.
12. As a site visitor, I want to clear my search query with a single click, so that I can start a new search easily.
13. As a site visitor, I want to see a clear empty-state message when no results match, so that I understand the search found nothing.
14. As a site visitor, I want to see a loading skeleton while results are fetching, so that I know content is coming.
15. As a site visitor, I want to paginate through search results with previous/next buttons and page numbers, so that I can browse beyond the first page.
16. As a site visitor, I want the pagination to show an active state on the current page number, so that I know where I am in the results.
17. As a site visitor, I want to use keyboard navigation to move through search input, results, and pagination, so that the experience is accessible without a mouse.
18. As a site visitor using a screen reader, I want the results count announced when it changes, so that I know how many results matched my query.
19. As a site visitor using a screen reader, I want the search area identified as a search landmark, so that I can navigate to it directly.
20. As a site visitor using a screen reader, I want the pagination identified as a navigation landmark with a label, so that I can distinguish it from other navigation.
21. As a developer, I want the component props to extend `ComponentProps`, so that `params.styles`, `params.RenderingIdentifier`, and `page.mode.isEditing` work consistently with all other UIIM components.
22. As a developer, I want `SearchDocument` to use a minimal base type with an index signature, so that the component works with any search index schema without hardcoded product fields.
23. As a developer, I want search view and click events tracked automatically, so that Sitecore Search analytics work without additional wiring.
24. As a developer, I want the component to show skeleton items in editing and preview mode, so that the component is visible and placeable even without live search data.
25. As a developer, I want the original SearchExperience (V1) preserved unchanged, so that I can compare the two implementations side by side.

## Implementation Decisions

### Module 1: shadcn/ui Primitives (prerequisite)

The project rules reference shadcn/ui components from `@/components/ui/*`, but no primitives are currently installed — `src/components/ui/` does not exist. Before building V2, install the required shadcn/ui primitives:

- `Card` (CardHeader, CardContent) — for search result items (card and list frames)
- `Button` — for pagination controls, load-more, clear search, error retry
- `Input` — for the search text input
- `Badge` — for tags and category labels on search results

These are installed via the shadcn CLI, which creates component files in `src/components/ui/`. Once installed, they're available to V2 and all future UIIM components.

### Module 2: SearchExperienceV2 Main Component

A single file at `src/components/uiim/search/SearchExperienceV2.tsx` containing:

**Types (in `search-components/models.ts`):**

- `SearchExperienceFields` — interface with 7 optional `Field<string>` properties: `SearchIndex`, `TitleMapping`, `DescriptionMapping`, `ImageMapping`, `TagsMapping`, `LinkMapping`, `TypeMapping`
- `SearchExperienceProps` — extends `ComponentProps` with `fields: SearchExperienceFields`
- `SearchDocument` — minimal base type: `{ sc_item_id: string; [key: string]: string | string[] }`
- `SearchFieldsMapping` — interface mapping UI slot names to `SearchDocument` keys (unchanged in shape, but keys reference `string` instead of `keyof SearchDocument`)

**Main file structure:**

- `SearchLayout` — non-exported local helper component encapsulating the shared layout between variants: wrapper div with `params.styles` and `params.RenderingIdentifier`, max-width container, SearchInput, results count with `aria-live="polite"`, error state, empty state, results grid, and a `footer` slot for variant-specific controls (pagination or load-more button)
- `export const Default` — calls `useSearch` hook, passes pagination footer to `SearchLayout`
- `export const LoadMore` — calls `useInfiniteSearch` hook, passes load-more button footer to `SearchLayout`
- Both variants read mapping fields directly from `props.fields` (e.g., `props.fields.TitleMapping?.value`) and construct a `SearchFieldsMapping` object — no JSON parsing
- `pageSize` and `columns` derived inline from `params` with defaults (no `useParams` hook)
- Editing mode accessed via `props.page?.mode?.isEditing` from `ComponentProps` — no redundant `useSitecore()` call in the main component

**Component map:**

- Add `SearchExperienceV2` entry to `.sitecore/component-map.ts` pointing to the new file

### Module 3: Subcomponents (in `search-components/` subfolder)

All subcomponents live in `src/components/uiim/search/search-components/`. Each is rewritten from its V1 equivalent — not modified in place.

**SearchItem.tsx** — consolidates the 7-file `SearchItem/` subfolder into one file:
- `SearchItem` component that receives a `SearchDocument`, a `SearchFieldsMapping`, and a variant (`card` | `list`)
- Local helper renderers for title, summary, category, tags, image, and link — each ~5-15 lines
- Uses shadcn `Badge` for tags and category
- Uses shadcn `Card` frames (via `SearchItemCommon`) for card variant
- The `getField` utility function stays internal to this file

**SearchInput.tsx:**
- Uses shadcn `Input` instead of raw `<input>`
- Uses Lucide `Search` and `X` icons instead of inline SVGs
- Wrapped in a container with `role="search"`
- `aria-label` on the input

**SearchPagination.tsx:**
- Uses shadcn `Button` for all page buttons (previous, next, page numbers)
- Uses Lucide `ChevronLeft` and `ChevronRight` icons
- Wrapped in `<nav aria-label="Search results pagination">`
- `aria-current="page"` on the active page button
- Page calculation logic unchanged

**SearchItemCommon.tsx:**
- `ItemCardFrame` and `ItemListFrame` rewritten using shadcn `Card` (CardContent)
- Theme tokens for background, border, shadow instead of hardcoded values

**SearchEmptyResults.tsx:**
- Uses Lucide `Search` icon
- Uses shadcn `Button` for clear action
- Theme tokens for colors

**SearchError.tsx:**
- Uses Lucide `AlertTriangle` icon
- Uses shadcn `Button` for retry action
- Uses `destructive` theme tokens instead of hardcoded `red-*`

**SearchSkeletonItem.tsx:**
- Updated to use new `Card` frames from `SearchItemCommon`
- Skeleton pulse animations use `muted` theme tokens

**constants.ts:**
- Dictionary keys unchanged
- `gridColsClass` helper unchanged
- `DEFAULT_PAGE_SIZE` unchanged
- `DEBOUNCE_TIME` unchanged (consumed by `useRouter` now)

**models.ts:**
- Updated types as described in Module 2
- `SearchParams` type removed (rendering params come from `ComponentProps`)

### Module 4: Hooks

**useRouter.tsx:**
- `useDebouncedCallback` merged in from the deleted `useDebounce.tsx`
- Adds `page` URL param support: reads `?page=` on mount, exposes `setRouterPage(page: number)` alongside `setRouterQuery(query: string)`
- `setRouterPage` is only used by the Default variant — LoadMore ignores it
- Constructs URL with both `?q=` and `?page=` params, omitting either when empty/default

**useEvent.tsx:**
- Receives `page` object as a parameter instead of calling `useSitecore()` internally
- Signature becomes `useEvent({ query, uid, page })` where `page` comes from `ComponentProps`
- Behavior unchanged: sends `search` events with `viewed` and `clicked` interaction types, skips in dev/editing/preview

**Deleted hooks:**
- `useSearchField.tsx` — JSON parsing no longer needed
- `useParams.tsx` — inlined into main component
- `useDebounce.tsx` — merged into `useRouter.tsx`

### Module 5: Sitecore Items (MCP, after React is approved)

Executed via Sitecore Marketer MCP after the React implementation is reviewed and approved.

**Datasource template** — `Search Experience V2` at `projectTemplatesRoot/Components/Search/Search Experience V2`:
- Section: `Search Configuration`
- Fields: `SearchIndex` (Single-Line Text), `TitleMapping` (Single-Line Text), `DescriptionMapping` (Single-Line Text), `ImageMapping` (Single-Line Text), `TagsMapping` (Single-Line Text), `LinkMapping` (Single-Line Text), `TypeMapping` (Single-Line Text)
- Base templates: Standard Template + Grid Parameters
- `__Standard Values` created
- No `Marketplace Types` or `Source` field (Marketplace app integration dropped)

**Folder template** — `Search Experience V2 Folder` at `projectTemplatesRoot/Folders/Search Experience V2 Folder`:
- `__Standard Values` with `__Masters` set to the datasource template

**Data folder** — at `dataRoot/Search Experiences V2`:
- Based on the folder template
- Insert options set on the folder item

**Rendering Parameters template** — at `renderingParamsRoot/Search Experience V2`:
- Fields: `columns` (Single-Line Text), `pageSize` (Single-Line Text)
- Base templates: standard 4 rendering parameter base templates

**JSON Rendering** — `SearchExperienceV2` at `renderingsRoot/Search/SearchExperienceV2`:
- `Component Name [shared]` = `SearchExperienceV2`
- `Datasource Template` = full path to `Search Experience V2` template
- `Datasource Location` = full path to `Search Experiences V2` data folder
- `Parameters Template [shared]` = Item ID (GUID) of the Rendering Parameters template
- Registered in Available Renderings (Page Content)

**Example datasource item** — inside the data folder:
- `SearchIndex` = empty (SE fills in their search source GUID)
- All mapping fields empty (SE fills in their search index field names)

## Testing Decisions

Tests are written for Modules 2 and 3 — the main component and subcomponents. These are project-owned code (not a starter kit copy) and contain non-trivial logic worth validating.

A good test for this component:
- Tests external rendering behavior (what the user sees), not internal state or hook implementation details
- Mocks the Content SDK search hooks (`useSearch`, `useInfiniteSearch`) to return controlled data
- Tests with and without datasource fields to verify graceful degradation
- Tests both variant behaviors (pagination vs load-more)
- Does not test Sitecore SDK internals, analytics events, or URL routing mechanics

**Module 2 tests (main component):**
- Renders Default variant with all fields populated — verifies results grid, pagination, results count
- Renders LoadMore variant with all fields populated — verifies results grid, load-more button
- Renders with missing/empty datasource fields — verifies fallback / empty state
- Renders skeleton items in editing mode when no search results
- Renders empty results state when search returns zero matches
- Renders error state when search hook returns an error

**Module 3 tests (subcomponents):**
- `SearchItem` — renders correct fields based on mapping (title only, all fields, no fields). Switches between card and list variants
- `SearchPagination` — page number calculation with various totalPages values. Active page gets `aria-current`. Previous disabled on page 1, next disabled on last page
- `SearchInput` — renders clear button only when value is non-empty. Calls onChange on input

**Prior art:** The project has test patterns in `src/__tests__/` (used by the deleted Cloud SDK search tests). Follow the same structure: `src/__tests__/components/search-experience-v2/` with one test file per module.

## Out of Scope

- **Faceted search / filtering** — The V2 component does not include facets, sort dropdowns, or category filters. This could be a future V3 enhancement.
- **Preview search / typeahead** — A typeahead search bar in the site header is a separate component concern, not part of the full results page experience.
- **Search Configuration Manager Marketplace app** — V2 intentionally drops this integration. The Marketplace app still works with V1 for environments where it's available.
- **Modifying or deleting the original SearchExperience (V1)** — V1 is preserved unchanged for comparison. Retirement of V1 is a separate decision after V2 is validated.
- **Search source creation and indexing** — Creating crawlers and indexing content is an SE task in the Sitecore Search UI, not a component concern.
- **Sitecore dictionary items for i18n keys** — The component uses `useTranslations` with fallback strings. Creating the actual dictionary items in Sitecore is an environment setup task.

## Further Notes

- **shadcn/ui must be initialized first.** The project references shadcn/ui in its rules but has never installed any primitives. Module 1 is a prerequisite — run the shadcn CLI to install Card, Button, Input, and Badge before building V2. This is a one-time setup that benefits all future UIIM components.
- **The component map determines which component is active.** Both V1 and V2 can coexist in the codebase. The component map entry for `SearchExperienceV2` makes it available in Page Builder alongside the original `SearchExperience`. An SE can use either.
- **Field naming convention.** The 7 template fields use PascalCase (`SearchIndex`, `TitleMapping`) to match Sitecore field conventions and the existing project pattern. The React props mirror these names exactly.
- **The `useSearch` and `useInfiniteSearch` hooks are from `@sitecore-content-sdk/nextjs/search`** — already part of the project's SDK. No new npm packages are needed (other than the shadcn primitives which are local files, not npm packages).
- **V1 comparison checklist.** After V2 is built, compare: file count (V1: ~23 files, V2: ~12 files), prop conventions, theme compliance, accessibility landmarks, URL state completeness, and type safety of `SearchDocument`.
