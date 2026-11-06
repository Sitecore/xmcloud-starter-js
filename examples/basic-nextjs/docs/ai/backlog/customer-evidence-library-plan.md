# Plan: indexed customer evidence for the ABM Studio agent

**Status:** In progress; original pack/upload verified. Full Sage run exposed XP-focused campaign drift; SitecoreAI-first skill/prompt/index correction prepared locally. Revised index read-back, Studio replacement, page-revision approval, current export and repeated acceptance remain pending.
**Date:** 2026-11-05
**Scope:** Sitecore Brand Context `43723db2-802c-4960-8d86-09fea574c117` and the ABM agent bundle in `docs/ai/agentic-studio/abm-landing-page/`.

## Execution status — 2026-11-05

- User approved continuing local authoring for the six-story pilot: Microsoft, United Airlines, Fujitsu, Pet Supplies Plus, WellSpan Health and FIS.
- Official sources were checked; [source review](../agentic-studio/abm-landing-page/customer-evidence/source-review.md) records product/metric/quotation caveats. Publication dates remain unknown rather than copying search-result metadata.
- Phase 2 pack prepared under the agent bundle: [index, records and upload guide](../agentic-studio/abm-landing-page/customer-evidence/README.md). Six ready rows map to six source-linked documents; readiness is local content readiness, not live upload verification.
- Phase 3: marketer uploaded additively; assistant discovered real IDs and verified all seven files through Marketer MCP at 2026-11-05T14:19:02.225Z. Text matches the local pack, including sources and quotation/metric caveats. The original four documents remain present. Verified IDs are cached in the pack's README; the index's runtime content is unchanged.
- Phase 4 local amendment: user approved continuing; skill now defers customer documents until angle selection, selects from ready index rows, reads one record, preserves same-source/historical proof and bounds alternates/web fallback. The bundle README contains the replacement prompt rule and read-only fixtures. All 28 local policy/preservation checks plus agents:check/whitespace checks pass. Existing intake, hero-image and page-write procedures are preserved; no new ranker/connector is introduced. These are static document checks, not Studio execution or latency measurements.
- Studio update: marketer reports applying the skill/prompt amendment. No live agent/skill read is exposed by this MCP, so installation is reported, not independently verified. Phase 5 Sage smoke output received: FIS selection, URL/summary/quote, historical product context and stat-limit handling pass content/relevance review. Reported 2 content calls and 7,646 characters match index + FIS; actual trace and timing remain unverified. AEGEAN output received: United selection/source/qualified summary and missing-quote behavior pass; reported 2 calls and 7,375 characters match the records. Initial stat eligibility was flagged because scale/feedback were listed as eligible and the label exceeded 30 characters. A fresh AEGEAN actual-field fixture with stat-kind/limits explicit now passes: qualified summary/General Link and empty quote/stat pairs; reported one tree read and 2 content calls / 7,375 characters. Actual traces, timing and unconstrained repeat behavior remain unverified. Healthcare output received: WellSpan selection, source/field markup, Sitecore XM context, the 20%/first-two-months outcome and its 28-character label pass; reported 2 calls / 6,994 characters match index + record. Optional quote/stat omissions should not be labelled gaps, and an empty portrait fixture is not permission to clear existing manual media. All three fixture outputs now pass content/selection/field review after the explicit AEGEAN follow-up; trace/timing, normal unreinforced behavior and full-page acceptance are still unverified. Next: a normal draft-only ABM run, actual traces/timing, current export and repeated comparison. Baseline capture is unconfirmed. The assistant sent no live write; Brand Kit, XM Cloud items/pages and deployments remain unchanged.
- Product-focus correction: the supplied full Sage trace shows that confirming an existing XP relationship led to an XP-led angle, feature/FAQ/CTA and FIS proof. The agent reports creating `sage-briefing` (`4bde5ca1-b53f-4628-bebc-1a2956a45d00`, version 1) after approval; this page read-back/publication state is not independently audited here. Account relationship is now separate from the SitecoreAI offer, and product/proof eligibility is a pre-ranking filter. XP/classic XM-led stories are explicit-legacy-only; two SaaS foundation rows are not proof of current AI-agent results. Earlier FIS/WellSpan smoke-selection passes are superseded for automatic SitecoreAI evidence. Generic Product documents were read, not rewritten; the current official platform overview supplies offering scope. Six source records remain intact. All 12 local focus/preservation checks pass; the prior policy fails eight. These are static checks, not live acceptance. `agent.json.prompt` is now updated directly; all other JSON attributes/config are verified unchanged. The prompt attribute is the source of truth, not a README block; full export synchronization still needs the current Studio config. Updated index metadata and Studio policy need replacement/read-back; no page or layout write was sent by the assistant.

