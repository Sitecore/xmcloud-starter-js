# Theme Extraction — Test Prompts

Use these prompts in Cursor to test the `sitecore-extract-theme` skill.
Each prompt should trigger the skill, run the Playwright scraper, and produce a valid theme YAML.

---

## Test 1 — Corporate / Banking (light, formal)
```
Extract the brand theme from https://www.ing.com for a demo build.
```
**Expected:** corporate tone, orange primary, white background, clean sans-serif font.
**Verifies:** scraper handles a major corporate site with dynamic content.

---

## Test 2 — Tech / SaaS (modern, dark accents)
```
I need to build a Sitecore demo that matches the look and feel of https://stripe.com
Extract their visual theme first.
```
**Expected:** modern/minimal tone, purple/indigo primary, geometric sans-serif.
**Verifies:** scraper handles a heavily JS-rendered SaaS site.

---

## Test 3 — Luxury / Retail (editorial)
```
Extract theme from https://www.gucci.com — we are building a demo for a luxury retail client.
```
**Expected:** luxury/editorial tone, dark/black primary, sharp corners, dramatic contrast.
**Verifies:** scraper handles sites with heavy imagery and anti-bot potential.

---

## Test 4 — Screenshot only (no URL fetch)
```
I have a screenshot of the client's homepage but can't share the URL.
Here's the screenshot: [attach screenshot]
Extract what you can for the brand theme.
```
**Expected:** Falls back to visual-only analysis, skips scraper, sets confidence to "low".
**Verifies:** graceful degradation when scraper cannot be used.

---

## Test 5 — Implicit trigger (no explicit "extract theme")
```
We have a deal with Contoso Ltd. Their website is https://www.microsoft.com
Let's start building the demo — begin with their visual identity.
```
**Expected:** Skill triggers from context, runs scraper, produces theme YAML.
**Verifies:** description-based triggering works for indirect requests.

---

## Test 6 — Slow / heavy site
```
Extract the brand theme from https://www.zara.com for a fashion retail demo.
Use extra wait time, the site loads slowly.
```
**Expected:** Agent passes `--wait 8000` to the scraper. Fashion/editorial tone detected.
**Verifies:** agent adjusts scraper parameters when hinted about slow loading.

---

## Validation checklist for each test

After each test, verify:
- [ ] Scraper ran (check for `[scraper] Complete` in terminal output)
- [ ] Screenshots exist: `screenshot-desktop.png`, `screenshot-mobile.png`, `screenshot-hero.png`
- [ ] `extracted-styles.json` has non-null color and typography values
- [ ] `meta.json` has font links or font-face entries
- [ ] Theme file created at `docs/ai/themes/<client-kebab>.theme.yaml`
- [ ] All color fields have valid hex values (not empty, not `rgba(0,0,0,0)`)
- [ ] Font families populated (or alternatives suggested with note)
- [ ] `tone.overall` is reasonable for the site type
- [ ] `tone.heroStyle`, `cardStyle`, `navStyle` are populated
- [ ] `tailwind` block has valid values
- [ ] `cssVariables` block is a valid CSS `:root` declaration
- [ ] `extraction.confidence` is set and makes sense
- [ ] `extraction.method` reflects what actually happened (playwright-full vs fallback)
- [ ] `extraction.notes` has at least one entry
- [ ] Images downloaded to `images/` folder (logo, hero-bg if available)
- [ ] Theme was presented for user review before proceeding
