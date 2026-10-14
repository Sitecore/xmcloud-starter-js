# Issue 006: ArticleBody — WithSidebar + Wide variants

**Label:** `ready-for-agent`

## Parent

PRD: Article Page Template (`docs/adr/prd-article-page-template.md`)

## What to build

Add the WithSidebar and Wide visual variants to the existing ArticleBody component, and create the Sitecore Variant Definition items for all three variants.

**React work:**
- Add `WithSidebar` named export to `ArticleBody.tsx`:
  - Two-column layout: body content on the left (~65%), sticky sidebar on the right
  - Sidebar contains key takeaways callout + author bio card
  - CSS sticky positioning for the sidebar
  - Same conditional logic — sidebar sections hide when fields are empty (unless editing)
- Add `Wide` named export to `ArticleBody.tsx`:
  - Full-width body content, no max-width constraint
  - Key takeaways rendered inline as a highlighted/accent section within the content flow
  - Author bio rendered as a full-width band at the bottom
  - Same conditional logic for empty fields

**Sitecore work:**
- Create a Headless Variants container for ArticleBody under the site's Headless Variants root
- Create 3 Variant Definition items: `Default`, `WithSidebar`, `Wide`
- Each Variant Definition name must exactly match the named export in the TSX file

**Tests:**
- Add variant-specific test cases to the existing ArticleBody test file:
  - WithSidebar variant renders two-column layout
  - WithSidebar shows takeaways and author bio in sidebar
  - WithSidebar hides sidebar sections when fields are empty
  - Wide variant renders full-width content
  - Wide variant shows takeaways inline and author bio as full-width band
  - All variants handle missing optional fields and editing mode correctly

Follow `docs/ai/skills/sitecore-add-variants.md` for the variant creation workflow.

## Acceptance criteria

- [ ] `WithSidebar` named export added — two-column with sticky sidebar containing takeaways + author bio
- [ ] `Wide` named export added — full-width body, inline takeaways, full-width author bio band
- [ ] Headless Variants container created for ArticleBody in Sitecore
- [ ] 3 Variant Definition items created: `Default`, `WithSidebar`, `Wide`
- [ ] Variant Definition names exactly match TSX named exports
- [ ] Tests added and passing for WithSidebar and Wide variants
- [ ] All variants handle conditional sections and editing mode correctly
- [ ] Manifest updated with variant item IDs

## Blocked by

- Issue 004: ArticleBody — Default variant (needs the base component and rendering to exist)
