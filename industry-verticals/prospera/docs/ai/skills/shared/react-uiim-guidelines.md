# React UIIM guidelines  
  
## Component location  
Generated React components must live under:  
  
- `src/components/uiim`  
  
Preferred file path pattern:  
  
- `src/components/uiim/<category-kebab>/<ComponentNamePascal>.tsx`  
  
Examples:  
- `src/components/uiim/banners/Hero.tsx`  
- `src/components/uiim/cards/ArticleCards.tsx`  
  
## Styling and UI system  
Use:  
- Tailwind CSS  
- shadcn/ui components from `@/components/ui/*`  
  
Prefer composition with shadcn primitives such as:  
- `Card`  
- `Button`  
- `Badge`  
- `Separator`  
- `Accordion`  
- `Tabs`  
- `Skeleton`  
  
Avoid:  
- CSS modules unless the repo already uses them for that component area  
- styled-components  
- large custom stylesheet files for simple layout work  
- inline styles unless required for dynamic behavior  
  
## Sitecore field rendering — editability is mandatory

**Every** Sitecore-managed field must be rendered using the appropriate SDK helper from `@sitecore-content-sdk/nextjs`. This ensures the field is editable in Experience Editor and Pages.

| Field type | SDK helper | Import alias convention |
|---|---|---|
| Single-Line Text | `Text` | `Text` |
| Rich Text | `RichText` | `RichText` or `ContentSdkRichText` |
| Image | `NextImage` | `ContentSdkImage` or `SitecoreImage` |
| General Link | `Link` | `ContentSdkLink` or `SitecoreLink` |

**Never** use:
- Plain `<img>` or `next/image` `Image` for Sitecore image fields — use `NextImage` from the SDK
- Plain `<a>` or `next/link` `Link` for Sitecore link fields — use `Link` from the SDK
- Plain strings or `<p>` / `<h1>` for Sitecore text fields — use `Text` or `RichText` from the SDK
- Hardcoded placeholder text or URLs for fields that should be Sitecore-managed

If any of these are used for Sitecore-managed fields, the field will **not** be editable in Experience Editor, which breaks the authoring experience.

### Correct import pattern

```tsx
import {
  Field,
  NextImage as ContentSdkImage,
  Link as ContentSdkLink,
  RichText as ContentSdkRichText,
  ImageField,
  LinkField,
  Text,
} from '@sitecore-content-sdk/nextjs';
```  
  
## Tailwind + shadcn + Sitecore rule  
Use shadcn for layout and UI primitives.  
Use Sitecore JSS field helpers for editable content values.  
  
Example:  
- shadcn `Card` wraps content  
- Sitecore `Text` renders editable title  
- Sitecore `Link` renders editable CTA  
- Tailwind classes handle spacing/layout  

### shadcn availability check

Before importing `@/components/ui/*`, verify that `src/components/ui/` exists in the project. If it does not, replace shadcn primitives with equivalent plain Tailwind `<div>` markup. Do not import shadcn components that are not present — it will cause build errors.

## Edit-mode visibility rule

When fields may be empty (no default values), conditional rendering like `{field?.value && <SDKHelper>}` hides the field in Experience Editor, preventing authors from clicking to add content.

Use the `|| isEditing` guard on every field that might start empty:

```tsx
const isEditing = page?.mode?.isEditing;

{(fields.Title?.value || isEditing) && (
  <Text field={fields.Title} tag="h1" className="..." />
)}
{(fields.BackgroundImage?.value?.src || isEditing) && (
  <ContentSdkImage field={fields.BackgroundImage} className="..." />
)}
{(fields.PrimaryLink?.value?.href || isEditing) && (
  <ContentSdkLink field={fields.PrimaryLink} className="..." />
)}
```

`page` is already available on `ComponentProps` — no `useSitecore` hook required.  
  
## Utility imports  
If available in the repo, use:  
- `cn` from `@/lib/utils`  
- `buttonVariants` from `@/components/ui/button`  
  
If these local utilities differ, adapt to the repo’s existing pattern.  
  
## Accessibility  
Always prefer:  
- semantic headings  
- visible link/button affordances  
- alt-capable image handling  
- keyboard-accessible interactive components  
- reasonable focus states through shadcn/tailwind patterns  
  
## Props shape rules  

### ComponentProps base type (mandatory)

Every component's props type **must** extend `ComponentProps` from `lib/component-props`. This provides:
- `params` — rendering parameters including `styles` and `RenderingIdentifier`
- `page` — page context including `mode.isEditing` for edit-mode awareness

```tsx
import { ComponentProps } from 'lib/component-props';

interface HeroFields {
  Title: Field<string>;
  Description: Field<string>;
  HeroImage: ImageField;
}

type HeroProps = ComponentProps & {
  fields: HeroFields;
};
```

