# Sitecore create ABM landing page (self-contained, account-targeted page instance)

Create a personalized Sitecore landing page *instance* for a specific target organization, using a pre-existing fixed-shape Landing Page template. The page is research-driven: the executing LLM investigates the organization, reasons about why **Sitecore AI** matters to them, and positions Sitecore's **Silver Celebration** event in Copenhagen as the call-to-action.

This skill is **fully self-contained**. The executing LLM does **not** need to read any project files, manifests, or registries. Everything required — Sitecore identity, template/parent item IDs, the full 40-field schema, validation regexes, content contracts, voice guidelines, event details, and honesty rules — is inlined below.

---

## What the executing LLM needs

### Tools (required)
- **`mcp__sitecore-marketer__get_content_item_by_path`** — sanity-check template + parent exist before creating
- **`mcp__sitecore-marketer__get_content_item_by_id`** — verify the created item's fields persisted
- **`mcp__sitecore-marketer__create_content_item`** — create the page
- **`mcp__sitecore-marketer__update_fields_on_item`** — retry silent-write fields (fallback)
- **WebSearch** — research the target organization
- **WebFetch** — read the organization's website and the Sitecore event page

### No filesystem access required
This skill embeds every reference the LLM needs. No `Read`, no `Grep`, no project file dependency.

---

## Sitecore identity (inlined — verify on first MCP call)

| Property | Value |
|---|---|
| Site collection | `main` |
| Site name | `main-website` |
| Site language | `en` |
| Content root | `/sitecore/content/main/main-website` |
| Landing Pages parent (`/Home/lp`) | path `/sitecore/content/main/main-website/Home/lp` |
| Landing Pages parent item ID | `{AF65681C-5C75-40D2-89A3-3779D5A47A27}` |
| Landing Page template path | `/sitecore/templates/Project/main/Page Types/Landing Page` |
| Landing Page template item ID | `{50AF6EC7-85FD-4B9B-ADF7-1FDE9D9136FE}` |

**Safety check (Phase 0):** before creating, the executing LLM must call:

```
mcp__sitecore-marketer__get_content_item_by_path(itemPath="/sitecore/content/main/main-website/Home/lp")
mcp__sitecore-marketer__get_content_item_by_path(itemPath="/sitecore/templates/Project/main/Page Types/Landing Page")
```

If either returns an item ID that **differs** from the inlined value above, use the live ID from the response (the inlined values may have drifted). If either path returns 404, **STOP** and report: *"Prerequisite missing — the Landing Page template or `/Home/lp` parent does not exist in this Sitecore instance."*

---

## Canonical Sitecore event (CTA anchor)

Every page created by this skill must drive to this event:

| Attribute | Value |
|---|---|
| **Event name** | Sitecore Silver Celebration |
| **Occasion** | Sitecore 25th anniversary |
| **Location** | Copenhagen, Denmark |
| **Date** | May 2026 |
| **URL** | `https://www.sitecore.com/resources/events-webinars/2026/05/sitecore-silver-celebration-copenhagen` |
| **Audience** | CMOs, CDOs, VP Marketing, Heads of Digital, Sitecore customers and prospects |
| **Hook** | A milestone industry moment — 25 years of Sitecore, the launch of Sitecore AI, the future of personalized content |

The **`finalCtaButton`** General Link **must** point to the URL above, verbatim. The **`finalCtaHeadline`** and **`finalCtaSubhead`** must reference the event by name. The **`heroPrimaryCta`** may either point to the event or to the organization's Sitecore account team — choose based on research (existing customer → account team; net-new prospect → event).

---

## Inputs

| Input | Required | Default if not provided |
|---|---|---|
| `organizationName` | YES | (must be provided — this is the whole point) |
| `pageSlugOverride` | NO | derive from organization name → `<kebab-case>-welcome` |
| `targetPersona` | NO | infer from research (CMO if B2C consumer, CDO if digital-first, Head of Digital if mid-market) |
| `relationshipStatus` | NO | infer from research ("prospect" if no public Sitecore mention, "existing customer" if found) |
| `industryHint` | NO | infer from research |

If `organizationName` is missing, **STOP and ask the user**. Do not invent an organization.

---

## Workflow

### Phase 0 — Verify Sitecore prerequisites
Run the two `get_content_item_by_path` safety checks above. If both succeed, proceed. If either fails or returns a different ID, follow the rules in the Sitecore identity section.

