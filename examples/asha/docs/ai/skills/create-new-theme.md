# Create new theme (Skin)

Create a new visual brand theme for **site-base** multi-theme hosting. Themes are selected
per Sitecore site via the Site definition **Skin** field, not via a dedicated rendering host.

## Trigger hints
Use this skill when the user asks to:
- "create a new theme" / "create new theme" from a site
- "add a brand theme" / "add a skin" for a client URL
- turn a website's look into a selectable `data-theme`

## Relationship to `sitecore-extract-theme`
`sitecore-extract-theme` produces a **theme YAML** (`docs/ai/themes/<client>.theme.yaml`) — the
brand analysis. This skill **consumes** those extracted values and writes the **actual code
wiring** so the theme becomes selectable at runtime. Run extraction first, then wire it in.

---

## The theme model (read before editing)

site-base is a **multi-theme rendering host**. One RH serves many Sitecore sites; each site
picks a Skin.

```
Sitecore Site definition (template {E46F3AF2-39FA-4866-A157-7017C4B2A40C})
  field Skin = "<key>"
       ↓
src/lib/theme/site-skins.ts   (mirrors Skin; Edge sites.json has no custom fields)
       ↓
resolveTheme({ site }) → AppTheme
       ↓
<html data-theme="<key>">     ([site]/layout.tsx via ApplySiteTheme)
       ↓
src/assets/styles/themes/<key>.css + fonts.css
```

Resolution order (`resolveTheme`):
1. Explicit `skin` argument (if ever passed from Sitecore)
2. `SITE_SKINS[site]`
3. Site name itself, if it is a registered theme key
4. `NEXT_PUBLIC_APP_THEME` (local / single-site fallback only)
5. `bcbst` default

### Standard tokens (required)

Every theme must set the tokens listed in:
- `src/lib/theme/standard-tokens.ts`
- `src/assets/styles/themes/_standard-tokens.css` (comment template)

Themes **may add extra tokens** (color scales, semantic surfaces, dark mode) in the same
file or a companion `<key>-tokens.css` — see `rockland` / `pkm`.

### Files a new theme touches

| # | File | What to add |
|---|------|-------------|
| 1 | `src/lib/theme/themes.ts` | Add `'<key>'` to `APP_THEMES` |
| 2 | `src/assets/styles/themes/<key>.css` | Full `[data-theme='<key>']` color block |
| 3 | `src/assets/styles/themes/fonts.css` | `html[data-theme='<key>']` font stacks |
| 4 | `src/app/globals.css` | `@import '../assets/styles/themes/<key>.css';` |
| 5 | `src/app/layout.tsx` | `next/font` load if new Google font(s) needed |
| 6 | `src/lib/theme/site-skins.ts` | Map site name(s) → `'<key>'` |
| 7 | `.env.remote.example` | Document the Skin key in the options comment |
| 8 | Sitecore | Set Site definition **Skin** field to `<key>` (remind user / set via MCP if asked) |

Do **not** edit `.env.local`. For local testing without a site route, they may set
`NEXT_PUBLIC_APP_THEME=<key>` as fallback.

Human overview: `src/assets/styles/themes/README.md`

---

## Workflow

Copy this checklist and track progress:

```
Theme creation progress:
- [ ] Step 1: Extract brand values from the URL
- [ ] Step 2: Choose the Skin / theme key
- [ ] Step 3: Register the key (themes.ts)
- [ ] Step 4: Add color tokens (themes/<key>.css)
- [ ] Step 5: Add font stacks (themes/fonts.css)
- [ ] Step 6: Import CSS + load fonts (globals.css, layout.tsx)
- [ ] Step 7: Map site → skin (site-skins.ts)
- [ ] Step 8: Document + Sitecore Skin field
- [ ] Step 9: Verify build/lint and present to user
```

### Step 1 — Extract brand values from the URL

Follow the `sitecore-extract-theme` skill (`docs/ai/skills/sitecore-extract-theme.md`) to run
the Playwright scraper and produce a theme YAML:

```bash
node docs/ai/scripts/site-scraper.mjs --url <CLIENT_URL> --output docs/ai/themes/<client-kebab>
```

