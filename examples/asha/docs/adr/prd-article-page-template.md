# PRD: Article Page Template

**Label:** `ready-for-agent`

---

## Problem Statement

The basic-nextjs demo builder has 19 datasource-based UIIM components that cover corporate homepage patterns, but no support for article/blog/news page types. Solution Engineers cannot demo editorial content workflows — authoring an article, assigning an author, publishing with metadata — because there is no Article page template, no article-specific components, and no AI skill to create them. Every demo that needs a blog or news section requires manual, one-off setup.

## Solution

Introduce a complete Article page type to the demo builder: a Sitecore page template with article-specific fields, a shared Person data template, two context components (ArticleHero, ArticleBody) with multiple visual variants, a Partial Design for out-of-the-box article page layout, and two new AI skills that make the pattern repeatable for future page types.

Authors create a new article by adding a child page under `/Home/Articles/`. The page comes pre-loaded with ArticleHero and ArticleBody via the Partial Design. They fill in article fields (title, body, image, author, date, read time, key takeaways) directly on the page item — no datasource selection needed. Context components render these route fields with full Experience Editor editability.

## User Stories

1. As a Solution Engineer, I want to create an Article page in Sitecore by adding a child page under an Articles parent, so that I can demo editorial content workflows without manual template setup.
2. As a Solution Engineer, I want new article pages to come pre-loaded with ArticleHero and ArticleBody components, so that I don't have to manually place components on every new article page.
3. As a content author, I want to fill in article fields (title, body, image, author, date, read time, key takeaways) directly on the page item, so that I don't need to create and link separate datasource items.
4. As a content author, I want to pick an author from a shared People list using a Droptree field, so that I can reuse the same author across multiple articles.
5. As a content author, I want the ArticleHero to display the article's featured image, title, author name and photo, publication date, and read time, so that readers see a rich article header.
6. As a content author, I want the ArticleBody to display the article's rich text content, key takeaways callout, and an author bio card, so that the full article is rendered from the page fields.
7. As a content author, I want key takeaways and author bio sections to appear only when those fields have content, so that articles without them look clean rather than showing empty sections.
8. As a content author, I want all article fields to be editable in Experience Editor, so that I can author and preview content inline.
9. As a content author, I want empty fields to remain visible in editing mode, so that I can click into them and add content.
10. As a Solution Engineer, I want to switch between ArticleHero variants (Default, Minimal, SplitImage) to match the client's editorial style.
11. As a Solution Engineer, I want to switch between ArticleBody variants (Default, WithSidebar, Wide) to match the client's content layout preferences.
12. As a Solution Engineer, I want to drop additional datasource-based components (CTAs, banners, feature blocks) onto article pages alongside the context components, so that I can enrich article pages for demos.
13. As a content author, I want social share buttons (Facebook, Twitter, LinkedIn, email, copy link) in the article hero, so that readers can share the article.
14. As a content author, I want to create Person items in a People folder, so that authors are reusable across articles and potentially other content types (testimonials, team pages).
15. As an AI agent, I want a `sitecore-create-page-template` skill, so that I can create new page types (Article, Event, Case Study) in a repeatable, documented way.
16. As an AI agent, I want a `sitecore-create-article-page` orchestrator skill, so that I can create the full Article page type (template, components, variants, partial design, content tree) in one coordinated workflow.
17. As an AI agent, I want the skill router to classify "create article page" and "create page template" requests, so that requests are routed to the correct skill without manual intervention.
18. As an AI agent, I want a `page-template-registry.yaml` separate from the component registry, so that page types and homepage components are cataloged independently.
19. As a Solution Engineer, I want article pages to inherit all standard SEO fields (metadataTitle, metadataDescription, ogTitle, ogDescription, ogImage) from the base page template, so that articles are properly indexed and shareable without extra configuration.
20. As a content author, I want the Articles parent page to have insert options restricting child creation to Article pages only, so that the content tree stays organized.
21. As a Solution Engineer, I want clean URLs for articles (`/articles/my-first-article`), so that the demo looks production-ready.

## Implementation Decisions

### Module 1: Person Data Model (Sitecore MCP)

- **Person template** at `projectTemplatesRoot/Data/Person` with section "Person Data"
- Six fields: `personFirstName` (Single-Line Text), `personLastName` (Single-Line Text), `personJobTitle` (Single-Line Text), `personProfileImage` (Image), `personBio` (Rich Text), `personLinkedIn` (General Link)
- Base templates: Standard Template + Grid Parameters (`{1930BBEB-...}|{44A022DB-...}`)
- `__Standard Values` created for the Person template
- **Person Folder template** with insert options pointing to Person template
- **People data folder** at `dataRoot/People` with insert options set on the folder instance

### Module 2: Article Page Template (Sitecore MCP)

