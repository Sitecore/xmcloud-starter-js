# Issue 003: ArticleHero — Default variant

**Label:** `ready-for-agent`

## Parent

PRD: Article Page Template (`docs/adr/prd-article-page-template.md`)

## What to build

Create the ArticleHero context component end-to-end: Sitecore rendering, React component (Default variant only), component map registration, and tests.

**Sitecore work:**
- Create a Rendering Parameters template at `renderingParamsRoot/Article/ArticleHero` with the standard 4 base templates for rendering params
- Create a JSON Rendering at `renderingsRoot/Article/ArticleHero`
  - `Component Name [shared]` = `ArticleHero` (PascalCase, matches TSX filename)
  - `Parameters Template [shared]` = rendering params template GUID
  - No datasource template, no datasource location, no ComponentQuery
- Register the rendering in Available Renderings (append to existing `Renderings [shared]` on Page Content item)

**React work:**
- Create `src/components/uiim/article/ArticleHero.tsx` with:
  - Props extending `ComponentProps`
  - `Default` named export
  - Non-exported empty-state fallback component
  - Route field access via `page?.layout?.sitecore?.route?.fields`
  - Renders: featured image (SmartMedia), title (`Text`), author name + avatar, publication date (`DateField`), read time (`Text`), share buttons (Facebook, Twitter, LinkedIn, email, copy link)
  - Edit-mode visibility guard on all optional fields
  - `params.styles` and `params.RenderingIdentifier` on wrapper
  - Tailwind CSS styling, shadcn/ui primitives where applicable

**Integration:**
- Add `ArticleHero` entry to `.sitecore/component-map.ts`

**Tests** (follow `kit-nextjs-article-starter` patterns):
- Create `src/__tests__/components/article-hero/ArticleHero.mockProps.ts` with mock prop combinations: default (all fields), without image, without author, without date, without read time, minimal, without fields (null), author without image, author without job title, editing mode page
- Create `src/__tests__/components/article-hero/ArticleHero.test.tsx` covering:
  - Renders all fields when present
  - Handles each optional field being absent
  - Renders with minimal props (title only)
  - Share buttons render and trigger correct actions
  - Clipboard copy works
  - Editing mode: empty fields remain visible
  - Fallback renders when route fields are missing
  - Semantic HTML and accessibility

SDK components, UI components, and SmartMedia should be mocked in tests following the article-starter mock patterns.

## Acceptance criteria

- [ ] Rendering params template created with correct base templates
- [ ] JSON Rendering created with correct `Component Name`, `Parameters Template`, no datasource fields
- [ ] Rendering registered in Available Renderings
- [ ] React component renders title, image, author, date, read time, share buttons from route fields
- [ ] All Sitecore fields use SDK editable helpers (no plain `<img>`, `<a>`, or hardcoded text)
- [ ] Empty fields visible in editing mode, hidden in normal mode
- [ ] Fallback component renders when route fields are missing
- [ ] Component map updated
- [ ] Mock props file created with all combinations
- [ ] Tests pass: all fields present, optional fields absent, editing mode, share buttons, fallback, accessibility
- [ ] Manifest updated with rendering and params template IDs

## Blocked by

- Issue 002: Article Page Template + Content Tree (needs route fields to exist on the template)
