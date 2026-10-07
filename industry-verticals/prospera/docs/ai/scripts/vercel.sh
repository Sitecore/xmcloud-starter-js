#!/usr/bin/env bash

set -Eeuo pipefail

# Git Bash otherwise rewrites Vercel API paths such as /v10/projects into Windows paths.
vercel() {
  MSYS_NO_PATHCONV=1 command vercel "$@"
}

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
PROJECT_DIR="$(cd -- "$SCRIPT_DIR/../../.." 2>/dev/null && pwd -P || true)"
CUSTOMER=""
TARGET=""
SEARCH_MODE=""
BRANCH=""
BUILD_COMMAND=""
VALIDATE_ONLY=false
SKIP_BUILD=false

usage() {
  cat <<'USAGE'
Usage:
  ./vercel.sh --customer <slug> --validate-only [--project-dir <path>]
  ./vercel.sh --customer <slug> --target preview|production|both \
    --search embedded|standalone [--branch <branch>] [--project-dir <path>] [--skip-build]

One-time authentication:
  Run `vercel login` before the first deployment. The script reuses that CLI session.

Optional non-interactive inputs:
  VERCEL_SCOPE
  VERCEL_PREVIEW_SITECORE_EDGE_CONTEXT_ID
  VERCEL_PREVIEW_NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID
  VERCEL_PRODUCTION_SITECORE_EDGE_CONTEXT_ID
  VERCEL_NEXT_PUBLIC_DEFAULT_SITE_NAME
  VERCEL_NEXT_PUBLIC_SEARCH_API_KEY
  VERCEL_NEXT_PUBLIC_SEARCH_CUSTOMER_KEY
  VERCEL_NEXT_PUBLIC_SEARCH_ENV
  VERCEL_NEXT_PUBLIC_SEARCH_SOURCE
USAGE
}

die() {
  printf 'Error: %s\n' "$*" >&2
  exit 1
}

while (($#)); do
  case "$1" in
    --customer) CUSTOMER="${2:-}"; shift 2 ;;
    --target) TARGET="${2:-}"; shift 2 ;;
    --search) SEARCH_MODE="${2:-}"; shift 2 ;;
    --branch) BRANCH="${2:-}"; shift 2 ;;
    --project-dir) PROJECT_DIR="$(cd -- "${2:-}" && pwd -P)"; shift 2 ;;
    --build-command) BUILD_COMMAND="${2:-}"; shift 2 ;;
    --validate-only) VALIDATE_ONLY=true; shift ;;
    --skip-build) SKIP_BUILD=true; shift ;;
    -h|--help) usage; exit 0 ;;
    *) die "Unknown argument: $1" ;;
  esac
done

[[ -n "$CUSTOMER" ]] || CUSTOMER="$(basename -- "$PROJECT_DIR")"
[[ "$CUSTOMER" =~ ^[a-z0-9]+([a-z0-9-]*[a-z0-9])?$ ]] || die "Customer must be a lowercase Vercel-safe slug."
[[ -f "$PROJECT_DIR/package.json" ]] || die "No package.json found in $PROJECT_DIR"

command -v git >/dev/null || die "git is required."
command -v node >/dev/null || die "node is required."

REPO_ROOT="$(git -C "$PROJECT_DIR" rev-parse --show-toplevel 2>/dev/null)" || die "Project is not inside a Git repository."
ROOT_DIRECTORY="$(node -e 'const p=require("path"); console.log(p.relative(process.argv[1], process.argv[2]).split(p.sep).join("/"))' "$REPO_ROOT" "$PROJECT_DIR")"
[[ -n "$ROOT_DIRECTORY" && "$ROOT_DIRECTORY" != ..* ]] || die "Project directory must be below the repository root."

run_build() {
  printf 'Validating local build in %s...\n' "$PROJECT_DIR"
  if [[ -n "$BUILD_COMMAND" ]]; then
    (cd "$PROJECT_DIR" && CI=true bash -lc "$BUILD_COMMAND")
  elif [[ -f "$PROJECT_DIR/pnpm-lock.yaml" ]]; then
    command -v pnpm >/dev/null || die "pnpm-lock.yaml exists but pnpm is unavailable."
    (cd "$PROJECT_DIR" && CI=true pnpm run build)
  elif [[ -f "$PROJECT_DIR/yarn.lock" ]]; then
    command -v yarn >/dev/null || die "yarn.lock exists but yarn is unavailable."
    (cd "$PROJECT_DIR" && CI=true yarn build)
  else
    command -v npm >/dev/null || die "npm is unavailable."
    (cd "$PROJECT_DIR" && CI=true npm run build)
  fi
  printf 'Build passed.\n'
}

