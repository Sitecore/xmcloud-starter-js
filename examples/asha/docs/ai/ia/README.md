# Sitecore IA specs

Markdown information-architecture trees for Sitecore page creation.

| Producer | Consumer |
|----------|----------|
| `get-site-ia` skill | `sitecore-create-ia` skill |

## Naming

```
docs/ai/ia/<client-kebab>-ia.md
```

Examples: `rockland-ia.md`, `quanex-ia.md`, `era-ia.md`

## Format

See `docs/ai/templates/site-ia.template.md` and `docs/ai/skills/get-site-ia.md`.

The `## Tree (creatable items only)` section must be an indented `- ` list that
`sitecore-create-ia` can parse without edits.
