# Component Template Library — Catalog

This catalog defines the reusable component types that cover ~80% of corporate
homepage patterns. Each component is pre-built with Sitecore templates, renderings,
and React code. For a demo, the Site Analyzer (Step 4) matches page sections to
these components and the theme layer reskins them.

## How to read this catalog

Each entry defines:
- **What it is** — the visual pattern it covers
- **Kind** — simple | list | context-only (drives Sitecore data model)
- **Variants** — named exports in the TSX, matching different layout patterns
- **Fields** — Sitecore template fields
- **Common on** — which industries / site types use this pattern frequently
- **Sage example** — where this appears on the Sage.com/es-es reference page

---

## 1. Announcement Bar

A thin, full-width bar at the very top of the page with a short promotional message
and optional link. Often dismissible.

- **Kind:** simple
- **Category:** Navigation
- **Variants:**
  - `Default` — text + link, colored background
  - `Highlight` — pulsing or bold accent, urgency style
- **Fields:**
  - `Message` (Single-Line Text)
  - `BarLink` (General Link)
  - `BackgroundColor` (Single-Line Text) — optional override, e.g. "primary" | "accent"
- **Common on:** SaaS, retail, banking (promotions, regulatory notices)
- **Sage example:** Green top bar — "¡OFERTA FLASH! 50% DTO los primeros 3 meses."

---

## 2. Navigation Header

The main site header with brand logo, authored navigation links, and CTA button.
This is a list component — the parent datasource holds the logo and CTA, child items
are individual navigation links.

- **Kind:** list (parent = header data, children = nav links)
- **Category:** Navigation
- **Variants:**
  - `Default` — solid background bar with inline links
  - `Transparent` — transparent overlay on hero, text changes on scroll
  - `Minimal` — logo only, centered
- **Fields (parent — NavigationHeaderData):**
  - `BrandLogo` (Image) — site logo
  - `CtaLabel` (Single-Line Text) — CTA button text
  - `CtaLink` (General Link) — CTA button link
- **Fields (child — NavigationLink):**
  - `LinkText` (Single-Line Text) — nav link label
  - `LinkUrl` (General Link) — nav link URL
- **Common on:** all sites
- **Sage example:** Black bar with Sage logo, nav links, "Acceso Clientes/Partners" CTA
- **Demo builder note:** The Navigation Contents Resolver must be removed from this rendering.
  Nav links are authored as child datasource items, not auto-generated from the site tree.

---

## 2.5. Hero Banner Carousel

A rotating hero section with multiple slides, each with its own headline, subtext,
background image, and CTAs. Auto-plays with dot indicators and prev/next arrows.

- **Kind:** list (parent = carousel, children = slides)
- **Category:** Banners
- **Variants:**
  - `Default` — full-width slides with dot indicators, arrows, auto-play (5s)
  - `WithThumbnails` — thumbnail strip below the main slide for navigation
- **Fields (parent):**
  - `Title` (Single-Line Text) — optional, used as aria-label
- **Fields (child — per slide):**
  - `SlideTitle` (Single-Line Text)
  - `SlideSubtitle` (Rich Text)
  - `SlideImage` (Image) — full-bleed background
  - `PrimaryLink` (General Link)
  - `SecondaryLink` (General Link)
- **Common on:** retail, hospitality, automotive, real estate — sites with multiple hero messages
- **When to use instead of Hero Banner:** when the client homepage has a rotating/sliding hero
  with multiple panels, or when there are 2+ distinct hero messages above the fold

---

## 3. Hero Banner

The main above-the-fold section. Usually the largest visual element on the page with
a headline, subtext, and one or two CTAs.

- **Kind:** simple
- **Category:** Banners
- **Variants:**
  - `Default` — full-width dark/colored background, centered text, CTA buttons below
  - `SplitImageText` — 50/50 grid with image on one side, text on the other
  - `BackgroundImage` — full-bleed background image with text overlay
  - `VideoBackground` — background video with text overlay
  - `Minimal` — text-only hero with large heading, no image
