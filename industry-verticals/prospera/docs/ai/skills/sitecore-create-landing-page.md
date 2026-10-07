# Sitecore create landing page

Orchestrator skill that creates a complete Landing Page type: page template (with 40 route fields across 6 sections, fixed-shape no datasources), 6 context components, variants, partial design, and `/Home/lp/` content tree setup.

Designed for **agent-driven authoring (Agentic Studio)** and **ABM campaigns** — every field is filled by an agent from a marketer brief; per-section variants let one ABM account get a SplitImage hero while another gets Minimal.

## Trigger hints
Use this skill when:
- the user says "create landing page", "landing page template", "campaign page template", "ABM landing page", "conversion page template"
- the user wants a page type with a hero, features, stats, social proof, FAQ, and final CTA where all fields live on the page template
- a request involves agent-fillable marketing pages with deterministic structure

## Do not use this skill when
- the user wants a single landing-page-related datasource component (use `sitecore-create-simple-component` or `sitecore-create-list-component`)
- the user wants to add variants to an existing landing page component (use `sitecore-add-variants`)
- the user wants a generic or custom page template (use `sitecore-create-page-template`)
- the user wants an article/blog/news page (use `sitecore-create-article-page`)

---

## Load first
- `docs/ai/config/project.yaml`
- `docs/ai/catalog/page-template-registry.yaml` (Landing entry — the source of truth for schema, variants, components)
- `docs/ai/manifests/sitecore-manifest.yaml`
- `docs/ai/skills/sitecore-maintain-manifest.md`
- `docs/ai/reference/sitecore-rules.md`
- `docs/ai/reference/sitecore-marketer-mcp-reference.md`
- `docs/ai/skills/shared/react-uiim-guidelines.md`

---

## Prerequisites
- Project config must exist (`docs/ai/config/project.yaml`)
- Manifest must exist (`docs/ai/manifests/sitecore-manifest.yaml`)
- Page Types parent folder exists at `/sitecore/templates/Project/main/Page Types/` (created by Article skill; reuse)

---

## Full workflow

This skill orchestrates multiple sub-skills in sequence. Each phase depends on the previous one.

### Phase 1 — Landing Page Template (delegates to `sitecore-create-page-template`)

Follow `docs/ai/skills/sitecore-create-page-template.md` to create:

1. **Landing Page template** — inherits from base page template
   - Path: `/sitecore/templates/Project/main/Page Types/Landing Page`
   - Base template: same Page template Article inherits from (resolve via MCP from Home or from existing manifest entry)
   - **6 template sections** in render order: Hero Data, Features Data, Stats Data, Social Proof Data, FAQ Data, Final CTA Data
   - **40 fields total** — see `page-template-registry.yaml` → `landing.templateSections` for the canonical list with types, validation regexes, and help text
   - Every field gets `__Short description` populated from the registry's `help` value (agent contract)
   - Every SLT field with `validation` gets its validation regex set
   - `__Standard Values` created and populated with the v1 defaults from the registry's `standardValuesDefaults` block

2. **Content tree** — `lp` parent page at `/sitecore/content/main/main-website/Home/lp` with insert options for Landing Page template only

3. **Layout.tsx** — extend `RouteFields` with all 40 new fields (optional). Field type mapping:
   - Single-Line Text → `Field<string>`
   - Rich Text → `RichTextField` (or `Field<string>` if existing convention uses that)
   - General Link → `LinkField`
   - Image → `ImageField`

### Phase 2 — Context components (delegates to `sitecore-create-context-component` x6)

Follow `docs/ai/skills/sitecore-create-context-component.md` for each component. All 6 share the same recipe — only the consumed route fields and component-specific JSX differ.

For each component:
1. Create Rendering Parameters template at `/sitecore/templates/Project/fmc-custom-demo/Rendering Parameters/Landing/<ComponentName>` with the 4 standard base templates
2. Create JSON Rendering at `/sitecore/layout/Renderings/Project/fmc-custom-demo/Landing/<ComponentName>` with:
   - `Component Name [shared]` = PascalCase matching TSX filename
   - `Parameters Template [shared]` = Item ID (GUID) of the RP template (never a path)
   - Empty `Datasource Template`, `Datasource Location`, `ComponentQuery`
   - `AddFieldEditorButton = 1`
3. Register in Available Renderings (append to existing `Renderings [shared]` value on Page Content, never replace)
4. Create React component file under `src/components/uiim/landing/<ComponentName>.tsx`
5. Update `.sitecore/component-map.ts`

