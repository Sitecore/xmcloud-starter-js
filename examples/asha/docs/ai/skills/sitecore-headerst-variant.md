# Sitecore HeaderST cosmetic variant

Match a client's header using a **new HeaderST VersionN variant** and/or **rendering parameters**. HeaderST is shared across every site — never restyle `Default`.

## Trigger hints

Use this skill when:
- the user uploads a **screenshot** and/or **URL** of a company header for a demo
- the request mentions HeaderST, site header, nav bar, "theme the header", or "match their header"
- a demo needs HeaderST cosmetics without affecting other sites

## Do not use this skill when

- the work is a new component (not HeaderST) — use the create-component / add-variants skills
- the user wants pixel-perfect variants for **page body** components — use `sitecore-create-demo-variants` (HeaderST is excluded there)
- the user wants a new Skin / `data-theme` — use `create-new-theme` first, then return here for header layout

---

## Load first

- `docs/ai/config/project.yaml`
- `docs/ai/manifests/sitecore-manifest.yaml` (HeaderST entry)
- `docs/ai/catalog/headerst-versions.yaml`
- `src/components/site-three/HeaderST.tsx`
- `docs/ai/skills/sitecore-add-variants.md` (Sitecore Variant Definition steps)
- `docs/ai/skills/sitecore-maintain-manifest.md`
- `docs/ai/reference/agent-api-limitations.md` (cannot set FieldNames / rendering params via MCP)

---

## Canonical HeaderST facts

| Item | Value |
|---|---|
| React | `src/components/site-three/HeaderST.tsx` |
| Datasource template | `{3CB38973-6209-4407-B463-4B017E0467CD}` |
| Rendering | `/sitecore/layout/Renderings/Project/click-click-launch/Global Elements/HeaderST` `{90A922AA-E2A7-4553-A7AD-B89AC9318D6B}` |
| Parameters template | `{4B39645F-F45A-4099-817A-60A20E48DA25}` `HeaderST Parameters` |
| Param section | Functionality `{0E23CA45-925A-4E01-899E-9FAE36D902F6}` |
| Existing checkboxes | `showSearchBox`, `showMiniCart`, `ReverseTheme` |
| Datasource fields | `Logo`, `SupportLink`, `SearchLink`, `CartLink`, `LoginLink` |
| Reserved exports | `Default`, `LoginRequired` |

Headless Variants live **per site**: `<headlessVariantsRoot>/HeaderST` from `project.yaml`. Create VersionN on the **current** site only.

---

## Inputs

| Input | Required | Role |
|---|---|---|
| Header screenshot | Yes (or capture from URL) | Source of truth for layout |
| Company URL | Optional | Capture screenshot if none; inspect live header |
| Site / opportunity name | Optional | Catalog `usedBy` only — **never** the variant name |

**HARD RULE:** Do not implement without a header screenshot. If URL only, capture one (Playwright `docs/ai/scripts/site-scraper.mjs` or ask the user). Web search is not enough.

---

## Naming

Sitecore Variant Definition name **must exactly match** the TSX named export. Use PascalCase:

```
Version1
Version2
Version3
```

Never `AcmeHeader`, `PeopleCert`, `version1`, or the opportunity name.

Scan `HeaderST.tsx` exports matching `/^Version(\d+)$/`. Next name is `Version{max+1}`. If no VersionN exists yet, start at `Version1`.

---

## Decision: params vs variant vs both

Analyze the screenshot, then pick the **smallest** change that matches it.

### 1. Reuse existing rendering params (do this first)

| Param | When the screenshot shows |
|---|---|
| `showSearchBox` | Inline search field vs search text/icon link |
| `showMiniCart` | Mini-cart drawer vs cart icon link |
| `ReverseTheme` | Dark/colored full-bleed nav row vs transparent/light |

These already work on `Default`. Prefer them when layout structure is already correct.

### 2. Add a new rendering param

Only when the difference is a **show/hide or binary toggle** that must not change Default when unset.

| Allowed new param | Effect when true |
|---|---|
| `HideCart` | Do not render cart / MiniCart |
| `HideSupportLink` | Do not render SupportLink in the utility row |
| `HideSearch` | Do not render search control |
| `CompactHeader` | Reduce logo height and vertical padding |

Rules for new params:
- Add as **Checkbox** under the existing Functionality section (parent `{0E23CA45-925A-4E01-899E-9FAE36D902F6}`)
- **Falsy default** — unset must equal today's Default
- Read with `isTruthyParam` (same helper as `ReverseTheme`)
- PascalCase name (`HideCart`), Title like `Hide Cart`
- Do **not** add another `ReverseTheme` (duplicates already exist)
- Do **not** add params that rewrite layout (logo-centered, single-row vs two-row) — that is a VersionN