## Goal

Give the agent a small, source-linked customer-story library that supports predictable selection and fewer discovery searches. Retrieve an index and the selected story, rather than loading an expanding evidence collection during initial brand-context preparation.

This is a content/retrieval improvement, not another landing-page template migration. The deployed `customerEvidenceName`, `customerEvidenceSummary` and `customerEvidenceLink` fields already support the output.

## Current state — inspected, not assumed

The live Brand Context already contains `Customer Evidence` folder `044c45f8-ff0a-4650-ac52-4461a1247867`:

| Document | Item ID | Returned content length | Current role |
|---|---|---:|---|
| Evidence Framework | `cf590410-2af6-4aee-81ff-4179c4335d59` | 3,043 characters | General sourcing/usage guidance |
| Case Studies | `857d48d9-5b70-4d59-9d37-c5d4b26e1e4f` | 3,328 characters | Microsoft and United Airlines summaries |
| Testimonials | `a8347ffa-65de-44e2-91c2-49186362f79a` | 3,196 characters | Themes and guidance; explicitly not an approved quote bank |
| Success Metrics | `7405e057-d1e9-406b-8d90-fef2db8fb154` | 2,835 characters | Metrics attributed to those two stories, plus planning guidance |

The four documents total **12,402 returned characters**. This is an inventory size, not a measurement of how much every Studio run actually loads.

Neither direct customer-story URLs nor reusable, verbatim attributed quotes occur in these four documents. The existing summaries describe outcomes, but their claims must be traced to the official story before they become ready library records. Document creation/review dates must not be treated as customer-story publication dates.

At the original inventory, the skill loaded customer-evidence documents during initial context preparation and had no structured index/ranking order. The local amendment now uses deferred index/selected-story retrieval; installation into Studio and actual end-to-end benchmarking remain pending.

## Scope boundaries

- Keep the Brand Context ID and all unrelated folders unchanged, including Product, Audiences, Messaging, Content Guidelines and AI Discovery.
- Add content under the existing Customer Evidence folder; retain the original four documents during the pilot.
- Do not modify the Brand Kit, Content Hub images, Sitecore templates, variants or shared page layout for this action.
- Hero-only image automation and quote-only/manual-media safeguards remain unchanged.
- Quote, author text and customer metrics remain sourced. A factual summary is enough for the evidence card; a quote is optional.
- The available Marketer MCP exposes Brand Context reads, not document create/edit tools. The marketer operates the Brand Context UI/upload workflow; the assistant prepares files and verifies them afterward through the MCP.
- Do not change the active skill or agent during planning, and do not invent document GUIDs before upload.

## Proposed library

Start with a lightweight index and a small pilot; do not upload every story at once.

```text
Customer Evidence/
  Evidence Framework                 existing, retained
  Case Studies                       existing, legacy fallback during pilot
  Testimonials                       existing, retained; not a quote bank
  Success Metrics                    existing, retained
  Story Index                        new, compact selection metadata
  Stories/                           new
    <customer> — <story topic>         one source-linked record per story
```

Industry folders are optional later; they are not needed to launch a small library. The index's tags can distinguish industries and capabilities without adding more lookup steps.

### Index record

One row per story, containing only selection metadata:

- Stable story key, e.g. `<customer>-<topic>`; add a year only when the actual publication date is known.
- Customer/company name and industry/business model.
- Primary business problem and Sitecore capabilities demonstrated.
- Actual products used, with a current/historical relevance note, plus Proof fit: `sitecoreai-direct`, `saas-foundation`, or `legacy-explicit-only`. Source readiness is not product eligibility.
- Buyer audience relevance.
- Actual publication date, or `unknown`; separate `reviewedAt` date.
- Official source URL.
- Exact Brand Context document title; item ID may be recorded after verification.
- Readiness: `candidate`, `ready`, or `retired`.
- One short relevance sentence, not a full story or repeated metrics table.

Keep the pilot index compact. Resolve document IDs from the current context tree and exact titles; recorded IDs are a cache, not the only way to find a story after recreation.

### Story document template

