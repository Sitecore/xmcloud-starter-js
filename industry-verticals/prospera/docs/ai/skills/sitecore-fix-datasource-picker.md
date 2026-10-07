# Sitecore fix datasource picker

## Trigger hints
Use this skill when:
- the datasource picker is empty
- authors cannot create datasource items
- the picker opens to the wrong location
- datasource folders exist but do not appear in the picker
- a context-only component incorrectly asks for datasource selection

## Do not use this skill when
The main issue is an invalid or mismatched `ComponentQuery`, the React component expects the wrong data shape, or child items are not loading because the query is wrong.

Use instead: `docs/ai/skills/sitecore-fix-componentquery.md`

If during diagnosis you discover the root cause is a `ComponentQuery` problem rather than a configuration problem, stop, state the finding clearly, and switch skills.

---

## Load first
- `docs/ai/reference/sitecore-rules.md`
- `docs/ai/templates/sitecore-component-spec.template.yaml`
- `docs/ai/reference/sitecore-marketer-mcp-reference.md`
- `docs/ai/skills/sitecore-maintain-manifest.md`

---

## Inputs to collect

- rendering name or path
- component name
- component type: simple, list, or context-only
- current `Datasource Template`
- current `Datasource Location`
- datasource folder path
- folder template name/path
- datasource template name/path
- parent/child template info for list components
- symptom description

---

## Required workflow

1. Read the request and inspect the current Sitecore setup using the **Sitecore marketer MCP**.
2. Determine what the component **should** be: simple, list, or context-only.
3. Inspect: rendering item, datasource template, folder template, `__Standard Values`, datasource folder, and parent/child insert options for list components.
4. Identify the root cause.
5. If the root cause is a `ComponentQuery` problem, stop and switch to `sitecore-fix-componentquery.md`.
6. Normalize the corrected configuration into the shared spec.
7. Before making changes, show:
   - chosen classification
   - diagnosis
   - root cause
   - corrected datasource settings
   - plan
8. Then implement.

If the user asks for an approval gate, stop after the plan and wait.

---

## Common root causes

### Rendering item problems
- `Datasource Template` is empty, set to a GUID, or points to the wrong template
- `Datasource Location` is empty or incorrect
- rendering points to the wrong folder template name in the query
- rendering incorrectly requires a datasource for a context-only component

### Folder template problems
- folder template does not exist
- folder template `__Standard Values` does not exist
- folder template `__Masters` is not set or points to the wrong template

### Datasource content problems
- datasource folder under `/sitecore/content/<siteCollection>/<siteName>/Data/` does not exist
- datasource folder exists in the wrong location or was created with the wrong template

### Template problems
- datasource template has no `__Standard Values`
- list parent `__Standard Values` does not set `__Masters` to child template
- list parent is missing `_HorizonDatasourceGrouping`

---

## Correction rules

### If the component should be simple
Ensure all exist and are linked correctly:
- datasource template + `__Standard Values`
- datasource template `Base template` includes `{1930BBEB-7805-471A-A3BE-4858AC7CF696}|{44A022DB-56D3-419A-B43B-E27E4D8E9C41}`
- folder template + `__Standard Values`
- folder template `__Masters` → datasource template
- datasource folder under `/sitecore/content/<siteCollection>/<siteName>/Data/`
- insert options set on datasource folder item itself (not only on folder template)
- rendering: valid `Datasource Template` (full path), valid `Datasource Location`, empty `ComponentQuery`
- rendering: `Parameters Template [shared]` set to the Rendering Parameters template **Item ID (GUID)**, not a path
- rendering: `Component Name [shared]` is PascalCase matching TSX filename exactly
- rendering registered in Available Renderings (Page Content)

