# Sitecore manifest rule

## Read before every task

After reading `docs/ai/config/project.yaml` (rule `00`), read:

```
docs/ai/manifests/sitecore-manifest.yaml
```

If the file does not exist, create it from the template and populate the `project` block from `project.yaml`.

## Use the manifest to

- **Avoid duplicates** — check if the component already exists before creating new items
- **Resume partial work** — if `status` is `partial` or `failed`, pick up where the last session left off using recorded item IDs
- **Skip redundant lookups** — use cached item IDs instead of re-resolving paths via MCP when the manifest entry is recent and trustworthy
- **Protect Available Renderings** — if the manifest records the last-known `Renderings [shared]` value, use it as a cross-reference when concatenating new rendering IDs
- **Skip redundant MCP calls** — check `lookups` for cached structural item IDs before calling `get_content_item_by_path`

## Update during every task

| When | What to update |
|---|---|
| After spec is confirmed | Add `planned` entry with paths, empty IDs |
| After each MCP create/update batch | Fill in item IDs, set boolean flags, set `status: "partial"` |
| After verification | Record `passed`, `failed`, `pendingManual` |
| Task complete | Set `status: "complete"`, set `updatedAt` |
| Task failed | Set `status: "failed"`, add `notes` explaining why |
| Existing component modified | Update changed fields, append timestamped `notes` entry |
| First task only | Resolve all 6 structural paths via MCP, populate `lookups` |
| Before any `get_content_item_by_path` | Check `lookups` first, use cached ID if available |
| After creating category subfolders | Add new subfolder paths to `lookups` |

Always write the manifest to disk at least once during implementation and once at task end.

## Conflict handling

- MCP is the source of truth for item existence and IDs — if MCP disagrees with the manifest, trust MCP and update the manifest
- If a manifest entry says `complete` but MCP cannot find the item, set `status: "failed"` and note the discrepancy
- Never silently overwrite a `complete` entry without user confirmation

## Full skill reference

For detailed rules on entry shape, lifecycle, verification recording, and search/lookup caching, see:

```
docs/ai/skills/sitecore-maintain-manifest.md
```

## Do not skip this step

The manifest must be read before and updated after every Sitecore task — create, update, fix, or variant addition.
