---
name: sitecore-build-demo
description: Build a complete Sitecore demo from a client homepage screenshot and optional URL. Use when an SE says "build a demo", "replicate this site", or provides a homepage screenshot.
---

# IMPORTANT: Execute ONE phase at a time

Do NOT plan or summarize all phases upfront. Execute Phase 0, then STOP and show results. Wait for the user before proceeding to the next phase. Each phase is a separate conversation turn.

Full reference: `docs/ai/skills/sitecore-build-demo.md`
Output: `docs/ai/demos/<client-kebab>/`

---

## Phase 0 — Gather inputs

1. Get client name + screenshot (required) + URL (optional)
2. Read `docs/ai/config/credentials.local.yaml` — if `contentHub.host` is empty or file missing, **ASK**: "What is your Content Hub URL, username, and password? (see `docs/ai/config/credentials.example.yaml`)" — validate with `POST <host>/api/authenticate`, save if valid
3. Create `demo-progress.yaml` from template
4. **Tell the user what you collected and say: "Ready for Phase 0.5 — manifest check. Proceed?"**

## Phase 0.5 — Manifest check

Run `sitecore-validate-manifest` in Quick mode. If root paths fail → STOP.
**Say: "Manifest validated. Ready for Phase 1 — theme extraction. Proceed?"**

## Phase 1 — Theme

Run `sitecore-extract-theme` skill. Present the theme YAML to the user.
**Say: "Does this theme look correct? Confirm before Phase 2."**

## Phase 2 — Build plan (⛔ MANDATORY STOP)

Run the site-analyzer agent. Present the build plan. Then **ASK both questions**:
1. "Does the build plan look correct? Approved to proceed?"
2. "Do you want pixel-perfect custom variants (Phase 5.5), or are generic variants OK?"

**Do NOT continue until user answers both.**

## Phase 2.5 — Content extraction

Run: `node docs/ai/scripts/content-extractor.mjs --url <URL> --output docs/ai/demos/<client> --download-images`
Run content-scraper agent → `content-map.yaml`
**Say: "Content extracted. N sections, M images downloaded. Ready for Phase 3?"**

## Phase 3 — Datasources + images

**Order matters:**
1. Upload images: `node docs/ai/scripts/upload-to-content-hub.mjs --images-dir docs/ai/demos/<client>/images`
2. Create datasource items via MCP
3. Populate ALL fields per item in one call — text + link XML + `imageFieldXml` from manifest (MUST include `width` and `height` attributes — Next.js Image throws without them)
4. Create + populate children for list components
**Say: "N datasource items created, M images uploaded. Ready for Phase 4?"**

## Phase 4 — Theme CSS

Write `:root` overrides in `globals.css` above `@layer base`. Add Google Fonts if needed.
**Say: "Theme applied. Ready for Phase 5/5.5/6?"**

## Phase 5 — Custom components (skip if none)

## Phase 5.5 — Custom variants (only if user said yes at Phase 2)

Use `sitecore-create-demo-variants` skill.

## Phase 6 — Page assembly

Add components to Home page, wire datasources, generate variant checklist.
**Say: "Page assembled. N components added. See variant-checklist.md for manual steps."**

## Phase 7 — Summary

List what was done + what needs manual attention.
