---
name: sitecore-headerst-variant
description: Create cosmetic HeaderST variants named Version1, Version2, … and optional rendering parameters to match a client's header from a URL and screenshot. Use when theming HeaderST, customizing the site header, matching a company header, or when the user uploads a header screenshot or URL. Never rename variants after the opportunity. Never change the Default HeaderST layout used by other sites.
---

Read and follow `docs/ai/skills/sitecore-headerst-variant.md` in full before proceeding.

HeaderST is a **shared** Global Elements component (`src/components/site-three/HeaderST.tsx`) used by every site. Cosmetic demo work must not restyle `Default`.

| Constraint | Rule |
|---|---|
| Variant names | `Version1`, `Version2`, … (PascalCase). Never the opportunity/client name. |
| Reserved exports | `Default`, `LoginRequired` — do not change their layout |
| Datasource template | `{3CB38973-6209-4407-B463-4B017E0467CD}` — cosmetic work does not add datasource fields |
| Rendering params | Reuse `showSearchBox`, `showMiniCart`, `ReverseTheme` first. New checkboxes must default off. |
| Colors | Theme tokens (`bg-background`, `text-foreground`, `var(--brand-*)`). No hardcoded hex. |

Version catalog: `docs/ai/catalog/headerst-versions.yaml` — read it to reuse an existing VersionN before creating a new one.
