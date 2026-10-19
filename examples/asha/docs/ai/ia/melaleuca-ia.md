# Melaleuca — Sitecore Content Tree (IA draft)

Source: https://www.melaleuca.com/
Client key: melaleuca
Extracted: 2026-10-14
Extracted by: get-site-ia
Max depth: 3
Confidence: high

## Hand-off to sitecore-create-ia
- IA file: `docs/ai/ia/melaleuca-ia.md`
- Site name: melaleuca
- Content root: /sitecore/content/melaleuca/melaleuca/Home
- Page template ID: {DB74BE6B-BDBB-4940-AA29-7D8E83B3F786}
- Folder template ID: _(n/a — no [folder] / shared nodes)_

## Notes
- US English store at www.melaleuca.com (`skipGeolocationRedirect=true&sc_lang=en-US`). Product Store is the homepage, so it is not a child of Home.
- L1 order follows the category bar, then hamburger-only sections, then eyebrow links: Our Story, R3, Riverbend Ranch.
- "All …" links point at the parent and are not separate items. Contact Us in the menu opens Become a Member, so only Become a Member is created.
- Hair Care under Personal Care and Hair Care under Beauty are different URLs and both stay.
- Riverbend Ranch Steaks in the menu is the same URL as Riverbend Ranch and is not duplicated.
- Sign In, language switchers, Careers (external jobs site), Privacy Policy, Terms of Use, and Income Statistics are omitted.
- Supplements, Medicines and Treatments, Home Fragrance, Essential Oils, New Products, Featured This Month, and R3 have no submenu children.
- Our Story children come from in-page links on /our-story, not the eyebrow. Frank L. VanderSloot is flattened to L2; the live URL is /our-story/who-we-are/frank-l-vandersloot.
- Home exists in Sitecore — skip creating Home; tree lists L1+ children only.

## Tree (creatable items only)

- Supplements
- Cleaning and Laundry
  - Cleaning
  - Laundry
- Personal Care
  - Bath and Body
  - Dental
  - Hair Care
  - Hand Soap and Sanitizer
  - Outdoor
  - Baby Care
  - Acne Prevention
- Beauty
  - Premium Skin Care
  - Color Cosmetics
  - Beauty Specials
  - Hair Care
  - Fragrance Perfume
  - Now Trending Seasonal Colors
- Healthy Foods and Drinks
  - Healthy Weight and Protein
  - Healthy Snacks
  - Beverages
  - Cooking Essentials
  - Fiber Drink
  - Mints
  - Baking Mixes
- Medicines and Treatments
- Home Fragrance
- Essential Oils
- New Products
- Extra Savings
  - Outlet Store
  - Monthly Specials
- Featured This Month
- Curated Collections
  - Family Favorites
  - Busy Moms
  - Beauty Essentials
  - For Him
  - Fitness Focus
  - Healthy Weight Essentials
- New Member Savings Packs
- Logo Gear
- Sales Aids and Materials
- Our Story
  - Total Wellness
  - Our Brands
  - Ingredients Philosophy
  - Awards
  - Made in America
  - Become a Member
  - Frank L VanderSloot
- R3
- Riverbend Ranch
