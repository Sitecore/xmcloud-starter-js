---
name: sitecore-update-theme
description: >-
  Update the live design tokens in this starter from a client URL, a screenshot,
  and any colors, fonts, or radii the user supplies. Use when the user asks to
  update the theme, update tokens, retheme, restyle, apply a brand, match a
  site, or change primary, secondary, or accent colors. Screenshot and explicit
  user colors win over scraped CSS. This updates the existing token set; it does
  not create a new Skin (create-new-theme) and it does not stop at a theme YAML
  (sitecore-extract-theme).
---

Read and follow `docs/ai/skills/sitecore-update-theme.md` in full before proceeding.

Update the tokens the app already renders with. Do not add a new `data-theme` Skin.

**Inputs, highest priority first:**

1. Colors, fonts, or radii the user states (primary, secondary, accent, background, foreground, and so on)
2. Screenshot (user-supplied, or `screenshot-hero.png` from the scraper) for visual confirmation
3. Playwright computed CSS from the URL, when a URL is available

**Write:**

1. `src/assets/styles/globals.css` — every brand token inside `@theme` (colors, fonts, radius, brand gradients). Leave the spacing, blur, and type-scale ramps alone.
2. `src/Layout.tsx` — `next/font` faces for heading, body, and accent (`--font-heading`, `--font-body`, `--font-accent`)
3. `src/app/globals.css` — base `font-family` / text color only if they still point at the old brand
4. `docs/ai/themes/<client-kebab>.theme.yaml` — the extraction record

Explicit user values always override the scraper and the screenshot. Derive hover, foreground, muted, border, tertiary, dark, light, and overlay so the full semantic set changes together.
