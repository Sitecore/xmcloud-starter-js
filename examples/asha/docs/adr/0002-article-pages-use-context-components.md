# ADR 0002: Article pages use context components reading route fields

## Status

Accepted

## Context

The project needs an Article page type for blog posts, news articles, and editorial content. The existing component library (19 UIIM components) is entirely datasource-based — each component reads from its own datasource item.

For article pages, the content (title, body, author, image, publication date) is inherently page-scoped. An article's title and body belong to that specific page, not to a reusable content item that could be shared across pages.

## Decision

Article-specific components (ArticleHero, ArticleBody) are **context components** that read from route/page fields on the Article Page Template. They do not use datasources or ComponentQuery.

The Article Page Template inherits from the base page template and adds an "Article Data" section with six fields: ArticleContent, ArticleImage, ArticleAuthor (Droptree to Person), ArticlePublicationDate, ArticleKeyTakeaways, ArticleReadTime.

## Alternatives considered

1. **Datasource components for article content** — Each article section (hero, body, takeaways) backed by its own datasource item. Rejected because article content is inherently page-scoped, and requiring authors to create separate datasource items for the article's own body text adds friction without benefit.

2. **Hybrid approach (article-starter pattern)** — ComponentQuery with `externalFields` reading route fields plus a datasource for component-specific fields. Used by `kit-nextjs-article-starter`. Rejected for this project because it adds query complexity for no gain when all fields can live on the route template.

3. **Single monolithic article component** — One component renders the entire article page. Rejected because it prevents authors from placing other components (CTAs, banners) between article sections and eliminates variant flexibility per section.

## Consequences

- Authors fill in article content on the page item itself, not via datasource selection — simpler authoring workflow.
- ArticleHero and ArticleBody are not reusable on non-article pages — they depend on route fields that only exist on the Article template.
- The `sitecore-create-context-component` skill handles these components. A new `sitecore-create-page-template` skill handles the template creation.
- Datasource-based components (CTAs, banners, feature blocks) can still be dropped onto article pages alongside context components.
- The component registry (homepage sections) remains separate from the page template registry (page types).