- **Fields:**
  - `Title` (Single-Line Text)
  - `Subtitle` (Rich Text)
  - `HeroImage` (Image)
  - `PrimaryLink` (General Link)
  - `SecondaryLink` (General Link)
- **Common on:** all sites
- **Sage example:** "Para cada fase de tu negocio" — dark background, centered text, category tabs below

---

## 4. Tab Navigation Section

A horizontal row of category/filter tabs that control which content is shown below.
Often used right below the hero to segment products or services.

- **Kind:** list (parent = section, children = tab items)
- **Category:** Navigation
- **Variants:**
  - `Default` — pill-shaped tabs, horizontal row
  - `Underline` — text tabs with active underline indicator
  - `Boxed` — bordered/filled tab buttons
- **Fields (parent):**
  - `Title` (Single-Line Text) — optional section title
- **Fields (child — per tab):**
  - `TabLabel` (Single-Line Text)
  - `TabLink` (General Link) — where clicking navigates
  - `TabContent` (Rich Text) — or links to content below
- **Common on:** SaaS, banking (product categories), retail (product lines)
- **Sage example:** "Contabilidad, Facturación y Gestión | ERP... | Recursos Humanos... | ..."

---

## 5. Product / Pricing Cards

A grid of cards showcasing products, plans, or services with title, description,
price, and CTA. Each card is an authorable child item.

- **Kind:** list (parent = card grid section, children = individual cards)
- **Category:** Cards
- **Variants:**
  - `Default` — vertical cards in a 2- or 3-column grid
  - `Horizontal` — wide cards with image left, text right
  - `Compact` — smaller cards without images, dense info
  - `Highlighted` — one card visually emphasized (recommended/popular)
- **Fields (parent):**
  - `Title` (Single-Line Text)
  - `Description` (Rich Text)
- **Fields (child — per card):**
  - `CardTitle` (Single-Line Text)
  - `CardDescription` (Rich Text)
  - `CardImage` (Image)
  - `BadgeText` (Single-Line Text) — e.g. "1-19 empleados", "Most popular"
  - `PriceText` (Single-Line Text) — e.g. "A partir de 45€ +IVA/mes"
  - `CardLink` (General Link)
- **Common on:** SaaS (pricing), banking (account types), retail (product highlights)
- **Sage example:** Sage 50 / Sage Active cards with employee count badge, description, price, CTA

---

## 6. Feature Highlight Block

A content block that highlights a single feature, product, or capability. Usually
has a heading, rich text description, optional image or illustration, and a CTA.

- **Kind:** simple
- **Category:** Content
- **Variants:**
  - `Default` — image right, text left (or vice versa)
  - `Centered` — centered text with image below or above
  - `WithVideo` — embedded video instead of image
  - `IconLeft` — small icon/illustration to the left of text
- **Fields:**
  - `EyebrowText` (Single-Line Text) — optional overline label
  - `Title` (Single-Line Text)
  - `Description` (Rich Text)
  - `FeatureImage` (Image)
  - `PrimaryLink` (General Link)
- **Common on:** all sites
- **Sage example:** "Esto es Sage Copilot" section — title, description, green CTA button, video/play button

---

## 7. Legal / Compliance Banner

A section calling out regulatory compliance, certifications, or legal requirements.
Distinct from generic content because it often has a specific visual tone (trust signals).

- **Kind:** simple
- **Category:** Content
- **Variants:**
  - `Default` — centered text with accent background
  - `WithImage` — text + compliance badge/seal image
- **Fields:**
  - `Title` (Single-Line Text)
  - `Description` (Rich Text)
  - `BannerImage` (Image) — optional badge/seal
  - `PrimaryLink` (General Link)
- **Common on:** banking, fintech, healthcare, insurance
- **Sage example:** "Ley Antifraude, Ley Crea y Crece... Verifactu, Factura electrónica, Software Certificado..."

---

