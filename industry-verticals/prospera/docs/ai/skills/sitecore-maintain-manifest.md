# Sitecore manifest management

Maintain a living YAML manifest of all AI-created Sitecore items at:

```
docs/ai/manifests/sitecore-manifest.yaml
```

## Purpose

The manifest provides a single source of truth for:
- what components the AI has created or modified
- Sitecore item IDs, paths, and relationships
- verification status of each item
- pending manual checks (silent-write fields)

This prevents duplicate creation, enables resumption of partial work, and gives humans a quick audit trail.

---

## When to read the manifest

**Before every Sitecore component task**, read the manifest file after reading `docs/ai/config/project.yaml`.

Use the manifest to:
- check whether the component already exists (by `name` and `category`)
- retrieve known item IDs to avoid redundant `get_content_item_by_path` lookups
- understand which items are `complete`, `partial`, `planned`, or `failed`
- find the current Available Renderings value if a recent component recorded it

If the manifest file does not exist, create it from the template at:
```
docs/ai/manifests/sitecore-manifest.yaml
```
Populate the `project` block from `docs/ai/config/project.yaml` and set `generatedAt` to the current timestamp.

---

## When to update the manifest

Update the manifest at these points during a task:

### 1. Task start — register the component

As soon as the spec is confirmed and before implementation begins, add a new entry to `components` with:
- `name`, `kind`, `category`
- `status: "planned"`
- `createdAt` set to the current timestamp
- all paths pre-populated from the spec
- item IDs left empty

If the component already exists in the manifest:
- if `status: "complete"` — confirm with the user before overwriting
- if `status: "partial"` or `"failed"` — resume from where it left off, using the recorded item IDs
- if `status: "planned"` — proceed with implementation

### 2. During implementation — record item IDs

After each successful MCP `create_content_item` or `update_fields_on_content_item`, update the corresponding field in the manifest entry:
- set `itemId` on the created item
- set boolean flags (`baseTemplatesSet`, `linked`, `insertOptionsSet`, `registeredInAvailableRenderings`)
- update `status` to `"partial"` once the first item is created

You do not need to write the file to disk after every single MCP call. Batch updates are fine — but always write at least once during implementation and once at the end.

### 3. Task end — finalize

After implementation and verification:
- set `status` to `"complete"` (or `"partial"` / `"failed"` if something is unfinished)
- populate `verification.checkedAt`, `verification.passed`, `verification.failed`, `verification.pendingManual`
- set `updatedAt` to the current timestamp
- write the manifest to disk

### 4. Update / variant addition / fix tasks

When modifying an existing component:
- find the entry by `name` (and optionally `category`)
- update only the changed fields
- append to `notes` with a timestamped note explaining the change
- update `updatedAt`

---

## Manifest entry lifecycle

```
planned → partial → complete
                  ↘ failed
```

| Status | Meaning |
|---|---|
| `planned` | Spec confirmed, no Sitecore items created yet |
| `partial` | Some items created, work interrupted or in progress |
| `complete` | All items created, verification done |
| `failed` | A blocking error prevented completion; see `notes` |

---

## Recording verification results

After running the verification checklist from the skill, record results in the component entry:

```yaml
verification:
  checkedAt: "2026-03-21T14:30:00Z"
  passed:
    - "Template exists"
    - "Base templates set"
    - "Fields created with correct Type"
    - "Standard Values linked"
    - "Rendering Parameters template created"
    - "Rendering created"
    - "Component Name is PascalCase"
    - "React file created"
    - "Component map updated"
  failed:
    - "Datasource Location not returned by MCP read"
  pendingManual:
    - "Datasource Template (silent-write)"
    - "Datasource Location (silent-write)"
    - "__Masters on folder SV (silent-write)"
    - "Renderings on Available Renderings (silent-write)"
```

`pendingManual` is specifically for silent-write fields where MCP confirms the write but cannot read the value back. These are **not failures** — they are expected MCP behavior. Mark them clearly so a human can verify in Content Editor.

---

## Lookup cache rules

The `lookups` section caches frequently-resolved Sitecore item paths and their IDs. This avoids redundant `get_content_item_by_path` calls — especially for structural items that never change between component tasks.

### Required lookups

The following paths must be in `lookups` after the first component task. If they are missing, resolve them via MCP and add them immediately:

| Path pattern | Why |
|---|---|
| `<dataRoot>` | Parent for all datasource folders |
| `<projectTemplatesRoot>/Components` | Parent for all template category subfolders |
| `<projectFoldersRoot>` | Parent for all folder templates |
| `<renderingParamsRoot>` | Parent for all rendering parameter templates |
| `<headlessVariantsRoot>` | Parent for all variant containers |
| Available Renderings Page Content | Read-modify-write target for every rendering registration |

