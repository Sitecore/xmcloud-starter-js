# Amkor Technology — Sitecore Content Tree (IA draft)

Source: https://amkor.com/
Client key: amkor
Extracted: 2026-08-24
Extracted by: get-site-ia
Max depth: 3
Confidence: high

## Hand-off to sitecore-create-ia
- IA file: `docs/ai/ia/amkor-ia.md`
- Site name: _(fill when creating)_
- Content root: _(e.g. /sitecore/content/<collection>/<site>/Home)_
- Page template ID: _(fill when creating)_
- Folder template ID: _(n/a — no [folder] / shared nodes)_

## Notes
- Playwright header crawl of https://amkor.com/ (2026-08-24). Mega-menu is in the desktop header DOM; labels and URLs match the live primary nav.
- Home exists in Sitecore — skip creating Home; tree lists L1+ children only.
- About Us and Customer Center are `#` mega-menu parents on the live site (no landing URL). Treated as creatable hub pages so create-ia does not need a folder template.
- Utility language switchers omitted from the tree (skill default): English → `/`, 한국어 → `/kr/`, 日本語 → `/jp/`, 简体中文 → `/cn/`.
- Duplicate utility vs About Us placements collapsed to the About Us / Customer Center branch: Careers, Contact Us, Document Library.
- External-only links omitted (not creatable amkor.com pages): Investors (`ir.amkor.com`), Cloud Services (`cloudservices.amkor.com`), Press Releases (`ir.amkor.com/press-releases`).
- Factory Certs omitted — it is an in-page anchor on Quality (`/quality-management/#certifications`).
- Sitemap `https://amkor.com/sitemap.xml` returned HTTP 500; not used.
- Live Power labels use JEDEC aliases: `D2PAK (TO-263)`, `DPAK (TO-252)`.
- Memberships nav label is **Memberships and Partnerships** (`/memberships-and-associations/`).
- Legal footer, login, and search omitted.
- Do not invent Sitecore site name, content root, or template IDs here.
- Name sanitization (create-ia): Sitecore `ItemNameValidation` is `^[\w\*\$][\w\s\-\$]*(\(\d{1,}\)){0,1}$`. Item names strip `/` `.` `+` `®` `™` and non-digit parentheses; `pageTitle` fields keep the original IA label (e.g. item `Smart Manufacturing I40`, title `Smart Manufacturing (I4.0)`).

## Tree (creatable items only)

- About Us
  - Amkor Overview
  - Mission
  - Company History
  - Leadership
  - Careers
    - China
    - France
    - Germany
    - Japan
    - Korea
    - Malaysia
    - Philippines
    - Portugal
    - Singapore
    - Taiwan
    - United States
    - Vietnam
  - Smart Manufacturing (I4.0)
  - Corporate Responsibility
  - News
    - Blog
  - Events
  - Customer Center
    - Amkor Mechanical Samples
    - B2B Integration Services
    - Document Library
  - Memberships and Partnerships
  - Contact Us
- Packaging
  - Laminate
    - CABGA/FBGA
    - DSMBGA
    - FCBGA
    - fcCSP
    - FlipStack® CSP
    - Interposer PoP
    - PBGA/TEPBGA
    - Stacked CSP
  - Leadframe
    - ePad LQFP/TQFP
    - ePad TSSOP/SOIC/SSOP
    - fcMLF®
    - LQFP
    - MicroLeadFrame®
    - SOIC
    - SSOP/QSOP
    - TQFP
    - TSSOP/MSOP
  - Memory
  - MEMS and Sensors
  - Power
    - D2PAK (TO-263)
    - DPAK (TO-252)
    - HSON8
    - LFPAK56
    - PowerCSP™
    - PQFN
    - PSMC
    - SO8-FL
    - SOD123-FL
    - SOD128-FL
    - TO-220FP
    - TOLL
    - TSON8-FL
  - System in Package (SiP)
  - Wafer Level
    - WLCSP
    - WLFO/WLCSP+
    - WLSiP/WL3D
- Technology
  - 2.5D/3D TSV
  - 3D Stacked Die
  - AiP/AoP
  - Chip-on-Chip
  - Copper Pillar
  - Edge Protection™
  - Flip Chip
  - Interconnect
  - Optical Sensors
  - Package-on-Package
  - S-Connect™
  - S-SWIFT™
  - SWIFT®
- Test Services
- Services
  - Design Services
  - Package Characterization
  - Wafer Bumping
- Applications
  - Artificial Intelligence
  - Automotive
  - Communications
  - Computing
  - Consumer
  - Industrial
  - Internet of Things
  - Networking
- Quality
