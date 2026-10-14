# {{CLIENT_NAME}} — Build Plan

> **Source:** {{SOURCE_URL}}
> **Analyzed:** {{DATE}}
> **Sections:** {{TOTAL_SECTIONS}} ({{TEMPLATE_MATCHES}} template, {{CUSTOM_REQUIRED}} custom)

---

## Page Sections (top to bottom)

<!-- One row per section. The "What We'll Use" column is the most important for SE review. -->

| # | What's on the page | What we'll use | Variant | Confidence | Notes |
|---|-------------------|----------------|---------|------------|-------|
| 1 | _Thin black utility bar with "Find a Hotel" links_ | Announcement Bar | Highlight | High | |
| 2 | _Logo + nav links + Book Now over hero image_ | Navigation Header | Transparent | High | Context-only, manual placement |
| 3 | _Full-bleed atmospheric photo_ | Hero Banner | BackgroundImage | High | |
| ... | ... | ... | ... | ... | ... |

---

## Sections that need attention

> [!WARNING]
> These sections have low confidence or need custom work. Review before approving.

<!-- Only include sections with matchConfidence "low" or matchType "custom" -->

| # | What's on the page | Issue | Suggestion |
|---|-------------------|-------|------------|
| 5 | _Interactive hero with expanding accordion categories_ | No template supports hero + accordion overlay | Custom component, or split into HeroBanner + FAQAccordion |
| ... | ... | ... | ... |

<!-- If no sections need attention, replace with:
> [!NOTE]
> All sections matched with medium or high confidence. No custom work needed.
-->

---

## Variant Decisions

Why each variant was chosen — helps the SE validate the plan matches the screenshot.

<!-- Only include non-Default variants and any where the reason isn't obvious -->

| # | Component | Variant | Why this variant |
|---|-----------|---------|-----------------|
| 1 | Announcement Bar | Highlight | High-contrast bar on dark background |
| 2 | Navigation Header | Transparent | Logo overlays hero image with light text |
| 3 | Hero Banner | BackgroundImage | Full-bleed photo with text overlay, luxury style |
| ... | ... | ... | ... |

---

## Components by type

### Will be added automatically (API-addable)
_These have datasource templates and can be placed + wired via the build pipeline._

| # | Component | Datasource needed |
|---|-----------|------------------|
| 1 | Announcement Bar | Simple (1 item) |
| 3 | Hero Banner | Simple (1 item) |
| 6 | Feature Cards Grid | List (parent + 4 children) |
| ... | ... | ... |

### Must be placed manually
_Context-only components or components that can't be added via API._

| # | Component | Where it lives | What to do |
|---|-----------|---------------|------------|
| 2 | Navigation Header | Header partial design | Assign datasource in Content Editor |
| 12 | Site Footer | Footer partial design | Assign datasource in Content Editor |

### Custom components needed
_These don't match any template and need to be built from scratch._

<!-- If none, replace with: "None — all sections matched template components." -->

| # | What's on the page | Suggested approach | Fields needed |
|---|-------------------|-------------------|---------------|
| ... | ... | ... | ... |

---

## Build Order

```
Phase 1 — Sitecore content (create datasource items):
  1. AnnouncementBar
  2. HeroBanner
  3. RichTextBlock
  4. TabNavigationSection
  5. FeatureCardsGrid (STAY)
  6. FeatureHighlight
  7. CTABanner
  8. FeatureCardsGrid (DINE)
  9. ValuePropositionGrid
  10. FeatureCardsGrid (MORE)

Phase 2 — Apply theme (CSS variables + fonts)

Phase 3 — Custom components (if any)
```

---

## Approval Questions

1. **Does the section-to-component mapping look correct?** Look at the table above and compare against the screenshot.
2. **Do you want pixel-perfect custom variants** (Phase 5.5) or are the generic template variants sufficient?

> Reply "approved" to proceed, or describe any changes needed.