if [[ "$SKIP_BUILD" != true ]]; then
  run_build || die "Build failed. No Vercel project was created or changed."
fi
[[ "$VALIDATE_ONLY" == true ]] && exit 0

[[ "$TARGET" == preview || "$TARGET" == production || "$TARGET" == both ]] || die "--target must be preview, production, or both."
[[ "$SEARCH_MODE" == embedded || "$SEARCH_MODE" == standalone ]] || die "--search must be embedded or standalone."

command -v vercel >/dev/null || die "Vercel CLI is required. Run: npm install --global vercel"
vercel whoami >/dev/null 2>&1 || die "Vercel is not connected. Run 'vercel login' once, then retry."

SCOPE_ARGS=()
[[ -n "${VERCEL_SCOPE:-}" ]] && SCOPE_ARGS=(--scope "$VERCEL_SCOPE")

ACTIVE_BRANCH="$(git -C "$REPO_ROOT" branch --show-current)"
if [[ -z "$BRANCH" ]]; then
  [[ -n "$ACTIVE_BRANCH" ]] || die "Git is in detached-HEAD state; pass --branch."
  BRANCH="$ACTIVE_BRANCH"
fi

if [[ -n "$(git -C "$REPO_ROOT" status --porcelain)" ]]; then
  printf 'Warning: the working tree is dirty. The initial CLI deployment includes local source; later Git deployments use the pushed %s branch.\n' "$BRANCH" >&2
fi

ORIGIN_URL="$(git -C "$REPO_ROOT" remote get-url origin 2>/dev/null)" || die "Git remote 'origin' is required."
GITHUB_REPO="$(printf '%s' "$ORIGIN_URL" | sed -E 's#^git@github.com:##; s#^https://github.com/##; s#\.git$##; s#/tree/.*$##')"
[[ "$GITHUB_REPO" =~ ^[^/]+/[^/]+$ ]] || die "origin must resolve to a GitHub owner/repository. Found: $ORIGIN_URL"

read_env_value() {
  local file="$1" key="$2"
  [[ -f "$file" ]] || return 0
  node - "$file" "$key" <<'NODE'
const fs = require('fs');
const [file, key] = process.argv.slice(2);
for (const raw of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
  const line = raw.trim();
  if (!line || line.startsWith('#')) continue;
  const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
  if (!match || match[1] !== key) continue;
  let value = match[2].trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
  process.stdout.write(value);
  break;
}
NODE
}

prompt_value() {
  local variable_name="$1" prompt="$2" default_value="${3:-}" secret="${4:-false}" value=""
  value="${!variable_name:-$default_value}"
  if [[ -z "$value" ]]; then
    if [[ "$secret" == true ]]; then
      read -r -s -p "$prompt: " value; printf '\n' >&2
    else
      read -r -p "$prompt: " value
    fi
  fi
  [[ -n "$value" ]] || die "$prompt is required."
  printf -v "$variable_name" '%s' "$value"
}

LOCAL_ENV="$PROJECT_DIR/.env.local"

prompt_value VERCEL_NEXT_PUBLIC_DEFAULT_SITE_NAME "NEXT_PUBLIC_DEFAULT_SITE_NAME" "$(read_env_value "$LOCAL_ENV" NEXT_PUBLIC_DEFAULT_SITE_NAME)" false
prompt_value VERCEL_NEXT_PUBLIC_SEARCH_API_KEY "NEXT_PUBLIC_SEARCH_API_KEY" "$(read_env_value "$LOCAL_ENV" NEXT_PUBLIC_SEARCH_API_KEY)" true
prompt_value VERCEL_NEXT_PUBLIC_SEARCH_CUSTOMER_KEY "NEXT_PUBLIC_SEARCH_CUSTOMER_KEY" "$(read_env_value "$LOCAL_ENV" NEXT_PUBLIC_SEARCH_CUSTOMER_KEY)" true
prompt_value VERCEL_NEXT_PUBLIC_SEARCH_ENV "NEXT_PUBLIC_SEARCH_ENV" "$(read_env_value "$LOCAL_ENV" NEXT_PUBLIC_SEARCH_ENV)" false
prompt_value VERCEL_NEXT_PUBLIC_SEARCH_SOURCE "NEXT_PUBLIC_SEARCH_SOURCE" "$(read_env_value "$LOCAL_ENV" NEXT_PUBLIC_SEARCH_SOURCE)" false