```markdown
# <Customer> — <story topic>

Story key: <stable key>
Status: candidate | ready | retired
Industry / business model: <tags>
Primary problem: <problem>
Capabilities: <demonstrated capabilities>
Products used: <actual products; current/historical note>
Audience relevance: <roles>
Published: <date or unknown>
Reviewed: <review date>
Source: <official customer-story URL>

## Customer name
<Name as published>

## Factual summary
<1–3 sentences grounded in the linked story>

## Metrics — optional
- Published value: <verbatim value and units>
  Meaning: <what the value measures>
  Kind: outcome | scale | survey finding
  Source passage: <supporting passage or specific citation>

## Direct quote — optional
Quote: <verbatim quote, or no quote available>
Speaker: <name as published>
Title / company: <as published>
Source passage: <supporting passage or specific citation>

## Applicability notes
<What this story supports; what it does not establish>
```

A scale figure such as annual interactions is not a conversion lift or an ROI benchmark. Keep customer-specific results distinct from universal promises. Preserve historical product names in direct quotes; do not retrofit an older product's result into a current SitecoreAI capability claim.

## Phased execution

### Phase 1 — source audit and pilot shortlist

**Owner:** Assistant prepares; marketer approves.

1. Trace Microsoft and United Airlines from the existing Case Studies document to their official published story URLs.
2. Confirm the company, products/capabilities, factual summary and any reusable figures against the actual source. Retain only exact quotes with attribution; absence of a quote is acceptable.
3. Propose a small representative pilot, initially **6–8 records**, covering travel/hospitality, B2B/technology and at least one additional demo industry. Choose additions based on real published sources, not fabricated coverage quotas.
4. Present the shortlist with source URLs and a relevance rationale. Mark unverified entries `candidate`; they are not automatically usable evidence.

**Done when:** the pilot shortlist is approved and every proposed ready record has an official URL and source-backed content. If only the two existing stories are ready, start with them rather than delaying for an arbitrary count.

### Phase 2 — author the index and per-story documents

**Owner:** Assistant.

1. Prepare one Markdown index and one Markdown record per approved story using the schema above.
2. Avoid repeating the entire narrative in the index, Testimonials and Success Metrics documents.
3. Keep unsupported metrics/quotes out; use a sourced summary where exact quotation is unavailable.
4. Store the approved authoring files under the agent bundle's `customer-evidence/` folder, or an agreed shared content location if other agents will use the library. This location is finalized at implementation time.

**Done when:** each ready index row maps to one document/source and the files pass a completeness/source-consistency review.

### Phase 3 — additive Brand Context upload

**Owner:** Marketer in the UI; assistant verifies through MCP.

1. Create Story Index and Stories under the existing Customer Evidence folder.
2. Upload the approved Markdown records without deleting the original four documents or touching unrelated brand knowledge.
3. Run `get_brand_context` to discover the actual folder/file IDs.
4. Run one batched `get_brand_context_items` read for the pilot files. Verify exact titles, content, source URLs, statuses and index-to-document mapping.
5. Record verified IDs; do not infer successful upload from an attachment acknowledgement alone.

**Done when:** the uploaded index and pilot documents are readable through the same Marketer MCP used by Studio and round-trip to the approved content.

### Phase 4 — change customer-evidence retrieval only

**Owner:** Assistant writes the bundle; marketer updates Studio.

1. Remove eager customer-case loading from the skill's initial context-preparation step. Keep other brand/product/audience retrieval behavior intact.
2. After researching the account and choosing the angle, retrieve Story Index with `get_brand_context_items` using its ID resolved from the current tree.
3. First scope the campaign to the current SitecoreAI product: an existing XP account is background, not a migration/comparison request. Filter `ready` rows for product/proof fit before ranking. Prefer relevant `sitecoreai-direct` evidence; use `saas-foundation` only for a narrower relevant foundation statement, not current AI-agent results. Exclude `legacy-explicit-only` from automatic selection unless the marketer explicitly requests that legacy story/comparison. Apply the same filter to bounded web fallback; no suitable source means omitted proof, not an XP substitute.
   Within the eligible tier rank explicit applicable marketer choice → target account's own applicable story → capability/problem → industry/business model → recipient fit → known publication date and stable key. Unknown dates have no freshness bonus.
4. Read the selected story document, not the entire Stories folder. A second candidate is allowed if the first record is missing, stale, failed to fetch or does not support the intended statement.
5. Populate company, summary and source link from the same chosen record. An exact quote is optional and must come from that record/source; it must not be combined with another customer's attribution.
6. Include one line in the draft/report: `Selected <customer/story> because <capability/industry/audience fit>.`
7. If the index is missing/unreadable or no ready entry fits, retain a bounded official web-search fallback. Report no evidence if that fallback supplies no valid source; do not force an irrelevant customer.
8. Update the existing Studio skill in place and replace any conflicting story-selection prompt rule. Obtain the latest Studio agent export and preserve its existing tool/connector selections.

