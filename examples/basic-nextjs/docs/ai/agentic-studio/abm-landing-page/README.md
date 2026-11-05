# SitecoreAI ABM Landing Page Builder (Agentic Studio)

Sitecore demo artifact (branch `sitecore-demo`). An Agentic Studio standard agent plus a custom skill that build an ABM landing page selling SitecoreAI to one named account, for example `/lp/ikea-briefing`. Modelled on the HEINEKEN Press Release Builder agent.

These files are **not** a repo skill: they live outside `.agents/skills/` so `npm run agents:sync` ignores them. The repo's `sitecore-abm-page` skill (Pi, Claude Code, Cursor) is separate and unchanged.

| File | What it is |
|---|---|
| `SKILL.md` | Skill content, uploaded in Agentic Studio as **ABM Landing Page For One Account** |
| `agent.json` | Last Studio export (skill `525f11e3-c359-4ac6-b980-4b2ba0e557a4`), **pending a fresh export with the Content Hub connector and prompt amendment**. Keep the current Studio configuration; replace this file with its export, not a guessed connector ID |

## Prerequisites (sitecore-demo environment)

| Item | State | Owner |
|---|---|---|
| Landing Page Template, `/Home/lp` parent | Exist (IDs in `SKILL.md`) | — |
| Existing `Sitecore` variants for the six landing sections | Original Variant Definitions verified 2026-10-29; existing shared layout is retained | — |
| Customer Evidence v2 fields + `CustomerEvidence` Variant Definition | **Created and read-back verified 2026-11-04.** Scoped serialization is verified; frontend deployment is pending. Keep Studio on A until the rendering hosts support B | Agent / Marketer |
| Sitecore brand context `43723db2-…` | Exists (built from sitecore.com 2026-09-16) | — |
| Brand Kit named exactly `Sitecore Brand Kit`, published, current naming (SitecoreAI, Agentic Studio) | Recreated and published 2026-10-30 as `717ec50a-…` in `org_BMSdm6mLMr270Wnk`, named `Sitecore`: **rename it to `Sitecore Brand Kit` in the UI**, since the skill finds it by exact name (the ID is for reference only) | Marketer |
| Content Hub MCP for `https://ffde.sitecoresandbox.cloud` | Connected in Studio per marketer; read-only MCP and delivery probes passed here 2026-11-03. Studio namespace/selection still needs checking in the current agent and recording from its export | Marketer |
| Hero image with a public link | Selected automatically with the found + public-link rule. Social proof defaults to quote + author text; portraits/logo strips are optional manual content, not agent prerequisites | Agent / Marketer |

## Customer Evidence v2 — registered; deployment pending

The frontend adds `CustomerEvidence` to `LandingSocialProof`, plus three route fields:

| Field | Type | Verified item ID |
|---|---|---|
| `customerEvidenceName` | Single-Line Text (max 80; empty allowed) | `183e3666-188e-4ac9-a74f-3dd852e993a9` |
| `customerEvidenceSummary` | Rich Text | `9d283560-78e5-4ad1-99c6-cd01ed6130d0` |
| `customerEvidenceLink` | General Link | `d05fc4c8-f524-4df2-bc1b-3ea8a63f0aa1` |

Variant Definition: `4669f382-f588-4560-a69e-54c0c0220bf8`. Titles/types/name validation were verified through MCP; inherited `__Short description` / `__Sortorder` values were verified in the approved scoped CLI serialized output on 2026-11-05.

The live fields/Types and Variant Definition are now created and read-back verified; the new Standard Values were already blank, so no existing default was updated. The live rendering host still serves pre-B commit `45993eef`, while the B frontend is uncommitted locally. **Keep the Studio skill on quote-only fallback and omit the new field names until serialization and frontend deployment are complete.** Enable its *Site facts* availability row only after the live/editing hosts support the new card.

### Registration/deployment checklist (Sitecore steps 1–5 completed here)