Derive these paths from `docs/ai/config/project.yaml` using the bootstrap rules in rule `00`.

### When to write lookups

**During the first component task:**
1. Before creating any items, resolve all 6 required paths via `get_content_item_by_path`
2. Record each `path`, `itemId`, and `lastReadAt` in the `lookups` array
3. Write the manifest to disk

**During subsequent component tasks:**
1. Before resolving a parent path via MCP, check `lookups` first
2. If the path is in `lookups` and has a non-empty `itemId`, use that ID directly — skip the MCP call
3. If the path is not in `lookups`, resolve via MCP and add it

**When creating category subfolders** (e.g. `Components/Banners`, `Rendering Parameters/Content`):
- After creating a new category subfolder, add it to `lookups` so the next component in the same category skips the resolution

### When to read lookups

Before every `get_content_item_by_path` call, check if the path is already in `lookups`. If it has a cached `itemId`, use it directly and skip the MCP call.

### Available Renderings — special handling

The Available Renderings Page Content item is the most critical lookup because:
- Every component registration reads its `Renderings [shared]` field
- The value is a pipe-separated list of GUIDs that grows with each component
- Writing the wrong value (replacing instead of concatenating) removes all other components
- **The `Renderings` field is BOTH silent-write AND silent-read** — MCP cannot read the current value

Rules:
1. **Always** have this item in `lookups` before creating any rendering
2. **MCP cannot read the `Renderings` field.** You must ask the user for the current value, OR use the `availableRenderings.lastKnownValue` from the manifest if available
3. Never replace — always concatenate
4. After each successful append, update `availableRenderings.lastKnownValue` in the manifest

### Available Renderings tracking in manifest

Track the cumulative value in a dedicated manifest section to reduce user friction:

```yaml
availableRenderings:
  itemId: "{2BF7E311-...}"
  lastKnownValue: "{55790BFE-...}|{C5F905F8-...}|..."
  lastUpdatedAt: "2026-03-25T21:30:00Z"
  renderingCount: 21
  warning: "MCP cannot read this field — value may be stale if modified outside this session"
```

**Within a single session:** Use `lastKnownValue` as the base for concatenation without asking the user each time. Update it after each append.

**At the start of a new session:** Ask the user to verify the current value once, then track it for the rest of the session.

### Lookup entry shape

```yaml
lookups:
  - path: "/sitecore/content/new/fmc/Presentation/Available Renderings/Page Content"
    itemId: "{C72B27E5-7DFF-4922-BBB0-8226D8DEC788}"
    lastReadAt: "2026-03-25T10:00:00Z"
    note: "Available Renderings — NEVER replace, always concatenate"
```

### Invalidation

- If MCP returns a different item ID for a cached path, update the lookup immediately
- If MCP returns "not found" for a cached path (item was deleted), remove the lookup entry and note the discrepancy
- Lookups do not expire — structural Sitecore paths rarely change. But always validate via MCP if something seems wrong

---

## Conflict resolution

- The manifest is a **record** of what the agent did, not a replacement for MCP verification.
- If MCP returns an item ID that differs from the manifest, **trust MCP** and update the manifest.
- If a human edits the manifest, the agent should respect the edit and not overwrite it silently.
- If the manifest says an item exists but MCP cannot find it (deleted externally), update the status to `"failed"` and note the discrepancy.

---

## File format rules

- Use YAML.
- Keep entries sorted by `category` then `name` alphabetically.
- Use ISO 8601 timestamps with timezone (e.g. `2026-03-21T14:30:00Z`).
- Item IDs must include curly braces (e.g. `{CE483486-28DE-4D03-AB7A-0234F31B9914}`).
- Paths must be full Sitecore paths starting with `/sitecore/`.
- Do not abbreviate or truncate paths.

---

## Integration with existing workflows

The manifest does **not** replace the component spec (`sitecore-component-spec.template.yaml`). The spec is the **plan**; the manifest is the **record**.

Workflow:
1. Read `project.yaml` → bootstrap paths
2. Read `sitecore-manifest.yaml` → check existing state
3. Classify and spec the component → fill `sitecore-component-spec.template.yaml`
4. Register `planned` entry in manifest
5. Implement via MCP → update manifest with item IDs
6. Verify → record results in manifest
7. Write final manifest to disk

---

## Do not skip this step

The manifest is maintained on every Sitecore task — create, update, fix, or variant addition. If the agent forgets to update the manifest, the next agent session will have stale or missing data.
