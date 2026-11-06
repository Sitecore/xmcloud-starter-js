# Auto-translate on approval (Azure Functions)

When an author approves the **English** version of a page in SitecoreAI workflow, this function app runs SitecoreAI's built-in AI translation for that page into every other language of the site. The new language versions then go through review like any other content.

```
Author approves EN page
  └─ Sitecore workflow: Webhook Submit Action ──POST──► workflowWebhook (HTTP, function key)
                                                         │ skips non-EN versions, answers 202
                                                         ▼
                                                 queue: translate-requests
                                                         ▼
                                                 planTranslations
                                                         │ looks up the site's languages,
                                                         │ skips items that aren't pages
                                                         ▼
                                                 queue: translate-pages  (1 msg per page)
                                                         ▼
                                                 translatePage, one language at a time:
                                                   POST /api/v1/pages/{id}/translate  → job handle
                                                   GET  /api/v1/jobs/{handle}/status  until done
                                                   PATCH /api/v1/pages/{id}  new version → Draft (if it landed Approved)
                                                         │ job errors / 429 / 5xx → re-queue the languages left (max 5 attempts)
                                                         │ 400/403/404 for a language → logged, next language
```

**Why one language at a time:** each translation job also writes the page's datasource items. On 2026-11-06, four parallel jobs for one page left the German HeroBanner datasource untranslated, while the other three languages and the German page fields were fine. Translating German again on its own worked. So the function waits for each job to finish before starting the next, processes one queue message at a time (`host.json`: `batchSize` 1), and the Flex app is capped at **one instance** (`az functionapp scale config set --maximum-instance-count 1`), so two pages sharing a datasource don't run jobs in parallel either.

