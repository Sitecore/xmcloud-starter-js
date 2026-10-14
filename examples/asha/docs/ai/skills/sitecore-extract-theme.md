# Sitecore extract client theme

Use this skill when creating a demo for a client and you need to capture their brand's visual identity from their website.

## Trigger hints
Use this skill when:
- the user provides a screenshot of a client website for demo creation
- the user provides a client website URL (will be screenshotted first)
- the user asks to "match" or "replicate" a client's look and feel
- the user asks to extract a brand theme, color palette, or design tokens
- the demo orchestrator needs a theme before building components

## Primary input: screenshot

The screenshot is the **primary source of truth** for theme extraction. Playwright scraper output (CSS tokens, meta tags) is supplementary data that improves accuracy.

| Available input | Extraction approach |
|---|---|
| Playwright scraper output + screenshot | Best: CSS tokens for exact values, screenshot for visual tone assessment |
| Screenshot only (scraper failed) | Good: analyze screenshot for colors, typography, layout, tone. Use web search for font names and hex codes if needed. Set confidence to "medium". |
| URL only (no screenshot yet) | Run Playwright to get screenshot first. If it fails, ask user for screenshot. Never extract theme from web search alone. |
| Web search results only | **Insufficient.** Web search provides brand-level info (logo colors, font names) but misses page-specific layout density, section backgrounds, card styles, spacing. Always require at least a screenshot. |

## Output
A populated theme file at:
```
docs/ai/themes/<client-kebab>.theme.yaml
```

## Template
Read the theme format from:
```
docs/ai/templates/client-theme.template.yaml
```

## Example
See a completed theme at:
```
docs/ai/themes/eurobank.theme.example.yaml
```

---

## Required workflow

### Step 0 — Ensure Playwright is installed

If this is the first time running the scraper, install Playwright and Chromium:

**Windows (cmd or PowerShell):**
```
.\setup.cmd
```
Or with PowerShell directly:
```powershell
powershell -ExecutionPolicy Bypass -File docs\ai\scripts\setup.ps1
```

**macOS / Linux:**
```bash
bash docs/ai/scripts/setup.sh
```

This installs Playwright and Chromium. Only needed once.

### Step 1 — Run the site scraper

Run the bundled Playwright script to render the client site with full JavaScript execution:

**macOS / Linux:**
```bash
node docs/ai/scripts/site-scraper.mjs \
  --url <CLIENT_URL> \
  --output docs/ai/themes/<client-kebab>
```

**Windows:**
```cmd
node docs\ai\scripts\site-scraper.mjs --url <CLIENT_URL> --output docs\ai\themes\<client-kebab>
```

This produces:
- `screenshot-desktop.png` — full page at 1440×900
- `screenshot-mobile.png` — full page at 390×844 (iPhone 14 Pro)
- `screenshot-hero.png` — hero/above-the-fold viewport only
- `extracted-styles.json` — computed CSS tokens from the rendered DOM
- `meta.json` — meta tags, Google Fonts URLs, OG data, logo/image URLs
- `images/` — downloaded logo, hero background, OG image, favicon

**Why Playwright instead of simple HTTP fetch:** Many modern sites are JavaScript-rendered (React, Next.js, Angular). A simple HTML request returns an empty shell with no styles. Playwright renders the full page in Chromium, executes all JavaScript, waits for lazy-loaded content, and extracts the actual computed styles the user sees.

**If the scraper fails** (site blocks headless browsers, requires auth, CAPTCHA, etc.):
- Try increasing `--wait` to 5000 or 8000 for slow-loading sites
- Try with `--no-images` to reduce requests
- Fall back to basic `web_fetch` of the HTML for partial analysis
- Ask the user for a screenshot if scraping is not possible
- Set `extraction.confidence: "low"` and note the limitation

### Step 2 — Read the scraper output

Read the two JSON files produced by the scraper:

**`extracted-styles.json`** contains computed CSS from the rendered page:
- `colors.bodyBackground` / `colors.bodyColor` — page background and text
- `colors.headerBackground` / `colors.headerColor` — nav/header bar
- `colors.footerBackground` / `colors.footerColor` — footer area
- `colors.primaryButtonBackground` / `colors.primaryButtonColor` — primary action color
- `colors.primaryButtonBorderRadius` — button shape
- `colors.linkColor` — link/accent color
- `typography.*` — font families, sizes, weights for h1–h3, body, and paragraphs
- `shape.*` — card border-radius, box-shadow, image border-radius
- `cssVariables` — any CSS custom properties found in `:root`

**`meta.json`** contains:
- `themeColor` — `<meta name="theme-color">` value (often the primary brand color)
- `googleFontsLinks` — URLs for Google Fonts stylesheets
- `fontFaces` — `@font-face` declarations found in same-origin stylesheets
- `ogImage` / `ogTitle` / `ogDescription` — Open Graph data
- `logoCandidates` — URLs of potential logo images
- `heroBgImage` — background-image URL from the hero section

