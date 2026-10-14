# Issue 007: Article Layout Partial Design

**Label:** `ready-for-agent`

## Parent

PRD: Article Page Template (`docs/adr/prd-article-page-template.md`)

## What to build

Create a Partial Design that pre-places ArticleHero and ArticleBody on new article pages, so authors don't have to manually add components every time they create an article.

**Sitecore work:**
- Navigate to the site's Partial Designs folder (typically at `/sitecore/content/<siteCollection>/<siteName>/Presentation/Partial Designs/`)
- Create a new Partial Design item named "Article Layout"
- Add the ArticleHero rendering to the `headless-main` placeholder (first position)
- Add the ArticleBody rendering to the `headless-main` placeholder (second position)
- On the Article Page template's `__Standard Values`, set the `Partial Designs` field to reference the "Article Layout" partial design item

After this slice, creating a new Article page under `/Home/Articles/` should automatically include ArticleHero and ArticleBody in `headless-main`, ready for content authoring. Authors can still add additional datasource-based components (CTAs, banners) between or after the pre-placed components.

**Verification:**
- Create a test Article page in Sitecore
- Verify that ArticleHero and ArticleBody appear automatically in `headless-main`
- Verify that the page renders in preview mode
- Verify that additional components can be added to the page alongside the pre-placed ones

## Acceptance criteria

- [ ] Partial Design "Article Layout" created under the site's Partial Designs folder
- [ ] ArticleHero placed in `headless-main` (first position)
- [ ] ArticleBody placed in `headless-main` (second position)
- [ ] Article Page template `__Standard Values` references the "Article Layout" partial design
- [ ] New Article pages automatically include both components when created
- [ ] Additional components can be added to article pages alongside pre-placed ones
- [ ] Manifest updated with Partial Design item ID and association status

## Blocked by

- Issue 003: ArticleHero — Default variant (rendering must exist to place in Partial Design)
- Issue 004: ArticleBody — Default variant (rendering must exist to place in Partial Design)
