# SitecoreAI ABM Landing Page Builder (Agentic Studio)

Sitecore demo artifact (branch `sitecore-demo`). An Agentic Studio standard agent plus a custom skill that build an ABM landing page selling SitecoreAI to one named account, for example `/lp/ikea-briefing`. Modelled on the HEINEKEN Press Release Builder agent.

These files are **not** a repo skill: they live outside `.agents/skills/` so `npm run agents:sync` ignores them. The repo's `sitecore-abm-page` skill (Pi, Claude Code, Cursor) is separate and unchanged.

When resuming this iteration, read the [2026-11-05 handoff](ITERATION-2026-11-05.md) first for agent/Brand Context changes, verified versus pending state, the XP-focus correction and safe next steps.

| File | What it is |
|---|---|
| `SKILL.md` | Updated local skill for **ABM Landing Page For One Account**, including index → selected-story retrieval; marketer reports Studio replacement done, acceptance/current export pending |
| [`customer-evidence/`](customer-evidence/README.md) | Six source-checked pilot records and Story Index uploaded/read-back verified 2026-11-05; verified IDs included; local retrieval amendment ready, not yet verified in Studio |
| `agent.json` | Agent definition; **only `prompt` updated locally** for SitecoreAI-first behavior. All other attributes/config remain the older export (skill `525f11e3-c359-4ac6-b980-4b2ba0e557a4`). Copy the prompt value into the connected Studio agent; do not import the full stale config. Current export synchronization still pending |

## Prerequisites (sitecore-demo environment)

| Item | State | Owner |
|---|---|---|
| Landing Page Template, `/Home/lp` parent | Exist (IDs in `SKILL.md`) | — |
| Existing `Sitecore` variants for the six landing sections | Original Variant Definitions verified 2026-10-29; existing shared layout is retained | — |
| Customer Evidence v2 fields + `CustomerEvidence` Variant Definition | **Enabled.** Sitecore registration/read-back and scoped serialization verified; both rendering hosts served frontend `411d14d0` on 2026-11-05 | — |
| Sitecore brand context `43723db2-…` | Exists (built from sitecore.com 2026-09-16) | — |
| Brand Kit named exactly `Sitecore Brand Kit`, published, current naming (SitecoreAI, Agentic Studio) | Recreated and published 2026-10-30 as `717ec50a-…` in `org_BMSdm6mLMr270Wnk`, named `Sitecore`: **rename it to `Sitecore Brand Kit` in the UI**, since the skill finds it by exact name (the ID is for reference only) | Marketer |
| Content Hub MCP for `https://ffde.sitecoresandbox.cloud` | Connected in Studio per marketer; read-only MCP and delivery probes passed here 2026-11-03. Studio namespace/selection still needs checking in the current agent and recording from its export | Marketer |
| Hero image with a public link | Selected automatically with the found + public-link rule. Social proof defaults to quote + author text; portraits/logo strips are optional manual content, not agent prerequisites | Agent / Marketer |

## Customer Evidence v2 — enabled and deployed

The frontend adds `CustomerEvidence` to `LandingSocialProof`, plus three route fields:

| Field | Type | Verified item ID |
|---|---|---|
| `customerEvidenceName` | Single-Line Text (max 80; empty allowed) | `183e3666-188e-4ac9-a74f-3dd852e993a9` |
| `customerEvidenceSummary` | Rich Text | `9d283560-78e5-4ad1-99c6-cd01ed6130d0` |
| `customerEvidenceLink` | General Link | `d05fc4c8-f524-4df2-bc1b-3ea8a63f0aa1` |

Variant Definition: `4669f382-f588-4560-a69e-54c0c0220bf8`. Titles/types/name validation were verified through MCP; inherited `__Short description` / `__Sortorder` values were verified in the approved scoped CLI serialized output on 2026-11-05.

Sitecore field Types/labels/validation and the Variant Definition are read-back verified; new defaults remain blank. The four generated items are serialized and committed. Both live and editing hosts served frontend commit `411d14d0` on 2026-11-05, so **Customer Evidence v2 is enabled in this skill**. Upload the current Markdown/update the existing Studio skill to use it; a real Studio draft/write/read-back run and current agent export are still pending.