### 3. Create VersionN

When structure differs from Default:

- Logo center vs left
- Single row (logo + nav + utilities) vs two-row (utilities on top, nav below)
- Nav alignment (left / center / right / justified)
- CTA-style control in the header chrome (still using an existing Link field, not a new datasource field)
- Distinctive chrome: boxed logo, underline nav, split utility/nav
- Spacing/sizing that a single checkbox cannot express

Reuse an existing VersionN from `docs/ai/catalog/headerst-versions.yaml` when the layout recipe already matches. Record the new demo in `usedBy`.

### 4. Combine

Typical demo: **VersionN + existing params** (e.g. `Version1` + `ReverseTheme=true` + `showSearchBox=false`).

Auth is orthogonal: VersionN must call `resolveRequireAuthForNav`. Do **not** create `Version1LoginRequired`.

---

## Out of scope for HeaderST

Do not invent datasource fields or pretend HeaderST can do these:

- Mega-menu / flyout panels
- Language/locale picker
- Announcement/promo bar (different component)
- Phone number as its own field (use `SupportLink` if needed)
- Hardcoded brand hex colors (Skin / theme tokens handle palette)

If the screenshot needs those, say so and continue with what HeaderST can represent.

---

## Required workflow

Copy this checklist:

```
HeaderST theming:
- [ ] 1. Screenshot in hand (or captured from URL)
- [ ] 2. Analyze header layout vs Default
- [ ] 3. Read headerst-versions.yaml — reuse or increment
- [ ] 4. Plan: params / VersionN / both
- [ ] 5. Show plan, then implement
- [ ] 6. React (never restyle Default / LoginRequired)
- [ ] 7. Sitecore Variant Definition on current site
- [ ] 8. Optional new RP checkboxes (default off)
- [ ] 9. Tests
- [ ] 10. Catalog + manifest
- [ ] 11. Manual Pages steps (variant + params cannot be set via MCP)
```

### Step 1 — Capture the header

If the user gave a URL and no screenshot, run the scraper and inspect the desktop capture. Prefer a crop of the header if the full page is attached.

### Step 2 — Analyze vs Default

Default HeaderST is:

1. Sticky full-width bar, `bg-background`, light border
2. Row 1: logo left (home link) · utility right (`SupportLink`, search, auth, mobile menu, cart)
3. Row 2 (desktop, if nav visible): `header-navigation-{DynamicPlaceholderId}` placeholder; `ReverseTheme` paints it `bg-primary`

Write a short analysis:

- rows (1 vs 2)
- logo position and relative size
- which utilities are visible (support, search, cart, login)
- search as box vs icon/link
- nav same row vs below; alignment
- background / reverse-theme nav
- sticky, density, distinctive chrome

### Step 3 — Reuse or increment

Read `docs/ai/catalog/headerst-versions.yaml`. If a VersionN recipe matches, reuse it. Otherwise next `Version{N+1}`.

### Step 4 — Show the plan

Before coding, show:

1. Reuse vs new VersionN name
2. Rendering params to set (existing) and any new checkboxes
3. Sitecore item paths (current site Headless Variants)
4. TSX plan (new export or shared view + layout classes)
5. Manual Pages steps after MCP

If the user wants approval first, stop here.

### Step 5 — React

File: `src/components/site-three/HeaderST.tsx`.

**Must keep**

- Sitecore helpers: `ContentSdkImage` (Logo), `ContentSdkLink` (links)
- `params.styles` on the wrapper
- `AppPlaceholder` for `header-navigation-${params?.DynamicPlaceholderId}`
- `HeaderSTAuthControls`, `MobileMenuWrapper`, `MiniCart`, `HeaderPreviewSearch`
- `isTruthyParam` / `isReverseThemeParam` / `resolveRequireAuthForNav`
- `'use client'` and deferred `component-map` require

**Must not**

- Change `Default` or `LoginRequired` layout/classes
- Hardcode hex / client-specific colors
- Add datasource fields for cosmetics
- Name the export after the client

**Preferred structure**

If VersionN is mostly spacing/alignment, add a `layout` argument to the shared view (e.g. `'default' | 'version1'`) and branch Tailwind with `cn()`. If structure is substantially different, add `HeaderSTVersionNView` in the **same file**. Split to another file only if `HeaderST.tsx` becomes unmaintainable.