### Phase 1 — Research the target organization
The goal is a one-page mental model that drives all 40 fields. Do not skip — un-researched ABM pages read as spam.

1. **Identity** — `WebSearch("<organizationName> company website")` → official URL
2. **What they do** — `WebFetch(<organization-website>)` → industry, products, target customers, scale
3. **Marketing posture** — `WebSearch("<organizationName> marketing strategy")` and `WebSearch("<organizationName> digital experience")` → go-to-market approach
4. **Recent moves** — `WebSearch("<organizationName> 2025 OR 2026 news")` → product launches, leadership changes, strategic initiatives
5. **Sitecore relationship** — `WebSearch("<organizationName> Sitecore")` → customer, partner, prospect, or net-new?
6. **Pain hypothesis** — based on the above, identify the top 2-3 marketing/content/digital challenges this organization likely faces

Synthesize into a **research dossier** (~150-200 words) before generating any content.

### Phase 2 — Choose the Sitecore AI angle
Sitecore AI is the platform's content intelligence and personalization layer. Pick the angle that fits the organization's profile:

| If the organization is... | Sitecore AI angle |
|---|---|
| Consumer brand at scale (retail, CPG, hospitality) | Personalize every page per visitor without engineering overhead. Run hundreds of variants. |
| Regulated industry (finance, healthcare, pharma) | Compliant content at scale. AI within the guardrails of governance. |
| B2B SaaS / enterprise tech | ABM at content velocity. Build account-specific pages without a sprint. |
| Mid-market / digitally maturing | The platform you grow into. Headless content + AI personalization, paced to your team. |
| Net-new / no clear Sitecore signal | Why content + AI is now table stakes. Industry peer proof. |

The chosen angle shapes the **features section** and **FAQ answers** — each feature should address one concrete pain → Sitecore AI capability.

### Phase 3 — Position the Copenhagen event
The Silver Celebration is the CTA anchor. The pitch:

- **Why attend** — Sitecore is 25. The event is where the platform's next chapter (Sitecore AI, personalization at scale, agent-driven content) is unveiled. Peer learning from CMOs and CDOs in the same shoes.
- **What they get** — Hands-on with Sitecore AI, customer keynotes, networking with industry peers, working sessions on agentic content workflows.
- **Why now** — Personalization at scale and AI-driven content production are 2026 problems, not 2027 problems. This event is where leaders see what's already working.

Reference the event explicitly in the **final CTA section** and in at least one FAQ answer.

### Phase 4 — Generate all 40 fields
Follow the inline field schema, content contracts, and validation regexes below. Self-validate before submitting.

### Phase 5 — Self-validate before submission
Run every check in the **Validation checklist** section below. If any fails, regenerate and re-check.

### Phase 6 — Create the Sitecore page item
One `create_content_item` call with all 40 fields. See **Create call shape** below.

### Phase 7 — Verify
Call `get_content_item_by_id` with the new item ID. Confirm all 38 content fields (the 2 image fields will be empty — that is intentional) appear with the values you sent. If any non-image field is empty, the API silent-wrote it — retry with `update_fields_on_item` for those fields.

### Phase 8 — Report
Output the **Final report format** at the bottom of this file.

---

## Full inline field schema (canonical)

The Landing Page template has **40 content fields** in 6 sections, plus 2 inherited base-page fields (`Title`, `ShowInNavigation`).

**Field types:**
- **SLT** = Single-Line Text. Value is a plain string.
- **Rich Text** = HTML string. Always wrap content in at least one `<p>` element.
- **General Link** = XML string of shape: `<link text="..." linktype="external" url="https://..." anchor="" target="_blank" />`
- **Image** = leave empty (`""`) unless a DAM media ID is known.

### Section 1: Hero Data (7 fields)

| Field name | Type | Validation regex | Content contract |
|---|---|---|---|
| `heroEyebrow` | SLT | `^.{1,40}$` | ≤40 chars. Short tag positioning the organization. Example: "Built for Acme" |
| `heroHeadline` | SLT | `^.{1,80}$` | ≤80 chars, single line, no trailing period. **Must include the organization name.** Benefit-led. |
| `heroSubhead` | SLT | `^.{1,200}$` | 1-2 sentences, ≤200 chars. Reinforces the headline. References the org's growth context. |
| `heroPrimaryCta` | General Link | — | text 4-6 words, action verb. URL: org's sitecore.com account page if customer, else event URL. target=`_blank`. |
| `heroSecondaryCta` | General Link | — | Lower-commitment alternative CTA. URL: sitecore.com or relevant Sitecore product page. target=`_blank`. |
| `heroImage` | Image | — | Leave empty (`""`) unless a Sitecore media ID is known. |
| `heroVideo` | General Link | — | Leave empty (`""`) unless a Sitecore-hosted video URL is on hand. |

