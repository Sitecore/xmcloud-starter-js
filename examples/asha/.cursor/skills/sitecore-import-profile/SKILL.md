---
name: sitecore-import-profile
description: >-
  Import SitecoreAI guest profiles through the Profile Import API. Formats
  messy or partial extension data into JSONL batch records, always using
  email as the identifier provider, then uploads the file, checks MD5,
  polls batch status, and reports results. Use when the user asks to import
  profiles, upload a profile batch, CDP/guest import, Profile Import API,
  format extension data (orders, preferences, custom attributes), or
  delete profiles in bulk via PROFILE_DELETION.
---

Read and follow `docs/ai/skills/sitecore-import-profile.md` in full before proceeding.

Official docs:
- [Profile Import API](https://doc.sitecore.com/sai/en/developers/sitecoreai/profile-import/profile-import-api.html)
- [Batch file format](https://doc.sitecore.com/sai/en/developers/sitecoreai/profile-import/batch-file-format.html)

**Default identifier:** `email` (`identifiers: [{ "provider": "email", "id": "<email>" }]`).

**Required before upload:**
1. **API key** — user-supplied; `Authorization: ApiKey <key>`. Never write it to git, `.env.local`, or the transcript logs if it can be avoided. Prefer env `SITECORE_PROFILE_IMPORT_API_KEY` for the shell command only.
2. **Base URL** — Performance → Settings → Profile import → Credentials → **API Endpoint**. Env: `SITECORE_PROFILE_IMPORT_BASE_URL`.
3. **Profile / extension data** — emails plus contact fields and/or custom extensions. Reformat whatever the user provides into the API shape.

**Do not invent emails.** Skip or ask about rows with no email. Confirm before `operationType=DELETE` (permanent hard delete).
