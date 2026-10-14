# AmericasMart — Sitecore Content Tree (IA draft)

Source: https://www.americasmart.com/
Client key: americasmart
Extracted: 2026-08-24
Extracted by: get-site-ia
Max depth: 3
Confidence: high

## Hand-off to sitecore-create-ia
- IA file: `docs/ai/ia/americasmart-ia.md`
- Site name: _(fill when creating — often `americasmart` under tenant `andmore`)_
- Content root: _(e.g. /sitecore/content/andmore/americasmart/Home)_
- Page template ID: _(fill when creating)_
- Folder template ID: _(n/a — no [folder] / shared nodes)_

## Notes
- Live primary mega-menu verified with Playwright on 2026-08-24 (desktop header already contains L2/L3 in the DOM; `imc-navigation__tier1Item` / `tier2` / `tier3`).
- Home exists in Sitecore — skip creating Home; tree lists L1+ children only.
- Location switcher (Atlanta / Las Vegas / High Point / New York) is a campus/channel utility, not in-tree. Those buttons open other ANDMORE market sites — documented here, not created as pages.
- Useful Links (Registration, Exhibitor Directory, Floor Plans, Book Hotel, Parking, About AmericasMart) are aliases of pages already in the tree — not duplicated.
- Footer **About Us** is a column heading (not a page). Footer destinations that already exist under About or Markets are not repeated.
- Footer **Our Markets** (Atlanta Apparel, Atlanta Market, Casual Market Atlanta, Las Vegas Apparel, Las Vegas Market, ANDMORE at High Point Market, ANDMORE) are external sister sites — not created.
- Markets & Events L3 brand hubs (Atlanta Market, Casual Market, Atlanta Apparel, Formal Markets) are external microsites — not created; Market Dates & Hours is the in-site hub.
- Exhibitor Directory **Categories** L3 items (Gift & Lifestyle, Gardens & Outdoor Living, etc.) are query-string directory filters, not CMS pages — omitted for a creatable demo tree.
- Homepage FAQ accordion is not a nav page. **Exhibitor FAQs** under Exhibit is the only FAQ page in the tree.
- Skipped: Sign In / Create an Account / Exhibitor Login / Register CTA (alias of Market Dates & Hours), legal footer (Terms, Privacy), social, Google Maps, Exhibitor Portal Guide (`support.andmore.com`), Careers (`andmore.com`), Atlanta Convention Center (`atlconventioncenter.com`).
- Open Year Round Showrooms is a labeled mega-menu item (live destination is a directory filter); included as a page under Shop Year Round.
- Downtown Development live URL is `/Year-Round/Interactive-Map`.

## Tree (creatable items only)

- Exhibitor Directory
  - Search Exhibitors
  - A-Z Brand Listing
  - Floor Plans
- Markets & Events
  - Market Dates & Hours
  - Plan Your Market
    - Spring Market
    - Spring Cash & Carry
    - Fall Market
    - Fall Cash & Carry
  - Shop Year Round
    - How to Register
    - Calendar of Events
    - Open Year Round Showrooms
    - For Designers
- Visit
  - Hotels
  - Parking & Transportation
  - Dining
  - Campus Overview
  - Atlanta City Guide
  - Downtown Development
- Exhibit
  - Leasing & Exhibit Options
  - Advertising
  - Exhibitor FAQs
- About
  - History
  - Contact Us
  - Press Center
  - Industry Partners
