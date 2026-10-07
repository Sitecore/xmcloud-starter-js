# Sitecore create article page

Orchestrator skill that creates a complete Article page type: page template, shared data templates, context components, variants, partial design, and content tree setup.

## Trigger hints
Use this skill when:
- the user says "create article page", "article template", "blog page type", "news page template"
- the user wants a page type for editorial/blog/news content with context components
- a design shows an article page layout with hero, body, author, and metadata

## Do not use this skill when
- the user wants a single article-related datasource component (use `sitecore-create-simple-component` or `sitecore-create-list-component`)
- the user wants to add variants to an existing article component (use `sitecore-add-variants`)
- the user wants a generic page template without article-specific components (use `sitecore-create-page-template`)

---

## Load first
- `docs/ai/config/project.yaml`
- `docs/ai/catalog/page-template-registry.yaml` (Article entry)
- `docs/ai/manifests/sitecore-manifest.yaml`
- `docs/ai/skills/sitecore-maintain-manifest.md`
- `docs/ai/reference/sitecore-rules.md`
- `docs/ai/reference/sitecore-marketer-mcp-reference.md`
- `docs/ai/skills/shared/react-uiim-guidelines.md`

---

## Prerequisites
- Project config must exist (`docs/ai/config/project.yaml`)
- Manifest must exist (`docs/ai/manifests/sitecore-manifest.yaml`)

---

## Full workflow

This skill orchestrates multiple sub-skills in sequence. Each phase depends on the previous one.

### Phase 1 — Page template and shared data (delegates to `sitecore-create-page-template`)

Follow `docs/ai/skills/sitecore-create-page-template.md` to create:

1. **Person template** — shared data template at `projectTemplatesRoot/Data/Person`
   - Section: "Person Data"
   - Fields: `personFirstName` (Single-Line Text), `personLastName` (Single-Line Text), `personJobTitle` (Single-Line Text), `personProfileImage` (Image), `personBio` (Rich Text), `personLinkedIn` (General Link)
   - People folder at `dataRoot/People` with insert options
   - Folder template for People folder

2. **Article Page Template** — inherits from base page template
   - Path: `projectTemplatesRoot/Page Types/Article Page`
   - Section: "Article Data"
   - Fields:
     - `ArticleContent` (Rich Text) — article body
     - `ArticleImage` (Image) — hero/featured image
     - `ArticleAuthor` (Droptree) — source: `dataRoot/People`
     - `ArticlePublicationDate` (Date) — publication date
     - `ArticleKeyTakeaways` (Rich Text) — highlights summary
     - `ArticleReadTime` (Single-Line Text) — e.g. "5 min read"
   - `__Standard Values` created

3. **Content tree** — Articles parent page at `/Home/Articles/` with insert options for Article Page

4. **Layout.tsx** — update `RouteFields` with new field types

### Phase 2 — Context components (delegates to `sitecore-create-context-component` x2)

Follow `docs/ai/skills/sitecore-create-context-component.md` for each component:

#### ArticleHero
- **Category:** article
- **File:** `src/components/uiim/article/ArticleHero.tsx`
- **Route fields used:** `ArticleImage`, `Title`, `ArticleAuthor` (name + photo only), `ArticlePublicationDate`, `ArticleReadTime`
- **Rendering:** JSON Rendering, no datasource, no ComponentQuery
- **Features:** Share buttons baked in (Facebook, Twitter, LinkedIn, copy link)
- **Rendering params template:** at `renderingParamsRoot/Article/ArticleHero`

#### ArticleBody
- **Category:** article
- **File:** `src/components/uiim/article/ArticleBody.tsx`
- **Route fields used:** `ArticleContent`, `ArticleKeyTakeaways`, `ArticleAuthor` (full: photo, name, title, bio, LinkedIn)
- **Rendering:** JSON Rendering, no datasource, no ComponentQuery
- **Features:** Key takeaways callout (conditional), author bio card (conditional)
- **Rendering params template:** at `renderingParamsRoot/Article/ArticleBody`

For each component:
1. Create Rendering Parameters template
2. Create JSON Rendering with `Component Name [shared]` matching TSX filename
3. Set `Parameters Template [shared]` to the rendering params template GUID
4. Register in Available Renderings (append to existing value)
5. Create React component file
6. Update `.sitecore/component-map.ts`

