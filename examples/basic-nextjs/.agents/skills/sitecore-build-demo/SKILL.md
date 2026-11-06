---
name: sitecore-build-demo
description: "Build a complete Sitecore demo from a client homepage screenshot and optional URL: extract the brand theme, analyze the page, match sections to template components, populate content, apply theming, and assemble the page. Use when an SE says \"build a demo for [client]\", \"replicate this site\", \"create components from this URL\", or provides a homepage screenshot for demo creation."
disable-model-invocation: true
---

# Sitecore build demo from URL

Use this skill when a Solution Engineer wants to create a Sitecore demo that replicates a client's homepage.

## Trigger hints
Use this skill when:
- the user provides a URL and says "build a demo", "replicate this site", "create a demo for [client]"
- the user provides a screenshot of a homepage and asks to build components for it
- the user says "analyze this homepage and build the components"

## Prerequisites
- The demo was started with `/skill:sitecore-start-demo <client> <url>` (`.agents/skills/sitecore-start-demo/SKILL.md`): Demo Branch, local tools, sign-in, target site, manifest and Content Hub are checked there. Phase 0 re-runs that Start Check in check-only mode and stops on any blocker.
- Template component library must be built (check manifest for 17+ components with status "complete")

## Load first
- `docs/ai/catalog/component-registry.yaml`
- `docs/ai/catalog/theme-component-mapping.md`
- `docs/ai/manifests/sitecore-manifest.yaml`

## Resume a demo build

Read the client progress file and the phase result files, then follow `.agents/skills/sitecore-build-demo/references/recovery.md`.

- Same `demo-framework-v2` contract, approved inputs, authenticated environment, and workspace only. Older incomplete contracts cannot resume through these helpers: preserve their records/resources and obtain an approved fresh build scope/workspace, never reset. Preserve the recovery journals and MCP transport records.
- Reuse verified work through the helpers; do not recreate items from phase flags or rewrite creation loops.
- Resume helper commands without `--initialize`; use `--begin` once after a session break for fresh MCP observations.
- A claimed mutation without a recorded response is unknown, not failed. Reconcile it; never execute that claim again.
- Missing/corrupt records, changed input, remote drift, or unresolved ownership require a stop. Existing legacy demos are NOT automatically migrated into new journals.
- Confirmed independent failures may preserve useful progress, but the final result stays partial while work remains unresolved.

---

## Subskill handoff

Phases 2 and 2.5 use two subskills with a strict **file-in → file-out** contract, so they behave the same in every tool:

| Subskill | Reads | Writes |
|---|---|---|
| `sitecore-analyze-site` | screenshot(s), theme YAML, component registry | `build-plan.yaml`, `build-plan-summary.md` |
| `sitecore-map-content` | `build-plan.yaml`, `extracted-content.json` | `content-map.yaml` |

- **If your tool has subagents** (Claude Code: `sitecore-analyze-site`, `sitecore-map-content` in `.claude/agents/`), delegate to the subagent, passing the client folder and input file paths. This keeps screenshots and the extracted JSON out of the main context.
- **Otherwise** (Pi, Cursor), read and follow `.agents/skills/<subskill>/SKILL.md` inline.
- Either way, continue only once the output files exist on disk, and read them from disk — never rely on the subagent's chat summary.

## Full workflow

### Phase 0 — Gather inputs (screenshot required)

A screenshot is the **primary input** for demo creation. Without a visual reference, the build plan will be wrong.

**Start Check first (check-only).** Run the check-only mode of `sitecore-start-demo` (`.agents/skills/sitecore-start-demo/SKILL.md`, section *Check-only mode*) for the client. Any blocker stops the build: tell the user to run `/skill:sitecore-start-demo <client> <url>` and stop. Warnings (e.g. no Content Hub credentials → manual images; preview unavailable) are carried into the summary.

**Collect from the user:**
1. **Client name** (required) — must match the started demo (`setup.json`)
2. **Screenshot** (required) — full-page desktop screenshot of the homepage to replicate
3. **Client URL** — taken from `docs/ai/demos/<client-kebab>/setup.json` unless the user gives another one

**How to obtain the screenshot:**

| User provides | Action |
|---|---|
| URL only | Run Playwright scraper to capture screenshot. If scraper fails (403, auth, CAPTCHA), ask user to provide a screenshot manually. Do NOT proceed without one. |
| Screenshot only | Use it directly. URL-based content extraction (Phase 2.5) will be skipped — content comes from screenshot analysis. |
| URL + screenshot | Use the screenshot for visual analysis (Phases 1-2). Use the URL for content extraction (Phase 2.5). |
| Neither | Ask for at least a screenshot. Do not proceed without visual reference. |