### If the component should be list
Ensure all exist and are linked correctly:
- parent template + `__Standard Values`
- parent template `Base template` includes `{1930BBEB-7805-471A-A3BE-4858AC7CF696}|{44A022DB-56D3-419A-B43B-E27E4D8E9C41}`
- child template + `__Standard Values`
- child template `Base template` includes `{1930BBEB-7805-471A-A3BE-4858AC7CF696}|{44A022DB-56D3-419A-B43B-E27E4D8E9C41}`
- parent `__Standard Values` `__Masters` = child template
- parent inherits `_HorizonDatasourceGrouping`
- folder template + `__Standard Values`
- folder template `__Masters` → parent template
- datasource folder under `/sitecore/content/<siteCollection>/<siteName>/Data/`
- insert options set on datasource folder item itself (not only on folder template)
- rendering: valid parent `Datasource Template` (full path), valid `Datasource Location`, valid `ComponentQuery`
- rendering: `Parameters Template [shared]` set to the Rendering Parameters template **Item ID (GUID)**, not a path
- rendering: `Component Name [shared]` is PascalCase matching TSX filename exactly
- rendering registered in Available Renderings (Page Content)

### If the component should be context-only
Ensure:
- rendering does **not** require datasource
- `Datasource Template` is empty
- `Datasource Location` is empty
- `Data source` is empty
- `Parameters Template [shared]` is set to the Rendering Parameters template **Item ID (GUID)**, not a path
- `Component Name [shared]` is PascalCase matching TSX filename exactly
- rendering registered in Available Renderings (Page Content)

---

## Preferred datasource location pattern

```txt
query:$site/*[@@name='Data']/*[@@templatename='<Folder Template Name>']|query:$sharedSites/*[@@name='Data']/*[@@templatename='<Folder Template Name>']
```

---

## `__Standard Values` rule

- `name = "__Standard Values"`
- `parentId = owning template item ID`
- `templateId = owning template item ID`

Do **not** use the Standard template ID `1930bbeb-7805-471a-a3be-4858ac7cf696`.

---

## Verification rule

After correction, verify:
- rendering datasource template (full path, not GUID)
- rendering datasource location query
- rendering `ComponentQuery` presence (list) or absence (simple/context-only)
- rendering requires datasource correctly
- folder template and its `__Standard Values` and `__Masters`
- datasource folder path and template
- for list: parent `__Standard Values` `__Masters` = child template
- for list: parent inherits `_HorizonDatasourceGrouping`

---

## Output format

Before implementation:
1. chosen classification
2. diagnosis
3. root cause
4. corrected datasource settings
5. plan

After implementation:
1. Sitecore actions performed
2. MCP/item operations performed
3. verification results
4. any follow-up verification requirements
5. updated manifest entry (update affected fields, status, notes)

---

## Completion rule

A task is only fully complete when:
- the root cause is correctly identified
- all template, folder template, and datasource folder items exist and are correctly linked
- the rendering datasource template and location are verified
- authors can see and select datasource items in the picker

Do not silently downgrade unverified Sitecore work to "manual setup required" without explaining why.

---

## Verification checklist

- [ ] Component classification confirmed
- [ ] Root cause identified
- [ ] Datasource template exists if required
- [ ] Datasource template has `__Standard Values` (using owning template ID)
- [ ] Folder template exists if required
- [ ] Folder template has `__Standard Values` (using owning template ID)
- [ ] Folder template `__Masters` points to the correct template
- [ ] Datasource folder exists under `/Data`
- [ ] Rendering is a JSON Rendering
- [ ] Rendering `Parameters Template [shared]` is set
- [ ] Rendering `Datasource Template` uses a full Sitecore path
- [ ] Rendering `Datasource Location` points to the expected folder template
- [ ] Simple component has empty `ComponentQuery`
- [ ] List component has valid parent/child insert setup
- [ ] List parent `__Masters` points to child template
- [ ] List parent inherits `_HorizonDatasourceGrouping`
- [ ] Context-only rendering does not require datasource
- [ ] Author can pick or create datasource items as intended
