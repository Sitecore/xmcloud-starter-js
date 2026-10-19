# ASHA — Sitecore Content Tree (IA draft)

Source: https://www.asha.org/
Client key: asha
Extracted: 2026-10-19
Extracted by: get-site-ia
Max depth: 3
Confidence: medium

## Hand-off to sitecore-create-ia
- IA file: `docs/ai/ia/asha-ia.md`
- Site name: asha
- Content root: /sitecore/content/asha/asha/Home
- Page template ID: {0DD698CA-AA34-4471-A2F9-CB89B44B4E3F}
- Folder template ID: _(n/a — no [folder] or shared nodes)_

## Notes
- Primary nav from the homepage navbar, in on-site order: Careers, Certification, Publications, Events, Advocacy, Continuing Education, Practice Management, Research.
- Second navbar row (audience) is included as L1: Audiologists, Speech-Language Pathologists, Academic and Faculty, Audiology and SLP Assistants, Students, Public.
- Utility links included: About (`/about/`) and Join ASHA (`/members/join-asha/`). Login, My Account, and ASHA Store point at apps.asha.org and are omitted.
- L2 labels come from each section sidebar. External-only destinations (convention.asha.org, pubs.asha.org, careers.asha.org, apps.asha.org, find.asha.org, marketing.asha.org) are omitted. Advertising Disclaimer and Advertise with us are sidebar chrome, not pages.
- The same destination is listed once. Billing, certification standards, and member data stay under their canonical section, not again under the audience pages.
- L3 is only where a section page links to a real child URL (certification standards, NOMS registries, member-benefit topics, milestones, governance, press quick facts). Anchor-only headings are not pages.
- Item labels are Sitecore-safe: `&` is `and`, slashes and parentheticals are removed, en dashes are hyphens. Live titles stay in pageTitle when they differ.
- Mega-menus are not in the initial HTML. Playwright hover did not reveal a separate dropdown; section sidebars and in-section hub links supplied L2 and L3.
- Home exists in Sitecore — skip creating Home; tree lists L1 children only. Starter Speakers and Video stay untouched.

## Tree (creatable items only)

- Careers
  - Work at ASHA
  - Career Guidance Tools
- Certification
  - About Certification
  - How to Apply for Audiology Certification
    - 2020 Audiology Certification Standards
    - 2027 Audiology Certification Standards
    - Audiology Pathway to Certification
  - How to Apply for SLP Certification
    - 2020 SLP Certification Standards
    - 2027 SLP Certification Standards
    - SLP Pathway to Certification
  - Certification Maintenance
  - Praxis Exam
  - Clinical Fellowship
- Publications
  - ASHA Journals
  - ASHA Monographs
  - ASHA Reports
  - Asha Magazine
  - ASHA Headlines
  - ASHA Now
- Events
  - CEO Events
  - ASHA Exchange Live
  - National Speech-Language-Hearing Month
  - Calendar of Events
- Advocacy
  - 2025-2026 Public Policy Agenda
  - Take Action
  - Advocacy News
  - ASHA State-by-State
  - Letters and Statements
  - Guide to Being an Advocate
- Continuing Education
  - ASHA Professional Development
    - Technical Support
  - Information for CE Providers
- Practice Management
  - Billing and Reimbursement
  - Ethics
  - Practice Policy
  - Interprofessional Education and Practice
  - Promote Your Services
  - Multicultural Resources
  - Practice Portal
- Research
  - Awards Grants and Funding
  - Evidence-Based Practice
  - ASHA Survey Reports
  - ASHA Member Data Reports
    - Salary Data
  - National Outcomes Measurement System
    - NOMS Audiology Registry
    - NOMS SLP Registry
    - NOMS Electronic Data Transmission
    - Why Participate in NOMS
- Audiologists
  - OTC Hearing Aid Toolkit
  - Audiology Calendar
  - Audiology Mentor Program
  - Audiology Resource Library
- Speech-Language Pathologists
  - Health Care
  - Private Practice
  - Schools
  - SLP Calendar
- Academic and Faculty
  - CSD Education Survey
  - Higher Education Reports
  - Academic Calendar
  - Starting an Academic Program
- Audiology and SLP Assistants
  - About Assistants Certification
  - Benefits of Affiliation
  - Career Pathway for Assistants
- Students
  - Learn About the Professions
  - Planning Your Education
  - Financial Aid
- Public
  - Find a Professional
  - Developmental Milestones
    - Feeding and Swallowing Milestones
    - Communication Milestones
  - Kindergarten Through Fifth Grade
  - Spanish Resources
- About
  - History of ASHA
  - Strategic Pathway
  - Diversity and Inclusion
  - Press Room
    - Quick Facts
  - Governance
    - Board of Directors
    - National Elections
    - Become a Volunteer
  - Awards
  - Contact ASHA
- Join ASHA
  - Member Benefits
    - Knowledge You Can Use
    - Community You Can Rely On
    - Advocacy for the Professions
    - Awareness of Your Value
    - Bonus Benefits
  - Membership Categories