### Section 2: Features Data (9 fields = 3 features × 3 fields)

| Field name | Type | Validation regex | Content contract |
|---|---|---|---|
| `feature{1,2,3}IconName` | SLT | `^[A-Z][A-Za-z0-9]{1,30}$` | PascalCase lucide-react icon name. Safe choices: `Zap`, `ShieldCheck`, `Rocket`, `BarChart3`, `Users`, `Clock`, `Sparkles`, `Layers`, `Globe`, `Lightbulb`, `Star`, `Trophy`, `Brain`, `Bot`, `Wand2`, `Target`. |
| `feature{1,2,3}Title` | SLT | `^.{1,40}$` | 2-4 words, ≤40 chars, action-led. Examples: "Launch in days", "Personalize at scale", "Measure what matters" |
| `feature{1,2,3}Description` | Rich Text | — | 1-2 sentences (100-180 chars body inside `<p>...</p>`). Names the organization in **at least 2 of the 3** features. Describes the outcome, not the mechanism. |

### Section 3: Stats Data (6 fields = 3 stats × 2 fields)

| Field name | Type | Validation regex | Content contract |
|---|---|---|---|
| `stat{1,2,3}Number` | SLT | `^.{1,8}$` | ≤8 chars with units. Use the safe-stats table below or research org-specific numbers. |
| `stat{1,2,3}Label` | SLT | `^.{1,30}$` | ≤30 chars. What the number describes. |

**Safe Sitecore stat defaults (pick 3):**

| Number | Label | Use for |
|---|---|---|
| `10x` | Faster launches | Speed/agility |
| `85%` | Lift in conversion | Personalization outcome |
| `<2wk` | Time to value | Speed of implementation |
| `1,500+` | Customers | Scale / credibility |
| `25 yr` | Of innovation | 25th anniversary tie-in |
| `99.9%` | Uptime SLA | Enterprise reliability |
| `100+` | Integrations | Ecosystem |

### Section 4: Social Proof Data (5 fields)

| Field name | Type | Validation regex | Content contract |
|---|---|---|---|
| `testimonialQuote` | Rich Text | — | 100-250 chars in `<p>...</p>`. Plausible peer-industry quote. **Never quote real executives.** |
| `testimonialAuthorName` | SLT | `^.{1,60}$` | ≤60 chars. Plausible fictional name. |
| `testimonialAuthorTitle` | SLT | `^.{1,80}$` | ≤80 chars. Frame as industry peer, e.g., "VP Marketing, peer retail brand". |
| `testimonialAuthorImage` | Image | — | Leave empty (`""`). |
| `partnerLogosImage` | Image | — | Leave empty (`""`). |

### Section 5: FAQ Data (10 fields = 5 FAQs × 2 fields)

| Field name | Type | Validation regex | Content contract |
|---|---|---|---|
| `faq{1..5}Question` | SLT | `^.{1,140}$` | ≤140 chars. Buyer-perspective question. **At least 3 of 5 reference the organization by name.** |
| `faq{1..5}Answer` | Rich Text | — | 1-3 sentences in `<p>...</p>`. Direct, concrete. Avoid "it depends". |

**Suggested FAQ topic coverage (use this as a template):**
- FAQ 1: Migration / time-to-launch ("How long does <Org> need to migrate?")
- FAQ 2: Integration with existing martech stack
- FAQ 3: Security, compliance, data residency
- FAQ 4: Support model post-launch ("Who supports <Org> after launch?")
- FAQ 5: The Copenhagen event ("What will <Org> get from attending Sitecore Silver Celebration?") — **this FAQ is mandatory** and must reference the event by name.

### Section 6: Final CTA Data (3 fields)

