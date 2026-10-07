# Sitecore add variants

Use this skill when adding one or more variants to an existing Sitecore XM Cloud component, or when a new component is requested with multiple variants from the start.

## Trigger hints
Use this skill when:
- a component needs multiple visual presentations of the same content
- the request mentions "variant", "variation", "alternate layout", or "alternate style"
- a design reference shows two or more distinct layouts for the same component
- an existing component needs a new named export added alongside `Default`

## Do not use this skill when
- the component itself does not exist yet and has no variants — use the appropriate creation skill first, then return here for variants
- the requirement is a completely different component, not a variation of an existing one

---

## Key concept

In Sitecore XM Cloud, a variant is a **named export** in the component TSX file paired with a **Variant Definition item** in Sitecore under the site's `Presentation/Headless Variants` folder.

The name of the TSX export **must exactly match** the name of the Variant Definition item. Casing matters.

Every component must have at least a `Default` variant. `Default` is always required — it is the fallback when no variant is selected by the author.

---

## Load first
- `docs/ai/skills/shared/react-uiim-guidelines.md`
- `docs/ai/reference/sitecore-marketer-mcp-reference.md`
- `docs/ai/skills/sitecore-maintain-manifest.md`

---

## Inputs to collect

- component name (must match the existing rendering item name exactly)
- list of variant names (always include `Default` if not already present)
- description of how each variant differs visually or structurally
- site collection and site name (read from `docs/ai/config/project.yaml`)
- TSX file path for the component

---

## Required workflow

1. Read `docs/ai/config/project.yaml` to get `siteCollection` and `siteName`.
2. Read `docs/ai/manifests/sitecore-manifest.yaml` and find the component entry.
3. Resolve the Headless Variants path: `/sitecore/content/<siteCollection>/<siteName>/Presentation/Headless Variants`
4. Check whether a Variants container item for this component already exists at: `<headlessVariantsRoot>/<ComponentName>`
5. Ask concise follow-up questions if variant names or visual differences are unclear.
6. Before implementation, show:
   - list of variant names
   - Sitecore item plan
   - TSX changes plan
7. Then implement.

If the user wants approval first, stop after the plan.

---

## Sitecore item steps

### Step 1 — Resolve or create the component's Variants container

Check whether a Variants container item exists at:
```
/sitecore/content/<siteCollection>/<siteName>/Presentation/Headless Variants/<ComponentName>
```

Use `get_content_item_by_path` to check.

If it does **not** exist, create it:
- `name` = component name (must match the rendering name exactly)
- parent = the `Headless Variants` folder item
- template = **Headless Variants** template

If it already exists, use the existing item.

### Step 2 — Create a Variant Definition item for each variant

Under the Variants container item, create one Variant Definition item per variant:
- `name` = variant name (e.g. `Default`, `Centered`, `Dark`, `WithImage`)
- template = **Variant Definition** template

The name must **exactly match** the named export in the TSX file.

Always include `Default` unless it already exists.

### Step 3 — Verify

After creating each item, verify with `get_content_item_by_path` or `get_content_item_by_id`:
- Variants container exists at the correct path
- Each Variant Definition item exists as a child
- Item names match TSX export names exactly

---

## React implementation steps

### Replace `export default` with named exports

Every XM Cloud component must use **named exports**, not a default export. Each named export corresponds to one variant.

**Before (wrong for XM Cloud):**
```tsx
export default function Hero({ fields }: HeroProps) {
  return ( ... );
}
```

**After (correct):**
```tsx
export const Default = ({ fields }: HeroProps): JSX.Element => {
  if (!fields) return <HeroDefaultComponent />;
  return ( ... );
};

export const Centered = ({ fields }: HeroProps): JSX.Element => {
  if (!fields) return <HeroDefaultComponent />;
  return ( ... );
};
```

### Always include a default component fallback

Add a non-exported fallback component rendered when there are no fields (no datasource):

```tsx
const HeroDefaultComponent = (): JSX.Element => (
  <div className="component hero">
    <div className="component-content">
      <span className="is-empty-hint">Hero</span>
    </div>
  </div>
);
```

### Variant names must match Sitecore exactly

The export name (`Default`, `Centered`, `Dark`) must be identical — same casing — to the Variant Definition item name in Sitecore.

### Each variant uses the same props type

All variant exports share the same props interface. Variants differ in layout, Tailwind classes, or which fields they render — not in their data shape.

```tsx
type HeroProps = {
  fields: {
    Title: Field<string>;
    Description: Field<string>;
    HeroImage: ImageField;
    PrimaryLink: LinkField;
  };
  params: { [key: string]: string };
};
```

### Import from `@sitecore-content-sdk/nextjs`

```tsx
import {
  Field,
  Image as SitecoreImage,
  ImageField,
  Link as SitecoreLink,
  LinkField,
  Text,
  RichText,
} from '@sitecore-content-sdk/nextjs';
```

---

## Output format

Before implementation:
1. variant names list
2. Sitecore item plan (paths for container + each Variant Definition)
3. TSX changes plan (which exports to add/change)

After implementation:
1. Sitecore actions performed and verified
2. TSX file changes
3. Verification results
4. Updated manifest entry (append new variants, update timestamp)

---

## Completion rule

A task is only fully complete when:
- every variant has a Variant Definition item in Sitecore verified via MCP
- the TSX file uses named exports matching those item names exactly
- `Default` is always present in both Sitecore and the TSX file
- no `export default` remains for the component function

---

## Verification checklist

- [ ] `docs/ai/config/project.yaml` read for `siteCollection` and `siteName`
- [ ] Headless Variants path resolved correctly
- [ ] Variants container item exists for this component
- [ ] Variant Definition item created for each variant
- [ ] All Variant Definition names match TSX export names exactly
- [ ] `Default` variant exists in both Sitecore and TSX
- [ ] TSX uses named exports — no `export default` for the component function
- [ ] All variants use the same props type
- [ ] Empty-state fallback component included
- [ ] All imports from `@sitecore-content-sdk/nextjs`
- [ ] Verified via MCP after creation
