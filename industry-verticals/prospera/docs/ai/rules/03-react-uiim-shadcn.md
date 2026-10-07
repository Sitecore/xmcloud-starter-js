# React UIIM + shadcn/ui standards

Use these rules for React components in `src/components/uiim`.

## Goals
- keep UI components consistent
- use existing design system patterns
- preserve Sitecore editability
- prefer simple, typed, composable React components
- align with Tailwind + shadcn/ui repo conventions

## File placement
- Create components under:
  - `src/components/uiim/<category-lowercase>/<ComponentNamePascal>.tsx`
- Use PascalCase filenames (e.g. `Hero.tsx`, `EurobankHeader.tsx`). The containing folder is kebab-case.
- Keep one primary component per file unless a local helper is tiny and tightly coupled.

## Component structure
- Use TypeScript props.
- Component props **must** extend `ComponentProps` from `lib/component-props` — never define `params` manually as `Record<string, string>`.
- Always use `params.styles` and `params.RenderingIdentifier` from `ComponentProps` in the wrapper element.
- Prefer small, readable functional components.
- Use **named exports** (`export const Default`) — never `export default` — for Sitecore variant resolution.
- Keep helper types close to the component if they are only used there.
- Follow existing repo patterns before inventing new abstractions.

## Styling rules
- Use **Tailwind CSS** for layout, spacing, typography, and responsiveness.
- Prefer **shadcn/ui primitives** from:
  - `@/components/ui/*`
- Use existing utilities such as:
  - `cn` from `@/lib/utils`
  when class composition is needed.
- Prefer utility classes over custom CSS files.
- Avoid CSS modules, SCSS, or inline styles unless the repo already uses them for a clear reason.
- Avoid hardcoded pixel-heavy styling when Tailwind scale values are available.

## Preferred UI primitives
Use shadcn/ui primitives when they fit the design, for example:
- `Button`
- `Card`
- `Badge`
- `Separator`
- `Accordion`
- `Tabs`
- `Dialog`

Do not rebuild primitives that already exist in the UI library unless the requirement truly cannot be met with composition.

## Sitecore editable field rules (mandatory)
**Every** Sitecore-managed field must use the appropriate SDK editable helper. This is non-negotiable.

Use imports from:
- `@sitecore-content-sdk/nextjs`

Preferred import aliases:
```tsx
import {
  Field,
  NextImage as ContentSdkImage,
  Link as ContentSdkLink,
  RichText as ContentSdkRichText,
  ImageField,
  LinkField,
  Text,
} from '@sitecore-content-sdk/nextjs';
```

### Do
- use `<Text field={...} />` for Single-Line Text fields
- use `<ContentSdkRichText field={...} />` (or `<RichText field={...} />`) for Rich Text fields
- use `<ContentSdkImage field={...} />` (i.e. `NextImage`) for Sitecore Image fields
- use `<ContentSdkLink field={...} />` (i.e. `Link`) for Sitecore General Link fields

### Do not
- use plain `<img>` or `next/image` `Image` for Sitecore Image fields — this breaks editability
- use plain `<a>` or `next/link` `Link` for Sitecore Link fields — this breaks editability
- use plain strings, `<p>`, or `<h1>` for Sitecore Text/RichText fields — this breaks editability
- use hardcoded placeholder text or image URLs for fields that should be Sitecore-managed
- use `dangerouslySetInnerHTML` for Sitecore rich text

### Edit-mode visibility guard
When fields may be empty, `{field?.value && <SDKHelper>}` hides the field in Experience Editor. Use `page?.mode?.isEditing` (from `ComponentProps`) to keep fields visible for authors:
```tsx
const isEditing = page?.mode?.isEditing;
{(fields.Title?.value || isEditing) && <Text field={fields.Title} ... />}
```

### shadcn availability check
Before importing `@/components/ui/*`, verify that `src/components/ui/` exists. If not, use plain Tailwind markup instead. Do not import missing shadcn components — it causes build errors.

## Data shape rules

### Context-only components
Use:
- `useSitecore()` (SDK 2.0 — replaces the removed `useSitecoreContext()`)
- `page?.layout?.sitecore?.route?.fields` (or access `page` from `ComponentProps`)

### Simple datasource components
Use top-level field access, for example:
- `fields.Title`
- `fields.Description`
- `fields.HeroImage`
- `fields.PrimaryLink`

Do **not** use GraphQL datasource nesting for simple components unless the repo already wraps it that way.

### List datasource components
Use GraphQL datasource shape:
- `fields.data.datasource`
- `fields.data.datasource.children.results`

For authorable values from GraphQL queries, use:
- `.jsonValue`

## Null-safety and rendering behavior
- Handle missing data safely with optional chaining.
- Return `null` when a component has nothing meaningful to render.
- Do not throw runtime errors because a datasource or child array is missing.
- Default repeated collections to empty arrays when practical.

## Accessibility rules
- Use semantic HTML.
- Preserve heading hierarchy where possible.
- Ensure interactive elements are real buttons or links.
- Do not create click-only `div` elements.
- Ensure images are rendered accessibly through Sitecore field helpers.
- Keep focus-visible behavior intact.

## Layout rules
- Mobile-first styling is preferred.
- Use responsive Tailwind classes for layout changes.
- Prefer container, grid, flex, and spacing utilities over deeply nested wrapper markup.
- Keep markup as flat and readable as possible.

## Content rules
- Do not hardcode user-facing copy that should be authorable.
- If a field is expected to be managed in Sitecore, model and render it as a Sitecore field.
- Use safe fallback labels only for clearly non-authorable UI chrome.

## Component map rules
When a new component is created:
- update `.sitecore/component-map.ts`
- ensure the component map key matches the rendering/component naming convention used by the repo
- prefer kebab-case map keys unless the repo clearly differs

## Preferred implementation pattern
- typed props
- Tailwind for layout
- shadcn/ui for primitives
- Sitecore JSS helpers for editable content
- small local helpers only when they improve readability

## Avoid
- oversized monolithic JSX blocks when small local helpers would clarify intent
- custom design systems when shadcn/ui already covers the need
- mixing plain HTML rendering with Sitecore field helpers for the same authorable field
- introducing a new pattern that conflicts with nearby components

## Repo-first rule
If the repository clearly uses a different local convention:
- follow the repository convention
- keep Sitecore editability intact
- explain the deviation briefly when relevant