if [[ "$TARGET" == preview || "$TARGET" == both ]]; then
  prompt_value VERCEL_PREVIEW_SITECORE_EDGE_CONTEXT_ID "Preview SITECORE_EDGE_CONTEXT_ID" "$(read_env_value "$LOCAL_ENV" SITECORE_EDGE_CONTEXT_ID)" true
  prompt_value VERCEL_PREVIEW_NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID "Preview NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID" "$(read_env_value "$LOCAL_ENV" NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID)" true
fi
if [[ "$TARGET" == production || "$TARGET" == both ]]; then
  prompt_value VERCEL_PRODUCTION_SITECORE_EDGE_CONTEXT_ID "Production SITECORE_EDGE_CONTEXT_ID" "" true
fi
if [[ "$TARGET" == both && "$VERCEL_PREVIEW_SITECORE_EDGE_CONTEXT_ID" == "$VERCEL_PRODUCTION_SITECORE_EDGE_CONTEXT_ID" ]]; then
  die "Preview and Production SITECORE_EDGE_CONTEXT_ID values must differ."
fi

api_request() {
  local method="$1" path="$2" body="${3:-}"
  local args=(api "$path" -X "$method" --raw "${SCOPE_ARGS[@]}")
  if [[ -n "$body" ]]; then
    printf '%s' "$body" | vercel "${args[@]}" --input -
  else
    vercel "${args[@]}"
  fi
}

json_value() {
  node -e 'let s=""; process.stdin.on("data",d=>s+=d).on("end",()=>{const o=JSON.parse(s); const v=process.argv[1].split(".").reduce((a,k)=>a?.[k],o); if(v!==undefined&&v!==null) process.stdout.write(String(v));})' "$1"
}

upsert_env() {
  local project_id="$1" key="$2" value="$3" payload
  payload="$(KEY="$key" VALUE="$value" node -e 'process.stdout.write(JSON.stringify({key:process.env.KEY,value:process.env.VALUE,type:"encrypted",target:["production","preview"]}))')"
  api_request POST "/v10/projects/$project_id/env?upsert=true" "$payload" >/dev/null
}