It uses the same translation engine as the **Translate** button in the Page builder (brand kit included), through the [Pages API `TranslatePage`](https://api-docs.sitecore.com/sai/pages-api/pages/translatepage.md) endpoint.

## Behaviour

| Situation | What happens |
|---|---|
| EN page approved | The page and its datasources are translated into each target language, one language after another (about 7–15 s per language) |
| A translated version (for example `de-DE`) is approved | Skipped. This is also what prevents loops. |
| Datasource, dictionary or settings item approved on its own | Skipped: the Pages API translates pages. A page's translation includes its components' datasources (verified). |
| Language listed in `TARGET_LANGUAGES` that the site doesn't use | Ignored, with a warning |
| Translation lands in a final (Approved) state | Moved to `TRANSLATION_WORKFLOW_STATE` (Draft) in place, so reviewers approve each language before it can be published. Translations copy the English version's state, so without this they'd be publishable right away. |
| Same page approved twice | `AddVersion` adds another translated version each time. Use `SkipIfExists` to only fill in missing languages. |

## Settings

| App setting | Required | Default | Notes |
|---|---|---|---|
| `AzureWebJobsStorage` | yes | | Storage account for the queues |
| `SITECORE_CLIENT_ID` / `SITECORE_CLIENT_SECRET` | yes | | **Automation** client from SitecoreAI Deploy → Credentials → Environment. Store them in Key Vault. |
| `SITECORE_SITE_NAME` | yes | | Site system name, for example `main-website` |
| `SITECORE_ENVIRONMENT_ID` | no | | Only if your client needs it |
| `SOURCE_LANGUAGE` | no | `en` | |
| `TARGET_LANGUAGES` | no | all site languages except the source | Comma-separated, for example `de-DE,ja-JP` |
| `TRANSLATION_STRATEGY` | no | `AddVersion` | `AddVersion` (retranslate) or `SkipIfExists` |
| `TRANSLATION_WORKFLOW_STATE` | no (recommended) | empty: leave as is | Workflow state ID new translations are moved to, if they land in a final state. Sample Workflow Draft: `{190B1C84-F1BE-47ED-AA41-F42193D9C8FC}` |
| `SITECORE_API_BASE_URL` / `SITECORE_AUTH_URL` / `SITECORE_AUDIENCE` | no | Sitecore cloud defaults | Override only for testing |

## Run locally

Prerequisites: Node 22+, [Azure Functions Core Tools v4](https://learn.microsoft.com/azure/azure-functions/functions-run-local), and [Azurite](https://learn.microsoft.com/azure/storage/common/storage-use-azurite) for the queues.

```bash
cd integrations/auto-translate-function
npm install
cp local.settings.example.json local.settings.json   # fill in the automation client (gitignored)
npx azurite --silent --location .azurite &           # local queues
npm start                                            # builds, then runs func start

# Simulate Sitecore approving a page (replace DataItem.Id with a real EN page ID first):
curl -i -X POST http://localhost:7071/api/sitecore/workflow-approved \
  -H 'Content-Type: application/json' --data @samples/workflow-approved.json
```

Function keys aren't checked locally. Tests: `npm test`. Types: `npm run type-check`.

## Deploy to Azure (Flex Consumption)

```bash
RG=rg-sitecore-autotranslate  LOC=westeurope  ST=stsitecoreautotr$RANDOM  APP=func-sitecore-autotranslate

az group create -n $RG -l $LOC
az storage account create -n $ST -g $RG -l $LOC --sku Standard_LRS --allow-blob-public-access false
az functionapp create -g $RG -n $APP --storage-account $ST \
  --flexconsumption-location $LOC --runtime node --runtime-version 24

# Key Vault with access policies (works with Contributor; RBAC role assignments would need Owner)
az keyvault create -n $KV -g $RG -l $LOC --enable-rbac-authorization false
PID=$(az functionapp identity assign -g $RG -n $APP --query principalId -o tsv)
az keyvault set-policy -n $KV --object-id $PID --secret-permissions get list

az functionapp config appsettings set -g $RG -n $APP --settings \
  SITECORE_SITE_NAME=main-website SOURCE_LANGUAGE=en TRANSLATION_STRATEGY=AddVersion \
  'TRANSLATION_WORKFLOW_STATE={190B1C84-F1BE-47ED-AA41-F42193D9C8FC}' \
  SITECORE_CLIENT_ID='@Microsoft.KeyVault(SecretUri=https://<vault>.vault.azure.net/secrets/sitecore-client-id/)' \
  SITECORE_CLIENT_SECRET='@Microsoft.KeyVault(SecretUri=https://<vault>.vault.azure.net/secrets/sitecore-client-secret/)'
az keyvault secret set --vault-name $KV -n sitecore-client-id --value '<client id>'
az keyvault secret set --vault-name $KV -n sitecore-client-secret --value '<client secret>'

npm run build && func azure functionapp publish $APP --typescript

# Function key that Sitecore will send:
az functionapp function keys list -g $RG -n $APP --function-name workflowWebhook --query default -o tsv
```

## Configure SitecoreAI

Needs a developer or admin role. These are serialized Sitecore items; agree the change with the team first.

1. **Pages must be in a workflow.** Check the page template's `__Standard Values` → *Default workflow*. Without a workflow there is no approval to hook into. The out-of-the-box **Basic Workflow** (`Draft` → *Approve* → `Approved`) is enough.
   - In the `sitecore-demo` environment, the site's pages (Home, About, Articles) currently have **no workflow**, so this step is still to do.
2. **Authorization item**: `/sitecore/System/Settings/Webhooks/Authorizations` → **API key**
   - Key: `x-functions-key`
   - Value: the function key from above
   - Add to: Header
3. **Webhook Submit Action**: right-click the workflow's approve command → **Insert** → **Webhook Submit Action**. With Basic Workflow that is `/sitecore/System/Workflows/Basic Workflow/Draft/Approve`. Set these fields:
   - Enabled: checked
   - Url: `https://<app>.azurewebsites.net/api/sitecore/workflow-approved`
   - Serialization Type: JSON
   - Authorization: the item from step 2
4. Approve an English page, then check the function's logs (Application Insights → traces, filter on `[webhook]`, `[plan]`, `[translate]`) and the page's other language versions.

## Troubleshooting

| Symptom | Check |
|---|---|
| Nothing in the logs | Webhook *Enabled*; the item is really in that workflow; the URL; the function key in the authorization item (a wrong key gives 401) |
| `[webhook] skipped: Item language ...` | The approved version wasn't `SOURCE_LANGUAGE` |
| `[plan] skipped: ... is not a page` | The approved item is a datasource or other non-page item |
| `[plan] skipped: Site ... was not found` | `SITECORE_SITE_NAME` must be the site's system name |
| `[translate] FAILED (not retried)` with 403 | The automation client lacks rights. With 400, read the message: often an unknown language code. |
| `[translate] ... GAVE UP` | Five attempts failed. The log lists the languages not translated; translate them in the Page builder, or approve the page again. |
| Messages in `translate-pages-poison` | The function itself crashed five times on a message (for example bad settings). Fix the cause, then move the message back to `translate-pages`. |

## Verified (sitecore-demo, 2026-11-06)

- **End to end:** a simulated approval of an English-only test page produced ja-JP, de-DE, ar-AE and es-ES versions within about 45 seconds.
- **Fields translated:** single-line text, rich text and the meta description.
- **Real workflow approval:** approving the test page in the Page builder (Sample Workflow) called the webhook, and Auto Publish published English only.
- **The translate call is asynchronous.** `TranslatePage` answers in under a second with `{"handle":"<job>"}`, and Sitecore translates in a background job.
  - `GET /api/v1/jobs/{handle}/status` returns `{ "done": bool, "errors": [] }` while the job exists (about 7 s for a small page), then 404 about a minute after it finishes. The function polls it every 3 s.
- **Datasources are included:** the HeroBanner datasource of the test page was translated with the page.
- **New language versions copy the English workflow state** (*Approved*, publishable). Sample Workflow's Auto Publish published English only, so they weren't live. With `TRANSLATION_WORKFLOW_STATE` set, the function now moves each new version to Draft in place via `PATCH /api/v1/pages/{id}` (`language`, `versionNumber`, `__Workflow state`). No new version is created, and earlier approved versions stay live. Log: `workflow v4: Approved -> Draft`.
- **Sequential run:** four languages in about 30 s (about 7 s each), with the new HeroBanner text translated in all four, German included.

## Known gap

- **Datasources without a workflow are always publishable.** The test page's HeroBanner datasource isn't in any workflow. Its new German text is publishable at once, and an older *approved* German page version would show it after the next publish in all languages. Put datasources in a workflow (for example *Basic Datasource Workflow*) if their translations must be reviewed too.

## Not verified yet

- Whether job `errors` is actually filled in when a datasource write fails. The failed German run had already disappeared when we looked.