```tsx
export const Version1 = (props: HeaderSTProps) => (
  <HeaderSTVersion1View
    {...props}
    requireAuthForNav={resolveRequireAuthForNav(props, false)}
  />
);
```

Wire `showSearchBox` / `showMiniCart` the same way Default does. New hide params: only skip the control when the param is truthy.

Use theme tokens: `bg-background`, `text-foreground`, `bg-primary`, `text-primary-foreground`, `border-border`, `hover:text-primary`. Optional `var(--brand-*)` — never raw hex.

### Step 6 — Sitecore Variant Definition

Follow `sitecore-add-variants` on the **current** site:

1. `headlessVariantsRoot` from `project.yaml`
2. Ensure container `/sitecore/content/<siteCollection>/<siteName>/Presentation/Headless Variants/HeaderST`
   - Template: Headless Variants `{49c111d0-6867-4798-a724-1f103166e6e9}`
3. Create Variant Definition `VersionN`
   - Template `{4d50cdae-c2d9-4de8-b080-8f992bfb1b55}`
   - Name exactly `Version1` (not `version1`)
4. Verify with `get_content_item_by_path`

Do not add VersionN under other sites' Headless Variants unless asked.

### Step 7 — Optional new rendering params

Parent = Functionality section `{0E23CA45-925A-4E01-899E-9FAE36D902F6}`.

```
create_content_item({
  name: "HideCart",
  templateId: "455a3e98-a627-4b40-8035-e683a0331ac7",
  parentId: "0e23ca45-925a-4e01-899e-9fae36d902f6",
  fields: [
    { name: "Type", value: "Checkbox" },
    { name: "Title", value: "Hide Cart" }
  ]
})
```

Leave `__Standard Values` empty (unchecked). Verify `Type` is Checkbox. Do not create a new Parameters Template and do not retarget the rendering's `Parameters Template` field.

### Step 8 — Tests

Update `src/__tests__/site-three/HeaderST.test.tsx` (and mock props if needed):

- VersionN renders without throwing
- Existing `showSearchBox` / `showMiniCart` behavior still holds on VersionN
- New hide params: hidden when true, visible when unset (Default unchanged)

### Step 9 — Catalog + manifest

Append to `docs/ai/catalog/headerst-versions.yaml`:

```yaml
  - name: Version1
    layout: "one-line recipe"
    paramsUsed: ["ReverseTheme"]
    usedBy: ["client-kebab"]
    notes: "what differs from Default"
```

Update the HeaderST entry in `sitecore-manifest.yaml`: append the variant to `react.variants` and `headlessVariants.variants` (current site), timestamped `notes`, `updatedAt`. New RP fields go on the HeaderST rendering-params record.

### Step 10 — Manual Pages steps (required)

MCP cannot set `FieldNames` or other rendering parameters (`docs/ai/reference/agent-api-limitations.md`). After items exist, tell the user:

1. Open this site's **Header** partial design in Pages
2. Select the HeaderST rendering
3. Design tab → variant **VersionN**
4. Set params: `showSearchBox`, `showMiniCart`, `ReverseTheme`, plus any new checkboxes
5. Publish the Header partial (and templates if new RP fields were added)

HeaderST lives on the Header partial — the variant applies site-wide. That is intended.

---

## Output format

Before implementation: analysis, reuse vs new name, params vs variant, Sitecore paths, TSX plan.

After implementation:

1. VersionN name (or reused)
2. Sitecore items created/verified
3. TSX / test files changed
4. New RP fields (or none)
5. Catalog + manifest updates
6. Manual Pages checklist
7. Anything the screenshot needed that HeaderST cannot do

---

## Completion rule

Complete only when:

- [ ] `Default` and `LoginRequired` layouts unchanged
- [ ] New export is `VersionN` (PascalCase), not the opportunity name
- [ ] Variant Definition exists on the current site and matches the export name
- [ ] Existing params still work; new params default off
- [ ] No new datasource fields for cosmetics
- [ ] Catalog and HeaderST manifest entry updated
- [ ] Tests cover the new export / params
- [ ] User has the Pages steps for variant + params

---

## Verification checklist

- [ ] Screenshot analyzed against Default
- [ ] `headerst-versions.yaml` checked for reuse
- [ ] Plan shown before coding
- [ ] Named export `VersionN` in `HeaderST.tsx`
- [ ] Headless Variants container + Variant Definition verified via MCP
- [ ] New RP checkboxes (if any) under Functionality, Type=Checkbox, default empty
- [ ] Tests pass for Default + VersionN
- [ ] Manifest + catalog updated
- [ ] Manual variant selection documented