### Completed registration/deployment checklist (retained for reference)

1. Connect the Marketer MCP and check `/sitecore/content/Environment Markers`: `sitecore-demo` must be the only child before any write.
2. Read template ID `50af6ec7-85fd-4b9b-adf7-1fde9d9136fe` to obtain its current path. Serialization names it `/sitecore/templates/Project/main/Page Types/Landing Page Template`; older manifest lookups say `Landing Page`. Resolve the template and its `Social Proof Data` section by live path, and correct the cached lookup only after reading it.
3. Add the three fields under the existing section (recorded ID `296f0e42-a06b-4a84-b107-5518ada4286b`), with the exact Types above and descriptive help. `customerEvidenceName` is optional with max 80 chars (`^.{0,80}$`). Read each new field back and record its real ID/Type.
4. Read the owning template's `__Standard Values` (recorded ID `0014cd13-f3f1-4049-a866-3f30f508202e`); set/verify only the new field defaults as blank, preserving all existing defaults and designs.
5. Resolve `/sitecore/content/main/main-website/Presentation/Headless Variants/LandingSocialProof`, reuse its existing container, and add `CustomerEvidence` with the Variant Definition template. Read it back and record the ID. Existing `Default`/`Sitecore` items remain intact.
6. After approval, pull the new/updated serialized items with the repo's serialization workflow and verify help/sort-order metadata. **No hand-editing `authoring/items/`.**
7. Completed: pushed frontend/serialized items in `411d14d0`; both hosts returned that exact build SHA and HTTP 200. Enabled the skill's v2 availability row afterward. Next: run an approved Studio page draft/write/read-back test and synchronize its agent export; those are the remaining acceptance checks.

Activation needs no shared layout mutation: complete new company/summary/link values automatically select the card through existing `Default`/`Sitecore`; absent/incomplete new data keeps the legacy presentation outside editing. The explicit variant exposes empty fields in the editor. Never change the shared Landing Page Layout to force activation across older pages.

The card needs no portraits or logo strips. Empty optional feature/stat/FAQ/CTA section content collapses but component wrappers and editing controls remain. Grids adapt to populated feature/stat slots; FAQ opens the first populated pair and keeps all five editable.

## Install / update

### Indexed customer evidence — local amendment ready

**Studio status (2026-11-05):** The original retrieval update was marketer-reported. A subsequent full Sage run exposed product-focus drift after the marketer confirmed an XP relationship. The local SitecoreAI-first correction is now prepared, but its skill/prompt replacement and updated index metadata are not installed/read-back verified. Current export, expanded tool details, repeat runs and timing remain pending.

