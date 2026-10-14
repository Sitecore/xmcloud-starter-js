# Sitecore tools and docs

## Primary tool rule

Use marketer MCP first for Sitecore item operations unless:
- a specific MCP action fails
- permissions prevent the change
- the repository/process explicitly requires serialization or source-controlled definitions

Treat the following as normal Sitecore items that MCP can create/update:
- templates
- template sections
- template fields
- template `__Standard Values`
- folder templates
- folder template `__Standard Values`
- datasource folders
- renderings

Do not state that marketer MCP cannot create templates or renderings by default.

---

## Documentation rule

Prefer:
1. official Sitecore documentation
2. repo-local AI/reference docs
3. established project conventions visible in the repository

If official docs and repo conventions differ, note the difference and follow repo convention when it is clearly project-specific.

---

## MCP execution rules

- Resolve parent items with `get_content_item_by_path` before creating children.
- Create folder/container structure before leaf items.
- After each create/update, verify with `get_content_item_by_id` or `get_content_item_by_path`.
- Use exact field names returned by item inspection when updating fields.
- Do not guess field-name casing or internal-name/display-name mappings.
- After each successful create/update batch, record item IDs in `docs/ai/manifests/sitecore-manifest.yaml`.

### Template field rule

When creating template fields:
- create the field item with the standard Template field template
- explicitly set the field item `Type`
- verify the final `Type` after update

Do not assume the field type is correct by default.

### `__Standard Values` rule

When creating `__Standard Values` for any template via MCP:

- `name = "__Standard Values"`
- `parentId = owning template item ID`
- `templateId = owning template item ID`

Example:
- Promo Banner template ID = `ce483486-28de-4d03-ab7a-0234f31b9914`
- Promo Banner `__Standard Values`:
  - `name = "__Standard Values"`
  - `parentId = "ce483486-28de-4d03-ab7a-0234f31b9914"`
  - `templateId = "ce483486-28de-4d03-ab7a-0234f31b9914"`

Do **not** use the Standard template ID `1930bbeb-7805-471a-a3be-4858ac7cf696` unless you are literally creating an item based on the Standard template itself.

---

## Rendering rule

When creating renderings:
- prefer JSON Rendering unless the repo uses a different convention
- always set `Parameters Template [shared]` to the **Item ID (GUID)** of the Rendering Parameters template — **never use a path**. Resolve the ID via MCP after creating the template.
- always set `Component Name [shared]` to **PascalCase** matching the TSX filename exactly (e.g. `EurobankHeader` for `EurobankHeader.tsx`)
- always register the rendering in Available Renderings — append the rendering ID to the `Renderings [shared]` field of the **Page Content** item at `/sitecore/content/<siteCollection>/<siteName>/Presentation/Available Renderings/Page Content`
- verify datasource template
- verify datasource location
- verify component name is PascalCase
- verify field editor button settings when applicable

If a rendering field cannot be confidently updated or verified through MCP, state that clearly and mark it as follow-up verification required.

---

## Verification rule

Prefer MCP-based verification first.

Verify, when relevant:
- template existence and path
- datasource template `Base template` includes `{1930BBEB-7805-471A-A3BE-4858AC7CF696}|{44A022DB-56D3-419A-B43B-E27E4D8E9C41}` (not for folder templates)
- template section existence
- template field existence
- template field `Type`
- template `__Standard Values`
- template `__Standard Values` is based on the owning template
- folder template `__Standard Values`
- folder template `__Standard Values` is based on the owning folder template
- folder insert options / `__Masters`
- datasource folder path and template
- insert options set on datasource folder instance (not only on folder template)
- rendering datasource template
- rendering datasource location
- rendering `Parameters Template [shared]` is set to Item ID (GUID), not a path
- rendering `Component Name [shared]` is PascalCase matching TSX filename
- rendering field editor button setting
- rendering is registered in Available Renderings (Page Content)

Use Content Editor verification only as a fallback when MCP cannot reliably confirm the value.

---

## Known tool behavior

### `list_available_insertoptions`

`list_available_insertoptions` may be most reliable for content items in a site content tree.

For items under `/sitecore/templates/...`, prefer:
- `get_content_item_by_path`
- `get_content_item_by_id`
- direct inspection of `__Standard Values` and insert options fields

Do not rely on `list_available_insertoptions` as the primary inspection tool for template items.

### Field update sensitivity

`update_fields_on_content_item` can be sensitive to exact field names, casing, or the item template involved.

When an update does not stick:
1. re-read the item via MCP
2. inspect the actual field names returned
3. retry using the exact returned names
4. if still unsuccessful, report the field as requiring follow-up verification

---

## Manifest rule

After every Sitecore task, update `docs/ai/manifests/sitecore-manifest.yaml` with:
- item IDs for all created/updated items
- verification results (passed, failed, pendingManual)
- component status (planned -> partial -> complete/failed)

See `docs/ai/skills/sitecore-maintain-manifest.md` for full rules.

---

## Honesty rule

Do not mark a Sitecore change as complete unless:
- the create/update call succeeded
- and the result was verified, or you explicitly state what remains unverified

Use language like:
- "created and verified"
- "created; field update needs verification"
- "planned; repo process may require serialization"

Avoid language like:
- "MCP does not support templates/renderings"

unless you encountered a specific, reproducible failure and report it as such.