1. Connect the Marketer MCP and check `/sitecore/content/Environment Markers`: `sitecore-demo` must be the only child before any write.
2. Read template ID `50af6ec7-85fd-4b9b-adf7-1fde9d9136fe` to obtain its current path. Serialization names it `/sitecore/templates/Project/main/Page Types/Landing Page Template`; older manifest lookups say `Landing Page`. Resolve the template and its `Social Proof Data` section by live path, and correct the cached lookup only after reading it.
3. Add the three fields under the existing section (recorded ID `296f0e42-a06b-4a84-b107-5518ada4286b`), with the exact Types above and descriptive help. `customerEvidenceName` is optional with max 80 chars (`^.{0,80}$`). Read each new field back and record its real ID/Type.
4. Read the owning template's `__Standard Values` (recorded ID `0014cd13-f3f1-4049-a866-3f30f508202e`); set/verify only the new field defaults as blank, preserving all existing defaults and designs.
5. Resolve `/sitecore/content/main/main-website/Presentation/Headless Variants/LandingSocialProof`, reuse its existing container, and add `CustomerEvidence` with the Variant Definition template. Read it back and record the ID. Existing `Default`/`Sitecore` items remain intact.
6. After approval, pull the new/updated serialized items with the repo's serialization workflow and verify help/sort-order metadata. **No hand-editing `authoring/items/`.**
7. With approval, commit/push the feature branch to deploy the updated frontend; verify the new build SHA on both live and editing hosts. Only then enable the Studio skill's v2 availability row and run an approved page draft/write/read-back test. The manifest upgrade remains partial until these steps succeed.

Activation needs no shared layout mutation: complete new company/summary/link values automatically select the card through existing `Default`/`Sitecore`; absent/incomplete new data keeps the legacy presentation outside editing. The explicit variant exposes empty fields in the editor. Never change the shared Landing Page Layout to force activation across older pages.

The card needs no portraits or logo strips. Empty optional feature/stat/FAQ/CTA section content collapses but component wrappers and editing controls remain. Grids adapt to populated feature/stat slots; FAQ opens the first populated pair and keeps all five editable.

## Install / update

### Update the existing Studio agent (Content Hub integration)

1. Edit the existing **ABM Landing Page For One Account** skill and replace its content with `SKILL.md`. Editing in place keeps its ID (`525f11e3-…`); creating a copy produces a new ID, which must be selected on the agent.
2. On the existing agent, under **Tools & skills → MCP**, keep **Marketer MCP** and select the **Content Hub MCP** connected to `ffde.sitecoresandbox.cloud`. Keep the existing tool selections, including image generation **off**. Do not infer the custom connector's `defaultContext` identifier from its display name or from Pi's namespace.
3. **Replace all previous automatic portrait/logo and image-audit rules** in the current agent's system prompt with this rule; do not append it alongside conflicting rules:

   > Keep account research, intake and page-writing safeguards. Use Customer Evidence v2 only when its Site facts availability is enabled: one published customer's company name, factual story summary and source link, with an optional verbatim quote from that same story. While registration is pending, omit the new field names and use quote-only fallback. Portrait/logo fields are empty on new pages and preserved on updates unless an explicit replacement/clear is approved; never search for them. Choose only the hero image automatically with the found + public-link workflow. Use available sourced stats and 3–5 useful FAQ pairs rather than filler; unused slots are empty. Complete the page draft and obtain approval before writes. Do not change shared designs or publish.

4. Save, export the updated agent, and replace the repo's `agent.json` with that export, preserving its connector identifiers and tool selections. **Until this export is received, do not import the old repo JSON over the already-connected agent.**
5. Run the read-only Studio tool check below before the acceptance test.

### First install

Create/upload the skill, select its resulting ID on an agent imported from `agent.json`, and enable both MCPs under **Tools & skills**. Save and export to synchronize the repo. Run from **Agentic → Chat**. No Context selection is needed: the agent reads the Sitecore brand context by ID through the Marketer MCP. Custom MCP credentials and OAuth approvals belong in Studio/server configuration, never in this bundle.