The index and six stories passed read-back on 2026-11-05. The local skill now defers customer documents until angle selection and follows [Customer evidence retrieval](SKILL.md#customer-evidence-retrieval): index → one applicable ready record, same-source fields/optional proof, and bounded failure handling. Product, audience and voice loading remain; hero-only discovery and page-writing safeguards are preserved. This is prompt-guided selection, not a new ranking service.

Before replacing the Studio skill, capture repeatable baseline runs for Sage, AEGEAN and another industry with the current skill/model/settings. The local edit has not changed Studio, so that baseline is still possible. Then replace the existing skill content and conflicting prompt rule using the steps below. Keep the connected MCP selections; no new connector is needed. For the SitecoreAI-first correction, update the existing Story Index content once as described in the library guide; the six source-story documents need no re-upload. Obtain the current agent export before auditing/editing its configuration, and export again afterward; never import the stale repo JSON over it. Studio installation, functional acceptance and measured performance comparison are pending—no speedup is claimed from local checks.

### Update the existing Studio agent (retrieval and image policy)

1. Edit the existing **ABM Landing Page For One Account** skill and replace its content with `SKILL.md`. Editing in place keeps its ID (`525f11e3-…`); creating a copy produces a new ID, which must be selected on the agent.
2. On the existing agent, under **Tools & skills → MCP**, keep **Marketer MCP** and select the **Content Hub MCP** connected to `ffde.sitecoresandbox.cloud`. Keep the existing tool selections, including image generation **off**. Do not infer the custom connector's `defaultContext` identifier from its display name or from Pi's namespace.
3. **Replace conflicting customer-story loading/selection rules, automatic portrait/logo rules and image-audit rules** in the current agent's system prompt with this rule; do not append it beside older instructions. Preserve unrelated prompt content and actual connector identifiers:

   The system prompt's source of truth is the **`prompt` attribute in `agent.json`**. Copy that decoded string into the existing agent's system-prompt field, replacing its old prompt; do not paste the whole JSON or this README. The local change affects only `prompt`, not `config`, tools, skills or connector identifiers. Because the remaining config is still the older export, do not import the full file over the already-connected agent; synchronize it from a current Studio export afterward.

4. Save, export the updated agent, and replace the repo's `agent.json` with that export, preserving its connector identifiers and tool selections. **Until this export is received, do not import the old repo JSON over the already-connected agent.**
5. Run the read-only Studio tool check below before the acceptance test.

### First install

Create/upload the skill, select its resulting ID on an agent imported from `agent.json`, and enable both MCPs under **Tools & skills**. Save and export to synchronize the repo. Run from **Agentic → Chat**. No Context selection is needed: the agent reads the Sitecore brand context by ID through the Marketer MCP. Custom MCP credentials and OAuth approvals belong in Studio/server configuration, never in this bundle.

The read-only boundary is a **skill policy**, not a server-side tool restriction: this MCP also exposes writes. For enforcement, give its Studio connection a Content Hub identity restricted to the required reads, without entity/schema creation, updates, deletes or lifecycle transitions. Existing public links avoid needing link-creation permissions.

## Test

### Read-only customer-evidence check

Run each fixture in a fresh Studio chat after installing the skill, using the same model/settings. Repeat to assess consistency. These are **synthetic test assumptions**, not researched assertions about an account's actual systems or pain:

| Account fixture | Recipient | Opportunity / angle |
|---|---|---|
| Sage | CMO | Faster global B2B marketing production and personalization |
| AEGEAN | CDO | Personalized multilingual traveler information across touchpoints |
| Mayo Clinic | Digital experience leader | A connected website/patient-portal experience for personalized access to care |

Prompt (substitute the fixture):

> Run only the skill's customer-evidence lookup. For this read-only fixture, assume research/intake are complete: account = <account>, recipient = <role>, opportunity = <opportunity>. Choose the angle, then follow Customer evidence retrieval. Return the selected story and reason, official URL, factual summary, optional exact quote/attribution and achieved stats that fit the field limits. Report customer-document titles/IDs, call count and returned characters from existing responses. No account research, extra questions, image queries, page/asset writes or publishing in this test.

Inspect the trace: apply the SitecoreAI proof-fit filter before ranking; an XP relationship is not permission to select FIS/Microsoft/Fujitsu or classic XM-led WellSpan automatically. The normal eligible lookup is one index + one record, not a legacy/folder/all-story fetch. If no relevant direct/foundation row fits, bounded current-product search or empty proof is correct. The earlier FIS/WellSpan smoke selections are historical policy results, not acceptance under this correction. Missing optional quote/metrics must not cause another lookup. Test an explicit story choice, no applicable ready entry, an unavailable index/record, unknown dates, historical XP/XM products, and FIS's `more than 200%` value (over the 8-character stat limit: omit it as a stat rather than strip the qualifier). If no baseline exists, record performance as unmeasured rather than infer an improvement. Full draft timing and approved page write/read-back still require the normal end-to-end acceptance run below.

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
| Normal indexed lookup | After angle selection, one index + one applicable ready record; selection explained; no routine web reread |
| Missing optional quote/metric | Summary/link remain useful; no alternate/search to fill optional content |
| Unreadable index / no applicable ready row | Bounded official fallback or empty proof; no required-context false stop |
| First selected record fails | At most one alternate record for a genuine failure, not an exhaustive library sweep |
| Historical products / projected figures / long qualifier | Preserve source applicability and meaning; no current-AI substitution, forecast-as-outcome or qualifier removal |
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
| 15 | Indexed customer evidence (2026-11-05) | Six stories/index uploaded and verified. Local skill uses deferred index → one selected ready record with ranked applicability, same-source proof and bounded fallback. Studio installation/export and before/after comparison remain pending. |

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
| 2026-11-05 | Deployment and Studio-skill activation | Pushed scoped frontend/serialized-items commit `411d14d0` to `sitecore-demo`. Both `sitecore-live-demo.vercel.app` and `sitecore-demo-editing-host.vercel.app` served that exact SHA with HTTP 200 after 48 seconds. Enabled Customer Evidence v2 in the skill/catalog only after verification. Existing `/lp/sage-briefing` live URL returned 404; no publication was attempted, and no live evidence-page acceptance is claimed. Studio run/current export remain pending |
| 2026-11-05 | Indexed evidence smoke test — Sage / CMO / global B2B marketing production (marketer response) | FIS selected with a relevant rationale; official URL, summary, verbatim quote/attribution and historical XP/SXA/JSS note match the verified record. 85% fits the stat limit; more than 200% is correctly retained in the summary but omitted from the constrained stat field. Reported index/FIS IDs and lengths match: 2 document-content calls, 7,646 characters. Content/relevance passes; actual tool trace, timing, repeat runs and page-write acceptance are not supplied/verified. |
| 2026-11-05 | Indexed evidence smoke test — AEGEAN / CDO / multilingual traveler information (marketer response) | United Airlines selection, source URL, scoped summary, XM Cloud/CDP/Personalize context and no invented quote pass. Reported index/United IDs and lengths match: 2 content calls, 7,375 characters; actual trace/timing unverified. Stat eligibility is not passed: 1,800 is scale and 82% is feedback, both summary facts rather than achieved-outcome stat slots under current policy; the proposed 82% label is also 75 characters versus the 30-character limit. Follow-up should reuse the loaded record and return actual stat field values, with no extra fetch/search. |
| 2026-11-05 | Fresh AEGEAN field-map fixture (marketer response; stat-kind/limits explicit) | United Airlines selected; three evidence fields have correct customer, qualified Rich Text summary and General Link XML/source. Quote/author and all stat pairs are proposed empty; scale/feedback are kept in the summary, not outcome slots. Field-value review passes; blank display markers must serialize as actual empty strings. Agent reports one metadata tree read, 2 content calls / 7,375 characters and no writes/asset queries; trace, timing, unconstrained repeat behavior and page-write acceptance remain unverified. |
| 2026-11-05 | Healthcare field-map fixture — Mayo Clinic / digital experience leader (marketer response) | WellSpan selected; official URL, Rich Text/General Link, Sitecore XM (not XM Cloud), and 20% new accounts during the first two months after launch match the verified record. 20% is 3 characters and its label 28, within limits. Quote/author and unused stat pairs are empty; reported 2 content calls / 6,994 characters match index + record. Functional output/field review passes. Optional proof omissions are not gaps; phrase quotation absence as no verified quote in the retrieved record, not proof the official source has no quotation. Portrait empty is a new-page default, not permission to clear an existing manual value. Actual trace/timing and full-page draft/write/read-back remain unverified. |
| 2026-11-05 | Full Sage run / product-focus rejection (marketer trace) | Intake selected VP Digital Experience and confirmed an existing XP relationship. Agent then made XP the angle, used Build from XP / XP FAQs/CTA and FIS historical proof, and reports creating sage-briefing (4bde5ca1-b53f-4628-bebc-1a2956a45d00, version 1) after approval. Sourced facts alone did not satisfy the SitecoreAI campaign focus. Local correction separates account background from the offer, filters legacy-led proof before ranking, scopes claims to the current official platform overview and adds index Proof fit. Earlier FIS/WellSpan selection passes do not satisfy this new scope. Updated index/Studio policy and a revised whole-page draft approval remain pending; assistant has not changed the page. |