configure_target() {
  local environment="$1"
  local project_name="$CUSTOMER-$environment"
  local edge public_edge create_payload project_response project_id patch_payload deployment_url

  if [[ "$environment" == preview ]]; then
    edge="$VERCEL_PREVIEW_SITECORE_EDGE_CONTEXT_ID"
    public_edge="$VERCEL_PREVIEW_NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID"
  else
    edge="$VERCEL_PRODUCTION_SITECORE_EDGE_CONTEXT_ID"
    public_edge="$VERCEL_PRODUCTION_SITECORE_EDGE_CONTEXT_ID"
  fi

  printf 'Configuring Vercel project %s...\n' "$project_name"
  create_payload="$(NAME="$project_name" REPO="$GITHUB_REPO" ROOT="$ROOT_DIRECTORY" node -e 'process.stdout.write(JSON.stringify({name:process.env.NAME,framework:"nextjs",rootDirectory:process.env.ROOT,gitRepository:{type:"github",repo:process.env.REPO}}))')"

  project_response="$(api_request GET "/v9/projects/$project_name" 2>/dev/null || true)"
  project_id="$(printf '%s' "$project_response" | json_value id 2>/dev/null || true)"
  if [[ -z "$project_id" ]]; then
    project_response="$(api_request POST /v10/projects "$create_payload")"
    project_id="$(printf '%s' "$project_response" | json_value id)"
    [[ -n "$project_id" ]] || die "Vercel did not return an id for $project_name."
  fi

  patch_payload="$(ROOT="$ROOT_DIRECTORY" node -e 'process.stdout.write(JSON.stringify({framework:"nextjs",rootDirectory:process.env.ROOT}))')"
  api_request PATCH "/v9/projects/$project_id" "$patch_payload" >/dev/null

  BRANCH="$BRANCH" PROJECT_ID="$project_id" node <<'NODE'
const fs = require('fs');
const os = require('os');
const path = require('path');
const candidates = [
  process.env.APPDATA && path.join(process.env.APPDATA, 'com.vercel.cli', 'Data', 'auth.json'),
  path.join(os.homedir(), '.local', 'share', 'com.vercel.cli', 'auth.json'),
  path.join(os.homedir(), 'Library', 'Application Support', 'com.vercel.cli', 'auth.json'),
].filter(Boolean);
const authPath = candidates.find((candidate) => fs.existsSync(candidate));
if (!authPath) {
  console.error('Vercel auth file was not found. Production branch was not changed.');
  process.exit(1);
}
const { token } = JSON.parse(fs.readFileSync(authPath, 'utf8'));
fetch(`https://api.vercel.com/v9/projects/${process.env.PROJECT_ID}/branch`, {
  method: 'PATCH',
  headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ branch: process.env.BRANCH }),
}).then(async (response) => {
  if (!response.ok) {
    const body = await response.text();
    console.error(`Failed to set production branch (${response.status}).`);
    process.exit(1);
  }
}).catch((error) => {
  console.error('Failed to set production branch.');
  process.exit(1);
});
NODE

  upsert_env "$project_id" SITECORE_EDGE_CONTEXT_ID "$edge"
  upsert_env "$project_id" NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID "$public_edge"
  upsert_env "$project_id" NEXT_PUBLIC_DEFAULT_SITE_NAME "$VERCEL_NEXT_PUBLIC_DEFAULT_SITE_NAME"
  upsert_env "$project_id" NEXT_PUBLIC_SEARCH_API_KEY "$VERCEL_NEXT_PUBLIC_SEARCH_API_KEY"
  upsert_env "$project_id" NEXT_PUBLIC_SEARCH_CUSTOMER_KEY "$VERCEL_NEXT_PUBLIC_SEARCH_CUSTOMER_KEY"
  upsert_env "$project_id" NEXT_PUBLIC_SEARCH_ENV "$VERCEL_NEXT_PUBLIC_SEARCH_ENV"
  upsert_env "$project_id" NEXT_PUBLIC_SEARCH_SOURCE "$VERCEL_NEXT_PUBLIC_SEARCH_SOURCE"

  env_backup="$(mktemp)"
  if [[ -f "$LOCAL_ENV" ]]; then
    cp "$LOCAL_ENV" "$env_backup"
  fi
  (cd "$PROJECT_DIR" && vercel link --yes --project "$project_name" "${SCOPE_ARGS[@]}") >/dev/null
  if [[ -s "$env_backup" ]]; then
    cp "$env_backup" "$LOCAL_ENV"
  fi
  rm -f "$env_backup"

  # The CLI upload is already the customer directory. Clear Root Directory for
  # that upload, then restore the repository-relative path for Git deployments.
  api_request PATCH "/v9/projects/$project_id" '{"rootDirectory":null}' >/dev/null
  deploy_log="$(mktemp)"
  set +e
  (cd "$PROJECT_DIR" && vercel deploy --prod --yes "${SCOPE_ARGS[@]}") >"$deploy_log" 2>&1
  deploy_status=$?
  set -e
  restore_root="$(ROOT="$ROOT_DIRECTORY" node -e 'process.stdout.write(JSON.stringify({rootDirectory:process.env.ROOT}))')"
  api_request PATCH "/v9/projects/$project_id" "$restore_root" >/dev/null
  deployment_url="$(tail -n 1 "$deploy_log")"
  if [[ "$deploy_status" -ne 0 ]]; then
    printf '%s\n' "$(tail -n 20 "$deploy_log")" >&2
    rm -f "$deploy_log"
    die "Deployment failed for $project_name."
  fi
  rm -f "$deploy_log"
  printf 'Configured and deployed %s (root: %s, branch: %s).\n' "$project_name" "$ROOT_DIRECTORY" "$BRANCH"
  printf 'Deployment: %s\n' "$deployment_url"
}

case "$TARGET" in
  preview) configure_target preview ;;
  production) configure_target production ;;
  both) configure_target preview; configure_target production ;;
esac

printf 'Vercel deployment complete. Future pushes to %s will trigger deployments.\n' "$BRANCH"