### Step 3 — Inspect the screenshots

Open `screenshot-hero.png` and assess visually:
- **Hero layout style:** full-bleed-image, split-image-text, centered-overlay, video-background, gradient, or minimal-text
- **Card style** (if cards visible in the screenshot): bordered, elevated, flat, image-top, horizontal
- **Nav style:** transparent-overlay, solid-bar, minimal, mega-menu
- **Overall tone:** corporate, modern, playful, luxury, minimal, bold, editorial
- **Color mode:** light, dark, or mixed
- **Contrast level:** low, medium, high
- **Imagery style:** photography, illustration, abstract, minimal, icon-heavy
- **Spacing density:** compact, normal, spacious

Open `screenshot-mobile.png` to check responsive behavior.

### Step 3.5 — Screenshot-first analysis (when scraper failed)

If the Playwright scraper failed (403, auth wall, CAPTCHA) but a screenshot is available:

1. **Color extraction from screenshot:**
   - Identify the dominant header/nav background color
   - Identify the primary button color (usually the most prominent colored button)
   - Identify link/accent color
   - Identify page background and text colors
   - Note section background alternation (white, gray, dark sections)
   - Use web search for the client's brand guidelines to find exact hex codes

2. **Typography from screenshot:**
   - Identify heading style (serif vs sans-serif, weight, transform)
   - Identify body text style
   - Use web search for the client's font name (e.g., "Eurobank font family" or check Brandfetch)
   - Find a Google Fonts substitute if the font is proprietary

3. **Layout and spacing:**
   - Assess section padding density (compact, normal, spacious)
   - Note card border-radius (sharp, slightly rounded, very rounded)
   - Note shadow depth (none, subtle, medium, dramatic)
   - Note button shape (sharp, rounded, pill)

4. **Set extraction metadata:**
   ```yaml
   extraction:
     confidence: "medium"
     method: "screenshot-analysis"
     notes:
       - "Playwright scraper failed (403). Theme extracted from screenshot + web search."
       - "Hex codes are approximations from visual analysis — may differ from actual CSS values."
   ```

This approach was validated during the Eurobank demo build — web search provided brand colors, and the screenshot provided layout/spacing/tone details that web search alone missed.

### Step 4 — Map to theme YAML

Using the data from Steps 2–3, populate the theme template:

**Color mapping priority:**
1. CSS custom properties from `cssVariables` (most reliable — these are the design system tokens)
2. `meta.themeColor` (good signal for primary brand color)
3. Computed styles: `primaryButtonBackground` → `colors.primary`, `linkColor` → `colors.accent` or `colors.secondary`
4. Header/footer backgrounds for those specific fields
5. Visual confirmation from screenshots

**RGB to hex conversion:** The scraper returns `rgb()` and `rgba()` values from computed styles. Convert them to hex for the theme YAML. For example, `rgb(0, 82, 204)` → `#0052cc`.

**Typography mapping:**
1. `googleFontsLinks` from `meta.json` → extract font family names and construct `googleFontsUrl`
2. `fontFaces` → note any custom fonts, suggest Google Fonts alternatives for the demo
3. Computed `fontFamily` values → confirm heading vs. body font
4. Computed `fontSize` values → map to the scale (hero, h1, h2, h3, body, small)
5. Computed `fontWeight` → `headingWeight`, `bodyWeight`

**Shape mapping:**
- `primaryButtonBorderRadius` → `shape.buttonRadius`
- `shape.cardBorderRadius` → `shape.cardRadius`
- `shape.imgBorderRadius` → `shape.imageRadius`
- `shape.cardBoxShadow` → `shape.shadowStyle` (none/subtle/medium/dramatic)
- For general `borderRadius`, use the most common radius observed across elements

**Spacing mapping:**
- Assess overall density from the screenshot and hero padding values
- `containerMaxWidth` from body or main container `max-width`

### Step 5 — Generate Tailwind + CSS variable outputs

From the mapped values, generate:

**The `tailwind` block:**
```yaml
tailwind:
  colors:
    brand:
      primary: "#0052cc"
      secondary: "#172b4d"
      accent: "#ff5630"
  fontFamily:
    heading: ["Montserrat", "sans-serif"]
    body: ["Open Sans", "sans-serif"]
  borderRadius:
    DEFAULT: "0.5rem"
    button: "0.375rem"
    card: "0.75rem"
```

