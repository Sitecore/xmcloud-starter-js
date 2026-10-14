# Issue 004: ArticleBody — Default variant

**Label:** `ready-for-agent`

## Parent

PRD: Article Page Template (`docs/adr/prd-article-page-template.md`)

## What to build

Create the ArticleBody context component end-to-end: Sitecore rendering, React component (Default variant only), component map registration, and tests.

**Sitecore work:**
- Create a Rendering Parameters template at `renderingParamsRoot/Article/ArticleBody` with the standard 4 base templates for rendering params
- Create a JSON Rendering at `renderingsRoot/Article/ArticleBody`
  - `Component Name [shared]` = `ArticleBody` (PascalCase, matches TSX filename)
  - `Parameters Template [shared]` = rendering params template GUID
  - No datasource template, no datasource location, no ComponentQuery
- Register the rendering in Available Renderings (append to existing `Renderings [shared]` on Page Content item)

**React work:**
- Create `src/components/uiim/article/ArticleBody.tsx` with:
  - Props extending `ComponentProps`
  - `Default` named export
  - Non-exported empty-state fallback component
  - Route field access via `page?.layout?.sitecore?.route?.fields`
  - Default variant layout: narrow centered column (~prose width)
    - Key takeaways as a styled callout box above the body (conditional — hidden when empty unless editing)
    - Article content rendered with `RichText` (aliased as `ContentSdkRichText`)
    - Author bio card at the bottom (conditional — hidden when ArticleAuthor is not set unless editing)
    - Author bio card shows: photo (SmartMedia), name, job title, bio (RichText), LinkedIn link (ContentSdkLink)
  - Edit-mode visibility guard on conditional sections
  - `params.styles` and `params.RenderingIdentifier` on wrapper
  - Tailwind CSS styling, shadcn/ui primitives where applicable

**Integration:**
- Add `ArticleBody` entry to `.sitecore/component-map.ts`

**Tests** (follow `kit-nextjs-article-starter` patterns):
- Create `src/__tests__/components/article-body/ArticleBody.mockProps.ts` with mock prop combinations: default (all fields), without key takeaways, without author, without content, minimal, without fields (null), author without image, author without job title, author without bio, author without LinkedIn, editing mode page
- Create `src/__tests__/components/article-body/ArticleBody.test.tsx` covering:
  - Renders article content (rich text present)
  - Key takeaways callout shown when field has value
  - Key takeaways hidden when field is empty
  - Author bio card shown when author is set
  - Author bio hidden when author is not set
  - Editing mode: conditional sections visible even when empty
  - Author bio shows all Person fields
  - Handles missing Person sub-fields gracefully
  - Fallback renders when route fields are missing
  - Semantic HTML and accessibility

## Acceptance criteria

- [ ] Rendering params template created with correct base templates
- [ ] JSON Rendering created with correct `Component Name`, `Parameters Template`, no datasource fields
- [ ] Rendering registered in Available Renderings
- [ ] React component renders article content, conditional key takeaways, conditional author bio from route fields
- [ ] All Sitecore fields use SDK editable helpers
- [ ] Key takeaways and author bio hide when empty in normal mode, show in editing mode
- [ ] Author bio card renders all Person fields (photo, name, title, bio, LinkedIn)
- [ ] Fallback component renders when route fields are missing
- [ ] Component map updated
- [ ] Mock props file created with all combinations
- [ ] Tests pass: content rendering, conditional sections, editing mode, Person sub-fields, fallback, accessibility
- [ ] Manifest updated with rendering and params template IDs

## Blocked by

- Issue 002: Article Page Template + Content Tree (needs route fields to exist on the template)