**Done when:** Studio retrieves only the index/selected story for this part of the task, explains the selection and uses a source-consistent evidence card. No template/image workflow changes are required.

### Phase 5 — compare against the baseline

**Owner:** Marketer runs Studio; assistant reviews the trace and output.

Use the same prompts/model/settings before and after the change: Sage, AEGEAN and a prospect in a different industry. Run each more than once where possible; one run is not proof of a latency improvement.

Capture:

- Time spent specifically on customer-evidence retrieval and time to the complete page draft.
- Customer-document fetch count and returned content characters.
- Official web-search count for customer proof, separately from account research.
- Selected story and its stated relevance.
- Whether name/summary/link and optional quote/metrics all refer to the same source.
- Whether the agent incorrectly asked for a quote, portrait, logos or extra statistics.

Acceptance criteria:

- Correct source-consistent evidence card, with no invented quotation/metric or historical-product substitution.
- A normal evidence lookup reads **one compact index + one selected record**, with one alternate record only on a real retrieval/support failure.
- No automatic download of all customer documents or folder content; folder IDs are not sent as content requests.
- Selection follows the agreed priority and is explained. v1 is prompt-guided selection, not a claim of deterministic code execution.
- Evidence retrieval does not add image queries or more intake questions.
- Median evidence-stage time and character volume do not regress versus baseline. If a larger library is slower, reduce index size/fetches before expanding it.
- Existing page-write approval, read-back verification and no-auto-publishing behavior stay intact.

**Done when:** the pilot passes the relevance/source and bounded-retrieval checks with measured before/after results, or the rollout is revised from the trace.

### Phase 6 — maintenance and expansion

**Owner:** Assigned marketer/content owner; assistant can prepare review updates.

- Add new stories individually through the same source-backed record process and append compact index rows.
- Review entries when products, claims or source URLs change; periodically retire stale/inapplicable evidence instead of silently rewriting it.
- Keep historical sources labelled and preserve exact quotations.
- Only after the pilot works should the library expand toward all approved cases.
- If prompt-guided ranking remains inconsistent at scale, consider a deterministic ranking helper/tool over machine-readable metadata as a separate v2 task; do not add a new MCP server/script just to launch the pilot.

## Rollback

The original folder/documents are retained. Revert the customer-story retrieval instructions to the prior skill and keep the new index/records unused if the pilot worsens relevance or latency. Do not delete brand knowledge or revert unrelated agent/template changes.

## Approval checkpoints and open decisions

Original planning checkpoints (local six-story authoring is now approved; upload ownership, shared use and live activation remain decisions):

1. Pilot sources/industries and the initial shortlist.
2. The person who uploads/owns the Brand Context content.
3. The shared-versus-agent-specific repository location for authoring files.
4. Whether the selection order above matches the SE's priorities.

The original planning step did **not** authorize implementation. Subsequent approval covered local pilot authoring, and the marketer then completed the additive upload. Brand Context read-back is verified, and the user subsequently approved the local skill/prompt amendment. Live Studio installation and comparison remain later gates. The assistant sent no live write; Brand Kit, live Studio skill/agent, templates, pages and deployment were not changed.

## Evidence for this plan

- Live first-party MCP inventory, 2026-11-05: `get_brand_context` for context `43723db2-802c-4960-8d86-09fea574c117`; existing Customer Evidence folder and document IDs listed above.
- Live first-party MCP document read, 2026-11-05: one `get_brand_context_items` batch for the four IDs above; all four succeeded, with the lengths/content summarized here. The current Case Studies, Testimonials and Success Metrics documents are inventory inputs, not independent validation of their cited customer results.
- Tool contracts inspected in this session: `get_brand_context` returns metadata/tree only; `get_brand_context_items` accepts selected file IDs in batches of up to 50 and reports individual fetch success/failure and content length. No Brand Context create/edit tools are exposed in this connection.
- Current implementation: [Studio skill](../agentic-studio/abm-landing-page/SKILL.md), especially initial brand retrieval and angle/reference-story selection; [bundle README](../agentic-studio/abm-landing-page/README.md) for the deployed Customer Evidence fields and Studio export rules.
