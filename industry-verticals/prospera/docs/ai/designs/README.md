# AI designs

Drop design references here for AI-assisted component development.

## File naming convention

Use the component's PascalCase name as the filename (folder is kebab-case):

- `hero.png`
- `article-cards.png`
- `page-hero.jpg`
- `promo-banner.pdf`

One file per component is preferred. If you have multiple views (desktop + mobile), use a suffix:

- `hero-desktop.png`
- `hero-mobile.png`

## How to reference designs in a request

When asking the AI to build a component, reference the design file by path:

```
Build a Hero component based on docs/ai/designs/hero.png
```

The AI will inspect the image before speccing or implementing the component.

## Supported formats

- `PNG` — preferred for screenshots and exports
- `JPG` / `JPEG` — acceptable for photos or compressed exports
- `PDF` — for multi-page design documents or Figma PDF exports

## Figma / Sketch exports

Export at 1x or 2x resolution as PNG. Avoid exporting as SVG — the AI reads pixel-based images, not vector source files.

## What the AI does with designs

1. Inspects the image before implementation
2. Identifies visible UI elements (headings, images, CTAs, badges, repeated items)
3. Infers the Sitecore field model from visible content
4. Determines whether the component is simple, list, or context-only
5. Populates `design.references`, `design.extractedLayout`, and `design.assumptions` in the component spec
6. Flags anything unclear as `design.openQuestions`

The AI will never invent hidden interactions — it only models what is visible in the design.