Collect:
- **Colors** (hex): primary, primary-foreground, accent, accent-foreground, background,
  foreground, secondary, muted/border, and any dark header/footer color.
- **Fonts**: heading + body. Prefer Google Fonts (`next/font/google`). Substitute proprietary
  fonts and note the substitution.

### Step 2 — Choose the Skin key

Lowercase, no spaces (`bcbst`, `dwyeromega`, `rockland`). Prefer matching the Sitecore site
name when the brand owns that site. Confirm it does not already exist in `APP_THEMES`.

### Step 3 — Register the key (`src/lib/theme/themes.ts`)

```ts
export const APP_THEMES = [..., '<key>'] as const;
```

Do not change `DEFAULT_THEME` (`bcbst`) unless asked.

### Step 4 — Add color tokens (`src/assets/styles/themes/<key>.css`)

Start from `_standard-tokens.css`. Set **all** standard color tokens.

For large official brand systems (scales, dark mode), also add
`src/assets/styles/themes/<key>-tokens.css` and `@import` it from `<key>.css`, then keep a
small bridge for portal aliases (`--color-card`, `--color-light`, etc.) like `rockland.css`.

If primary is dark (footers/hero bands):

```css
[data-theme='<key>'] .bg-primary {
  color: var(--color-primary-foreground);
}
```

Hover colors: darken ~10–15%. Overlay RGB: space-separated (e.g. `#2a2b67` → `42 43 103`).

### Step 5 — Add font stacks (`src/assets/styles/themes/fonts.css`)

```css
html[data-theme='<key>'] {
  --font-body: var(--font-<body-var>), '<Body Font>', ui-sans-serif, system-ui, sans-serif;
  --font-heading: var(--font-<heading-var>), '<Heading Font>', ui-sans-serif, system-ui, sans-serif;
  --font-accent: var(--font-<heading-var>), '<Heading Font>', ui-sans-serif, system-ui, sans-serif;
  --font-weight-heading: 700;
}
```

Only add extra brand rules (letter-spacing, CTA shapes) when clearly required.

### Step 6 — Import CSS + load fonts

In `src/app/globals.css`, add:

```css
@import '../assets/styles/themes/<key>.css';
```

In `src/app/layout.tsx`, declare any new `next/font/google` faces and append `.variable` to
`fontVariables`. Reuse an existing font declaration when possible.

### Step 7 — Map site → skin (`src/lib/theme/site-skins.ts`)

```ts
export const SITE_SKINS = {
  ...,
  '<sitecore-site-name>': '<key>',
};
```

If the Sitecore site name equals the Skin key, convention already works — still add the
entry so the map stays a readable inventory.

### Step 8 — Document + Sitecore Skin field

Update `.env.remote.example` Skin options comment.

Remind the user (or set via Marketer MCP if requested) to set:

- Path: `/sitecore/content/<collection>/<site>/Settings/Site Grouping/<site>`
- Template: Site `{E46F3AF2-39FA-4866-A157-7017C4B2A40C}`
- Field: **Skin** = `<key>`

RenderingHost should point at the shared **site-base** RH, not a per-brand RH.

### Step 9 — Verify and present

```bash
npm run lint
npm run build
```

Present: Skin key, palette (primary/accent/foreground), fonts (+ substitutions), site map
entries, and Sitecore Skin reminder. Ask for confirmation before considering the theme done.

---

## Verification checklist

- [ ] Key in `APP_THEMES`
- [ ] Full standard token set in `themes/<key>.css` (extras allowed after)
- [ ] `.bg-primary` contrast fix if primary is dark
- [ ] Font block in `themes/fonts.css`; `--font-*` names match `layout.tsx`
- [ ] Theme CSS imported in `src/app/globals.css`
- [ ] Site mapped in `site-skins.ts`
- [ ] `.env.remote.example` updated
- [ ] User reminded to set Sitecore **Skin** field
- [ ] `npm run lint` and `npm run build` pass

## Do not

- Do not edit `.env.local` or any `.env.*.local`.
- Do not change the default theme unless asked.
- Do not leave a theme's **standard** token set partially defined.
- Do not add a proprietary font that `next/font/google` cannot load — substitute and note it.
- Do not create a new rendering host / example app for a brand theme — use site-base + Skin.
