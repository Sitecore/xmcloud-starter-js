# ADR 0004: SearchExperienceV2 replaces JSON config with proper Sitecore template fields

## Status

Accepted

## Context

ADR 0003 adopted the OOTB SitecoreAI SearchExperience component from the starter kit. The component works, but several aspects conflict with this project's conventions and limit its usefulness as a multi-demo builder component:

1. **JSON blob configuration** — The component stores its search index ID and field mappings in a single Multi-Line Text field as a JSON string. This bypasses Sitecore's template system, makes configuration invisible to standard queries, and creates a hard dependency on the Search Configuration Manager Marketplace app for a decent authoring experience. The Marketplace app is on a phased rollout and isn't reliably available.

2. **Hardcoded product types** — The `SearchDocument` type contains fields from the SYNC audio gear starter (`Price`, `ProductName`, `AmpPower`) that are meaningless in a multi-demo context.

3. **Non-conforming props** — The component defines its own props interface instead of extending `ComponentProps`, duplicating param handling and requiring a separate `useSitecore()` call for editing mode.

4. **Generic styling** — Hardcoded gray/blue/red Tailwind classes instead of the project's theme tokens and shadcn/ui primitives.

5. **Starter kit copy, not a project component** — Placed outside the UIIM directory, treated as a foreign artifact rather than a first-class project component.

## Decision

Create **SearchExperienceV2** as a new component that replaces the JSON configuration with 7 individual Sitecore template fields, conforms to project conventions, and uses the project's design system. The original SearchExperience is preserved for comparison.

### Key changes

**Configuration: JSON blob to individual fields**
- `SearchIndex` (Single-Line Text) — search source GUID
- `TitleMapping`, `DescriptionMapping`, `ImageMapping`, `TagsMapping`, `LinkMapping`, `TypeMapping` (all Single-Line Text) — map UI fields to search index field names
- Search Configuration Manager Marketplace app integration dropped entirely

**Component conventions**
- Props extend `ComponentProps` from `lib/component-props`
- Placed at `src/components/uiim/search/SearchExperienceV2.tsx`
- Both variants (`Default`, `LoadMore`) in a single file with shared layout helper
- `SearchDocument` uses minimal base type with index signature: `{ sc_item_id: string; [key: string]: string | string[] }`

**Styling and accessibility**
- shadcn/ui primitives (`Card`, `Button`, `Input`, `Badge`) for themed interactive elements
- Semantic theme tokens for structural elements (no hardcoded grays/blues/reds)
- Lucide React icons replacing inline SVGs
- `role="search"`, `<nav aria-label>`, `aria-current="page"`, `aria-live="polite"` on results count

**File consolidation**
- `SearchItem/` subfolder (7 files) consolidated into single `SearchItem.tsx`
- `useDebounce` merged into `useRouter`
- `useParams` inlined into component
- `useSearchField` (JSON parsing) deleted
- ~18 files down to ~12

**URL state**
- Default (pagination) variant syncs both `?q=` and `?page=` to URL
- LoadMore variant syncs `?q=` only (infinite scroll has no discrete pages)

## Alternatives considered

1. **Patch the existing component in place** — Rejected because the scope of changes (template fields, props, styling, file structure) is large enough that a side-by-side comparison is valuable. The original serves as a reference.

2. **Keep the JSON field but add individual fields as fallback** — Rejected as unnecessary complexity. The Marketplace app integration provides no value if the app isn't reliably available, and maintaining two config paths adds confusion.

3. **Extract a shared base component** — Rejected as premature. V2 needs to prove itself first. If both coexist long-term, a shared base could be extracted later.

## Consequences

- The original SearchExperience remains functional and unchanged for comparison.
- V2 requires new Sitecore items: datasource template (7 fields), folder template, rendering, rendering parameters template.
- V2 breaks compatibility with the Search Configuration Manager Marketplace app. SEs configure fields directly in the datasource item.
- V2 diverges from the upstream starter kit, making future upstream syncs for this component irrelevant — it is effectively a project-owned component.
- Faceted search and preview/typeahead search remain out of scope.
