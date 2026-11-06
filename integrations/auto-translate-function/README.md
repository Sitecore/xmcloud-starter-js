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

## First-time setup in Azure (Flex Consumption)

Only for a new environment. The `sitecore-demo` environment is already set up; to change it, see [Maintaining and deploying](#maintaining-and-deploying).

```bash
SUF=$RANDOM
RG=rg-sitecore-autotranslate  LOC=westeurope  ST=stscautotr$SUF  APP=func-sc-autotranslate-$SUF  KV=kv-sc-autotr-$SUF
printf 'RG=%s\nLOC=%s\nST=%s\nAPP=%s\nKV=%s\n' $RG $LOC $ST $APP $KV > .azure-resources.env   # gitignored

az group create -n $RG -l $LOC
az storage account create -n $ST -g $RG -l $LOC --sku Standard_LRS --allow-blob-public-access false
az functionapp create -g $RG -n $APP --storage-account $ST \
  --flexconsumption-location $LOC --runtime node --runtime-version 24
# One instance, so two pages never run translation jobs at the same time (see "Why one language at a time")
az functionapp scale config set -g $RG -n $APP --maximum-instance-count 1

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

Needs a developer or admin role. The webhook and authorization items are **not** serialized: the authorization item holds the function key. They exist only in the environment. The page templates' default workflow **is** serialized (`authoring/items/main-templates`).

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

## Maintaining and deploying

Azure is **not** updated automatically. Merging to `main` changes nothing in Azure: a change goes live only when someone deploys it with the steps below. The Sitecore template change (default workflow) is the exception; it travels with the normal Sitecore deployment.

### What exists where (sitecore-demo)

| Where | What |
|---|---|
| Azure subscription `SA-EMEA-SE-DEMO-INT-CHBE-3000`, resource group `rg-sitecore-autotranslate` (West Europe) | Function app `func-sc-autotranslate-vdzoy` (Flex Consumption, Node 24, max 1 instance), storage `stscautotrvdzoy` (queues), Key Vault `kv-sc-autotr-vdzoy` (Sitecore client ID and secret), Application Insights `func-sc-autotranslate-vdzoy` (logs) |
| Sitecore, `/sitecore/system/Workflows/Sample Workflow/Approved/Auto Translate` | Webhook Submit Action calling `https://func-sc-autotranslate-vdzoy.azurewebsites.net/api/sitecore/workflow-approved` |
| Sitecore, `/sitecore/system/Settings/Webhooks/Authorizations/Auto Translate Function Key` | Sends the function key as `x-functions-key` |
| Sitecore, page templates' `__Standard Values` (Blank, Article, Landing) | `__Default workflow` = Sample Workflow (also in `authoring/items/main-templates`) |
| SitecoreAI Deploy, environment credentials | The **Automation** client the function uses |
| `docs/ai/manifests/sitecore-manifest.yaml` → `autoTranslate` | IDs, history, verification of all of the above |

`.azure-resources.env` (gitignored) holds the Azure names for the commands below. If it's missing, recreate it from the table.

### Prerequisites

```bash
export PATH="$HOME/.azcli/bin:$PATH"     # az is installed there on the demo machine
az login                                 # as an account with Contributor on the subscription
az account set -s SA-EMEA-SE-DEMO-INT-CHBE-3000
func --version                           # Azure Functions Core Tools 4 (npm i -g azure-functions-core-tools@4)
cd integrations/auto-translate-function && source .azure-resources.env && npm install
```

### Change and deploy the code

1. Work on a feature branch; change `src/`, and add or adjust tests in `test/`.
2. Check locally:
   ```bash
   npm test && npm run type-check
   ```
3. If the change alters a **queue message shape** (`src/messages.ts`), make sure the queues are empty first, so old messages aren't read by new code:
   ```bash
   CS=$(az storage account show-connection-string -n $ST -g $RG --query connectionString -o tsv)
   for q in translate-requests translate-pages; do echo "$q: $(az storage message peek -q $q --num-messages 32 --connection-string "$CS" --query 'length(@)' -o tsv)"; done
   ```
4. Deploy (takes 1–2 minutes; it restarts the app):
   ```bash
   npm run clean && npm run build && func azure functionapp publish $APP --typescript
   ```
   The output must list `planTranslations`, `translatePage` and `workflowWebhook`, and end with `The deployment was successful!`.
5. Smoke test. This calls only the webhook and translates nothing: a Japanese version is always skipped.
   ```bash
   KEY=$(az functionapp function keys list -g $RG -n $APP --function-name workflowWebhook --query default -o tsv)
   node -e 'const s=require("./samples/workflow-approved.json"); s.DataItem.Language="ja-JP"; process.stdout.write(JSON.stringify(s))' \
     | curl -s -X POST https://$APP.azurewebsites.net/api/sitecore/workflow-approved \
         -H "x-functions-key: $KEY" -H 'Content-Type: application/json' --data @-
   # expected: {"queued":false,"reason":"Item language \"ja-JP\" is not the source language \"en\"."}
   ```
6. For changes to the translation logic, also do a real test: approve an English test page in the Page builder, check the logs (below), then remove the test page (mark it *Never publish*, publish it, delete it).
7. Commit and open a PR as usual.

### Read the logs

Azure portal → Application Insights `func-sc-autotranslate-vdzoy` → Logs → `traces`. Or from the terminal (logs arrive 1–3 minutes late):

```bash
APPID=$(az resource show -g $RG -n $APP --resource-type microsoft.insights/components --query properties.AppId -o tsv)
Q='traces | where timestamp > ago(1h) | where message has_any ("[webhook]","[plan]","[translate]") | order by timestamp asc | project timestamp, message'
az rest --method post --resource https://api.applicationinsights.io \
  --url "https://api.applicationinsights.io/v1/apps/$APPID/query" \
  --body "$(node -e 'console.log(JSON.stringify({query:process.argv[1]}))' "$Q")" --query "tables[0].rows" -o tsv
```

A healthy run: `[webhook] queued`, `[plan] page ... en -> ...`, one `[translate] ... translated in Ns; workflow vN: Approved -> Draft` per language, then `finished`. Lines with `GAVE UP` or `REVIEW BEFORE PUBLISHING` need action (see Troubleshooting).

### Change a setting

```bash
az functionapp config appsettings set -g $RG -n $APP --settings TARGET_LANGUAGES=de-DE,ja-JP   # for example
```

The app restarts by itself. See [Settings](#settings) for the list. Settings live only in Azure, so record non-default values in the manifest.

### Switch it off quickly

- **From Sitecore (preferred):** clear **Enabled** on `/sitecore/system/Workflows/Sample Workflow/Approved/Auto Translate`. Approvals keep working; nothing is translated.
- **From Azure:** `az functionapp stop -g $RG -n $APP` (start again with `az functionapp start`). Sitecore's webhook calls then fail, but approvals still go through.

### Roll back a bad deploy

There are no deployment slots. Redeploy the last good commit:

```bash
git worktree add /tmp/autotranslate-rollback <good-commit>
cd /tmp/autotranslate-rollback/integrations/auto-translate-function
npm ci && npm run build && func azure functionapp publish func-sc-autotranslate-vdzoy --typescript
cd - && git worktree remove /tmp/autotranslate-rollback
```

### Rotate secrets

- **Sitecore automation client:**
  1. Create a new Automation client in SitecoreAI Deploy.
  2. Store it in Key Vault:
     ```bash
     az keyvault secret set --vault-name $KV -n sitecore-client-id --value '<new id>'
     az keyvault secret set --vault-name $KV -n sitecore-client-secret --value '<new secret>'
     az functionapp restart -g $RG -n $APP
     ```
  3. Run the smoke test and a real approval, then delete the old client in Deploy.
- **Function key:**
  1. Create a new key and copy its value without pasting it into chat or tickets:
     ```bash
     az functionapp function keys set -g $RG -n $APP --function-name workflowWebhook --key-name sitecore
     ```
  2. Paste the value into **Value** of `/sitecore/system/Settings/Webhooks/Authorizations/Auto Translate Function Key`.
  3. Run the smoke test.
  4. Delete the old key:
     ```bash
     az functionapp function keys delete -g $RG -n $APP --function-name workflowWebhook --key-name default
     ```

### Remove everything

1. Delete the **Auto Translate** webhook action and the **Auto Translate Function Key** authorization item in Sitecore.
2. If page workflow is no longer wanted, clear `__Default workflow` on the three templates in Sitecore *and* in `authoring/items/main-templates`.
3. Delete the Azure resources: `az group delete -n rg-sitecore-autotranslate`.
4. Delete the Automation client in SitecoreAI Deploy.
5. Update the manifest.

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