## 8. Value Proposition Grid

A row of 3–4 short value props, each with an icon, heading, and brief text.
No images — icon-driven. Often appears mid-page to reinforce key benefits.

- **Kind:** list (parent = grid section, children = value prop items)
- **Category:** Content
- **Variants:**
  - `Default` — 3-column grid with icons above text
  - `TwoColumn` — 2-column for fewer items
  - `FourColumn` — 4-column compact grid
  - `Horizontal` — icon left, text right, stacked vertically
- **Fields (parent):**
  - `Title` (Single-Line Text)
  - `Description` (Rich Text)
- **Fields (child — per item):**
  - `ItemTitle` (Single-Line Text)
  - `ItemDescription` (Rich Text)
  - `ItemIcon` (Image) — small icon or illustration
  - `ItemLink` (General Link)
- **Common on:** all sites
- **Sage example:** "Obtén mucho más que un gran software" — Soporte reconocido / Member Masterclasses / Community Hub

---

## 9. Trust Badges / Stats Row

A horizontal row of key numbers, logos, or trust indicators. "40+ years", "2 millones
de empresas", etc. Often used to build credibility.

- **Kind:** list (parent = row, children = stat items)
- **Category:** Content
- **Variants:**
  - `Default` — centered numbers with labels below
  - `WithIcons` — icon above each stat
  - `LogoRow` — partner/client logos instead of numbers
- **Fields (parent):**
  - `Title` (Single-Line Text) — optional section title
  - `EyebrowText` (Single-Line Text)
- **Fields (child — per item):**
  - `StatValue` (Single-Line Text) — e.g. "40+"
  - `StatLabel` (Single-Line Text) — e.g. "años de experiencia"
  - `StatDescription` (Rich Text) — optional detail text
  - `StatIcon` (Image) — optional
- **Common on:** corporate, banking, SaaS
- **Sage example:** "Más de 40 años" / "2 millones" / "Más de 40.000" / "Más de 100"

---

## 10. Testimonial / Quote Block

A customer quote, review, or testimonial with attribution. Can be a single
featured quote or a carousel of multiple quotes.

- **Kind:** list (parent = section, children = testimonial items)
- **Category:** Social Proof
- **Variants:**
  - `Default` — single large quote, centered, with author name
  - `Carousel` — multiple quotes in a swipeable carousel
  - `Grid` — 2-3 testimonials in a card grid
  - `WithPhoto` — author photo alongside the quote
- **Fields (parent):**
  - `SectionTitle` (Single-Line Text) — e.g. "Conoce a nuestros clientes"
- **Fields (child — per testimonial):**
  - `QuoteText` (Rich Text)
  - `AuthorName` (Single-Line Text)
  - `AuthorRole` (Single-Line Text)
  - `AuthorImage` (Image)
  - `CompanyName` (Single-Line Text)
  - `CompanyLogo` (Image)
- **Common on:** all sites
- **Sage example:** "Conoce a nuestros clientes" — quote marks, testimonial text, attribution

---

## 11. CTA Banner / Call to Action

A full-width section designed to drive a single conversion action. Bold heading,
short text, prominent button. Often appears near the bottom of the page.

- **Kind:** simple
- **Category:** Banners
- **Variants:**
  - `Default` — centered text, primary color background, single CTA
  - `WithImage` — CTA banner with background image
  - `Split` — text on one side, form or button on the other
  - `Minimal` — subtle background, underlined link instead of button
- **Fields:**
  - `Title` (Single-Line Text)
  - `Description` (Rich Text)
  - `PrimaryLink` (General Link)
  - `SecondaryLink` (General Link)
  - `BackgroundImage` (Image)
- **Common on:** all sites
- **Sage example:** "Leer nuestro completo" button section at bottom

---

## 12. Feature Cards Grid

A grid of 3–4 cards each describing a feature or capability with icon, title,
description, and optional link. Heavier than Value Props (more text, possibly images).