The read-only boundary is a **skill policy**, not a server-side tool restriction: this MCP also exposes writes. For enforcement, give its Studio connection a Content Hub identity restricted to the required reads, without entity/schema creation, updates, deletes or lifecycle transitions. Existing public links avoid needing link-creation permissions.

## Test

### Read-only Studio tool check

Run in the existing agent:

> Run only the hero image workflow: find a suitable contextual hero with Content Hub search/visual_search (take 3, thumbnails false), or reuse existing hero candidates. Retrieve their public links in one public_link(action: list) batch, select a hero URL, and return its field value/preview. Metadata reads only format the field. Do not search for testimonial portraits, named authors' photos, company logos or composite logo strips; those fields are manual-only defaults. Do not create a page or mutate an asset/link.

The connected DAM is `ffde.sitecoresandbox.cloud`; no tenant-check tool call is needed for image selection. Use the returned public link instead of a temporary signed thumbnail. The Studio export records the actual custom connector identifier.

### Acceptance and edge cases

Run with `IKEA`, answer intake and approve the page draft. While v2 registration is pending, the page must follow quote-only A and omit the new field names. Once enabled, expect a sourced company/summary/link card, with an optional exact quote from that source and no portrait/logo discovery. Audit the written page through the marketer MCP after the marker check: `ShowInNavigation = 0`, unpublished, version 1, no unsourced claims/figures, and the source link matches the summary's story. Unused stat/FAQ slots are empty and do not leave empty frames. Test an older page without new evidence fields: its legacy presentation/images remain available, and preserved image values are not cleared silently.

| Case | Expected result |
|---|---|
| v2 not registered | Omit all three new field names from writes; use quote-only A; do not send unknown empty fields |
| v2 enabled, published customer story but no exact quote | Source-linked company/summary card without quote or images |
| v2 enabled, exact quote available from the same story | Card may also show the real quote and author text; no portrait/logo dependency |
| No published story/quote | Evidence/quote fields empty; no invented proof and no empty section frame |
| Older page without new evidence fields | Legacy Default/Sitecore quote/manual images remain unchanged |
| Empty optional sections / partial FAQ pairs | No content frames/padding in live mode; wrappers preserved and editor fields remain visible |
| Existing page with authored portrait/logos | Reuse current field values without Content Hub lookups; no silent clear |
| Marketer explicitly supplies or requests clearing one manual image | Show supplied/replacement/empty value in the page draft; write only after approval; no discovery search |
| Hero image search returns signed thumbnails | Retrieve public links in one batch, then use a found hero URL; no extra image checks |
| Hero has no public URL | Try another result or leave the hero empty; no link creation |
| Page writes / publishing | Confirmed target, whole-page approval, batch write and read-back stay unchanged; nothing is published |

Read-only HTTP probes from this harness passed 2026-11-03 for an existing public image and the live demo's `/_next/image` endpoint (both `200 image/jpeg`). This proves delivery/hostname compatibility, **not** asset eligibility or an end-to-end Studio page run. Studio acceptance and edge cases remain pending.

## Decisions (grill session 2026-10-29)

