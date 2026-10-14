---
name: create-new-theme
description: Create a new visual brand theme (Skin) for site-base multi-theme hosting. Themes are selected by Sitecore Site definition Skin field → site-skins map → <html data-theme>. Use when the user asks to "create a new theme", "create new theme", "add a brand theme", or "add a skin" from a site URL.
---

Read and follow `docs/ai/skills/create-new-theme.md` in full before proceeding.

This skill turns a website URL into a selectable **Skin** (`data-theme` key). It reuses
`sitecore-extract-theme` (and `docs/ai/scripts/site-scraper.mjs`) to pull brand colors and
fonts, then wires those values into the theme package files:

1. `src/lib/theme/themes.ts` — add the key to `APP_THEMES`
2. `src/assets/styles/themes/<key>.css` — standard color tokens (+ optional extras)
3. `src/assets/styles/themes/fonts.css` — `html[data-theme='<key>']` font stacks
4. `src/app/layout.tsx` — load Google fonts via `next/font` if needed
5. `src/app/globals.css` — `@import` the new theme CSS
6. `src/lib/theme/site-skins.ts` — map Sitecore site name(s) → Skin
7. `.env.remote.example` — document the Skin key (local fallback only)

Also set/remind the user to set the Sitecore Site definition **Skin** field to `<key>`.

Never edit `.env.local`. For local single-site testing only, they may set
`NEXT_PUBLIC_APP_THEME=<key>` as a fallback when no site Skin is resolved.
