# Issue 005: ArticleHero — Minimal + SplitImage variants

**Label:** `ready-for-agent`

## Parent

PRD: Article Page Template (`docs/adr/prd-article-page-template.md`)

## What to build

Add the Minimal and SplitImage visual variants to the existing ArticleHero component, and create the Sitecore Variant Definition items for all three variants.

**React work:**
- Add `Minimal` named export to `ArticleHero.tsx`:
  - No image, clean background, large title, metadata row (author, date, read time) below the title
  - Share buttons still present
  - All the same route fields, same conditional logic, same edit-mode guards
- Add `SplitImage` named export to `ArticleHero.tsx`:
  - Two-column layout: image on the right, title + metadata stacked on the left
  - Editorial magazine feel
  - All the same route fields, same conditional logic, same edit-mode guards

**Sitecore work:**
- Create a Headless Variants container for ArticleHero under the site's Headless Variants root
- Create 3 Variant Definition items: `Default`, `Minimal`, `SplitImage`
- Each Variant Definition name must exactly match the named export in the TSX file

**Tests:**
- Add variant-specific test cases to the existing ArticleHero test file:
  - Minimal variant renders without image
  - Minimal variant still shows title, metadata, share buttons
  - SplitImage variant renders with two-column layout
  - SplitImage variant shows image alongside text
  - All variants handle missing optional fields correctly

Follow `docs/ai/skills/sitecore-add-variants.md` for the variant creation workflow.

## Acceptance criteria

- [ ] `Minimal` named export added to ArticleHero.tsx — no image, clean background, title + metadata
- [ ] `SplitImage` named export added to ArticleHero.tsx — two-column: image right, text left
- [ ] Headless Variants container created for ArticleHero in Sitecore
- [ ] 3 Variant Definition items created: `Default`, `Minimal`, `SplitImage`
- [ ] Variant Definition names exactly match TSX named exports
- [ ] Tests added and passing for Minimal and SplitImage variants
- [ ] All variants handle missing optional fields and editing mode correctly
- [ ] Manifest updated with variant item IDs

## Blocked by

- Issue 003: ArticleHero — Default variant (needs the base component and rendering to exist)
