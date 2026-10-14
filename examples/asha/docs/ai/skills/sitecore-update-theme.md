# Update theme tokens

Replace the live brand tokens in this starter so the site picks up a client's colors, fonts, and shape. Components already use Tailwind utilities (`bg-primary`, `text-foreground`, `font-heading`, `rounded-default`). Changing the tokens restyles those utilities. Do not restyle components one by one.

## When to use

- "update the theme" / "update the tokens" / "retheme" / "restyle"
- "apply this brand" / "match this site" with a URL and/or screenshot
- the user names primary, secondary, accent, or other colors to apply

## Not this skill

| Ask | Skill |
|-----|--------|
| Write a theme YAML only, do not change CSS | `sitecore-extract-theme` |
| Add a new selectable Skin (`data-theme`) | `create-new-theme` |
| Pixel-match one component's layout | `sitecore-create-demo-variants` |

## Inputs

| Input | Required | Role |
|-------|----------|------|
| URL | Required unless a screenshot is attached | Run the scraper for exact CSS |
| Screenshot | Required unless the scraper captures one | Visual source of truth for tone, which color is primary, and shape |
| Named colors / fonts / radii | Optional | Authoritative. A stated primary replaces anything scraped or seen |

If the user gives neither a URL nor a screenshot, ask for one. A color list alone is enough to update color tokens; still ask for a screenshot before changing fonts or radius.

## Token files

| File | What to change |
|------|----------------|
| `src/assets/styles/globals.css` | Brand values inside the `@theme` block. The file says it was auto-generated; edit the brand tokens anyway. Do not regenerate or rewrite the spacing, blur, width, or font-size ramps. |
| `src/Layout.tsx` | `next/font` declarations and their `variable` names |
| `src/app/globals.css` | The `html` font stack and `color` only when they still name the previous brand |
| `docs/ai/themes/<client-kebab>.theme.yaml` | Record, from `docs/ai/templates/client-theme.template.yaml` |

Never edit `.env.local`.

## Workflow

```
Update theme progress:
- [ ] Step 1: Collect inputs and lock user overrides
- [ ] Step 2: Capture the site (URL) and read the screenshot
- [ ] Step 3: Resolve every semantic token
- [ ] Step 4: Write @theme, fonts, and the theme YAML
- [ ] Step 5: Show the token diff
```

### Step 1 — Lock user overrides

Copy any value the user stated into a short override list before looking at the site. Examples: "primary is #003087", "secondary #F5A800", "headings are Georgia", "buttons are square".

Those values are final. Do not "correct" them from the screenshot.

### Step 2 — Capture the site and read the screenshot

When a URL is present, follow `sitecore-extract-theme` (`docs/ai/skills/sitecore-extract-theme.md`) through the scraper and screenshot read. Do not stop at the YAML — this skill continues into the CSS.

```bash
node docs/ai/scripts/site-scraper.mjs --url <URL> --output docs/ai/themes/<client-kebab>
```

Read, in order:

1. The user-attached screenshot, if any
2. `screenshot-hero.png`, then `screenshot-desktop.png`
3. `extracted-styles.json` and `meta.json` (exact hex and font names)

If the scraper fails, continue from the user screenshot. Say so in `extraction.notes`. Do not invent a palette from web search alone when a screenshot exists; web search may only confirm a font name or an official hex.

### Step 3 — Resolve every semantic token

Fill every row. Priority: **user override → computed CSS → screenshot**. Convert `rgb()` / `rgba()` to hex.

**Observed roles**

| Role | Where to look |
|------|----------------|
| Primary | Primary button fill, else `meta.themeColor`, else the dominant brand color in the screenshot |
| Primary foreground | Text on that button |
| Secondary | Second brand color, or a tinted surface used for secondary buttons |
| Accent | Link color or a highlight that is not the primary button |
| Background / foreground | Page background and body text |
| Header / footer | Nav bar and footer fills and text |
| Muted | Alternating section or card fill |
| Border | Hairline dividers and input borders |
| Radius | Primary button `border-radius` |
| Heading / body font | `h1` vs body computed `font-family`, confirmed on the screenshot |

