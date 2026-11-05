# ADR 0014: Translated pages, with the visitor's language remembered in a cookie

## Status

Accepted (2026-11-05). Environment: `sitecore-demo`, with 5 languages: `en`, `ja-JP`, `de-DE`, `ar-AE`, `es-ES`.

## Context

- **The content is translated.** Home, `/Articles` and the 28 articles have published versions in all 5 languages. The ABM landing pages (`/lp/*`) are English only.
- **The rendering host served only English.** `src/i18n/routing.ts` listed only the default language. `LocaleProxy` takes the language only from the first URL segment: there's no cookie or `Accept-Language` fallback.
- **Sitecore links carry no language.** The site has Language Embedding off, so Edge returns `/Articles/...` for every language. That covers Link fields, rich text, navigation and `url.path`. Without a fix, every internal link on `/ja-JP/...` would lead back to English.

## Decision

1. **Serve the site languages under a prefix.** `routing.locales` lists the 5 languages; the default stays unprefixed (`localePrefix: 'as-needed'`). The list must equal the Sitecore language names with published versions.
2. **Remember the visitor's language** (`src/i18n/locale-preference.ts`, `src/proxy.ts`):
   - A visitor page request to a prefixed path sets the `NEXT_LOCALE` cookie to that language.
   - An unprefixed page request with a non-default `NEXT_LOCALE` gets a 307 redirect to the same path in that language.
   - Excluded: requests in draft mode (Pages editing and preview), `sc_itemid` requests, non-GET/HEAD requests, and paths with a file extension.
   - Visitors without the cookie, including crawlers, get the default language.
3. **Language switcher in the header.** It appears in the `Default`, `Transparent` and `Sitecore` variants. It sets the cookie and opens the same path in the chosen language. It's hidden when there's one language or while editing. `Minimal` is left out: it's used on the English-only ABM pages.
4. **Language and direction.** The page wraps its content in `<div lang dir class="contents">`, and `DocumentLocale` updates `<html lang dir>`. Arabic renders right to left.

## Alternatives rejected

- **Language Embedding on the site.** It embeds the language in every URL, including the default (`/en/Articles`). It needs a full republish and a change to the search URLs, and it changes every existing English URL.
- **Prefixing hrefs in every component.** That's 23 components, and links inside rich text would still lose the language.

## Consequences

- Translated pages keep the language across internal links, rich text included, at the cost of one redirect per unprefixed link.
- A page with no version in the remembered language returns 404 after the redirect (for example `/lp/*` for a Japanese visitor). Choosing English in the switcher resets this.
- Arabic is mirrored by the browser. Components using physical spacing (`ml-*`, `left-*`) don't flip, so Arabic layouts may need RTL-specific variants.
- Search UI labels come from Sitecore dictionary keys with English fallbacks. Translating them is content work in Sitecore.
- Merging this to another branch serves these 5 languages there too. Change `SITE_LANGUAGES` in `src/i18n/routing.ts` per environment.
