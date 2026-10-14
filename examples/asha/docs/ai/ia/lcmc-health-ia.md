# LCMC Health — Sitecore Content Tree (IA draft)

Source: https://www.lcmchealth.org/
Client key: lcmc-health
Theme key: lcmc
Extracted: 2026-08-24
Extracted by: get-site-ia
Max depth: 3
Confidence: high

## Hand-off to sitecore-create-ia
- IA file: `docs/ai/ia/lcmc-health-ia.md`
- Site name: _(fill when creating)_
- Content root: _(e.g. /sitecore/content/<collection>/<site>/Home)_
- Page template ID: _(fill when creating)_
- Folder template ID: _(n/a — no [folder] / shared nodes)_

## Notes
- Home exists in Sitecore — skip creating Home; tree lists L1+ children only.
- Primary L1 from live header mega-menu (`#HeaderV1TopNav`): About Us, For Patients, Our Services, Our Locations, Find a Provider.
- Utility nav (live): Notice of Non-Discrimination, Careers, Patient Portal/Pay my Bill, For Providers, Contact Us.
- Extraction: Playwright `extract-nav-ia.mjs` + focused header crawl of https://www.lcmchealth.org/; L3 filled from live `/site-map/` and hub pages. `sitemap.xml` returned HTTP 500.
- Theme / skin key used elsewhere in this repo is `lcmc` (filename stem remains `lcmc-health`).
- **Locations summarized:** live mega-menu and `/our-locations/` directory list 70–223 clinics, specialty sites, and pediatric satellites. Tree keeps the eight system hospitals (homepage + About Us) plus urgent-care sites from the header. Individual clinic/specialty location pages are not creatable IA nodes.
- Duplicate destinations collapsed to one canonical parent (see Skipped).
- Depth capped at 3 under Home. Academic Affairs learner subtypes, Neuroscience condition list, Patient Stories, and Little Extras quotes are L4+ / listing items — omitted.
- Live mega-menu still labels the children’s hospital “Children's Hospital of New Orleans” and links to `chnola.org`. Homepage / About Us use **Manning Family Children's**. Tree uses the current brand name.
- Lakeside Hospital (`/lakeside-hospital/`) and Lakeview Hospital (`/lakeview-hospital/`) appear on the homepage hospital strip and About Us, not as top-level items in the Our Locations mega-menu (only affiliated clinics do). Included as hospital L2.

## Skipped (do not create)

| Item | Why |
|------|-----|
| Home | Already exists — skip |
| Careers | External (`careers.lcmchealth.org`) |
| Patient Portal/Pay my Bill (utility combo) | Same destinations as For Patients → Patient Portal / Pay My Bill |
| Patient Portal Login | External (`mylcmchealth.org`) |
| Newsletter Sign-up | External form |
| Search / Menu / language / accessibility chrome | Not pages |
| For Providers under About Us | Canonical L1 from utility nav (`/for-providers/`) |
| Laboratory Services under For Patients | Canonical under Our Services |
| LCMC Health FindHelp under For Patients | Canonical under About Us → Opportunity & Social Responsibility |
| Men's Health children that repeat other services | Nav aliases, not unique pages |
| ~70 mega-menu clinics / 223 location-directory sites | Summarized; not a creatable demo tree |
| Children's Hospital of New Orleans (`chnola.org`) | External; represented as Manning Family Children's |
| Closed location: Children's Hospital Pediatrics - LaPlace | Directory status page, not IA |
| Newsroom & Blog | Footer only (not primary L1) |
| Footer legal: Terms of Use, Privacy Practices, balance-billing / GFE PDFs, Price Transparency footer alias | Legal / PDF; Price Transparency kept under Financial Assistance |
| ADA.gov service-animal links | External |
| Individual blog posts, Little Extras quotes, patient stories | Listing content, not nav hubs |

## Tree (creatable items only)

- About Us
  - Academic Affairs at LCMC Health
    - Meet Our Team
    - Helpful Resources
    - Sponsored Training Programs
    - Learner Opportunities
  - Beyond Extraordinary Podcast
  - Celebrating the Little Extras All Around Us
  - Community Health Needs
  - Community Involvement
    - New Orleans Museum of Art Partnership
    - Wellness Lounge
    - Heart Beat Marching Krewe
  - Direct Contracting
  - Emergency Preparedness
  - Executive Leadership
  - Extraordinary Together
  - Family ties
  - Heart Beat Dance Krewe
  - Keeping You Well
  - LCMC Health therapy dogs
  - Opportunity & Social Responsibility
    - LCMC Health FindHelp
    - Be in the KNOW
    - Minority Executive Fellowship Program
  - Patient Stories
  - Satisfaction Surveys & Ratings
  - Volunteer
- For Patients
  - Communication and Translation
  - Donate blood
  - Financial Assistance
    - Price Transparency
  - Free Ask a Nurse Hotline
  - Pay My Bill
  - Request Your Medical Records
  - Patient Portal
  - SMS Terms and Conditions
- Our Services
  - Behavioral Health
  - Cancer Care
    - LSU LCMC Health Cancer Center
    - Cancel Cancer
    - Clinical Trials
  - Centro Hispano de Salud
  - Dermatology
    - Mohs Surgery
  - Diabetes Care
  - Digestive Care
  - Ears, Nose, and Throat Care
  - Emergency Care
    - LCMC Health Emergency Care Downtown
    - Where to Seek Care
  - Heart and Vascular Care
  - Hispanic Health Center
  - Imaging
  - Laboratory Services
  - LCMC Health Pharmacy Services
  - LCMC Health Home Care
  - Maternal Fetal Medicine
  - Men's Health
  - Neuroscience Institute at LCMC Health
    - Conditions We Treat
    - Caregiver Resources
    - Preparing for Your Procedure
    - Awards and Accolades
    - News and Events
    - Neuroscience For Providers
  - Orthopedic Care
  - Pediatrics
  - Primary Care
    - Same and Next Day Appointments
  - Rehabilitation
    - Inpatient Rehab
    - Outpatient Rehab
  - Respiratory Care
  - Sleep Care
  - Stroke Care
  - Transplant Services
  - Urgent Care
  - Urology
  - Virtual Care
    - Virtual Care On-Demand
    - Remote Monitoring for Chronic Conditions
    - Home Monitoring for Maternal Health
    - Nurse Hotline
  - Weight Loss
    - Meet the Weight Loss Team
  - Women's Health
    - Women's Care for the Next Generation
    - Breast Cancer Care
    - Menopause Care
  - Wound Care
- Our Locations
  - East Jefferson General Hospital
  - Lakeside Hospital
  - Lakeview Hospital
  - Manning Family Children's
  - New Orleans East Hospital
  - Touro
  - University Medical Center New Orleans
  - West Jefferson Medical Center
  - Urgent Care Locations
    - LCMC Health Chalmette Urgent Care
    - LCMC Health Clearview Urgent Care
    - LCMC Health Gretna Urgent Care
    - LCMC Health Kenner Urgent Care
    - LCMC Health Lakeview Urgent Care
    - LCMC Health Luling Urgent Care
    - LCMC Health Marrero Urgent Care
    - LCMC Health Uptown Urgent Care
- Find a Provider
- For Providers
- Contact Us
- Notice of Non-Discrimination
