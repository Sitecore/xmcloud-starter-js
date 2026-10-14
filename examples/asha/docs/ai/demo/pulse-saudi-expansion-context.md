# Pulse AI Demo Context — Saudi Expansion & Export Controls

> **Prefer the skill pack for Claude upload:** [`pulse-saudi-expansion/SKILL.md`](pulse-saudi-expansion/SKILL.md)  
> Detail companion: [`pulse-saudi-expansion/reference.md`](pulse-saudi-expansion/reference.md)

---

**Demo question (canonical):**  
> We're expanding into Saudi Arabia and have export-control questions. Who should we talk to?

**Site / brand:** Pillsbury Law (`pillsburylaw`)  
**Live base URL:** [https://pillsburylaw.vercel.app/](https://pillsburylaw.vercel.app/)  
**AI agent:** Pulse (`/api/pulse/ask` → playbook + answer composer)  
**Related surface:** On-site Search Results AI panel (same narrative)

All public page and citation links below use the live base URL.

**Source files in this codebase:**
- `src/lib/pulse-demo-playbook.ts` — curated intent + citations
- `src/lib/pulse-answer.ts` — answer narrative composition
- `src/lib/pulse-retrieve.ts` — playbook wins; max 8 sources
- `src/components/search-results/data.ts` — search catalog + AI insight rule
- `src/components/pulse-assistant/PulseAssistant.tsx` — UI + starter prompts

---

## 1. Demo narrative (what the agent should convey)

**Visitor intent:** A U.S. company is expanding into Saudi Arabia (KSA / Vision 2030) and has U.S. export-control questions (EAR / OFAC). They want to know **who to talk to**, and what learning assets help brief the business before intake.

**Optimal journey (people first, then assets):**
1. **Ata A. Akiner** — International Trade, Washington, DC → EAR / OFAC / national-security trade
2. **Khalid A. AlArfaj** — Corporate, Riyadh → entity setup, commercial, local coordination
3. Optional MENA corporate: **Osama Abu-Dehays** (Doha) — used more in search AI / broader MENA intent
4. Learning path before intake: webinar → podcast → guide → checklist → alert → CLE

**Positioning line:** Keyword search rarely surfaces this people + webinar + guide path together; Pulse connects practice, geography, and situation in one step.

---

## 2. How Pulse matches this question

**Intent ID:** `saudi-expansion-export-controls`  
(Higher specificity than fallback `mena-trade-sanctions`)

**Normalization:** lowercase; strip punctuation to spaces (so `export-control` → `export control`).

**Match groups** (any group where *all* tokens appear in the question; highest token-count wins):

| Match group | Example why it fires |
|-------------|----------------------|
| `expanding` + `saudi` | “…expanding into Saudi…” |
| `expand` + `saudi` | substring of “expanding” |
| `saudi` + `export` | “…Saudi… export-control…” |
| `ksa` + `export` | alternate phrasing |
| `vision` + `2030` + `export` | Vision 2030 asks |
| `who` + `talk` + `saudi` | “Who should we talk to?” + Saudi |
| `saudi` + `arabia` + `export` | full country + export |
| `export` + `control` + `questions` | “export-control questions” |
| `saudi` + `arabia` + `talk` | talk-to + Saudi Arabia |

For the canonical question, expected best score is **3** (e.g. `who`+`talk`+`saudi` or `export`+`control`+`questions`).

**Starter prompt chip (same question):**  
`We're expanding into Saudi Arabia and have export-control questions. Who should we talk to?`

---

## 3. Pulse playbook sources (ordered citations)

These are the **exact** sources Pulse returns for this intent (people first, then learning assets). Cap: **8**.

### People

#### 1. Ata A. Akiner — International Trade (Washington, DC)
- **Type:** Lawyer (`people-and-teams`)
- **Item ID:** `{8306EB6F-3AA2-474A-ABF0-CD35B805CE6E}`
- **URL:** `https://pillsburylaw.vercel.app/Lawyers/Bios/Ata-A-Akiner`
- **Sitecore path:** `/sitecore/content/pillsbury/pillsburylaw/Home/Lawyers/Bios/Ata-A-Akiner`
- **Excerpt (used in answer):**  
  EAR / OFAC and national-security trade counsel for U.S. companies expanding into the Kingdom — start here on export-control questions.
- **Search catalog blurb:** Senior Associate · International Trade. Helps clients navigate international trade, export controls, and national-security regulatory matters. Washington, DC.

#### 2. Khalid A. AlArfaj — Corporate (Riyadh)
- **Type:** Lawyer (`people-and-teams`)
- **Item ID:** `{A17985F3-2812-4721-8928-6B4381768660}`
- **URL:** `https://pillsburylaw.vercel.app/Lawyers/Bios/Khalid-A-AlArfaj`
- **Sitecore path:** `/sitecore/content/pillsbury/pillsburylaw/Home/Lawyers/Bios/Khalid-A-AlArfaj`
- **Excerpt:**  
  Riyadh corporate partner for entity setup, commercial contracting, and local coordination alongside U.S. trade counsel.
- **Search catalog blurb:** Partner · Corporate. Advises national and international clients on complex corporate matters across Saudi Arabia and the U.S. Riyadh.

### Learning assets

#### 3. Webinar: Expanding into Saudi Arabia — Export Controls 101
- **Badge:** Webinar  
- **Item ID:** `{FC3F756B-EF7C-4A68-9CD6-97FD0202EE72}`
- **URL:** `https://pillsburylaw.vercel.app/Insights/Events/Webinar/Expanding-into-Saudi-Arabia-Export-Controls-101`
- **Sitecore path:** `/sitecore/content/pillsbury/pillsburylaw/Home/Insights/Events/Webinar/Expanding-into-Saudi-Arabia-Export-Controls-101`
- **Excerpt:** Client webinar with Akiner and AlArfaj on sequencing EAR/OFAC review with KSA corporate setup before the first intake call.
- **Search description:** EAR, OFAC, and practical diligence for U.S. companies entering the Kingdom—with Ata Akiner (DC) and Khalid AlArfaj (Riyadh).
- **Sitecore Detail (representative HTML used in CMS):**
  - Title: Expanding into Saudi Arabia: Export Controls 101
  - Speakers: Ata A. Akiner (International Trade, Washington, DC) and Khalid A. AlArfaj (Corporate, Riyadh)
  - Learn: when Saudi expansion triggers U.S. export-control review; how to sequence trade counsel with MENA corporate counsel; practical intake checklist for legal and business teams

#### 4. Podcast: Trade Talks — Saudi Vision 2030 & Export Controls
- **Badge:** Podcast  
- **Item ID:** `{77C55548-522D-46D9-9367-536CE5163AC4}`
- **URL:** `https://pillsburylaw.vercel.app/Insights/Thought-Leadership/Podcast/Trade-Talks-Saudi-Vision-2030-Export-Controls`
- **Sitecore path:** `/sitecore/content/pillsbury/pillsburylaw/Home/Insights/Thought-Leadership/Podcast/Trade-Talks-Saudi-Vision-2030-Export-Controls`
- **Excerpt:** Short briefing episode on when to involve DC trade counsel vs Riyadh corporate counsel during Gulf expansion.
- **Search description:** When to involve DC trade counsel vs Riyadh corporate counsel—and how webinars/CLE complement intake.

#### 5. Guide: Who to Talk To — Saudi Expansion & Export Controls
- **Badge:** Guide / Insight  
- **Item ID:** `{C6AD0AF7-0CCB-4109-B74D-E207ECB78A35}`
- **URL:** `https://pillsburylaw.vercel.app/Insights/Thought-Leadership/Article/Who-to-Talk-To-Saudi-Expansion-Export-Controls`
- **Sitecore path:** `/sitecore/content/pillsbury/pillsburylaw/Home/Insights/Thought-Leadership/Article/Who-to-Talk-To-Saudi-Expansion-Export-Controls`
- **Excerpt:** Recommended lawyer pairing plus webinars, CLE, alert, and checklist for expansion teams.
- **Search title:** Who Should We Talk To? Saudi Expansion & Export Controls  
- **Search description:** Recommended lawyer pairing (Akiner + AlArfaj) plus webinars, podcast, alert, and checklist for expansion teams.

#### 6. Checklist: U.S. Companies Entering KSA
- **Badge:** Guide  
- **Item ID:** `{0579D7FB-48F2-4036-A8EE-E279E67958D4}`
- **URL:** `https://pillsburylaw.vercel.app/Insights/Thought-Leadership/White-Paper/Checklist-US-Companies-Entering-KSA`
- **Sitecore path:** `/sitecore/content/pillsbury/pillsburylaw/Home/Insights/Thought-Leadership/White-Paper/Checklist-US-Companies-Entering-KSA`
- **Excerpt:** Practical market-entry checklist covering corporate setup, trade diligence, and counsel handoffs.
- **Search description:** Corporate setup, contracting, and U.S. export-control diligence for Saudi market entry—built for GCs and expansion leads.

#### 7. Alert: Gulf Expansion — EAR / OFAC Update
- **Badge:** Alert  
- **Item ID:** `{68460E98-8ADA-4788-9921-EFD5270CAC89}`
- **URL (Pulse playbook):** `https://pillsburylaw.vercel.app/Insights/Alert/Gulf-Expansion-EAR-OFAC-Update`  
  *(Search catalog also references `https://pillsburylaw.vercel.app/Insights/Thought-Leadership/Alert/Gulf-Expansion-EAR-OFAC-Update` — prefer the live Vercel URL when wiring Claude.)*
- **Sitecore path:** `/sitecore/content/pillsbury/pillsburylaw/Home/Insights/Alert/Gulf-Expansion-EAR-OFAC-Update`
- **Excerpt:** Current EAR and OFAC points of focus for U.S. companies expanding across the Gulf.
- **Search description:** Recent EAR and OFAC developments for U.S. companies expanding into Saudi Arabia and the Gulf.

#### 8. CLE: International Trade Briefing — Riyadh & DC
- **Badge:** CLE  
- **Item ID:** `{CC0936CE-7B39-4755-A1FF-D7E80563CB07}`
- **URL:** `https://pillsburylaw.vercel.app/Insights/Events/CLE/International-Trade-Briefing-Riyadh-and-DC`
- **Sitecore path:** `/sitecore/content/pillsbury/pillsburylaw/Home/Insights/Events/CLE/International-Trade-Briefing-Riyadh-and-DC`
- **Excerpt:** In-person / CLE-style briefing bridging Riyadh commercial realities with Washington trade compliance.
- **Search description:** Half-day CLE for in-house teams managing Saudi expansion and export-control risk—with AlArfaj and Akiner.

---

## 4. Expected Pulse answer shape

Pulse does **not** call an LLM for this intent. It composes from the playbook via `composePulseAnswer`:

1. Intro: *Here’s who I’d start with for “[question]” — based on indexed lawyer bios and related site content.*
2. Primary lawyer (Akiner) + excerpt
3. *Also bring in:* AlArfaj (+ excerpt)
4. *To brief the business side before intake, use these learning assets:* webinar; podcast; guide; checklist; alert (up to 5 named)
5. Extra sentence from the webinar excerpt
6. Close: *Keyword search rarely surfaces this people + webinar + guide path together — open the citation cards below for bios and learning assets.*

**Example composed answer (paraphrase of runtime output):**

> Here’s who I’d start with for “We're expanding into Saudi Arabia and have export-control questions. Who should we talk to?” — based on indexed lawyer bios and related site content.
>
> **Ata A. Akiner — International Trade (Washington, DC)** (Lawyer). EAR / OFAC and national-security trade counsel for U.S. companies expanding into the Kingdom — start here on export-control questions.
>
> Also bring in: **Khalid A. AlArfaj — Corporate (Riyadh)** (Lawyer).
>
> Riyadh corporate partner for entity setup, commercial contracting, and local coordination alongside U.S. trade counsel.
>
> To brief the business side before intake, use these learning assets: **Webinar: Expanding into Saudi Arabia — Export Controls 101**; **Podcast: Trade Talks — Saudi Vision 2030 & Export Controls**; **Guide: Who to Talk To — Saudi Expansion & Export Controls**; **Checklist: U.S. Companies Entering KSA**; **Alert: Gulf Expansion — EAR / OFAC Update**.
>
> Client webinar with Akiner and AlArfaj on sequencing EAR/OFAC review with KSA corporate setup before the first intake call.
>
> Keyword search rarely surfaces this people + webinar + guide path together — open the citation cards below for bios and learning assets.

---

## 5. Parallel Search AI panel (same demo question)

Used by `selectAiSearchInsight` in `src/components/search-results/data.ts` (rule id `sanctions` / insight id `ai-saudi-expansion-export`).

**Headline:** Saudi expansion with export-control questions

**Answer:**  
Start with a two-lawyer team—Washington international trade for EAR/OFAC, and Riyadh corporate for local entity and commercial setup—then use webinars, a CLE briefing, and a short podcast to brief the business side before the first intake call.

**Bullets:**
- Talk to Ata A. Akiner (International Trade, Washington, DC) for export controls and sanctions.
- Talk to Khalid A. AlArfaj (Corporate, Riyadh) for Kingdom entity and commercial issues.
- Optional MENA corporate coverage: Osama Abu-Dehays (Doha).
- Brief the team with the Export Controls 101 webinar, Trade Talks podcast, Gulf EAR/OFAC alert, and KSA entry checklist.

**Citations:** Akiner; AlArfaj; Export Controls 101 webinar; Trade Talks podcast; Who-to-talk-to guide  

**CTA:** Open the who-to-talk-to guide → `https://pillsburylaw.vercel.app/Insights/Thought-Leadership/Article/Who-to-Talk-To-Saudi-Expansion-Export-Controls`  

**State callout:** Demo journey: people first, then webinar / podcast / alert / checklist.

**Popular search chip (same string as Pulse starter).**

---

## 6. Related assets not in the top-8 Pulse list (useful for Claude / search)

| Asset | URL | Role |
|-------|-----|------|
| MENA Corporate Setup & U.S. Export Compliance (webinar) | `https://pillsburylaw.vercel.app/Insights/Events/Webinar/MENA-Corporate-Setup-and-US-Export-Compliance` | Broader MENA entity + export webinar (fallback intent) |
| Export-Control Diligence for MENA Deals (presentation) | `https://pillsburylaw.vercel.app/Insights/Thought-Leadership/Presentation/Export-Control-Diligence-for-MENA-Deals` | Deal-team diligence / RACI workshop |
| Osama Abu-Dehays bio | `https://pillsburylaw.vercel.app/Lawyers/Bios/Osama-Abu-Dehays` | Optional Doha MENA corporate |
| Events hub | `https://pillsburylaw.vercel.app/Insights/Events` | Browse webinars / CLE |
| Webinars hub | `https://pillsburylaw.vercel.app/Insights/Events/Webinar` | Webinar list |
| Podcasts hub | `https://pillsburylaw.vercel.app/Insights/Thought-Leadership/Podcast` | Podcast series |

---

## 7. Instructions for Claude (reuse this pack)

When the user asks the demo question (or close variants: expanding into Saudi, KSA export controls, who should we talk to about Saudi + EAR/OFAC):

1. **Lead with people:** Akiner (DC trade) then AlArfaj (Riyadh corporate). Mention Abu-Dehays only as optional MENA cover.
2. **Then learning assets in this order:** Export Controls 101 webinar → Trade Talks podcast → Who-to-talk-to guide → KSA checklist → Gulf EAR/OFAC alert → Riyadh & DC CLE.
3. **Emphasize the journey:** brief the business with webinar/podcast/checklist **before** the first intake call.
4. **Contrast with keyword search:** a plain keyword search rarely returns this people + events + guides path together.
5. **Stay citation-grounded:** only recommend the assets and lawyers listed above; do not invent other partners or fake events.
6. **Tone:** confident SE-demo narrative for a law-firm visitor experience; concise; no legal advice disclaimers overload—this is a product demo of AI-assisted discovery.

**Synonyms / domain vocabulary to recognize:** Saudi Arabia, KSA, Kingdom, Riyadh, Vision 2030, Gulf, MENA, export control(s), EAR, OFAC, market entry, entity setup, expanding / expansion, who should we talk to.
