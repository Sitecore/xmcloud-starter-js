# AmesburyTruth — Sitecore Content Tree (IA draft)

Source: https://www.amesburytruth.com/
Client key: amesburytruth
Extracted: 2026-08-11
Extracted by: get-site-ia
Max depth: 3
Confidence: high

## Hand-off to sitecore-create-ia
- IA file: `docs/ai/ia/amesburytruth-ia.md`
- Site name: `amesburytruth`
- Content root: `/sitecore/content/quanex/amesburytruth/Home` (`{A57ED898-AA1D-46E6-B7CF-7C7804688EC8}`)
- Page template ID: `{274FC64E-530F-457E-BD04-8B195DF94646}` (Services Page)
- Folder template ID: _(none — no [folder]/shared nodes)_
- Created: **2026-08-11** — **81** Services Page items (Home skipped; Speakers/Video/Data left untouched)
- Manifest: `docs/ai/manifests/sitecore-manifest.yaml` → `ia.amesburytruth-ia-tree`

## Notes
- Primary product nav (Window / Door / Weatherseals / Extrusions) plus utility Resources & About Us.
- L2 product families from mega-menu URL structure; L3 = product-line hubs (not individual SKUs).
- Skipped PDF guide links, Login, and Where to Buy (locator CTA).
- Recall Notice included as L1 utility page.
- Scraped title: Fenestration Products and Engineered Solutions | AmesburyTruth
- Home exists in Sitecore — skip creating Home; tree lists L1+ children only.
- Item names: `Casement / Awning` → `Casement Awning`; `Hung / Sliding` → `Hung Sliding`; `News & Events` → `News and Events`.
- Live URL pattern: `/products/windows|doors|weatherseals|extrusions/...` (sitemap double-slash is cosmetic).

## Tree (creatable items only)

- Window Hardware
  - Casement / Awning
    - PowerLink
    - Locks
    - Hinges
    - Operators
    - Handles and Covers
    - Push-Out Hardware
    - Safety Products
    - Accessories
  - Hung / Sliding
    - Balances
    - Locks
    - Tilt Latches
    - Sash Lifts
    - Rollers
    - Weeps
    - Keepers
    - Vent Stops
    - WOCDs
    - Hole Plugs
    - Grid Clips
    - Grid Joiners
  - Skylights
  - Tilt-n-Turn
- Door Hardware
  - Sliding
    - Handle Sets
    - Mortise Locks
    - Mortise Keepers
    - Lift N Slide
    - Rollers
    - Secondary Locks
    - Screen Rollers
    - Secondary Lock Keepers
  - Hinged
    - Handle Sets
    - Hinges
    - Locks
    - Tru-Lock
    - Handle Accessories
    - Lock Accessories
- Weatherseals
  - Pile
    - Dust Plug
    - Extruded Pile
    - Kerf Pile
  - Window Seals
    - Compression
    - Surface Mount
  - Door Seals
    - Corner Pads
    - Kerf
    - Pocket
    - Surface Mount
    - Sweeps
- Extrusions
  - Accessories
  - Backer Rod
  - Custom
  - Glazing Bead
  - Nailing Fin
  - Services
  - Shipping Supplies
- Resources
  - Associations
  - FAQ
  - Patents
  - Technical Notes
  - Warranty Information
  - Videos
- About Us
  - Careers
  - Lawrence
  - Our Promise
  - History
  - News & Events
  - Sustainability
  - Value Proposition
  - Contact Us
- Recall Notice

