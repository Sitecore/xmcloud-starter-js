---
name: sitecore-create-demo-variants
description: Create pixel-perfect custom variants for each component on a demo page, replicating the exact layout, spacing, and visual style from the client's homepage screenshot. Use when the demo builder reaches Phase 5.5, or when the user says "match the screenshot exactly", "replicate the visual style", or "pixel-perfect".
---

Read and follow `docs/ai/skills/sitecore-create-demo-variants.md` in full before proceeding.

This skill creates a custom named export per component (e.g., `PeopleCert`) that matches the client's screenshot exactly:

1. Read the build plan and identify sections needing custom variants
2. Inspect the screenshot and analyze layout, spacing, card style, typography per section
3. Write `variant-specs.yaml` with the visual analysis
4. Create new named exports in each component's TSX file (Tailwind + `var(--brand-*)`)
5. Create Variant Definition items in Sitecore
6. Update the variant checklist with custom variant names
7. Validate with `node docs/ai/scripts/validate-components.mjs`

Key rules:
- **Variant name** = client PascalCase name (e.g., `PeopleCert`, `BankOfAmerica`)
- **Never hardcode colors** — always use `var(--brand-*)` references
- **Keep ALL Sitecore field helpers** — `Text`, `RichText`, `NextImage`, `Link`
- **Keep ALL isEditing guards** — fields must stay editable
- **Use the closest existing variant as starting point** — modify, don't rebuild from scratch
- **HeaderST is excluded** — use `sitecore-headerst-variant` (`Version1`, `Version2`, …) instead of a client-named header variant