Components to create (see `page-template-registry.yaml` → `landing.contextComponents` for the canonical list):

| Component | Route fields consumed |
|---|---|
| `LandingHero` | heroEyebrow, heroHeadline, heroSubhead, heroPrimaryCta, heroSecondaryCta, heroImage, heroVideo |
| `LandingFeatures` | feature{1,2,3}{IconName,Title,Description} |
| `LandingStats` | stat{1,2,3}{Number,Label} |
| `LandingSocialProof` | testimonialQuote, testimonialAuthorName, testimonialAuthorTitle, testimonialAuthorImage, partnerLogosImage |
| `LandingFAQ` | faq{1..5}{Question,Answer} |
| `LandingFinalCTA` | finalCtaHeadline, finalCtaSubhead, finalCtaButton |

### Phase 3 — Variants (delegates to `sitecore-add-variants`)

Lean v1 scope — only the Hero gets multiple variants. All other components ship Default-only.

Follow `docs/ai/skills/sitecore-add-variants.md` for each component:

#### LandingHero variants
Create Headless Variants container at `/sitecore/content/main/main-website/Presentation/Headless Variants/LandingHero` and 3 Variant Definition items:
- `Default` — centered eyebrow + headline + subhead + dual CTAs above hero image/video
- `SplitImage` — two-column: text left, hero image/video right (preferred for known-account ABM)
- `Minimal` — text-only, no media (preferred for retargeting visitors)

#### LandingFeatures, LandingStats, LandingSocialProof, LandingFAQ, LandingFinalCTA
Headless Variants container + `Default` Variant Definition only for each.

Each variant = a named export in the TSX file matching the Variant Definition item name exactly. Total: 8 named exports across 6 files.

### Phase 4 — Partial Design

Create a Partial Design for the landing page layout:

1. Navigate to `/sitecore/content/main/main-website/Presentation/Partial Designs/`
2. Create new Partial Design item named "Landing Page Layout"
3. Add components to `headless-main` placeholder **in this order**:
   1. LandingHero
   2. LandingFeatures
   3. LandingStats
   4. LandingSocialProof
   5. LandingFAQ
   6. LandingFinalCTA
4. Associate the partial design with the Landing Page Template's `__Standard Values`:
   - Set the `Partial Designs` field on `__Standard Values` to reference "Landing Page Layout"

### Phase 5 — Verification and manifest

Verify all items from Phases 1-4. Update manifest with:
- Page template item ID, path, section IDs, all 40 field IDs
- `__Standard Values` ID
- 6 RP template IDs
- 6 rendering IDs
- 8 Variant Definition IDs (LandingHero: 3, others: 1)
- Partial design ID
- `lp` parent page ID
- New lookups: Page Types parent (likely already cached from Article), `/Home/lp`, Landing RP folder, Landing rendering folder
- Component status: `complete` (each of the 6 components + the page template entry) or `failed` with notes

---

## React implementation notes

### Shared patterns across all 6 components
- Props extend `ComponentProps` from `@/lib/component-props`
- Access route fields via `useSitecore()` → `page.layout.sitecore.route.fields`
- Every Sitecore field rendered via SDK editable helper: `Text`, `ContentSdkRichText`, `ContentSdkImage`, `ContentSdkLink`
- Edit-mode visibility guard: `{(field?.value || isEditing) && <Helper field={field} />}`
- `params.styles` and `params.RenderingIdentifier` on the wrapper element
- Non-exported empty-state fallback component per file
- Named exports only — never `export default`

### LandingHero
- Renders `heroVideo` when set, else `heroImage`. No control boolean.
- Both CTAs as `ContentSdkLink`. Hide secondary if not set (unless editing).
- 3 variants share most JSX through internal helper components; only layout wrappers differ.

### LandingFeatures
- 3-up card grid. For each feature: render the lucide icon via `lucide-react` dynamic lookup (`(LucideIcons as any)[feature{N}IconName]`).
- If icon name is unknown or empty, fall back to a neutral icon (e.g. `Sparkles`) or no icon.
- Hide any feature where all 3 of its fields (icon, title, description) are empty (unless editing).

### LandingStats
- 3-up tile band. Numbers rendered large, labels below.
- Hide any stat where both number and label are empty (unless editing).

