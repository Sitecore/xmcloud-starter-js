# BCAA — Sitecore Content Tree (IA draft)

Source: https://www.bcaa.com/
Client key: bcaa
Extracted: 2026-10-05
Extracted by: get-site-ia
Max depth: 3
Confidence: medium

## Hand-off to sitecore-create-ia
- IA file: `docs/ai/ia/bcaa-ia.md`
- Site name: _(fill when creating)_
- Content root: _(e.g. /sitecore/content/<collection>/<site>/Home)_
- Page template ID: _(fill when creating)_
- Folder template ID: _(n/a — no [folder] / shared nodes)_

## Notes
- Primary nav and full-menu columns from homepage HTML (`o-mega-menu-desktop` / mobile accordion). L1 chrome is uppercase on the live site; labels below are title case for CMS display names.
- L1 order: Membership, Insurance, Automotive, Marketplace, Impact, then utility column: BCAA Connect, BCAA Blog, Trip Planning, New to Canada, Media Centre, About BCAA, Contact Us, Join Email List.
- L2 labels and order are the menu link text. "Overview" links point at the parent and are not separate items. Careers stays under About BCAA (`/about-us/careers`), not a second L1.
- L3 is the first content child under each nav L2, from sitemap.xml, capped at depth 3. Quote flows, `/web/` steps, form-success pages, `/rd/` redirects, campaigns, contests, blog posts, media releases, and branch-level location pages are omitted.
- Plan tiers (Basic, Plus, Premier, Go) and Life siblings (Term Life, Critical Illness) are nested under their product hub. Live URLs are siblings of `/membership/plans` and `/insurance/life`, not children of those paths.
- Playwright was not installed (`ERR_MODULE_NOT_FOUND`). Section-page subnavs were not opened, so L3 display names are title-cased from URLs, not confirmed H1s.
- Home exists in Sitecore — skip creating Home; tree lists L1+ children only.

## Tree (creatable items only)

- Membership
  - Plans
    - Basic
    - Plus
    - Premier
    - Go
  - Ways to Save
  - Manage Membership
  - Mobile App
  - Join
- Insurance
  - Home
    - Homeowners
    - Condo or Townhouse
    - Renters
    - Landlord
    - Mobile Home
    - Residential Strata
    - Vacation Property
    - Home Insurance Claims
  - Car
    - BCAA Optional Car Insurance
    - Car Insurance 101
    - ICBC Autoplan
    - Motorcycle Insurance
    - RV Insurance
  - Travel
    - Emergency Medical
    - Trip Cancellation
    - Trip Protection Coverage
    - Travel Delay
    - Visitors to Canada
  - Small Business
    - Businesses We Cover
    - Claim
    - FAQ
  - Life
    - Term Life
    - Critical Illness
  - Health & Dental
  - Pet
  - Policy Wordings
  - Claims
  - Underwriters
  - Disclosures
  - Commitment
- Automotive
  - BCAA Auto Service Centres
    - Member Perks
    - Vehicle Inspections
    - Warranty
  - Evo Car Share
  - Black Book
  - Approved Auto Repair
  - Battery Service
    - AGM Batteries
  - Electric Vehicles
    - Electric Vehicles in Canada
    - Engine Options
    - Rebates and Incentives
- Marketplace
  - Task Marketplace
  - Auto Marketplace
- Impact
  - Wildfire Resilience
    - FireSmart BC
    - Fireweed
    - Protecting Heroes
    - Reforestation
  - Road Safety
    - Child Passenger Safety
    - Distracted Driving
    - School Safety Patrol
    - Slow Down Kids Playing
  - Giving Back
    - Earthquake Alliance BC
    - HUB Cycling
    - United Way
- BCAA Connect
  - Community Guidelines
- BCAA Blog
- Trip Planning
  - International Driving Permit
  - Passport Photos
  - Route and Weather Information
- New to Canada
  - Home Insurance
  - Membership
  - Travel Insurance
- Media Centre
- About BCAA
  - AGM
  - Careers
    - DEI
    - Why Work With Us
  - Governance
  - History
  - Leadership
- Contact Us
  - Auto Service Centres
  - Make an Appointment
  - Partner Network
  - Service Locations
- Join Email List
