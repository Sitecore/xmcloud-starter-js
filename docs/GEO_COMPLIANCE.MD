# GEO Compliance Guide

This document defines the full set of GEO (Generative Engine Optimization) requirements that must be implemented and validated before release.  
It acts as the **single source of truth** for GEO configuration, development, content preparation, and automated CI validation.

Use this document in:
- PR templates  
- CI validation workflows  
- Starter Kit documentation  
- Development onboarding  

---

##  1. Purpose

The goal of GEO Compliance is to ensure that websites and content are fully optimized for:
- AI crawlers  
- LLM-based search engines  
- Semantic understanding  
- Rich results and structured responses  

A GEO‑compliant setup ensures your content can be discovered, interpreted, and used by answer engines and AI models.

---

##  2. GEO Requirements Overview

Below is a complete list of GEO tasks and requirements implemented in the project.

### **2.1 Technical & Platform Requirements**
- AI crawler access configured via `robots.txt` and hosting  
- `.well-known/ai.txt` endpoint added for AI crawler permissions
- Standard XML sitemap generated (`/sitemap.xml`) for traditional crawlers  
- LLM‑optimized sitemap created (`/sitemap-llm.xml`)  
- Semantic HTML structure used throughout  
- Schema.org markup implemented and validated  
- Canonical metadata implemented and optimized  
- OpenGraph and metadata support enabled  
- Metadata optimization across key pages  
- Chunk‑level content architecture implemented  
- GraphQL queries updated to fetch chunk content
- Sitemap LLM integrated using SitecoreClient  
- GEO testing scripts added to CI (where applicable)

---

### **2.2 GEO Content Deliverables**
The following files must exist at site root or specified endpoints:

| File | Purpose |
|------|---------|
| `/ai/summary.json` | Concise site summary for answer engines |
| `/ai/faq.json` | Structured Q&A for LLMs |
| `/ai/service.json` | Site capabilities, offerings, features |
| `sitemap-llm.xml` | LLM-optimized structured sitemap |

Note: Coverage varies by starter. See AI_ENDPOINTS.md for which starters implement each endpoint.
All files must match the required schema format and validation rules listed in Section 4.

---

### **2.3 Documentation Requirements**
- GEO documentation (this guide) available and linked from repo README
- GEO readiness checklist completed
- Bot / AI crawler access documentation prepared  

---

##  3. GEO Validation & Thresholds

Below are the **validation rules**, **tools**, and **minimum thresholds** required for GEO compliance.

### **3.1 Semantic HTML + Schema Markup**
- **Validation Tool:**
  - Google Rich Results Test (Google Search Console) — validates structured data and schema markup
  - PageSpeed Insights (https://pagespeed.web.dev/analysis/) — checks semantic HTML usage, metadata quality, and structured data performance signals
- **Threshold:**  
  - No schema errors (warnings allowed depending on context)  
  - Required schema types present on key pages 
  - Semantic HTML elements correctly used for headings, sections, navigation, and content structure 

### **3.2 Metadata Requirements**
- **Validation Tool:** 
  - Meta Sharing Debugger (Meta for Developers) — validates OpenGraph fields, detects missing metadata, and shows how content appears when shared
  - Twitter Card Validator (https://cards-dev.twitter.com/validator) — validates Twitter Card metadata and previews how links render on X/Twitter  
- **Threshold:**  
  - All required OpenGraph fields present  
  - Canonical tag present  
  - Title + description meet minimum length rules  

### **3.3 GEO JSON Validation**
- **Validation Tool:** GEO JSON schema validator  
- **Thresholds:**  
  - `/ai/summary.json` must include mandatory fields  
  - `/ai/faq.json` must include minimum 3 FAQ item  
  - `/ai/service.json` must include required service descriptors  
  - No broken JSON, missing fields or invalid structure  

### **3.4 LLM Sitemap**
- **Validation Tool:** 
  - QuickSEO Sitemap Validator (https://quickseo.ai/tools/sitemap-validator) — validates XML structure, URL formatting, and sitemap compliance  
- **Threshold:**  
  - Valid XML  
  - All required `<url>` fields defined  
  - Schema matches LLM sitemap spec 
  - Must follow the LLM sitemap specification, meaning:
      - Only the most content-rich, authoritative, meaningful pages are included
      - Content should be stable, canonical, and intended for LLM ingestion 

### **3.5 AI Crawler Access**
- **Validation Tool:**
  - QuickSEO Robots.txt Validator https://quickseo.ai/tools/robots-txt-validator Validates syntax, disallow/allow rules, crawler accessibility, and proper formatting  
- **Threshold:**
  - robots.txt must be valid (no syntax errors, no malformed directives)
  - Required `/ai/*` endpoints not blocked  
  - `.well-known/ai.txt` discoverable  

### **3.6 Chunk‑Based Content**
- **Threshold:**  
  - Chunk title + metadata present  
  - Content within recommended size limits  
  - No empty chunks  

---

##  4. GEO Compliance Checklist (PR‑ready)

Copy this block into PR templates or CI reporting.

```markdown
###  GEO Compliance Checklist

#### Technical Requirements
- [ ] Semantic HTML structure implemented
- [ ] Schema.org markup validated (no errors)
- [ ] Canonical metadata present and correct
- [ ] OpenGraph metadata present and complete
- [ ] Robots.txt configured for AI crawler access
- [ ] `.well-known/ai.txt` implemented

#### GEO JSON Files
- [ ] `/ai/summary.json` exists and passes schema validation
- [ ] `/ai/faq.json` exists with at least one Q&A
- [ ] `/ai/service.json` exists with full service descriptions

#### LLM Sitemap
- [ ] `/sitemap-llm.xml` generated and valid
- [ ] All required fields included

#### Content Architecture
- [ ] Chunk-level content structure implemented
- [ ] Chunk metadata and length validated

#### Testing & Validation
- [ ] GEO automated tests pass (run `npm run dev`, then `npm run test:geo` in starter directory)
- [ ] GEO Readiness Checklist completed
- [ ] GEO compliant (see this guide, Sections 2–4)
```

---

##  5. GEO Testing Scripts and Documentation

Use the following links to access related GEO assets, validation scripts, and author guidance.

| Resource | Description | Link |
|----------|-------------|------|
| **GEO Compliance Checklist** | PR-ready checklist (copy into PR templates or CI reporting) | [Section 4 above](#-4-geo-compliance-checklist-pr‑ready) in this document |
| **GEO endpoints and ai.json** | Implementation details for `/.well-known/ai.txt`, `/ai/summary.json`, `/ai/faq.json`, `/ai/service.json`, `/sitemap-llm.xml` | [AI_ENDPOINTS.md](AI_ENDPOINTS.md) |
| **AI crawler setup** | Crawler configuration, hosting provider setup, and how to allow or restrict AI crawlers | [AI_CRAWLER_ACCESS.md](AI_CRAWLER_ACCESS.md) |
| **GEO automated tests** | Automated tests validate GEO endpoints: `/.well-known/ai.txt`, `/ai/summary.json`, `/ai/faq.json`, `/ai/service.json`, `/sitemap-llm.xml`, `/robots.txt`, `/sitemap.xml`. **Before running the tests:** start the site with `npm run dev` in the starter directory, then in another terminal run `npm run test:geo` or `npm run test:geo:watch` (from `examples/<starter>`). | Start site: `npm run dev`. Then run: `npm run test:geo` or `npm run test:geo:watch` (from `examples/<starter>`) |
| **GEO compliant (checklist item)** | For the “GEO compliant” item in Section 4: use this document (requirements, validation thresholds, and checklist) as the GEO rules reference. | This document (Sections 2–4) |