- **Article Page template** at `projectTemplatesRoot/Page Types/Article Page`
- Inherits from the **base page template** (resolved via MCP by inspecting the Home item's template). This gives all standard route fields for free: Title, pageSummary, metadata, OG, thumbnailImage, BackgroundColor, placeholder settings.
- New section **"Article Data"** with six fields:
  - `ArticleContent` (Rich Text)
  - `ArticleImage` (Image)
  - `ArticleAuthor` (Droptree, source: `dataRoot/People`)
  - `ArticlePublicationDate` (Date)
  - `ArticleKeyTakeaways` (Rich Text)
  - `ArticleReadTime` (Single-Line Text)
- Field names are prefixed with `Article` to avoid collision with standard Sitecore field names (per project rules)
- `__Standard Values` created, linked to Partial Design (Module 6)

### Module 3: Content Tree (Sitecore MCP)

- **Articles parent page** created at `/Home/Articles/` using the base page template
- Insert options on the parent page set to allow Article Page children
- URL structure: `/articles/<article-name>`

### Module 4: ArticleHero Component (React + Sitecore MCP)

- **React file:** `src/components/uiim/article/ArticleHero.tsx`
- **Kind:** context-only (reads route fields, no datasource)
- **Route fields used:** `ArticleImage`, `Title` (inherited), `ArticleAuthor` (name + photo only), `ArticlePublicationDate`, `ArticleReadTime`
- **Three named exports** (variants):
  - `Default` — full-bleed image with dark overlay, centered title, metadata row (author avatar + name, date, read time), share buttons
  - `Minimal` — no image, clean background, large title, metadata row below
  - `SplitImage` — two-column: image on the right, title + metadata stacked on the left
- Share buttons baked into the component (Facebook, Twitter, LinkedIn, email, copy link)
- Props extend `ComponentProps`, access route fields via `page?.layout?.sitecore?.route?.fields`
- All Sitecore fields use SDK editable helpers (`Text`, `ContentSdkImage`, `DateField`)
- Edit-mode visibility guard: fields shown when `page?.mode?.isEditing` is true even if empty
- Non-exported empty-state fallback component
- `params.styles` and `params.RenderingIdentifier` on wrapper element
- SmartMedia for images (project convention)
- **Sitecore side:** Rendering params template, JSON Rendering, 3 Variant Definition items, Available Renderings registration

### Module 5: ArticleBody Component (React + Sitecore MCP)

- **React file:** `src/components/uiim/article/ArticleBody.tsx`
- **Kind:** context-only
- **Route fields used:** `ArticleContent`, `ArticleKeyTakeaways`, `ArticleAuthor` (full: photo, name, job title, bio, LinkedIn link)
- **Three named exports** (variants):
  - `Default` — narrow centered column (~prose width), key takeaways as a styled callout box above body, author bio card at the bottom
  - `WithSidebar` — two-column: body content left (~65%), sticky sidebar right with key takeaways + author bio card
  - `Wide` — full-width body, key takeaways inline as a highlighted section, author bio as a full-width band at the bottom
- Key takeaways and author bio are **conditional** — hidden when fields are empty (unless in editing mode)
- `ArticleContent` rendered with `RichText` (aliased as `ContentSdkRichText`)
- Author bio card shows: photo (SmartMedia), name, job title, bio (RichText), LinkedIn link (ContentSdkLink)
- **Sitecore side:** Rendering params template, JSON Rendering, 3 Variant Definition items, Available Renderings registration

### Module 6: Article Layout Partial Design (Sitecore MCP)

- Partial Design item "Article Layout" created under the site's Partial Designs folder
- ArticleHero placed in `headless-main` (first position)
- ArticleBody placed in `headless-main` (second position)
- Article Page template `__Standard Values` references this Partial Design

### Module 7: Integration (Code)

- `Layout.tsx` — `RouteFields` interface updated with new article field types (`ArticleContent`, `ArticleImage`, `ArticleAuthor`, `ArticlePublicationDate`, `ArticleKeyTakeaways`, `ArticleReadTime`). The `ArticleAuthor` type includes nested Person fields.
- `.sitecore/component-map.ts` — two new dynamic import entries for `ArticleHero` and `ArticleBody`

### Module 8: Skills and Documentation (already complete)

- `docs/ai/skills/sitecore-create-page-template.md` — generic, reusable skill for creating page templates
- `docs/ai/skills/sitecore-create-article-page.md` — 5-phase orchestrator skill
- `docs/ai/catalog/page-template-registry.yaml` — machine-readable Article page type definition
- `docs/ai/rules/01-sitecore-router.md` — updated with routing rules for both new skills
- `CONTEXT.md` — domain glossary with resolved terms
- `docs/adr/0002-article-pages-use-context-components.md` — architectural decision record
- `CLAUDE.md` — updated quick reference

## Testing Decisions

### What makes a good test

Tests should verify **external behavior** from the component consumer's perspective: what renders, what's visible, what's hidden, how interactions behave. Tests should NOT verify implementation details like internal state, CSS class names (unless they encode behavior), or the exact structure of intermediate JSX.

### Prior art

The `kit-nextjs-article-starter` has extensive test coverage that establishes the testing pattern for this project:
- `src/__tests__/components/article-header/ArticleHeader.test.tsx` + `ArticleHeader.mockProps.ts`
- Tests use `@testing-library/react` with `render`, `screen`, `fireEvent`, `waitFor`
- Mock props are factored into a separate `.mockProps.ts` file with multiple combinations (default, without optional fields, minimal, editing mode)
- SDK components (`Text`, `DateField`, etc.) are mocked to render simple HTML with `data-testid` attributes
- UI components (`Avatar`, `Badge`, `Button`) are mocked as simple wrappers
- `window.matchMedia`, `window.history`, `navigator.clipboard` are mocked at the test level
- Page mode (`isEditing`) is controlled via mock to test both normal and editing behavior

### Modules to test

**ArticleHero (`src/__tests__/components/article-hero/`):**
- Renders all fields when present (title, image, author, date, read time)
- Handles each optional field being absent (no image, no author, no date, no read time)
- Renders minimal props (title only)
- Share buttons render and trigger correct actions (Facebook, Twitter, LinkedIn, copy)
- Clipboard copy works
- Editing mode: empty fields remain visible
- Fallback component renders when route fields are missing
- All three variants render without errors (Default, Minimal, SplitImage)
- Semantic HTML: header element, accessibility attributes
- Author display: avatar with image, avatar fallback without image, name, job title

**ArticleBody (`src/__tests__/components/article-body/`):**
- Renders article content (rich text)
- Renders key takeaways callout when field has value
- Hides key takeaways when field is empty
- Renders author bio card when author is set
- Hides author bio when author is not set
- Editing mode: key takeaways and author bio visible even when empty
- Author bio shows all Person fields (photo, name, title, bio, LinkedIn)
- Handles missing Person sub-fields gracefully (no image, no job title, no bio, no LinkedIn)
- Fallback component renders when route fields are missing
- All three variants render without errors (Default, WithSidebar, Wide)

### Test file structure

Follow the article-starter convention:
```
src/__tests__/components/article-hero/
  ArticleHero.mockProps.ts    # Mock prop combinations
  ArticleHero.test.tsx         # Test suites

src/__tests__/components/article-body/
  ArticleBody.mockProps.ts
  ArticleBody.test.tsx
```

## Out of Scope

- **Related Articles / Article Listing component** — a query-based or datasource-based component that shows cards linking to other articles. This is a datasource component, not a context component, and should be built separately using the existing `sitecore-create-list-component` skill.
- **Search / filtering of articles** — no article search, tag filtering, or category navigation. The Articles parent page is a simple container with insert options.
- **Pagination** — no paginated article listing. The Articles parent page does not render its children.
- **Article categories / tags taxonomy** — no taxonomy system. Articles do not have category or tag fields. This can be added later as a follow-up.
- **RSS feed** — no RSS or Atom feed generation for articles.
- **Comments** — no commenting system on article pages.
- **Scheduled publishing** — relies on Sitecore's built-in publishing workflow, no custom scheduling.
- **Content Hub integration for article images** — image uploads follow the existing manual or credential-based workflow, no article-specific automation.
- **Localization of article content** — articles use the existing i18n setup (en, en-CA). No article-specific localization work.

## Further Notes

- The `sitecore-create-page-template` skill is intentionally generic. Future page types (Event, Case Study, Product Landing) should follow the same pattern: inherit from base, add a template section, create context components, wire up a Partial Design. The Article implementation is the first instance but not the last.
- The Person template is placed under `projectTemplatesRoot/Data/` (not under `Components/`) because it's a shared data template reusable beyond articles — testimonials, team pages, about pages.
- The `page-template-registry.yaml` is separate from `component-registry.yaml` because page types define data models while the component registry catalogs droppable homepage sections used by the Site Analyzer. They serve different audiences in the demo builder pipeline.
- The aspirational route fields in `Layout.tsx` (`Content`, `Author`, `PublicationDate`, `Excerpt`, `KeyTakeaways`, `ReadTime`, `Expert`) will be replaced with the properly prefixed article fields. `Expert` is dropped. `Excerpt` is replaced by the inherited `pageSummary`. The old aspirational types should be cleaned up during the `RouteFields` update.
- ADR 0002 documents the decision to use context components over datasource components for article content, with three alternatives considered and rejected.