| Field name | Type | Validation regex | Content contract |
|---|---|---|---|
| `finalCtaHeadline` | SLT | `^.{1,80}$` | ≤80 chars. Names the org, asks for attendance. Example: "Acme, see Sitecore AI in Copenhagen" |
| `finalCtaSubhead` | Rich Text | — | 1 sentence in `<p>...</p>`. **Must reference Sitecore Silver Celebration by name and date.** |
| `finalCtaButton` | General Link | — | text: action-oriented invitation (e.g., "Reserve your seat in Copenhagen"). url: `https://www.sitecore.com/resources/events-webinars/2026/05/sitecore-silver-celebration-copenhagen` (verbatim). target=`_blank`. |

### Inherited base-page fields (set these too)

| Field name | Value to set |
|---|---|
| `Title` | `"<Organization> — <one-line hook>"` (used in browser title and metadata) |
| `ShowInNavigation` | `"0"` (landing pages do not appear in site nav) |

---

## Validation checklist (Phase 5 — run before MCP submission)

The executing LLM **must** self-check every item before calling `create_content_item`:

### Length / regex compliance
- [ ] Every SLT field satisfies its validation regex (most importantly: `heroHeadline ≤80`, `heroEyebrow ≤40`, `heroSubhead ≤200`, `feature{N}Title ≤40`, `stat{N}Number ≤8`, `faq{N}Question ≤140`, `finalCtaHeadline ≤80`)
- [ ] Every `feature{N}IconName` matches `^[A-Z][A-Za-z0-9]{1,30}$` and is a real lucide-react icon name (safe list in the schema above)

### XML / HTML well-formedness
- [ ] Every General Link field is `<link text="..." linktype="external" url="https://..." anchor="" target="_blank" />` with no missing attributes
- [ ] Every Rich Text field is wrapped in at least one `<p>...</p>` element

### Personalization density (ABM signal)
- [ ] Organization name appears in: `heroHeadline`, `heroSubhead`, ≥2 of the 3 `feature{N}Description`, ≥3 of the 5 `faq{N}Question`, `finalCtaHeadline`
- [ ] Total organization-name mentions across the 40 fields is 5-10 (fewer = bland, more = sycophantic)

### Copenhagen event references
- [ ] At least one `faq{N}Answer` references the event by name
- [ ] `finalCtaSubhead` references "Sitecore Silver Celebration" by name
- [ ] `finalCtaButton.url` is exactly `https://www.sitecore.com/resources/events-webinars/2026/05/sitecore-silver-celebration-copenhagen`

### Honesty
- [ ] Testimonial author name is plausibly fictional, not a real executive at the target organization
- [ ] Testimonial author title positions the speaker as a peer-industry leader, not the target org's executive
- [ ] No fabricated Sitecore stats outside the safe-stats table
- [ ] No partner logos (image fields left empty)

If any check fails, regenerate the failing field(s) and re-run the full checklist.

---

## Create call shape (Phase 6)

```json
{
  "name": "<kebab-case-slug>",
  "parentId": "{AF65681C-5C75-40D2-89A3-3779D5A47A27}",
  "templateId": "{50AF6EC7-85FD-4B9B-ADF7-1FDE9D9136FE}",
  "language": "en",
  "fields": {
    "Title": "<Organization> — <hook>",
    "ShowInNavigation": "0",

    "heroEyebrow": "...",
    "heroHeadline": "...",
    "heroSubhead": "...",
    "heroPrimaryCta": "<link text=\"...\" linktype=\"external\" url=\"https://...\" anchor=\"\" target=\"_blank\" />",
    "heroSecondaryCta": "<link text=\"...\" linktype=\"external\" url=\"https://...\" anchor=\"\" target=\"_blank\" />",
    "heroImage": "",
    "heroVideo": "",

    "feature1IconName": "...",
    "feature1Title": "...",
    "feature1Description": "<p>...</p>",
    "feature2IconName": "...",
    "feature2Title": "...",
    "feature2Description": "<p>...</p>",
    "feature3IconName": "...",
    "feature3Title": "...",
    "feature3Description": "<p>...</p>",

    "stat1Number": "...",
    "stat1Label": "...",
    "stat2Number": "...",
    "stat2Label": "...",
    "stat3Number": "...",
    "stat3Label": "...",

    "testimonialQuote": "<p>...</p>",
    "testimonialAuthorName": "...",
    "testimonialAuthorTitle": "...",
    "testimonialAuthorImage": "",
    "partnerLogosImage": "",

    "faq1Question": "...",
    "faq1Answer": "<p>...</p>",
    "faq2Question": "...",
    "faq2Answer": "<p>...</p>",
    "faq3Question": "...",
    "faq3Answer": "<p>...</p>",
    "faq4Question": "...",
    "faq4Answer": "<p>...</p>",
    "faq5Question": "...",
    "faq5Answer": "<p>...</p>",

    "finalCtaHeadline": "...",
    "finalCtaSubhead": "<p>...</p>",
    "finalCtaButton": "<link text=\"Reserve your seat in Copenhagen\" linktype=\"external\" url=\"https://www.sitecore.com/resources/events-webinars/2026/05/sitecore-silver-celebration-copenhagen\" anchor=\"\" target=\"_blank\" />"
  }
}
```