| # | Topic | Decision |
|---|---|---|
| 1 | Input | The marketer types the account name. The agent researches the web, then asks about gaps, one question at a time (max 5, each with a suggested answer). The marketer's answers win. Nothing is written before confirmation. |
| 2 | Goal | The marketer picks the goal per page (briefing or demo, event or webinar, account executive meeting) with its exact URL. Suggested default: `Book a SitecoreAI briefing` → `https://www.sitecore.com/request-a-demo`. Replaces the hardcoded Copenhagen event (May 2026, past). |
| 3 | Sitecore truth | Brand context = what Sitecore sells (read by ID with `marketer_mcp.get_brand_context`, since Studio drops brand context IDs from `defaultContext`); Brand Kit = voice; Sitecore documentation MCP = capability check; web = account research and sitecore.com verification. The old built-in "safe stats" are dropped. |
| 4 | Customer evidence and optional stats | Enabled v2 uses one published company/story summary/link, optional exact quote from that same source. Pending v2 falls back to quote-only A. Use 0–3 available sourced stats; no filler or mandatory three-number research. |
| 5 | Page creation | `marketer_mcp.create_page` (Title only) + one `update_fields_on_item` from the Landing Page Template under `/Home/lp`; updates use one `update_content` with `createNewVersion`; never a duplicate of the example page (its DevOps filler would survive in empty fields). Name `<account>-<goal>`. Existing page for the account: ask update (new version) or new page. |
| 6 | Text-first social proof | Quote-only A remains the fallback; additive v2 uses company/summary/source-link data when registered. Both use no portrait/logo searches. Existing manual image values/legacy presentation are retained; only the hero is auto-populated with media. |
| 7 | Language | English only. Translation is a later, separate step. |
| 8 | Publishing | Never publishes. Ends with a review checklist and "Review in Pages before publishing. Nothing was published." Indexing is already off for this site (ADR 0012). |
| 9 | Location | Kept in this repo as Sitecore demo artifacts; the repo `sitecore-abm-page` skill stays as is. |
| 10 | Acceptance | Run for IKEA in Agentic Studio, then audit the page through the marketer MCP. |
| 11 | Intake format | Changed after the first run: each question offers at least 4 lettered options, one marked (Recommended), plus a free answer. The goal URL is checked before use. |
| 12 | Tools | All page work goes through `marketer_mcp`; tools load on demand via `ToolSearch`. The Marketer MCP is attached through `defaultContext` (`marketer-mcp`). Agent API Sites, Pages, Content and Brand Kits stay on by the marketer's choice, for reads only: the `pages` namespace has no `create_page`, and its `update_page_*` tools create a version per call, so the skill keeps all page writes in `marketer_mcp`. Lengths are counted with `skill_runtime.bash`. The page open in Page builder is never the target unless the marketer chose to update it. |
| 13 | Content Hub (hero-only automation) | Hero search → batch public_link(action: list) → image assignment; reuse supplied hero URLs and metadata. No portrait/logo discovery, image audit, or pending-work loop. Manual social-proof values are copied/supplied, not searched. Preserve Studio connector configuration; uploads/link creation stay outside scope. |
| 14 | Customer Evidence v2 (2026-11-04) | User approved B: additive route fields and an explicit CustomerEvidence presentation, data-driven activation through legacy exports, no shared layout switch; optional section frames collapse with editor wrappers retained. Live registration/serialization remain pending. |

## Test log (historical)

Earlier entries document superseded image workflows. Current defaults are decisions 6/14: text-first evidence when installed, quote-only fallback otherwise, and hero-only image automation.

