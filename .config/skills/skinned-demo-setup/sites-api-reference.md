# Sites API reference (Skinned Demo Setup)

Base URL: `https://xmapps-api.sitecorecloud.io`  
Catalog: [Sites API](https://api-docs.sitecore.com/sai/sites-api)

All mutating site/collection operations may return `{ "handle": "..." }`. Poll until terminal status.

## Auth

1. Create an **Automation** environment client in SitecoreAI Deploy (Organization Admin/Owner).
2. Exchange credentials for a JWT (audience `https://api.sitecorecloud.io`).
3. Send `Authorization: Bearer {JWT}` on every request.

Optional query on most endpoints: `environmentId`.

## Endpoints used in Step 1

| Action | Method | Path |
|---|---|---|
| List sites | `GET` | `/api/v1/sites` |
| Get site | `GET` | `/api/v1/sites/{siteId}` |
| Duplicate site | `POST` | `/api/v1/sites/{siteId}/copy` |
| Rename site | `POST` | `/api/v1/sites/{siteId}/rename` |
| List collections | `GET` | `/api/v1/collections` |
| Create collection | `POST` | `/api/v1/collections` |
| List collection sites | `GET` | `/api/v1/collections/{collectionId}/sites` |
| Job status | `GET` | `/api/v1/jobs/{jobHandle}/status` |

### Create collection body

```json
{
  "name": "customer-collection",
  "displayName": "Customer Collection",
  "description": "Optional description"
}
```

`name` pattern: `^(?![\s-])[a-zA-Z0-9_\s-]*(?<!\s)$` (max 100).

### Copy site body

```json
{
  "name": "new-site-name",
  "displayName": "Optional display name",
  "description": "Optional description"
}
```

Copy does **not** accept a target `collectionId`. The duplicate stays in the source site’s collection.

### Rename site body

```json
{
  "name": "final-site-name"
}
```

`name` max length 50; same character pattern as collection names.

## Job polling

`GET /api/v1/jobs/{jobHandle}/status`

Terminal `status` values: `Completed` | `Failed`.  
While `Queued` or `Running`, wait and retry (suggest 5–15s intervals; back off if long-running).

On `Failed`, stop the skill and surface the job payload to the user.

## Not available

- **Move site between collections** — no Sites API endpoint. Product docs: sites cannot be moved between collections via Channels automation; this skill notifies the user to move in **Content Editor** (parallel with local folder copy), then verifies via `GET /api/v1/collections/{collectionId}/sites`.
