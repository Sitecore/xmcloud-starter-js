# Atlanta Apparel (ANDMORE) — Sitecore Content Tree (IA draft)

Source: https://www.atlanta-apparel.com/
Client key: atlanta-apparel
Extracted: 2026-08-24
Extracted by: get-site-ia
Max depth: 3
Confidence: medium

## Hand-off to sitecore-create-ia
- IA file: `docs/ai/ia/atlanta-apparel-ia.md`
- Site name: `atlanta-apparel` _(verify via `list_sites`; tenant is often `andmore`)_
- Content root: _(e.g. /sitecore/content/andmore/atlanta-apparel/Home)_
- Page template ID: _(fill when creating)_
- Folder template ID: _(required — tree includes Discover `[folder]`)_

## Notes
- Primary L1 from live header (confirmed on homepage + inner pages): Exhibitor Directory, Markets & Events, Visit, Discover, Exhibit.
- Home exists in Sitecore — skip creating Home; tree lists L1+ children only.
- Mega-menus are JS-rendered. L2/L3 reconstructed from live section landings, header “Useful Links”, and on-site URL IA — not from a hover crawl.
- **Discover** has no `/Discover` landing (soft-404). Marked `[folder]` so create-ia can still nest category/inspiration pages.
- **Visit** maps to live `/Attend` (page title: Attending Atlanta Apparel). Use display name **Visit** to match primary nav.
- Useful Links (Registration, Exhibitor Directory, Floor Plans, Book Hotel, Events, Parking) are aliases. Canonical parents only: Registration / Floor Plans / Hotels / Events / Directions and Parking under Visit; Exhibitor Directory stays L1.
- Location switcher (Atlanta, Las Vegas, High Point, New York) is a utility for other ANDMORE market sites — **not in tree** (external / current-site chrome).
- Footer **Our Markets** (AmericasMart, Atlanta Market, Casual Market Atlanta, Las Vegas Apparel, Las Vegas Market, ANDMORE at High Point Market, ANDMORE) — **not in tree** (external sister brands).
- Footer **About Us** — no on-site page found. **Contact Us** → americasmart.com/About/Contact-Us. **Careers** → andmore.com/careers. All skipped (external).
- Footer **Market Information** = Markets L1. **Press Center** nested under Markets & Events. **Download the ANDMORE Markets App** = Plan Your Market (`/app` redirects there). **Our Brands** = Brand Directory under Exhibitor Directory.
- Skipped: Exhibitor Login, registration/account chrome, individual exhibitor/line items, press-release articles, Market Map floor deep-links, legal/privacy, social, YouTube, HubSpot blog (`info.atlanta-apparel.com`).
- `/Markets/Complete-Show-Dates` redirects to `/Attend/Registration` — omitted as a duplicate.
- Individual market pages keep live labels (April lives at `/Markets/Atlanta-Apparel/March`).
- Prefer this creatable demo tree — do not create every exhibitor.
- **First Finds** appears twice on purpose: buyer page `/exhibitor/First-Finds` (under Discover) vs exhibitor page `/Exhibit/Atlanta-Apparel/First-Finds` (under Exhibit).

## Tree (creatable items only)

- Exhibitor Directory
  - Brand Directory
- Markets & Events
  - Atlanta Apparel
    - February Atlanta Apparel
    - April Atlanta Apparel
    - June Atlanta Apparel
    - August Atlanta Apparel
    - October Atlanta Apparel
  - Formal Markets
    - Spring Formal Markets
    - Fall Formal Markets
  - Press Center
    - Media Resources
    - Media Registration
- Visit
  - Registration
    - First-Time Buyers
    - Returning Buyers
  - Plan Your Market
  - Events
  - Floor Plans
  - Travel
    - Hotels
    - Directions and Parking
    - Air Travel
  - Dining
  - FAQs
  - Safety and Security
- Discover [folder]
  - Categories
    - Contemporary Apparel
    - Prom & Social Occasion
    - Bridal
    - Ready to Wear
    - Young Contemporary
    - Jewelry & Fashion Accessories
    - Shoes
    - Children's
    - Men's
    - Cash & Carry
  - First Finds
  - Open Year Round
  - Tools and Inspiration
- Exhibit
  - Exhibit at Atlanta Apparel
    - Showrooms
    - First Finds
  - Exhibitor Resources
    - Showroom Resources
    - Temporary Resources
    - Market Toolkit
  - Advertising and Sponsorship
  - Social Occasion