- **Kind:** list (parent = grid, children = feature cards)
- **Category:** Cards
- **Variants:**
  - `Default` — 3-column card grid with icons
  - `TwoColumn` — 2-column wider cards
  - `WithImages` — cards with top images instead of icons
- **Fields (parent):**
  - `Title` (Single-Line Text)
  - `Description` (Rich Text)
- **Fields (child — per card):**
  - `CardTitle` (Single-Line Text)
  - `CardDescription` (Rich Text)
  - `CardImage` (Image)
  - `CardLink` (General Link)
- **Common on:** SaaS, technology, corporate
- **Sage example:** "Confianza y seguridad" / "Sage AI" / "Asistencia 24 horas" — 3-col cards with icons, text, CTA links

---

## 13. Image Gallery / Full-Width Image

A full-width image or a gallery of images. Used for visual storytelling, team
photos, office shots, or product showcases.

- **Kind:** simple (single image) or list (gallery)
- **Category:** Media
- **Variants:**
  - `Default` — single full-width image with optional caption
  - `Gallery` — 2-4 images in a grid
  - `Parallax` — full-width image with parallax scroll effect
- **Fields (simple):**
  - `GalleryImage` (Image)
  - `Caption` (Single-Line Text)
  - `AltText` (Single-Line Text)
- **Common on:** retail, luxury, hospitality, corporate
- **Sage example:** Full-width landscape photo section before the footer

---

## 14. Logo Cloud / Partner Strip

A row or grid of partner, client, or certification logos. Usually with a
heading like "Trusted by" or "Our partners".

- **Kind:** list (parent = section, children = logo items)
- **Category:** Social Proof
- **Variants:**
  - `Default` — single row of logos, auto-scrolling or static
  - `Grid` — multi-row grid for many logos
  - `WithLabels` — logo + partner name below
- **Fields (parent):**
  - `Title` (Single-Line Text)
- **Fields (child — per logo):**
  - `LogoImage` (Image)
  - `CompanyName` (Single-Line Text)
  - `LogoLink` (General Link) — optional
- **Common on:** SaaS, corporate, consulting
- **Sage example:** Not prominently visible but very common on similar sites

---

## 15. Footer

The site footer with brand logo, link columns, social icons, and legal text.
Uses a datasource for the BrandLogo image (rendered with inverted colors for dark backgrounds).
Link columns and social icons are currently hardcoded placeholders.

- **Kind:** datasource
- **Category:** Navigation
- **Variants:**
  - `Default` — multi-column links with logo and social icons
  - `Minimal` — single row with essential links
  - `MegaFooter` — extensive footer with newsletter signup, multiple sections
- **Fields (SiteFooterData datasource):**
  - `BrandLogo` (Image) — site logo, displayed with CSS invert for dark footer
- **Common on:** all sites
- **Sage example:** Sage logo, link columns (Empresa, Productos, Soporte), social icons, legal links
- **Demo builder note:** The BrandLogo is set on the SiteFooter datasource item, separate
  from the NavigationHeader datasource. Both need the logo image set during demo build.

---

## 16. Newsletter / Email Signup

An inline signup form — email input + submit button with a short pitch.
Can appear standalone or embedded in another section.

- **Kind:** simple
- **Category:** Forms
- **Variants:**
  - `Default` — inline form with heading and input + button
  - `Banner` — full-width colored background with form
  - `Compact` — just input + button, no heading
- **Fields:**
  - `Title` (Single-Line Text)
  - `Description` (Rich Text)
  - `PlaceholderText` (Single-Line Text)
  - `ButtonText` (Single-Line Text)
  - `SuccessMessage` (Single-Line Text)
- **Common on:** SaaS, retail, media, publishing
- **Sage example:** Not on homepage, but common pattern

---

## 17. FAQ / Accordion

A list of question-answer pairs in an expandable accordion. Common for
product pages and landing pages.