### LandingSocialProof
- Testimonial card (quote + author block) above logo strip.
- Hide testimonial block if `testimonialQuote` is empty (unless editing).
- Hide logo strip if `partnerLogosImage` is empty (unless editing).

### LandingFAQ
- shadcn `Accordion` component, type="single", collapsible.
- Iterate 1..5; render only the items where both question and answer are non-empty (unless editing).
- Use `AccordionItem` / `AccordionTrigger` / `AccordionContent` from `@/components/ui/accordion`.

### LandingFinalCTA
- Centered headline + subhead + single button on a contrast background band.
- Button = `ContentSdkLink`.

---

## Component map entries

Add to `.sitecore/component-map.ts` (match existing key casing — inspect the file before writing):
```typescript
'LandingHero': dynamic(() => import('components/uiim/landing/LandingHero')),
'LandingFeatures': dynamic(() => import('components/uiim/landing/LandingFeatures')),
'LandingStats': dynamic(() => import('components/uiim/landing/LandingStats')),
'LandingSocialProof': dynamic(() => import('components/uiim/landing/LandingSocialProof')),
'LandingFAQ': dynamic(() => import('components/uiim/landing/LandingFAQ')),
'LandingFinalCTA': dynamic(() => import('components/uiim/landing/LandingFinalCTA')),
```

Follow the existing naming pattern in the file.

---

## Sitecore item path conventions (this skill)

| Item | Path |
|---|---|
| Page template | `/sitecore/templates/Project/main/Page Types/Landing Page` |
| RP templates | `/sitecore/templates/Project/fmc-custom-demo/Rendering Parameters/Landing/<Component>` |
| Renderings | `/sitecore/layout/Renderings/Project/fmc-custom-demo/Landing/<Component>` |
| Headless Variants | `/sitecore/content/main/main-website/Presentation/Headless Variants/<Component>` |
| Partial Design | `/sitecore/content/main/main-website/Presentation/Partial Designs/Landing Page Layout` |
| Content tree parent | `/sitecore/content/main/main-website/Home/lp` |

Note: Page templates live under `Project/main/Page Types/` (Article convention), but RP templates and renderings live under `Project/fmc-custom-demo/`. This is the established split — don't try to unify.

---

## Agentic Studio + ABM notes

- **Field naming is verbose semantic and position-indexed** so an LLM can map a brief sentence to a field name unambiguously (`heroHeadline`, `feature2Title`, `faq3Question`).
- **Every field has `__Short description`** carrying the agent contract (length, voice, example).
- **Validation regexes** enforce length caps — a rejected agent fill is a signal to retry shorter.
- **`__Standard Values` carries realistic SaaS-flavored defaults** — gives the agent a shape reference. Marked v1, intended for review before first ABM campaign.
- **No control booleans** — visibility derives from field emptiness. Agent's job is fill-or-skip, not flag-flipping.
- **Variant selection is NOT a field** — layout choice (centered hero vs split-image hero) is the Variant Definition picker on the rendering. ABM can swap variants per audience independently of content.
- **Personalization-ready** — every field individually personalizable via Sitecore Personalize. ABM pattern: same template, different field values per account.

A future Agentic Studio Brief Type can be added as a separate task that maps 1:1 to these 40 fields (deferred — Path 1 from the grilling).

---

## Completion rule

The task is only complete when ALL phases succeed:
- [ ] Landing Page template created inheriting from Page base
- [ ] All 6 sections created with the correct names
- [ ] All 40 fields created with correct Types, validation regexes, and `__Short description` help text
- [ ] `__Standard Values` created and linked, populated with v1 defaults
- [ ] `lp` parent page created at `/Home/lp` with insert options
- [ ] `Layout.tsx` RouteFields updated with 40 new optional fields
- [ ] 6 Rendering Parameters templates created
- [ ] 6 JSON Renderings created with correct Component Name (PascalCase matching TSX) and Parameters Template GUID
- [ ] All 6 renderings registered in Available Renderings (appended, never replaced)
- [ ] 6 Headless Variants containers + 8 Variant Definition items (LandingHero: 3, others: 1 each)
- [ ] 6 React component files created with 8 named exports total
- [ ] `.sitecore/component-map.ts` updated with 6 entries
- [ ] Partial Design "Landing Page Layout" created with all 6 components placed on `headless-main` in render order
- [ ] Landing Page `__Standard Values` references the partial design
- [ ] Manifest fully updated with all item IDs and status

If any phase fails, set status to `partial`, record what succeeded, and report what remains.