**HARD RULE: Never proceed to Phase 1 without a screenshot.** Web fetch and web search are insufficient — they miss layout, spacing, card styles, section backgrounds, and visual hierarchy that drive variant selection.

**Content Hub credentials** are verified by the Start Check (`content-hub`). If they are missing or failing, images fall back to the manual `images-to-upload.md` checklist in Phase 3; to set them, the user re-runs `sitecore-start-demo`.

**Upload plan inspection, after Phase 2.5 has produced an image manifest** (does not validate credentials; the Start Check's `content-hub` check does):
```bash
node .agents/skills/sitecore-build-demo/scripts/upload-to-content-hub.mjs --images-dir docs/ai/demos/<client-kebab>/images --dry-run
```
`--dry-run` performs no authentication, uploads, or checkpoint writes. Do not describe it as credential verification.

**Create the progress file** at `docs/ai/demos/<client-kebab>/demo-progress.yaml` using the template at `.agents/skills/sitecore-build-demo/assets/demo-progress.template.yaml`. Set `client.name`, `client.sourceUrl`, `client.startedAt`, and `phases.phase0_inputs.status: "complete"`.

### Phase 0.5 — Manifest health check

The manifest check runs in `sitecore-start-demo` (Step 2, item 5, with its decision table). Reuse that result only when the check-only Start Check reports `manifestReuse.reusable: true` **and** `manifestReuse.siteItemId` equals the site item ID read in Phase 0 (same day, same `main` commit, same environment). Otherwise run the `sitecore-manifest` skill in validate mode, Quick level (`.agents/skills/sitecore-manifest/references/validate.md`) and apply the decision table from `sitecore-start-demo` — a root-path failure stops the build.

**Do not skip this phase.** A stale manifest causes silent failures in Phase 3 (content population) that are hard to diagnose.

### Phase 1 — Extract the brand theme

Use the `sitecore-extract-theme` skill:

1. Run the Playwright scraper:
   ```
   node .agents/skills/sitecore-extract-theme/scripts/site-scraper.mjs --url <URL> --output docs/ai/themes/<client-kebab>
   ```
2. Read the scraper output (`extracted-styles.json`, `meta.json`)
3. Inspect the screenshots
4. Produce `docs/ai/themes/<client-kebab>.theme.yaml`
5. Present the theme to the user for review

**Do not proceed past Phase 1 until the user confirms the theme.**

### Phase 2 — Analyze the homepage

Run the `sitecore-analyze-site` subskill — see **Subskill handoff** above. Inputs: the screenshot(s), `docs/ai/themes/<client-kebab>.theme.yaml`. Outputs: `build-plan.yaml` and `build-plan-summary.md` in `docs/ai/demos/<client-kebab>/`. It:

1. Read the component registry and theme mapping
2. Inspect the desktop screenshot top-to-bottom
3. Identify every section on the page
4. Match each section to a template component + best-fit variant
5. **Variant gap analysis** — for each matched section:
   - Check if the selected variant already exists (named export in TSX + Variant Definition in Sitecore)
   - If variant exists → mark as `variantMatch: "exact"`
   - If no existing variant matches the visual → mark as `variantMatch: "none"` and describe the custom variant needed:
     ```yaml
     customVariantNeeded:
       name: "EurobankCards"     # PascalCase, will become React export name
       description: "2x3 card grid with top images, red accent links, hover scale effect"
       parentComponent: "FeatureCardsGrid"  # existing component to add variant to
     ```
   - If a variant partially matches → mark as `variantMatch: "partial"` and note what differs
6. Extract visible content from the screenshot (in English)
7. **API-addable classification** — classify each component:
   - `apiAddable: true` — has a datasource template, can be added via `add_component_on_page`
   - `apiAddable: false` — context-only component (no datasource template), must be added manually in Pages editor

   Components with no datasource template cannot be added through this API. Do not classify header/footer by name: inspect the manifest and rendering. Datasource-backed Header/Footer content is populated normally, and `placement: "partial-design"` is automatically wired to the exact inspected instance by the assembly helper. The approved complete-build plan includes this mandatory switch and discloses shared page impact. Missing/incompatible targets require a separate repair decision.
8. Output two files:
   - `docs/ai/demos/<client-kebab>/build-plan.yaml` — machine-readable plan for subsequent phases
   - `docs/ai/demos/<client-kebab>/build-plan-summary.md` — human-readable summary using the template at `.agents/skills/sitecore-analyze-site/assets/build-plan-summary.template.md`
9. **Present the summary (not the YAML) to the user in chat.** The summary includes:
   - Section-by-section table with plain-language descriptions, matched components, variants, and confidence
   - Sections needing attention (low confidence or custom)
   - Variant decisions with reasoning
   - Components grouped by type (API-addable vs manual vs custom)
   - Build order in plain language

**⛔ MANDATORY CHECKPOINT — Do not proceed past Phase 2.**

Present the **build plan summary** to the user and STOP. The SE reads the summary to validate the plan — not the raw YAML. Wait for explicit approval before creating any Sitecore items, datasource content, or React code.

**Ask THREE questions — do not continue without answers to all:**
1. "Does the build plan look correct? Approved to proceed?"
2. "Do you want pixel-perfect custom variants for each component (Phase 5.5), or are the generic template variants sufficient?"
3. "Include search (Phase 6.5): articles, facets, related articles, header suggestions, and Latest Articles on Home (after the hero, at a position you name, or none)?"

Before asking these two questions, inspect the actual target page and Header/Footer partial designs through marketer MCP. Record their paths, item IDs, rendering and instance IDs, current datasources and known/unknown usage in `targetPage.sharedPartialDesigns`. Show this shared impact in the summary. Approval includes automatic datasource wiring, not a separate leave/switch question. If another client's branded experience is found, pause for explicit repurposing confirmation before any client-content/shared-design writes. Ordinary starter content alone does not require this extra confirmation. Record `targetReview` in the approved plan, classify it as `fresh`, `starter` or `existing-client`, and require `repurposeApproved: true` for the last case. Do not add/remove/replace partial-design components unless the approved plan says so: to apply client Header/Footer variants, propose `sharedDesign.replace: true` for each healthy shared instance and name the instance to be removed and the pages affected (ADR 0009). That approval is the removal confirmation.

Record the Phase 5.5 decision in `demo-progress.yaml` (`phases.phase5_5_variants.skippedReason` if declined), and the Phase 6.5 decision as `phases.phase6_5_search` (`included`, `homePlacement`).

The user must say "approved", "go ahead", "looks good", or equivalent before Phase 2.5 begins. If the user requests changes, update the plan and re-present.

**Why this gate exists:** In the Eurobank demo build, skipping approval led to creating wrong variants, wrong content language, and wrong page structure — all of which had to be redone. This checkpoint prevents ~15 minutes of wasted MCP calls.

### Phase 2.5 — Extract and map content

After the build plan is approved, extract precise content from the client site and map it to component fields.

**Step 1 — Run the content extractor script:**
```bash
node .agents/skills/sitecore-build-demo/scripts/content-extractor.mjs --url <CLIENT_URL> --output docs/ai/demos/<client-kebab> --download-images
```

This produces:
- `docs/ai/demos/<client-kebab>/extracted-content.json` — structured content per section
- `docs/ai/demos/<client-kebab>/images/` — all section images downloaded locally
- `docs/ai/demos/<client-kebab>/images/image-manifest.json` — maps each image to its source URL, local file, and section

The `extracted-content.json` contains:
- DOM-extracted text per section (headings, paragraphs, links, images)
- Repeated item detection (cards, list items)
- Source language detection
- Background color hints per section

**Step 2 — Run the `sitecore-map-content` subskill** (see **Subskill handoff** above). Inputs: `build-plan.yaml`, `extracted-content.json`, client name. Output: `docs/ai/demos/<client-kebab>/content-map.yaml`.

The agent reads the build plan + extracted content and:
1. Matches extracted DOM sections to build plan sections (using headings as anchors)
2. **Translates all content to English** (if source language is not English)

> **HARD RULE: All demo content must be created in English (en), regardless of source page language.**
> Never create datasource items in the source language (Greek, Spanish, French, etc.) even if the screenshot shows non-English text. Always translate to natural English.
> This rule exists because demos are shown to English-speaking stakeholders. Creating in the source language then translating back wastes two round-trips of MCP calls.
3. Maps content to specific Sitecore component fields
4. Handles field types (plain text vs Rich Text vs General Link vs Image)
5. Outputs `docs/ai/demos/<client-kebab>/content-map.yaml`

The content map is the input for Phase 3 — it contains exact field values ready to write to Sitecore.

**Why this phase exists:** Phase 2 extracts approximate content from screenshots (good enough for the build plan). Phase 2.5 extracts precise content from the DOM (needed for accurate datasource population). The extractor also captures links, image URLs, and content that isn't visible in screenshots (below the fold, inside accordions, etc.).

**If the extractor fails** (site blocks headless browsers, requires auth):
- Fall back to the build plan's screenshot-extracted content
- Set `contentSource: "screenshot"` in the content map
- Note reduced accuracy in the summary

### Phase 3 — Populate content for template components

**Required execution path:** `.agents/skills/sitecore-build-demo/references/recovery.md`. Use its tested upload and population helpers rather than hand-written MCP creation loops.

**Inputs:** approved build plan and content map, project identity, verified template/folder IDs from the manifest, image manifest.

**Order with custom components:** if the build plan has `customComponents`, create their Sitecore definitions (Phase 5 steps 1–3, 5–7) **before** preparing the execution plan below. The execution plan is frozen once population starts and needs their verified template, folder and rendering IDs. Their client datasources are then populated by the Phase 3 helper like any other section.

1. Upload images through `.agents/skills/sitecore-build-demo/scripts/upload-to-content-hub.mjs`. Known pending approvals share one configurable 60-second read-only window; known public links share one configurable 90-second anonymous-access window. Request time counts against the batch-wide deadline. Use `--approval-timeout` / `CH_APPROVAL_TIMEOUT` and `--public-link-timeout` / `CH_PUBLIC_LINK_TIMEOUT` (seconds). Never recreate resources or repeat uncertain approval writes to absorb delay. An explicitly approved NEW upload run uses `--initialize`; a resume never does. Check `upload-result.json`, not just non-empty URLs. Without Content Hub credentials, preserve a manual-image handoff and do not claim automated uploads succeeded.
2. Set `contract: "demo-framework-v2"` and include the inspected `targetReview` and approved shared-design targets. Prepare the reviewed, field-ready execution plan using `.agents/skills/sitecore-build-demo/assets/execution-plan.template.json`. Resolve project paths from configuration and verify IDs/field types. Record explicit optionality and explicit blanks; omitted content is not permission to blank fields. Use a distinct stable section key for repeated component types.
3. Create client datasource instances, never change example items or shared templates. Header/footer datasources are included when configured on their renderings; their `placement: "partial-design"` affects assembly, not whether content is populated. The NavigationHeader template also has a **Search** section (`SearchIndex`, `TitleMapping`, `LinkMapping`, `MaxSuggestions`, `ResultsPage`): copy its values from the current header datasource into the client header's fields unless the plan sets them, or the header search box disappears.
4. Invoke `.agents/skills/sitecore-build-demo/scripts/demo-recovery.cjs` with `--phase populate`, the plan, and the demo directory. Use `--initialize` only for an explicitly approved NEW phase. Follow the durable **claim → marketer MCP call once → reply → step** protocol in the reference.
5. The helper checkpoints parent/child IDs, populates fields, sets child `__Sortorder` from source order, reads values back, and verifies the returned child ID sequence. No successful response or non-empty field alone proves completion.
6. The helper flags unintended item-name defaults. For explicitly blank optional display text only, an acknowledged but ineffective empty write may use the recorded single-space workaround. Required/unspecified fields, links, images, and system fields never receive whitespace.
7. Inspect `population-result.json`. The recovery journal is authoritative; progress and content-map datasource records are derived. Blocked/failed sections are not ready for assembly. Copy verified exceptions and unresolved target fields into the handoff.

General Link values must be complete XML or approved external link objects; image values come from verified DAM image XML with dimensions. All demo content remains English. Media posters may be used only when approved; videos and unavailable assets remain explicit manual tasks.

The pipeline creates default client datasources. Segment-specific personalization remains separate approved work. Header/Footer datasource wiring is mandatory within the approved complete build. With `sharedDesign.replace: true` the instance is replaced to apply the client variant; repairs of missing/incompatible renderings remain separate. Creation-time datasource fields are deferred pending a separately approved live probe; retain the verified narrow blank fallback without shared-template changes.

### Phase 4 — Apply the theme

The theme was extracted in Phase 1. All 18 template components consume `--brand-*` CSS variables (see `docs/ai/reference/brand-variables.md` for the full contract).

**Two delivery methods** — prefer inlined, fall back to import:

#### Method 1: Inlined in globals.css (PREFERRED)

Paste the client `:root` block **above** `@layer base` in `src/app/globals.css`. An unlayered `:root` always beats `@layer base` in the CSS cascade, regardless of how Next.js processes the CSS.

1. Read the theme YAML's `cssVariables` block (produced in Phase 1)
2. In `src/app/globals.css`, find the commented `/* CLIENT THEME */` placeholder above `@layer base`
3. Replace it with the client's `:root` block:
   ```css
   :root {
     --brand-primary: #00827f;
     --brand-primary-foreground: #ffffff;
     --brand-heading-font: 'Poppins', sans-serif;
     /* ... all 19 variables from the theme */
   }
   ```
4. Record `themeDelivery: "globals-inlined"` in `demo-progress.yaml`

#### Method 2: Separate globals-brand.css (FALLBACK)

Only use this if you have verified the `@import` works in DevTools after build.

1. Write the `:root` block to `src/app/globals-brand.css`
2. Uncomment the `@import './globals-brand.css'` line at the bottom of `globals.css`
3. Build and verify in DevTools that `--brand-primary` etc. resolve to client values, not defaults
4. Record `themeDelivery: "globals-brand-import"` in `demo-progress.yaml`

**Why Method 1 is preferred:** Next.js App Router CSS processing can strip or reorder `@import` statements. When this happens, the `@layer base` defaults win and the client theme doesn't apply. An unlayered `:root` block above `@layer base` is immune to this — it always wins the cascade.

**Google Fonts (if applicable):**

If the theme specifies `typography.googleFontsUrl`, add a `<link>` tag to `src/app/layout.tsx`:
```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700;900&display=swap" />
```

**Present the theme diff to the user before proceeding:**
- Show the `:root` block content and where it was placed
- Show the Google Fonts link (if any)
- Note any font substitutions (proprietary -> Google Fonts alternative)
- Note which delivery method was used (inlined / import)
- Ask: "Does this look correct? Ready to apply?"

The theme takes effect on next dev server restart. All 18 components pick up the new values automatically via `var(--brand-*)` references.

### Phase 5 — Build custom components (if any)

For each section in the build plan with `matchType: "custom"`:

Do this **before Phase 3's execution plan** (see the ordering note in Phase 3); the steps are numbered here for reference only.

1. Use the appropriate Sitecore creation skill (simple/list/context-only)
2. Follow the `customComponents` section of the build plan for field specs
3. Build the component from scratch with the client theme applied
4. Include its client datasource as a section in the Phase 3 execution plan — do not populate it by hand
5. Update the manifest (template, rendering, datasource folder, example item, variants)
6. Register in Available Renderings
7. Register in component-map.ts

Custom components must be fully built before page assembly so they can be placed alongside template components in a single pass.

If there are no custom components (`customComponents: []` in build plan), skip to Phase 5.5.

### Phase 5.5 — Create demo variants (pixel-perfect matching)

For each component on the page, create a custom named export that replicates the exact layout, spacing, and visual style from the client's screenshot.

**Use the `sitecore-demo-variants` skill** (`.agents/skills/sitecore-demo-variants/SKILL.md`).

This phase bridges the gap between "same colors" (Phase 4 CSS variables) and "looks like their actual site" (custom layout per section).

**What it produces:**
1. A `variant-specs.yaml` file with per-section visual analysis
2. A new named export in each component's TSX file (named after the client, e.g., `PeopleCert`)
3. Variant Definition items in Sitecore (one per component)
4. Updated variant checklist referencing the custom variant names

**Decision:** If the user explicitly says generic variants are fine, skip this phase. Otherwise, create custom variants for all sections where `variantMatch` is `"none"` or `"partial"`. If the user wants pixel-perfect, create for ALL sections.

**Update `demo-progress.yaml`** after completion:
- `phases.phase5_5_variants.status: "complete"`
- `phases.phase5_5_variants.variantsCreated: N`

### Phase 6 — Assemble the page

**Required execution path:** `.agents/skills/sitecore-build-demo/references/recovery.md`, assembly phase. No inline add/retry loops.

**Inputs:** unchanged approved execution plan, verified population result, existing Home page identity and inspected page composition.

1. Use the existing Home page unless the user requested a new page. Inventory its components through marketer MCP. Record any approved reuse explicitly as an `existingInstanceId`; never match only by component name or take over another demo. For a demo build, propose `replace: true` on each reused section with a `variant` (the instance is replaced in place so the variant is applied), and list leftover starter components in `removeInstances` (`instanceId`, `renderingId`, `reason`). Both need explicit plan approval naming the instances; that approval is the removal confirmation (ADR 0009).
2. Invoke `.agents/skills/sitecore-build-demo/scripts/demo-recovery.cjs` with `--phase assemble`. NEW phases require explicit `--initialize`; resumes do not. Use the same claim/call/reply protocol as population.
3. The helper snapshots page state, adds sequentially with stable section-specific names, diffs read-back after every add, checkpoints instance IDs, wires client datasources, and verifies final relative order and relationships.
4. A timeout is an unknown outcome. Read back before any retry. If attribution remains ambiguous, stop the placement chain. Never generate a different retry name or delete a local datasource to bypass a collision.
5. Automatically wire approved Header/Footer partial-design targets using the journaled helper. Verify exact instance/rendering identity and expected pre-write datasource, preserve parameters and unrelated components, and record previous datasource IDs. Missing/incompatible/ambiguous targets block wiring and require a separate repair decision. Never silently treat unresolved mandatory wiring as an optional manual task. With `sharedDesign.replace: true` and a `variant`, the helper instead replaces the instance: variant first → add after the old instance → restore order → wire the client datasource → remove the old instance, each journaled and verified. If the variant cannot be applied it falls back to the datasource switch. Report the auto-created datasource for manual cleanup.
6. **Variants are applied automatically for added instances.** Set each section's `variant` (the Variant Definition name, e.g. `ClientHero`) in the execution plan; Phase 5.5 must have created it before assembly. Just before each add the helper sorts that variant first in `Presentation/Headless Variants/<componentName>` (a new instance takes the first variant), checks the instance's `FieldNames`, then restores the folder order. Reused instances (`existingInstanceId`) and shared Header/Footer renderings cannot be changed by MCP; they are replaced when approved (`replace: true`, step 5's `sharedDesign.replace`), otherwise they become manual variant tasks in `assembly-result.json`. After a clean assembly, approved `removeInstances` are removed. List `assembly-result.json` `cleanupDatasources` (placeholder datasources created by each add) as a manual Content Editor cleanup task. Generate `variant-checklist.md` only from those tasks and any `applied: false` instance.
7. Inspect `assembly-result.json` and all unresolved upstream phase results. A written summary does not turn partial work into completed work. Auto-created local datasource cleanup remains manual, not an automatic delete.
8. Visual checks through `get_page_screenshot` only work once the demo branch is deployed to the environment's rendering host; before that the preview answers "Preview content is not found or access is denied". Push the demo branch (decision: client work stays on its Demo Branch) and check after the deployment.

Report component instance IDs, datasource wiring, relative order, exceptions, verified shared-design switches and previous datasources, variant tasks, and unresolved operations. Resume through verified records rather than repeating adds.

**Manual-placement fallback.** If a page placement fails or can't be verified, assembly stops that chain (later sections are anchored to it). `assembly-result.json` then lists every unplaced page section in plan order under `manualPlacements`, with page, placeholder, component, datasource ID, variant, and the section and instance it goes after.
- Write `docs/ai/demos/<client>/manual-placements.md` from it: one numbered step per section.
- The first entry carries a `note`: its automatic add failed or wasn't verified, so check Pages before placing it, to avoid a duplicate.
- Don't retry placements in a loop. If Start Check's placement preflight warned (`placementApi: "failing"`), expect this path.

### Phase 6.5 — Capabilities: search (if approved in Phase 2)

Follow **"Set up search for an environment"** in `.agents/skills/sitecore-search/SKILL.md`, using `--directory docs/ai/demos/<client>/search-setup` and the approved `--home-placement`.
- Run it after Phase 6, so connect reads the assembled Home and anchors Latest Articles there.
- The user publishes once at the end, for the build and search together. Then push the articles, wait about a minute (the showcase re-renders pages at most 60 seconds after publishing), and verify in Phase 8.
- Report `seed-result.json` and `connect-result.json` in the summary: `sharedSandboxImages`, `manualPlacements` and `cleanupDatasources` go under Manual Tasks.
- If the environment has no push source yet, the setup checklist (`.agents/skills/sitecore-search/references/push-source-setup.md`) is a user task. Seeding and connecting can run before it exists, but connect needs the source ID.

### Phase 7 — Summary

**GATE: summaries must report the actual recovery result.**

Read the upload, population, and assembly result files. Unverified/failed operations keep the automated build **partial**, even when independent sections succeeded. Include each unresolved operation and its affected item/field. Keep expected manual variant, publishing, and visual-QA tasks separate from automated verification. Copy recorded exceptions, including whitespace fallbacks, into Build notes. Never rerun a mutation solely to make the phase counters look complete.

Generate `docs/ai/demos/<client-kebab>/demo-summary.md` using the template at `.agents/skills/sitecore-build-demo/assets/demo-summary.template.md`.

**How to populate the template:**

1. **Build Overview table** — pull counts from `demo-progress.yaml`:
   - `TEMPLATE_COUNT` = sections with `matchType: "template"`
   - `CUSTOM_COUNT` = `phases.phase5_custom.customComponentsBuilt`
   - `VARIANT_COUNT` = `phases.phase5_5_variants.variantsCreated`
   - `DATASOURCE_COUNT` = verified parent and child IDs in `population-result.json`
   - `FIELDS_COUNT` = sum of verified sections' `phase3.populatedFieldCount`
   - `IMAGES_UPLOADED` / `IMAGES_TOTAL` = verified uploads / mapped image targets from the image manifest and upload result
   - `AUTOMATED_STATUS` = partial if any automated phase has unresolved work; otherwise complete within the verified scope
   - `VERIFICATION_SCOPE` = actual service read-back performed, plus any unverified delivery/visual checks. Do not substitute local regression-test results for live verification.

2. **Component Inventory table** — one row per section from `build-plan.yaml`:
   - Status from `sections[N].phase6.status`: `wired` = "✅ Wired", `skipped` = "⚠️ Manual placement", `partial` = "⚠️ Unresolved", `failed` = "❌ Failed". Required Header/Footer switches are either verified wiring or unresolved operations, never successful skipped placement.
   - If variant is non-Default and Phase 5.5 was skipped, append "⚠️ Needs variant" to status

3. **Theme section** — from the theme YAML produced in Phase 1

4. **Image Upload Summary** — read `docs/ai/demos/<client>/images/image-manifest.json`:
   - Count entries by verified upload stages: `"uploaded"` with approved asset and verified public link = OK; `"asset-created"` / `"approved"` = incomplete; `"needs-reconciliation"` = unknown effect; `"failed"` = confirmed rejection; unattempted downloaded inputs = skipped. Include incomplete/unknown targets in the unresolved table, never in successful uploads.
   - **Summary table**: show totals per result category
   - **If all OK**: show the NOTE callout, include the Successful Uploads table for reference
   - **If any failed**: show the WARNING callout + Failed/Skipped Images table. For each failed image, pull `uploadError` from the manifest entry to populate the Error column
   - **If skipped** (no credentials): show the NOTE with the upload script command
   - **Successful Uploads table**: one row per `uploadStatus: "uploaded"` entry — show file, section (from `sectionPosition`), `assetId`, clickable `publicUrl`, and `width x height`
   - **Remove empty sub-tables** — if no failures, omit the Failed table. If no successes, omit the Successful table.

5. **Videos** — read `content-map.yaml` `manualVideoTasks`:
   - Only include this section if there are video entries
   - One row per video with section, component, poster image file, source URL, and action
   - If no videos found, omit the entire Videos section

6. **Manual Tasks** — populate each subsection:
   - **Variant Selection**: include components where observed and planned variants differ, or the current value is unverified. Do not infer Default.
   - **Shared Header/Footer / Context Components**: report verified automatic switches with previous datasource IDs, or unresolved required wiring/structural repair tasks. List actual unsupported context placements separately; never classify Header/Footer by name or call required wiring an optional skipped task.
   - **Link Verification**: list links from content-map that point to the client's domain
   - **Manual placements**: from `assembly-result.json` `manualPlacements`, if any, linking `manual-placements.md`
   - **Cleanup**: `cleanupDatasources` from `assembly-result.json`, plus any OOB components that were not in an approved `removeInstances`
   - **Personalization**: always include — it's optional guidance for the SE

7. **Recovery notes** — list unresolved operations, verified blank-field exceptions, affected target fields, and safe next actions. Reconcile existing assets/instances before suggesting any new creation.

8. **Remove unused sections** — if a manual task, image, or video subsection has zero items, remove it entirely. Don't leave empty tables.

**Present the summary to the user in the chat** (not just saved to file). Copy the populated content directly into the chat response so the SE can read it immediately.

Also save the standalone `manual-tasks.md` with just the Manual Tasks section (subsections 1-5) for quick reference in the Pages editor.

### Phase 8 — Deploy and verify (after the user pushes)

Pushing the demo branch deploys the showcase. Only push when the user asks (see Important rules). After the push, and after the user has **published** in Sitecore:

1. Make sure `setup.json` has `showcaseUrl`. If not, ask for it and run `node .agents/skills/sitecore-start-demo/scripts/start-demo.mjs --client <client> --continue --showcase-url <url>`.
2. Wait for the exact commit to be live. The app sends `X-Build-Sha` on every response.
   ```bash
   node .agents/skills/sitecore-build-demo/scripts/wait-for-deploy.mjs --client <client>
   ```
   - Exit 2 (timeout) means the deploy failed or is still queued. Check the Vercel project, and don't verify an old build.
   - A missing header means the deployment predates `X-Build-Sha`.
3. Verify the deployed demo in one command:
   ```bash
   node .agents/skills/sitecore-build-demo/scripts/verify-demo.mjs --client <client>
   ```
   - It checks the indexing policy (demo sites are noindex by default, ADR 0012), sweeps the linked pages, and runs the `sitecore-search` browser protocols when the site has `/Articles`.
   - The result goes to `docs/ai/demos/<client>/verify-result.json`. Add the pass count and any failures to `demo-summary.md` and the handoff.
   - The browser protocols run headless, which analytics treats as a bot, so no analytics events are expected. Failures caused by content you haven't published yet need a publish, not a code fix.

## Output files

After completion, the demo directory should contain:

```
docs/ai/demos/<client-kebab>/
│
│  BUILD PIPELINE FILES (automation internals — enable resume)
├── demo-progress.yaml         # which phases/sections are done
├── build-plan.yaml            # page sections mapped to components + variants (machine-readable)
├── content-map.yaml           # client content mapped to Sitecore field names
├── execution-plan.json        # approved normalized, field-ready execution input
├── recovery-*.json            # authoritative operation journals; preserve these
├── mcp-*.json                 # durable marketer request/response handoff
├── *-result.json              # derived verified phase results
│
│  SE REFERENCE FILES (use while finishing the demo)
├── build-plan-summary.md      # human-readable build plan (reviewed in Phase 2)
├── demo-summary.md            # start here — full build overview + manual tasks
├── manual-tasks.md            # step-by-step checklist for remaining work
├── variant-checklist.md       # quick-ref table for setting variants in Pages
│
│  ASSETS
├── images/                    # downloaded source images from client site
└── images/image-manifest.json # maps images to Content Hub IDs + upload status
```

## Important rules

- **Never replace existing Available Renderings** — template components are already registered
- **Never recreate template components** — they already exist, just populate their datasource items with client content
- **Always use the manifest** for item IDs — don't re-resolve paths that are already cached
- **Always present the plan before executing** — the SE must approve the theme and build plan
- **Automate images via Content Hub** — download during Phase 2.5 (`--download-images`), upload + approve + create public link via `upload-to-content-hub.mjs` in Phase 3 Step 1, set Image fields using DAM format (`<Image src="..." dam-id="..." />`). Requires Content Hub credentials in `credentials.local.yaml`. Fall back to manual `images-to-upload.md` if no credentials.
- **Plan variants, don't click them** — set `variant` on every section of the execution plan. Assembly applies it to added instances and to approved replacements (`replace`, `sharedDesign.replace`); only non-replaced reused/shared instances stay in the manual variant checklist. See `docs/ai/reference/agent-api-limitations.md`.
- **Use `insertAfterComponentId` for ordering** — add components sequentially, passing the previous component's instance ID to maintain build-plan order
- **Use the existing Home page by default** — do not create a new subpage unless the user explicitly asks. The Home page already has the correct Page Design and URL routing. Propose removing leftover OOB components (`removeInstances`) or note them for manual cleanup.
- **Client work stays on its demo branch** — client components, themes and variants are committed only on the demo branch (`<client>-demo`), which may be pushed to deploy the demo. Never merge it into `main`/`dmz` or include client work in framework pull requests. Demo records in `docs/ai/demos/<client>/` are gitignored; never force-add them. Do not commit or push unless the user asks.
- **All content in English** — regardless of source page language, all datasource content must be in English (en). Translate from the source language during content extraction, never after content creation.