- **Kind:** list (parent = FAQ section, children = Q&A items)
- **Category:** Content
- **Variants:**
  - `Default` — standard accordion, one open at a time
  - `AllOpen` — all expanded by default
  - `TwoColumn` — questions split into two columns
- **Fields (parent):**
  - `Title` (Single-Line Text)
  - `Description` (Rich Text)
- **Fields (child — per Q&A):**
  - `Question` (Single-Line Text)
  - `Answer` (Rich Text)
- **Common on:** SaaS, insurance, banking, healthcare
- **Sage example:** Not on homepage, but very common pattern

---

## 18. Rich Text / Content Block

A simple block of rich text content. The most flexible and generic component —
used when no other component type fits. Section heading + body text.

- **Kind:** simple
- **Category:** Content
- **Variants:**
  - `Default` — left-aligned text with heading
  - `Centered` — centered text, good for intros
  - `Narrow` — max-width constrained for readability
- **Fields:**
  - `Title` (Single-Line Text)
  - `Body` (Rich Text)
- **Common on:** all sites
- **Sage example:** Various text-only sections between visual blocks

---

## Coverage Analysis — Sage.com/es-es

Mapping the Sage homepage sections to this catalog:

| Page Section | Component | Variant |
|---|---|---|
| Green promo bar at top | #1 Announcement Bar | Default |
| Navigation header | #2 Navigation Header | Default (solid-bar) |
| "Para cada fase de tu negocio" | #3 Hero Banner | Default (centered, dark bg) |
| Category tabs row | #4 Tab Navigation Section | Default (pills) |
| Sage 50 / Sage Active cards | #5 Product / Pricing Cards | Default (2-col) |
| "Esto es Sage Copilot" | #6 Feature Highlight Block | Default or WithVideo |
| "Ley Antifraude..." compliance | #7 Legal / Compliance Banner | Default |
| "Obtén mucho más..." + 3 features | #8 Value Proposition Grid | Default (3-col) |
| "Confianza y seguridad" 3-card row | #12 Feature Cards Grid | Default (3-col) |
| "Conoce a nuestros clientes" quote | #10 Testimonial / Quote Block | Default (single) |
| Stats row (40 años, 2M...) | #9 Trust Badges / Stats Row | Default |
| Full-width landscape image | #13 Image Gallery | Default (single) |
| "Leer nuestro completo" CTA | #11 CTA Banner | Default |
| Footer with columns | #15 Footer | Default (multi-col) |

**Result: 14 out of 14 visible sections covered.** No custom component needed for Sage.

---

## Coverage Estimate — Industry Patterns

| Industry | Components typically needed | Covered by catalog |
|---|---|---|
| Corporate / Enterprise | Hero, Nav, Cards, Value Props, Stats, Testimonials, CTA, Footer | 100% |
| Banking / Finance | Hero, Product Cards, Compliance, Stats, CTA, FAQ, Footer | 100% |
| SaaS / Technology | Hero, Feature Highlight, Pricing Cards, Testimonials, Logo Cloud, FAQ, CTA | 100% |
| Retail / E-commerce | Hero, Product Cards, Image Gallery, Testimonials, Newsletter, CTA | 100% |
| Healthcare / Insurance | Hero, Feature Cards, FAQ, Compliance, Stats, CTA | 100% |
| Professional Services | Hero, Value Props, Testimonials, Stats, CTA, Footer | 100% |

---

## What's NOT in this catalog (custom-build territory)

These patterns are rare or highly custom — the sub-agent builder handles them:
- Interactive calculators / configurators
- Map / location finders
- Live chat widgets
- Complex multi-step forms
- Custom animations / parallax storytelling
- Product comparison tables with feature matrix
- Video gallery / media center
- Login / account portals
- Search results pages

---

## Next Steps

After this catalog is approved:
- **Step 3** — Build each component (Sitecore items + themed React code)
- **Step 4** — Build the Site Analyzer that decomposes a homepage and matches to this catalog
- **Step 5** — Build the Demo Orchestrator that ties theme + analyzer + components together