| Date | Run | Result |
|---|---|---|
| 2026-10-29 | IKEA, skill attached (it used the skill's parent, template and `ShowInNavigation = 0`, yet broke its field rules) | `/lp/sitecoreai-for-ikea` failed audit: CTA URL `sitecore.com/contact` 404 (given by marketer), empty internal secondary link, invented testimonial, slogan stats, titles over 40 chars, low account density, FAQ topics off-spec |
| 2026-10-29 | Sage, from the Page builder chat with the IKEA page open | No Sage page: `create_page` not exposed. The agent probed update tools and created empty versions 2 and 3 of `sitecoreai-for-ikea`. Fixed by decision 12 |
| 2026-10-29 | Updated skill, no brand context selected | Stopped at step 1: "The Sitecore brand context is not available in this session." Guard works. The Studio export shows `defaultContext` reduced to `sitecore-ai-knowledge` and `contextRequirements` added (Brand Context, Pages, Content Items); `agent.json` synced to the export |
| 2026-10-29 | Brand context selected | Stopped at step 1: "Page creation is not available here." False stop from the upfront tool-list check; check moved to the write step |
| 2026-10-29 | "List all available tools" | `create_page` exists only in `marketer_mcp` (fields as `[{"Field": value}]`); `pages` has `duplicate_page` and version-creating `update_page_*`; `marketer_mcp` reads brand contexts by ID; `search_assets` with tags is in `marketer_mcp`; `skill_runtime.bash` available. Skill rewritten to `marketer_mcp`, Agent API toggles off |
| 2026-10-29 | Sage, after the `marketer_mcp` rewrite | `/lp/sage-briefing` created as version 1 only; all limits met; stats sourced (CIMIC customer story); testimonial empty for lack of a validated quote. `get_page_preview_url` returns a malformed URL that embeds the editing host's protection key and fails with 401: to be replaced by a Page builder link |
| 2026-10-29 | Page builder link | Report gives "Open in Page builder" built from a fixed pattern (organization and tenant of the sitecore-demo environment, item ID, version); `get_page_preview_url` removed from the skill |
| 2026-11-03 | Content Hub read-only connectivity and delivery (this harness) | `current_instance` = `ffde.sitecoresandbox.cloud`; Sitecore metadata search returned 8 candidates; text visual search returned candidates; schema/asset/lifecycle/brand/rights reads and `public_link(action: list)` succeeded. Asset `40990` has Approved lifecycle and an existing completed public link. Direct public image and live Next.js optimizer both returned `200 image/jpeg`. No Content Hub or Sitecore content was written |
| 2026-11-03 | Initial strict-curation probes (this harness; policy since relaxed) | `abm-hero` and `SitecoreAI` keyword searches returned no matches. Candidate `49933` belongs to Solterra & Co, `48531` to Skywings; asset `40990` is a Sitecore event photo. No page image selected in this read-only probe. The original tag/brand-only selection gates were later relaxed by the marketer for this demo; known restrictions and technical delivery checks still apply |
| 2026-11-03 | Studio integration | Skill and installation/prompt instructions updated locally. Current Studio export, tool check, and acceptance/edge-case audit still pending; `agent.json` left unchanged rather than guessing the custom connector configuration |
| 2026-11-03 | Studio gap report (marketer excerpt, prior policy) | Hero left empty for missing exact `abm-hero` and unverified visual candidate; no verified quote or supporting portrait/logo. No page ID/full tool trace supplied, so the page and verification attempts were not audited |
| 2026-11-03 | Flexible demo image policy (marketer decision) | Marketer authorized autonomous best-available image choice. Updated the skill and replacement agent prompt to prefer, not require, tags/brand associations; use generic contextual imagery; turn missing optional metadata into review notes; retain explicit restrictions, real delivery/dimensions and whole-page approval. Quote/portrait/logo rules unchanged. New Studio run still needs verification |
| 2026-11-03 | AEGEAN image-delay report (marketer excerpt) | Agent had three visual candidates, including `96648`, but ended a reply with inspection/lifecycle/link work still pending before the draft. No tool-duration trace or page ID supplied; this establishes the pending-work symptom, not the complete runtime bottleneck |
| 2026-11-03 | Candidate `96648` read-only timing probe (this harness) | Projected metadata: 328 ms; existing public links: 120 ms; combined serialized responses: 3,343 characters. Published JPEG, 1200x675, no explicit draft/expiry/approval flag, and completed non-expiring public links; public image GET returned 200. Full get_asset with inline preview: 909 ms and 111,812 serialized characters (101,664 image-data characters). These are one-run MCP subpath measurements, not Studio end-to-end timings |
| 2026-11-03 | Candidate visual inspection and fast image revision (superseded) | Public image `96648` is an interview still with Travel Money Oz branding. The intermediate workflow used bounded metadata/restriction reads. The marketer subsequently removed all image eligibility checks; branding no longer disqualifies a findable image with a public link |
| 2026-11-03 | Simple image assumption (latest marketer decision) | Marketer explicitly requested removing all image checks/constraints: found in search + public link means usable, for hero, portrait and logo fields. Updated skill and replacement agent prompt, removed image checklist/audit notes and status/rights/brand/identity/call-budget gates. Dimensions retained solely for SDK rendering, with defaults when absent. Quote/fact text and page approval/no-publishing rules remain. Studio rerun/export pending |
| 2026-11-03 | Portrait lookup skipped (marketer transcript) | Generic portrait search returned `94557`, `95244`, `96648`; agent left the slot empty before public-link lookup, explaining an identity mismatch with Taeko Yamamoto. User supplied `94557-service-channels?v=2aa858c9`; agent acknowledged skipping the lookup. This is the observed workflow failure; its self-explanation does not identify the exact live prompt/skill source |
| 2026-11-03 | Portrait link replay and instruction refinement (this harness) | One public_link(action: list) batch returned public URLs for all three candidates in 413 ms. `94557` formatting metadata: identifier `ZmrmErwsTMGGk10CQDLEwQ`, 1104x1224; expected public URL exists. Updated the candidate→batch-link sequence and defined testimonial portrait as decorative illustration, not biographical evidence. No page/image values written. Current Studio export and rerun still pending |
| 2026-11-04 | Quote-only quick win (marketer chose A) | Stopped automatic portrait/logo discovery. New ABM drafts set both optional image fields empty; updates preserve existing values unless a supplied replacement/clear is explicitly approved. Hero discovery and sourced quote/author text stay in scope. Template, renderer, layout and stored page content unchanged. Quote-only renderer test added; all 24 landing component tests, policy consistency checks and agents:check passed. Studio run/export still pending |
| 2026-11-04 | Customer Evidence v2 (marketer chose B, frontend only) | Added the CustomerEvidence export and company/summary/source-link route types; Default/Sitecore auto-select only for complete new data, otherwise retain legacy UI. Empty optional section frames collapse without removing wrappers/editor fields; stat/feature grids adapt and FAQ opens the first populated complete pair. Tests went red before implementation, then all 43 passed; TypeScript and scoped ESLint passed. Catalog/skill include a pending-registration gate: no unknown-field writes. No shared layout, serialized items or live Sitecore changes; Marketer MCP/field/VD registration and Studio run/export still pending |
| 2026-11-04 | Live Customer Evidence registration | Marketer MCP connected; marker check passed with sitecore-demo as the only marker. Created/read back 3 Template field items with Types/labels/optional-name validation and the CustomerEvidence Variant Definition. Owning Standard Values returned all three as blank; no Standard Values update or shared layout/page change was sent. Existing Default/Sitecore variants remain. Field-list reads stayed capped at 50, omitting Priority/Page Design/SxaTags; returned old values were unchanged. Live rendering host remains on pre-B commit 45993eef, so Studio activation is held pending approved serialization and frontend deployment |
| 2026-11-04 | Approved scoped serialization/deployment attempt | User approved pull/commit/push. Used an isolated CLI workspace with only environment-marker verification and the 4 new items; no repository serialization/module edits. Pull was blocked by expired CLI cloud refresh token; requested `dotnet sitecore cloud login`. Private scratch credential copy removed. Nothing committed/pushed; deployment/Studio activation still pending |
| 2026-11-05 | Scoped serialization after CLI login | Refreshed CLI login succeeded. Pulled marker verification + exactly 4 new items in a private temporary module; CLI marker IDs matched the MCP environment. Verified field/variant IDs, parents, types, descriptions, validation and sort order, then copied only the 4 generated YAML files to their existing module paths. No marker/module/auth files added to the repository; no Sitecore push or page publishing. Frontend commit/deployment and Studio acceptance remain pending |
| 2026-11-05 | Pre-deployment offline gate | Full suite: 438 tests/41 suites passed. TypeScript, agents:check, 33/33 component registrations and read-only Main.Templates/FmcCustomDemo.Content serialization validation passed. Existing SearchTypeahead/NavigationHeader review warnings were left untouched. Ready to commit/push the scoped deployment; Studio activation remains gated until both hosts serve it |
