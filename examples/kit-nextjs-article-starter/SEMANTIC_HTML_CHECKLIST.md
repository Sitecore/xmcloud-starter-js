# Semantic HTML Quick Reference

Quick checklist for semantic HTML and structured data implementation.

## Table of Contents

- [Quick Implementation Examples](#quick-implementation-examples)
- [Component Checklist](#component-checklist)
- [Quick Validation](#quick-validation)
- [Best Practices](#best-practices)
- [Maintenance](#maintenance)

## Quick Implementation Examples

### Article with Schema

```tsx
<article itemScope itemType="https://schema.org/Article">
  <header>
    <time dateTime={isoDate} itemProp="datePublished">{date}</time>
  </header>
</article>
```

### Figure with Caption

```tsx
<figure>
  <ImageWrapper image={image} />
  <figcaption><Text field={caption} /></figcaption>
</figure>
```

### Navigation

```tsx
<nav aria-label="Breadcrumb">
  {/* Navigation links */}
</nav>
```

## Component Checklist

| Component | Semantic Tags | Schema | Status |
|-----------|--------------|--------|--------|
| ArticleHeader | `<article>`, `<header>`, `<time>` | Article, Person | ✅ |
| ArticleListing | `<section>`, `<article>` | - | ✅ |
| ImageBlock | `<figure>`, `<figcaption>` | - | ✅ |
| AccordionBlock | `<section>` | FAQPage | ✅ |
| GlobalFooter | `<footer>` | Organization | ✅ |
| GlobalHeader | `<header>`, `<nav>` | - | ✅ |
| Breadcrumbs | `<nav>` | BreadcrumbList | ✅ |
| FooterNavigationCallout | `<aside>` | - | ✅ |

## Quick Validation

- **Structured Data**: [Google Rich Results Test](https://search.google.com/test/rich-results)
- **HTML**: [W3C Validator](https://validator.w3.org/)
- **Accessibility**: [WAVE](https://wave.webaim.org/)

## Best Practices

✅ **Do:**

- Use semantic HTML instead of `<div>` where appropriate
- Include `dateTime` attribute in ISO 8601 format for `<time>`
- Add `aria-label` to `<nav>` elements
- Use `<figure>` for images/videos with captions
- Only one `<main>` per page

❌ **Don't:**

- Use generic divs for semantic content
- Skip headings in `<section>` elements
- Forget `dateTime` on `<time>` elements
- Use multiple `<main>` tags

## Maintenance

Review this checklist when:

- Adding new components
- Updating semantic standards
- During code reviews