**Never** define `params` manually as `Record<string, string>`. Always extend `ComponentProps`.

### Using params in rendering

Always use `params.styles` and `params.RenderingIdentifier` from `ComponentProps` for wrapper elements:

```tsx
export const Default = ({ fields, params }: HeroProps): JSX.Element => {
  const { styles, RenderingIdentifier } = params;
  return (
    <div className={`component hero ${styles}`} id={RenderingIdentifier}>
      <div className="component-content">
        {/* ... */}
      </div>
    </div>
  );
};
```

### Simple component  
Use default JSS field shape:  
- `fields.Title`  
- `fields.Description`  
- `fields.CtaLink`  
  
### List component  
Use GraphQL datasource shape:  
- parent item: `fields.data.datasource`  
- child items: `fields.data.datasource.children.results`  
- field values via `.jsonValue`  
  
### Context-only component
Use route context when confirmed:
- `useSitecore()` (SDK 2.0 — replaces the removed `useSitecoreContext()`)
- `page?.layout?.sitecore?.route?.fields` (or access `page` from `ComponentProps`)  
  
## Named exports and variants

Every XM Cloud component must use **named exports**, not `export default` for the component function.

The framework resolves variants by matching the author-selected variant name to the named export in the TSX file. If the component uses `export default`, the variant mechanism silently fails — Sitecore will always render the default and the variant picker has no effect.

### Required pattern

```tsx
// Always required — the default presentation
export const Default = (props: MyProps): JSX.Element => {
  if (!props.fields) return <MyDefaultComponent />;
  return ( ... );
};

// Additional variants — name must match Variant Definition item in Sitecore exactly
export const Centered = (props: MyProps): JSX.Element => {
  if (!props.fields) return <MyDefaultComponent />;
  return ( ... );
};
```

### Empty-state fallback

Always include a non-exported fallback component for when no datasource is present:

```tsx
const MyDefaultComponent = (): JSX.Element => (
  <div className="component my-component">
    <div className="component-content">
      <span className="is-empty-hint">MyComponent</span>
    </div>
  </div>
);
```

### Variant names must match Sitecore exactly

The export name (`Default`, `Centered`, `Dark`) must be **identical — same casing** — to the Variant Definition item name under `Presentation/Headless Variants/<ComponentName>/` in Sitecore.

To create the Sitecore Variant Definition items, use `docs/ai/skills/sitecore-add-variants.md`.

## Example: simple component pattern  
  
```tsx  
import React, { JSX } from 'react';
import {  
  Field,  
  NextImage as ContentSdkImage,  
  ImageField,  
  Link as ContentSdkLink,  
  LinkField,  
  RichText as ContentSdkRichText,  
  Text,  
} from '@sitecore-content-sdk/nextjs';  
import { ComponentProps } from 'lib/component-props';
import { Card, CardContent } from '@/components/ui/card';  
import { buttonVariants } from '@/components/ui/button';  
import { cn } from '@/lib/utils';  
  
interface HeroFields {  
  Title: Field<string>;  
  Description: Field<string>;  
  BackgroundImage: ImageField;  
  CtaLink: LinkField;  
}  
  
type HeroProps = ComponentProps & {  
  fields: HeroFields;  
};  

const HeroDefaultComponent = (): JSX.Element => (
  <div className="component hero">
    <div className="component-content">
      <span className="is-empty-hint">Hero</span>
    </div>
  </div>
);

export const Default = ({ fields, params, page }: HeroProps): JSX.Element => {  
  const { styles, RenderingIdentifier } = params;
  const isEditing = page?.mode?.isEditing;

  if (!fields) return <HeroDefaultComponent />;

  return (  
    <div className={`component hero ${styles}`} id={RenderingIdentifier}>
      <div className="component-content">
        <Card className="overflow-hidden border-0 shadow-none">  
          <CardContent className="grid gap-8 p-6 md:grid-cols-2 md:p-10">  
            <div className="space-y-4">  
              <Text  
                tag="h1"  
                field={fields.Title}  
                className="text-4xl font-semibold tracking-tight md:text-5xl"  
              />  
              <ContentSdkRichText  
                field={fields.Description}  
                className="prose prose-neutral max-w-none"  
              />  
              {(fields.CtaLink?.value?.href || isEditing) && (  
                <ContentSdkLink  
                  field={fields.CtaLink}  
                  className={cn(buttonVariants({ size: 'lg' }))}  
                />  
              )}  
            </div>  
  
            <div className="overflow-hidden rounded-xl">  
              {(fields.BackgroundImage?.value?.src || isEditing) && (
                <ContentSdkImage  
                  field={fields.BackgroundImage}  
                  className="h-full w-full object-cover"  
                />  
              )}
            </div>  
          </CardContent>  
        </Card>
      </div>
    </div>
  );  
}  