### Phase 3 — Variants (delegates to `sitecore-add-variants`)

Follow `docs/ai/skills/sitecore-add-variants.md` for each component:

#### ArticleHero variants
Create Headless Variants container and Variant Definition items:
- `Default` — full-bleed image with dark overlay, centered title, metadata row, share buttons
- `Minimal` — no image, clean background, large title, metadata row
- `SplitImage` — two-column: image right, title + metadata left

#### ArticleBody variants
Create Headless Variants container and Variant Definition items:
- `Default` — narrow centered column, key takeaways callout above body, author bio card at bottom
- `WithSidebar` — two-column: body left (~65%), sticky sidebar right with takeaways + author bio
- `Wide` — full-width body, takeaways inline as highlighted section, author bio as full-width band

Each variant = a named export in the TSX file matching the Variant Definition item name exactly.

### Phase 4 — Partial Design

Create a Partial Design for the article layout:

1. Navigate to `/sitecore/content/<siteCollection>/<siteName>/Presentation/Partial Designs/`
2. Create a new Partial Design item named "Article Layout"
3. Add ArticleHero to `headless-main` placeholder (first position)
4. Add ArticleBody to `headless-main` placeholder (second position)
5. Associate the partial design with the Article Page Template's `__Standard Values`
   - Set the `Partial Designs` field on `__Standard Values` to reference the "Article Layout" partial design

### Phase 5 — Verification and manifest

Verify all items from Phases 1-4. Update manifest with:
- All item IDs (template, fields, renderings, variants, partial design)
- Verification results per item
- Component status: `complete` or `failed` with notes

---

## React implementation notes

### ArticleHero
- Props extend `ComponentProps`
- Use `page` from ComponentProps to access route fields: `page?.layout?.sitecore?.route?.fields`
- All Sitecore fields use SDK editable helpers (`Text`, `ContentSdkImage`, `DateField`)
- Handle `ArticleAuthor` as a Droptree reference — access nested fields via `field?.value?.fields?.personFirstName` etc.
- Edit-mode visibility guard: show empty fields when `page?.mode?.isEditing` is true
- Share buttons: Facebook, Twitter, LinkedIn, email, copy link (same pattern as article-starter)

### ArticleBody
- Same props/access pattern as ArticleHero
- `ArticleContent` rendered with `RichText` (aliased as `ContentSdkRichText`)
- `ArticleKeyTakeaways` rendered with `RichText` inside a styled callout — hidden when field is empty (unless editing)
- Author bio card: photo, name, job title, bio, LinkedIn link — hidden when `ArticleAuthor` is not set (unless editing)
- WithSidebar variant uses CSS sticky positioning for the sidebar

### Shared patterns
- Non-exported empty-state fallback component for each
- `params.styles` and `params.RenderingIdentifier` on wrapper element
- Tailwind CSS for layout, shadcn/ui primitives where applicable
- SmartMedia component for images (project convention — see MEMORY.md)

---

## Component map entries

Add to `.sitecore/component-map.ts`:
```typescript
'ArticleHero': dynamic(() => import('components/uiim/article/ArticleHero')),
'ArticleBody': dynamic(() => import('components/uiim/article/ArticleBody')),
```

Follow the existing naming pattern in the file.

---

## Completion rule

The task is only complete when ALL phases succeed:
- [ ] Person template created with all 6 fields, `__Standard Values`, People folder
- [ ] Article Page Template created inheriting from base, with all 6 fields, `__Standard Values`
- [ ] Articles parent page created with insert options
- [ ] `Layout.tsx` RouteFields updated
- [ ] ArticleHero rendering + React component + component map entry
- [ ] ArticleBody rendering + React component + component map entry
- [ ] 6 Variant Definition items created (3 per component)
- [ ] 6 named exports in TSX files matching variant names
- [ ] Both renderings registered in Available Renderings
- [ ] Partial Design "Article Layout" created with both components placed
- [ ] Article `__Standard Values` references the partial design
- [ ] Manifest fully updated with all item IDs and status

If any phase fails, set status to `partial`, record what succeeded, and report what remains.