**Slug pattern:** `<kebab-org-name>-welcome` or `<kebab-org-name>-copenhagen`. Examples: `acme-welcome`, `maersk-copenhagen`, `lego-welcome`. Lowercase, hyphens only, no spaces or special characters.

---

## Voice and brand guidelines

- **Tone:** professional, direct, peer-to-peer. Speak to a senior marketer (CMO, VP Marketing, CDO), not a developer.
- **Voice:** Sitecore is the partner, the target organization is the protagonist. The organization is the hero of the page; Sitecore is the trusted guide.
- **Avoid:** marketing-speak ("synergy", "leverage", "best-in-class"), filler adjectives ("powerful", "robust", "innovative"), and generic claims with no metric backing.
- **Prefer:** concrete numbers, named outcomes, second-person address ("you", "your team", "<Org>'s marketers").
- **Personalization density:** the target organization name should appear 5-10 times across the 40 fields. More than 10 reads as sycophantic; fewer than 5 fails the ABM purpose.

---

## Honesty and accuracy rules (non-negotiable)

- **Never fabricate customer logos or quote real executives.** Use plausible fictional names and explicitly label testimonials as from a peer-industry brand.
- **Never invent Sitecore product capabilities or stats.** Use the safe-stats table and the canonical event details exactly as given.
- **Cite the event URL verbatim.** Do not paraphrase, shorten, or query-string it.
- **Disclose uncertainty.** If research surfaces conflicting signals (e.g., the organization appears to be both a Sitecore customer and a prospect), flag this in the final report and ask the user before proceeding.
- **If WebSearch / WebFetch produce no usable signal**, report that the research phase failed and ask the user for context. Do not proceed with a fabricated dossier.

---

## Completion checklist

- [ ] Phase 0 — Sitecore template + parent verified via MCP
- [ ] Phase 1 — Research dossier produced (≥150 words documented in chat)
- [ ] Phase 2 — Sitecore AI angle chosen and noted
- [ ] Phase 3 — Copenhagen event integration planned
- [ ] Phase 4 — All 40 fields generated
- [ ] Phase 5 — Validation checklist passed (regex, XML, personalization density, event references, honesty)
- [ ] Phase 6 — `create_content_item` call succeeded and returned an item ID
- [ ] Phase 7 — `get_content_item_by_id` verification confirms 38 content fields persisted (the 2 image fields will be empty)
- [ ] Phase 8 — Final report delivered

If any step fails, report what succeeded and what remains. Do not silently move on.

---

## Final report format (Phase 8)

```
Created ABM landing page for <Organization>.

Sitecore item
  Path:    /sitecore/content/main/main-website/Home/lp/<slug>
  Item ID: {GUID}
  Page URL: /lp/<slug>

Research angle
  Industry:  <industry>
  Relationship to Sitecore: <prospect | existing customer | partner | unknown>
  Pain points addressed: <2-3 phrases>

Sitecore AI positioning
  <1-2 sentences capturing the angle taken>

Event CTA
  Anchor:    Sitecore Silver Celebration, Copenhagen, May 2026
  Final CTA: "<finalCtaButton.text>"
  Final URL: https://www.sitecore.com/resources/events-webinars/2026/05/sitecore-silver-celebration-copenhagen

Verification
  Fields persisted: 38/38 content fields, 2 image fields empty (intentional)
  Silent-writes:    <none | list any that needed update_fields_on_item retry>
```

---

## Out of scope

- Creating or modifying the Landing Page template (this skill consumes the template; it does not build it)
- Setting up Sitecore Personalize rules (separate workflow)
- Uploading images to the Sitecore DAM (image fields left empty for v1)
- Translating the page to other languages (default `en`)
- Editing Sitecore manifests, registries, or any project files (this skill only creates a Sitecore content item via MCP)