**Derived tokens** (compute these; do not leave the previous brand's values)

| Token | Rule |
|-------|------|
| `--color-primary` | Observed primary |
| `--color-primary-foreground` | Observed button text, else `#ffffff` when primary is dark, else `#111111` |
| `--color-primary-hover` | Darken a light primary ~12%, lighten a dark primary ~12% |
| `--color-secondary` | Observed secondary, else a light tint of primary (~8% primary on white) |
| `--color-secondary-foreground` | Text on secondary, else foreground |
| `--color-secondary-hover` | Secondary mixed ~15% toward foreground |
| `--color-accent` | Observed accent, else primary |
| `--color-accent-foreground` | Text on accent, same contrast rule as primary foreground |
| `--color-background` | Page background |
| `--color-foreground` | Body text |
| `--color-card` / `--color-popover` | Background, unless cards are a distinct surface |
| `--color-card-foreground` / `--color-popover-foreground` | Foreground |
| `--color-muted` | Observed muted surface, else a step between background and border |
| `--color-muted-foreground` | Secondary text |
| `--color-border` / `--color-input` | Observed border |
| `--color-ring` | Primary, or the focus color if one is obvious |
| `--color-tertiary` | Same as secondary unless a third surface exists |
| `--color-tertiary-foreground` / `--color-tertiary-hover` | Match the secondary pair |
| `--color-dark` | Header or footer fill when that fill is dark, else foreground |
| `--color-dark-foreground` | Text on that dark fill |
| `--color-dark-hover` | Dark mixed ~12% toward background |
| `--color-light` | Background or the lightest surface |
| `--color-light-foreground` | Foreground |
| `--color-light-hover` | Light mixed ~8% toward muted |
| `--color-overlay` | Foreground at ~70% opacity, 8-digit hex (`#112233b3`) |
| `--color-brand-black` | Foreground. `text-brand-black` and the base text color depend on it |
| `--background-image-gradient` | `linear-gradient(180deg, <primary> 0%, <foreground-or-black> 100%)` |
| `--background-image-gradient-secondary` | Same primary, horizontal, primary → dark → primary |
| `--font-family-heading` / `--font-family-body` / `--font-family-accent` | See fonts below |
| `--border-radius-default` and `--radius` | Button radius. Pill buttons → `9999px` only if most buttons are pills; otherwise the measured radius. Leave `--border-radius-full` as-is |
| `--color-destructive*` | Leave unchanged unless the user names an error color |

Contrast: pick `#ffffff` or `#111111` so text on the fill is readable. Do not put a light primary on a white foreground.

**Fonts**

- Use a Google font via `next/font/google` when the family is on Google Fonts.
- If the face is proprietary, keep the real name in the theme YAML notes and load the closest Google substitute. Say which substitute you chose.
- Accent defaults to the heading family unless the site uses a distinct mono or label face.
- Weights: load the weights the site actually uses (at least 400 and the heading weight).

Point the `@theme` font tokens at the `next/font` variables so `font-heading` / `font-body` follow the loaded files:

```css
--font-family-heading: var(--font-heading), '<Heading Family>', ui-sans-serif, system-ui, sans-serif;
--font-family-body: var(--font-body), '<Body Family>', ui-sans-serif, system-ui, sans-serif;
--font-family-accent: var(--font-accent), '<Accent Family>', ui-sans-serif, system-ui, sans-serif;
```

### Step 4 — Write the files

**`src/assets/styles/globals.css`**

Replace only the values listed in Step 3. Keep every other `@theme` custom property (spacing, blur, font-size scale, widths).

**`src/Layout.tsx`**

Replace the `localFont` / `IBM_Plex_Sans` / `IBM_Plex_Mono` setup when the brand fonts differ. Keep the variable names `--font-heading`, `--font-body`, and `--font-accent`, and keep them on `classNamesMain`. Reuse an existing `next/font` declaration when the family is already loaded.

**`src/app/globals.css`**

- Set the `html` `font-family` fallback to the body family (the `*` rule already uses `var(--font-body)`).
- Set `html` `color` to `var(--color-foreground)` if it still references a color this theme does not define. Prefer adding `--color-brand-black` in `@theme` when `text-brand-black` is still used.

**Theme YAML**

Write `docs/ai/themes/<client-kebab>.theme.yaml` from the template, including `cssVariables` for the resolved hex values and `extraction.notes` for overrides, substitutions, and scraper failures.

### Step 5 — Show the diff

Lead with the applied palette, not the process:

- Client name and source URL
- Primary, secondary, accent, background, foreground (hex)
- Heading and body fonts, including any substitute
- Button radius
- Anything the user overrode, and anything estimated from the screenshot only

Then restart is enough for the dev server to pick up CSS and font changes. Do not run a production build unless the user asks.

## Low confidence

Apply immediately when the user supplied the colors, or when scraper CSS and the screenshot agree.

Stop and show the proposed palette before writing files when confidence is low: scraper failed, the screenshot is cropped, or two candidates could be primary. Ask which color is primary. Do not leave the old brand tokens in place after the user answers.

## Do not

- Do not add a new Skin, `data-theme` file, or rendering host.
- Do not rewrite component `className`s to hard-code client hex values.
- Do not edit `.env.local`.
- Do not replace the spacing, blur, or type-size scales.
- Do not drop a semantic color token because the site did not use that role — derive it so the previous brand does not leak through.
- Do not load a proprietary font `next/font` cannot fetch. Substitute and note it.
