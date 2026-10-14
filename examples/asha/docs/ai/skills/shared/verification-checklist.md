# Shared Verification Checklist

Items common to all component types. Each create skill adds type-specific items on top.

## Sitecore items

- [ ] Rendering Parameters template created under `renderingParamsRoot/<Category>`
- [ ] Rendering Parameters template base templates set (all four IDs)
- [ ] Rendering created as JSON Rendering
- [ ] `Component Name [shared]` is PascalCase matching TSX filename exactly
- [ ] `Parameters Template [shared]` set to Item ID (GUID), not a path
- [ ] Rendering registered in Available Renderings (Page Content)

## React / component map

- [ ] React file created under `src/components/uiim`
- [ ] TSX imports from `@sitecore-content-sdk/nextjs`
- [ ] Props type extends `ComponentProps` from `lib/component-props`
- [ ] Component uses `params.styles` and `params.RenderingIdentifier` in wrapper
- [ ] All Sitecore fields use SDK editable helpers (Text, ContentSdkRichText, ContentSdkImage, ContentSdkLink)
- [ ] No plain `<img>`, `<a>`, or hardcoded text used for Sitecore-managed fields
- [ ] Tailwind used
- [ ] shadcn/ui primitives used where appropriate
- [ ] TSX uses named exports (`export const Default`, not `export default`)
- [ ] Empty-state fallback component included
- [ ] Headless Variants container item exists in Sitecore
- [ ] `Default` Variant Definition item created under Headless Variants container
- [ ] Component map updated
