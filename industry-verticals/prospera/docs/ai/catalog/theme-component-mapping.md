# Theme-to-Component Mapping Guide

How the extracted client theme drives component variant selection and styling.

## Variant Selection Rules

When the Site Analyzer (Step 4) decomposes a homepage, it uses the theme's `tone`
fields to pick the best variant for each matched component.

### Hero Banner
| `tone.heroStyle` value | Variant |
|---|---|
| `full-bleed-image` | `BackgroundImage` |
| `split-image-text` | `SplitImageText` |
| `centered-overlay` | `Default` |
| `video-background` | `VideoBackground` |
| `gradient` | `Default` |
| `minimal-text` | `Minimal` |

### Navigation Header
| `tone.navStyle` value | Variant |
|---|---|
| `solid-bar` | `Default` |
| `transparent-overlay` | `Transparent` |
| `minimal` | `Minimal` |
| `mega-menu` | `Default` (with expanded hover behavior) |

### Product / Pricing Cards
| Visual observation | Variant |
|---|---|
| Cards in 2-3 column grid | `Default` |
| Wide cards with image left | `Horizontal` |
| Dense cards without images | `Compact` |
| One card larger / highlighted | `Highlighted` |

### Testimonials
| Visual observation | Variant |
|---|---|
| Single large quote | `Default` |
| Multiple quotes with arrows/dots | `Carousel` |
| 2-3 quote cards side by side | `Grid` |
| Author photo visible | `WithPhoto` |

## Styling Application Rules

Every template component uses CSS variables from the theme. The agent does NOT
hardcode hex colors — it references `var(--brand-*)` variables.

### Color mapping
| CSS Variable | Used for |
|---|---|
| `--brand-primary` | Primary buttons, active tab indicators, links |
| `--brand-secondary` | Secondary buttons, section backgrounds |
| `--brand-accent` | CTAs, highlight badges, alerts |
| `--brand-bg` | Page background, card backgrounds (light mode) |
| `--brand-fg` | Body text, headings on light backgrounds |
| `--brand-muted` | Alternating section backgrounds, card backgrounds |
| `--brand-muted-fg` | Secondary text, captions, descriptions |
| `--brand-header-bg` | Navigation header background |
| `--brand-header-fg` | Navigation text |
| `--brand-footer-bg` | Footer background |
| `--brand-footer-fg` | Footer text and links |
| `--brand-border` | Card borders, dividers, input borders |
| `--brand-ring` | Focus rings, active states |

### Typography mapping
| CSS Variable | Tailwind usage |
|---|---|
| `--brand-heading-font` | `font-heading` in Tailwind config → applied to h1–h6 |
| `--brand-body-font` | `font-body` in Tailwind config → applied to body text |
| `--brand-radius` | `rounded-[var(--brand-radius)]` or Tailwind config override |
| `--brand-button-radius` | Button border-radius |
| `--brand-card-radius` | Card border-radius |

### Dark vs Light section handling
Many sites alternate between dark and light sections. Use the theme's
`tone.colorMode` to determine the default:

| `tone.colorMode` | Behavior |
|---|---|
| `light` | Default sections use `--brand-bg` / `--brand-fg`. Dark sections use `--brand-header-bg` / `--brand-header-fg`. |
| `dark` | Default sections use dark backgrounds. Light sections (cards, content) use `--brand-bg` / `--brand-fg`. |
| `mixed` | Alternate automatically. Hero and footer dark, content sections light. |

## Section Background Alternation

To create visual rhythm, template components alternate between:
1. `--brand-bg` (white/light) — default
2. `--brand-muted` (subtle gray/tint) — every other section
3. `--brand-header-bg` or `--brand-primary` (dark/brand) — hero, CTA, feature highlight

The Site Analyzer assigns a `sectionBackground` hint to each component:
- `"default"` → `bg-[var(--brand-bg)]`
- `"muted"` → `bg-[var(--brand-muted)]`
- `"dark"` → `bg-[var(--brand-header-bg)]` with light text
- `"primary"` → `bg-[var(--brand-primary)]` with `--brand-primary-foreground` text
- `"accent"` → `bg-[var(--brand-accent)]` with `--brand-accent-foreground` text

## Font Substitution for Demo

When the theme notes proprietary fonts (like "Sage Headline"), the components
use the Google Fonts alternative specified in the theme. The mapping:

1. Theme `typography.headingFamily` → if available on Google Fonts, use directly
2. If proprietary → check `extraction.notes` for suggested alternative
3. Load via `typography.googleFontsUrl` in the page `<head>`

Common substitutions:
| Proprietary Font | Google Fonts Alternative |
|---|---|
| Sage Headline (black weight) | `Poppins` weight 900 or `Montserrat` weight 800 |
| Sage Text | `Inter` or `Source Sans 3` |
| Custom serif (luxury brands) | `Playfair Display` or `Cormorant Garamond` |
| Custom geometric sans | `DM Sans` or `Albert Sans` |
| Custom humanist sans | `Open Sans` or `Nunito` |