**The `cssVariables` string:**
```css
:root {
  --brand-primary: #0052cc;
  --brand-primary-foreground: #ffffff;
  --brand-secondary: #172b4d;
  --brand-secondary-foreground: #ffffff;
  --brand-accent: #ff5630;
  --brand-accent-foreground: #ffffff;
  --brand-bg: #ffffff;
  --brand-fg: #172b4d;
  --brand-muted: #f4f5f7;
  --brand-muted-fg: #6b778c;
  --brand-header-bg: #172b4d;
  --brand-header-fg: #ffffff;
  --brand-footer-bg: #172b4d;
  --brand-footer-fg: #c0c8d0;
  --brand-border: #dfe1e6;
  --brand-ring: #0052cc;
  --brand-heading-font: 'Montserrat', sans-serif;
  --brand-body-font: 'Open Sans', sans-serif;
  --brand-radius: 0.5rem;
  --brand-button-radius: 0.375rem;
  --brand-card-radius: 0.75rem;
}
```

### Step 6 — Assess extraction confidence

Set `extraction.confidence` based on:
- **high**: scraper ran successfully, CSS custom properties found, Google Fonts link present, visual tone clear from screenshot
- **medium**: scraper ran but some values inferred from computed styles rather than explicit tokens, or fonts not clearly identified
- **low**: scraper failed and fell back to screenshot-only analysis, or site uses heavily obfuscated CSS

Set `extraction.method`:
- **"playwright-full"**: scraper ran successfully, both JSON + screenshots available
- **"playwright-partial"**: scraper ran but some elements not found (e.g. no cards, no clear hero)
- **"html-fetch"**: fell back to basic HTML fetch (no JS rendering)
- **"visual-only"**: screenshot-only analysis (no CSS data)

Add notes for anything ambiguous — guessed values, replaced fonts, color conflicts between sections.

### Step 7 — Write the theme file

Save the completed theme to:
```
docs/ai/themes/<client-kebab>.theme.yaml
```

### Step 8 — Present for review

Show the user:
- The hero screenshot for visual context
- The extracted color palette (primary, secondary, accent + backgrounds)
- The font families (and any substitutions made)
- The tone assessment (overall, heroStyle, cardStyle, navStyle)
- Anything flagged as low-confidence
- The downloaded logo/images if available

Ask: "Does this capture the brand correctly? Any colors, fonts, or layout impressions to adjust?"

Do not proceed to component building until the user confirms the theme.

---

## Handling edge cases

### Sites that block Playwright
Some sites detect headless browsers via User-Agent, navigator properties, or WebDriver flags. The scraper uses a realistic User-Agent and standard viewport, but some aggressive anti-bot systems will still block it.

If blocked:
1. Try increasing `--wait` to 8000 (some sites load anti-bot checks first)
2. If still blocked, fall back to `web_fetch` for raw HTML analysis
3. Ask the user for a manual screenshot
4. Note in `extraction.notes`

### Sites behind auth / VPN
If the URL requires login or is internal:
1. Ask the user to provide screenshots (desktop + mobile if possible)
2. Ask the user for the brand colors and font names if known
3. Do visual-only analysis
4. Set confidence to "low"

### Single-page applications with complex routing
Some SPAs use hash routing or load content via API calls after initial render. The scraper's `networkidle` wait and scroll-trigger usually handle this, but if content is still missing:
1. Increase `--wait` to 8000 or 10000
2. If critical sections are behind interaction (tabs, accordions), note in `extraction.notes` that only the default/initial state was captured

### Sites with multiple themes (dark sections, colored bands)
Extract the dominant/default theme. For section-specific colors (e.g. dark hero, light content, dark footer), capture them in their respective fields (`headerBackground`, `footerBackground`). Note the color variety in `extraction.notes` so the component builder knows to use appropriate section backgrounds.

### Proprietary / paid fonts
If the site uses fonts from Adobe Fonts, Typography.com, or custom proprietary fonts:
1. Record the actual font name in a note
2. Suggest a close Google Fonts alternative for the demo
3. Set the alternative in the theme fields
4. Note the substitution clearly in `extraction.notes`

---

## Verification checklist

- [ ] Screenshot available (from Playwright, user-provided, or both)
- [ ] Scraper ran successfully OR screenshot-first fallback documented
- [ ] Screenshots captured: desktop, mobile, hero
- [ ] `extracted-styles.json` read and values mapped
- [ ] `meta.json` read for fonts, theme-color, OG data
- [ ] All color fields populated with hex values
- [ ] Font families identified (or alternatives suggested for proprietary fonts)
- [ ] Google Fonts import URL captured
- [ ] Typography scale estimated from computed sizes
- [ ] Spacing density assessed
- [ ] Shape (border-radius, shadows) captured from computed styles
- [ ] Visual tone fields filled from screenshot inspection
- [ ] Tailwind config block generated
- [ ] CSS variables block generated
- [ ] Extraction confidence and method rated
- [ ] Key images downloaded (logo, hero-bg, og-image)
- [ ] Theme file saved to `docs/ai/themes/<client-kebab>.theme.yaml`
- [ ] Theme presented to user for review and confirmed

---

## Do not skip the review step

The theme drives the entire demo's visual identity. Always present it to the user and ask for confirmation or adjustments before proceeding to component building. A wrong primary color or font cascades through every component.
