---
name: sitecore-extract-theme
description: Extract a client's brand visual identity from their website screenshot (primary) or URL. Use when starting a demo build, when the user provides a client screenshot or URL, or when matching a client's look and feel. Triggers on "extract theme", "match their brand", "replicate the look", "demo for [client]", "build a demo that looks like". Screenshot is the primary input — Playwright scraper output is supplementary.
---

Read and follow `docs/ai/skills/sitecore-extract-theme.md` in full before proceeding.

**Primary input: screenshot** — The screenshot is the source of truth for theme extraction.
Playwright scraper output (CSS tokens, meta tags) improves accuracy but is not required.

| Available input | Approach |
|---|---|
| Playwright output + screenshot | Best: CSS tokens for exact values, screenshot for visual tone |
| Screenshot only (scraper failed) | Good: analyze screenshot, use web search for hex codes/fonts |
| URL only (no screenshot yet) | Run Playwright first. If it fails, ask user for screenshot. |
| Web search only | **Insufficient** — always require at least a screenshot |

Theme template: `docs/ai/templates/client-theme.template.yaml`
Output to: `docs/ai/themes/<client-kebab>.theme.yaml`

Scripts live in `docs/ai/scripts/`:
- `setup.sh` / `setup.cmd` / `setup.ps1` — One-time Playwright install
- `site-scraper.mjs` — Headless Chromium scraper for JS-rendered sites

```bash
node docs/ai/scripts/site-scraper.mjs --url <URL> --output docs/ai/themes/<client>
```
