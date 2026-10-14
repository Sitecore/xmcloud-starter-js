# Issue 002: Article Page Template + Content Tree

**Label:** `ready-for-agent`

## Parent

PRD: Article Page Template (`docs/adr/prd-article-page-template.md`)

## What to build

Create the Article Page template in Sitecore XM Cloud that inherits from the existing base page template, set up the content tree for article authoring, and update the TypeScript route fields.

**Sitecore template work:**
- Resolve the base page template by inspecting the Home item's template via MCP
- Create an Article Page template under `projectTemplatesRoot/Page Types/Article Page` inheriting from the resolved base template
- Add an "Article Data" template section with six fields:
  - `ArticleContent` (Rich Text)
  - `ArticleImage` (Image)
  - `ArticleAuthor` (Droptree, source set to `dataRoot/People`)
  - `ArticlePublicationDate` (Date)
  - `ArticleKeyTakeaways` (Rich Text)
  - `ArticleReadTime` (Single-Line Text)
- Create `__Standard Values` for the Article Page template

**Content tree work:**
- Create an Articles parent page at `/Home/Articles/` using the base page template
- Set insert options on the Articles parent to allow Article Page as a child template

**Code work:**
- Update `Layout.tsx` `RouteFields` interface with the new article field types. Clean up the aspirational fields (`Content`, `Author`, `PublicationDate`, `Excerpt`, `KeyTakeaways`, `ReadTime`, `Expert`) and replace with the properly prefixed article fields.

Field names are prefixed with `Article` to avoid collision with standard Sitecore field names per project conventions. The `ArticleAuthor` TypeScript type should include nested Person fields for type safety.

Use `docs/ai/catalog/page-template-registry.yaml` for the authoritative field schema. Follow `docs/ai/skills/sitecore-create-page-template.md` for the implementation workflow.

## Acceptance criteria

- [ ] Base page template resolved and ID recorded in manifest
- [ ] Article Page template exists at `projectTemplatesRoot/Page Types/Article Page` inheriting from base
- [ ] "Article Data" section exists with all 6 fields, each with correct `Type` verified via MCP
- [ ] `ArticleAuthor` Droptree field has `Source` set to the People data folder path
- [ ] `__Standard Values` created for Article Page template
- [ ] Articles parent page exists at `/Home/Articles/` using the base page template
- [ ] Insert options on Articles parent page include the Article Page template
- [ ] `Layout.tsx` `RouteFields` updated with article field types, aspirational fields cleaned up
- [ ] Manifest updated with all item IDs, verification status, and `status: complete`

## Blocked by

- Issue 001: Person Data Model (ArticleAuthor Droptree needs People folder to exist)
