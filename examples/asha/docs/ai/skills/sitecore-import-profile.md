# Sitecore import profile

Upload guest profiles to SitecoreAI via the Profile Import API. The user supplies an API key and some form of profile/extension data. This skill turns that data into a valid JSONL batch, using **email** as the identifier, then uploads and reports results.

Docs:
- [Profile Import API](https://doc.sitecore.com/sai/en/developers/sitecoreai/profile-import/profile-import-api.html)
- [Batch file format](https://doc.sitecore.com/sai/en/developers/sitecoreai/profile-import/batch-file-format.html)
- [Import a batch file](https://doc.sitecore.com/sai/en/developers/sitecoreai/profile-import/import-a-batch-file.html)
- [Errors and troubleshooting](https://doc.sitecore.com/sai/en/developers/sitecoreai/profile-import/profile-import-errors-and-troubleshooting.html)

Helper: `docs/ai/scripts/profile-import.mjs`

---

## When this skill applies

Use it when the user wants to:

- import profiles / guests / CDP contacts into SitecoreAI
- format extension data for profile import
- upload a JSONL batch to `/v1/batches`
- check batch status, stats, or results
- bulk-delete profiles (`PROFILE_DELETION`)

---

## Credentials

Never commit the API key. Never write it into source files, `docs/ai/manifests/`, or `.env.local`.

Collect in this order:

1. Environment variables already in the shell: `SITECORE_PROFILE_IMPORT_API_KEY`, `SITECORE_PROFILE_IMPORT_BASE_URL`
2. Values the user pastes in chat this turn
3. If either is missing, ask. Base URL is on **Performance → Settings → Profile import → Credentials → API Endpoint**. All calls are `{base_url}/v1/batches/...`.

Pass the key into the helper via env for that command only:

```powershell
$env:SITECORE_PROFILE_IMPORT_API_KEY = '<user-key>'
$env:SITECORE_PROFILE_IMPORT_BASE_URL = 'https://<their-endpoint>'
```

Header format:

```
Authorization: ApiKey <your-api-key>
```

---

## Required workflow

### 1. Collect inputs

- Operation: `UPSERT` (default) or `DELETE` (only if the user explicitly asks to delete)
- Records: file, JSON, CSV, spreadsheet, or prose. Anything is fine as long as each person has an **email**.
- Optional contact fields: firstName, lastName, email, dateOfBirth, gender, language, title, phoneNumbers, address
- Optional extensions: any custom keys the org tracks

If a row has no email, skip it and list skipped rows at the end. Do not invent addresses.

For DELETE, stop and confirm. Deletion is a permanent hard delete. Each delete record is only:

```json
{"recordType":"PROFILE_DELETION","identifiers":[{"provider":"email","id":"jane@example.com"}]}
```

### 2. Normalize into API records

Each UPSERT line is one compact JSON object (no pretty-print, no trailing comma):

```json
{"recordType":"profile","identifiers":[{"provider":"email","id":"jane@example.com"}],"contact":{"firstName":"Jane","lastName":"Doe","email":"jane@example.com"},"extensions":{}}
```

Rules:

- `recordType` is `profile` for imports.
- Identifier provider is always `email` unless the user names another configured identity rule **in addition to** email. Keep email as the first identifier.
- Copy the same email into `contact.email` when contact is present.
- Every record needs at least one non-null field in `contact` or `extensions`. Empty payloads fail with `NO_UPDATABLE_FIELDS`.
- Omit empty optional fields rather than sending `""`.
- `language` is ISO 639-1 two letters, uppercase (`EN`).
- `dateOfBirth` is `YYYY-MM-DD`.
- `address.country` is ISO 3166-1 alpha-2 and is required if `address` is present.
- Phone numbers are E.164 (`+16045551212`).

Map obvious columns (`First Name` → `contact.firstName`, `email address` → identifier + `contact.email`). Everything else that is not a contact field goes under `extensions`.

### 3. Format extensions

`extensions` is an object of custom keys. Values may be string, boolean, number, object, array, or null.

**Arrays** (the shape this project uses) must follow the API rules:

- Each array is a list of **objects** (not strings, not nested arrays).
- Max **100** objects per array.
- Each object is **flat**. Properties are only scalar: string, number, boolean, or null.
- Nested objects or nested arrays inside an array item are invalid — flatten or drop the nested part.
- Replacing an array replaces the whole array on the profile (not a merge).
- `null` on an extension **key** deletes that key. `null` **inside** an array item is stored as-is.

Use this array format (verbatim from Sitecore docs / the user):

```
"extensions": {
  "orders": [
    {
      "amount": 149.99,
      "currency": "USD"
    },
    {
      "amount": 49,
      "currency": "EUR"
    }
  ],
  "preferences": [
    {
      "name": "newsletter",
      "value": "weekly",
      "priority": 1,
      "enabled": true,
      "note": "paused"
    },
    {
      "name": "channel",
      "value": "email",
      "priority": 2,
      "enabled": false,
      "note": null
    }
  ]
}
```

When the user pastes loose extension data, coerce it into that shape:

| User gives | Write as |
|---|---|
| `orders: 149.99 USD, 49 EUR` | `orders: [{ "amount": 149.99, "currency": "USD" }, { "amount": 49, "currency": "EUR" }]` |
| `newsletter=weekly` | `preferences: [{ "name": "newsletter", "value": "weekly", "priority": 1, "enabled": true }]` |
| `{ "tier": "gold", "score": 42 }` | scalar keys on `extensions` (`"tier": "gold", "score": 42`) |
| nested `{ "order": { "total": { "amount": 10 } } }` inside an array item | flatten to `{ "amount": 10 }` (or split into scalar fields) |

Scalar custom fields stay as top-level extension keys. Do not wrap a single string in an array.

### 4. Write the JSONL file

UTF-8, one JSON object per line, max 100 MB.

Save under `docs/ai/profile-import/batches/` (gitignored). Name it with a timestamp, e.g. `2026-10-06T160000-profiles.jsonl`.

Show the user a short preview (first 2–3 records, record count, skipped emails) and wait for a go-ahead if the dataset is large or includes DELETE.

Validate:

```bash
node docs/ai/scripts/profile-import.mjs validate --file docs/ai/profile-import/batches/<file>.jsonl
```

Fix any validation errors before upload.

### 5. Upload

Only one batch may be `QUEUED` or `RUNNING` per environment. If upload returns 429, list batches, wait until the active one finishes, then retry.

```bash
node docs/ai/scripts/profile-import.mjs upload --file docs/ai/profile-import/batches/<file>.jsonl
```

The script computes MD5, POSTs multipart `file` + `md5` (+ `operationType` when deleting), and prints `batchId`. A successful upload is **202 Accepted**, not 201.

Do not upload a DELETE file without `operationType=DELETE`. Do not send `contact`/`extensions` on deletion records.

### 6. Poll until final

Poll every 8–10 seconds:

```bash
node docs/ai/scripts/profile-import.mjs status --batch-id <batchId>
```

Stop on `COMPLETED`, `COMPLETED_WITH_ERRORS`, or `FAILED`. `QUEUED` / `RUNNING` keep polling. Cap around 10 minutes; if still running, give the user the `batchId` and the status command.

### 7. Report results

On a final state:

```bash
node docs/ai/scripts/profile-import.mjs stats --batch-id <batchId>
node docs/ai/scripts/profile-import.mjs results --batch-id <batchId> --out docs/ai/profile-import/batches/<file>-results.jsonl
```

Summarize for the user: status, total / succeeded / created / updated / failed (or deleted / notFound for DELETE), and any `failedByCode` plus the first error description. If records failed, quote the first few result lines.

---

## Identity notes

- Only identifiers whose `provider` matches a **configured identity rule** in the SitecoreAI environment are used. Unrecognized providers are ignored and the record fails if nothing valid remains.
- Email values are case-insensitive for resolution.
- 0 matches → create; 1 match → update (deep merge); 2+ matches → `INCONSISTENT_IDENTIFIERS`.
- Object fields merge; **arrays replace**. Null keys delete that field.
- An `email` identity rule must already exist in the environment (it is the default in this skill).

---

## Common HTTP / record errors

| Code | Meaning | What to do |
|---|---|---|
| 400 | Bad MD5, empty file, or invalid operationType | Recompute MD5 via the helper; do not hand-edit the hash |
| 401 / 403 | Missing or unauthorized API key | Ask the user for a new key from Profile import → Credentials |
| 404 | Unknown batchId or results not ready | Wait until a final status |
| 429 | Another batch is active | Wait, then retry |
| `INVALID_RECORD` | Bad JSON, missing identifiers, or illegal nested arrays | Fix the line; keep extension arrays as flat objects |
| `NO_UPDATABLE_FIELDS` | No contact/extensions data | Add at least one field |
| `INCONSISTENT_IDENTIFIERS` | Email (or extra ids) maps to two profiles | Stop and tell the user |
| `WRITE_FAILED` | Transient write error | Re-upload |

---

## Example UPSERT line

```json
{"recordType":"profile","identifiers":[{"provider":"email","id":"jane@example.com"}],"contact":{"firstName":"Jane","lastName":"Doe","email":"jane@example.com"},"extensions":{"tier":"gold","orders":[{"amount":149.99,"currency":"USD"}],"preferences":[{"name":"newsletter","value":"weekly","priority":1,"enabled":true,"note":"paused"}]}}
```
