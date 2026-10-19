---
name: sitecore-update-header-footer
description: Match a site header and footer from screenshots. Adds a HeaderST and FooterST variant named after the site, points Mega Menu items and Link Lists at the information architecture, and builds the footer as static markup. Use when the user pastes header and footer images, gives a Partial Designs path, or asks to update the header and footer for a site.
---

Read and follow `docs/ai/skills/sitecore-update-header-footer.md` in full before proceeding.

HeaderST and FooterST are shared. Add a site-named variant (`Asha` for site `asha`). Do not restyle `Default`.

| Piece | Rule |
|---|---|
| Variant name | PascalCase site name. Must match the Variant Definition item |
| Header nav | `header-navigation-{DynamicPlaceholderId}` placeholder, MegaMenuItem + Link List per primary IA item |
| Footer | Static markup in the site variant. Link List placeholders are optional |
| Colors | Theme tokens. No hardcoded hex |
| Variant selection | MCP cannot set `FieldNames`. Leave the user the Pages steps |
