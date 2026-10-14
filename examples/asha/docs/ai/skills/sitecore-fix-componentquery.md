# Sitecore fix ComponentQuery

## Trigger hints
Use this skill when:
- child items are not rendering
- datasource data is undefined or missing
- GraphQL fields are missing from the response
- the rendering seems misconfigured vs the component TSX
- you need to remove or correct a `ComponentQuery`

## Do not use this skill when
The main problem is the datasource picker being empty or misconfigured, or templates/folder templates/insert options are missing.

Use instead: `docs/ai/skills/sitecore-fix-datasource-picker.md`

If during diagnosis you discover the root cause is a datasource picker problem rather than a query problem, stop, state the finding clearly, and switch skills.

---

## Load first
- `docs/ai/reference/sitecore-rules.md`
- `docs/ai/skills/shared/react-uiim-guidelines.md`
- `docs/ai/templates/sitecore-component-spec.template.yaml`
- `docs/ai/reference/sitecore-marketer-mcp-reference.md`
- `docs/ai/skills/sitecore-maintain-manifest.md`

---

## Inputs to collect

- rendering name or path
- component name
- component TSX file path
- current `ComponentQuery`
- current datasource template path
- template names for parent and child items
- error symptoms or console errors
- example returned data shape if available

---

## Required workflow

1. Read the request and gather the current implementation.
2. Inspect the rendering item settings, current `ComponentQuery`, React component TSX, and component map.
3. Classify what the component **should** be: simple, list, or context-only.
4. Compare the expected data shape with the actual query and TSX shape.
5. Identify the root cause.
6. If the root cause is a datasource picker issue, stop and switch to `sitecore-fix-datasource-picker.md`.
7. If official behavior is unclear, use the `sitecore-documentation-docs` MCP.
8. Normalize the fix into the shared spec.
9. Before making changes, show:
   - chosen classification
   - diagnosis
   - root cause
   - corrected query/data shape
   - plan
10. Then implement.

If the user asks for an approval gate, stop after the plan and wait.

---

## Common root causes

### Wrong workflow chosen
- component should have been **simple**, but a `ComponentQuery` was added
- component should have been **context-only**, but a datasource query was added
- component should have been **list**, but no `ComponentQuery` was created

### Query structure problems
- missing required variables: `$datasource: String!`, `$language: String!`
- query does not fetch: `datasource: item(path: $datasource, language: $language)`
- uses `... on TemplateName` fragments instead of generic `field(name: "...")` accessors — `... on` fragments silently fail when template names conflict in shared XM Cloud instances
- child items not read from `children { results { ... } }`
- missing child `id`
- authorable fields missing `jsonValue`

### React/query mismatch
- TSX expects `fields.data.datasource` but the rendering doesn't provide that shape
- TSX expects `fields.Title` but the component was switched to a GraphQL datasource model
- TSX reads plain values instead of using Sitecore helpers on `jsonValue`

---

## Repair rules

### If the component should be simple
- remove `ComponentQuery` from the rendering
- ensure rendering uses datasource template + location only
- update TSX to use default JSS shape: `fields.Title`, `fields.Description`, etc.
- verify rendering via MCP after update

### If the component should be context-only
- remove `ComponentQuery` from the rendering
- disable datasource requirement if appropriate
- update TSX to use `useSitecore()` and access route fields via `page?.layout?.sitecore?.route?.fields` (or `page` from `ComponentProps`)
- verify rendering via MCP after update

### If the component should be list
- ensure the rendering is a JSON Rendering with a correctly formed `ComponentQuery`
- ensure it uses `$datasource: String!` and `$language: String!`
- ensure it fetches `datasource: item(path: $datasource, language: $language)`
- ensure parent fields use `jsonValue`
- ensure child items come from `children { results { ... } }`
- ensure child fields use `jsonValue` and each child result includes `id`
- ensure TSX reads `fields.data.datasource.children.results`
- verify rendering via MCP after update

### Preferred list query pattern

**Always use the generic `field(name: "...")` accessor** instead of `... on TemplateName` fragments. XM Cloud instances often have multiple templates with the same name (from SXA, Foundation, Feature layers), which causes `... on` fragments to silently fail.

```graphql
query ComponentName($datasource: String!, $language: String!) {
  datasource: item(path: $datasource, language: $language) {
    title: field(name: "Title") { jsonValue }
    description: field(name: "Description") { jsonValue }
    children {
      results {
        id
        title: field(name: "Title") { jsonValue }
        image: field(name: "Image") { jsonValue }
        link: field(name: "Link") { jsonValue }
      }
    }
  }
}
```

**Do NOT use this pattern (causes silent failures):**
```graphql
# BAD — breaks when template name conflicts exist
... on ParentTemplateName { title { jsonValue } }
children { results { ... on ChildTemplateName { id title { jsonValue } } } }
```

---

## Verification rule

After repair, verify:
- rendering `ComponentQuery` content
- rendering datasource template path and location
- rendering `Parameters Template [shared]` is still set (do not clear it during repairs)
- rendering component name
- TSX data access matches query shape

If any value cannot be reliably set or verified through MCP, state that explicitly and mark it as follow-up required.

---

## Output format

Before implementation:
1. chosen classification
2. diagnosis
3. root cause
4. corrected query or data shape
5. plan

After implementation:
1. Sitecore actions performed
2. MCP/item operations performed
3. files changed
4. verification results
5. any follow-up verification requirements
6. updated manifest entry (update rendering.componentQuery, status, notes)

---

## Completion rule

A task is only fully complete when:
- the root cause is correctly identified
- the rendering `ComponentQuery` is corrected or removed as appropriate
- the TSX data shape matches the query
- Sitecore rendering values are verified or explicitly flagged for follow-up
- the component renders datasource data correctly

Do not silently downgrade unverified Sitecore work to "manual setup required" without explaining why.

---

## Verification checklist

- [ ] Component classification confirmed
- [ ] Root cause identified
- [ ] Wrong `ComponentQuery` removed or corrected
- [ ] Rendering remains JSON Rendering
- [ ] `Parameters Template [shared]` is still set on the rendering
- [ ] Datasource settings remain valid
- [ ] Corrected query uses `$datasource: String!` and `$language: String!`
- [ ] Query fetches `datasource: item(path: $datasource, language: $language)`
- [ ] Parent and child fragment names are correct
- [ ] Child items read via `children.results`
- [ ] Authorable fields use `jsonValue`
- [ ] React file updated under `src/components/uiim` if needed
- [ ] TSX data shape matches the query
- [ ] TSX imports from `@sitecore-content-sdk/nextjs`
- [ ] Tailwind/shadcn pattern preserved
