#!/usr/bin/env node
// Manage the Experience Edge publish webhook that revalidates the rendering host (ADR 0015).
//
// Usage (from examples/basic-nextjs):
//   node tools/edge/edge-webhook.mjs list
//   node tools/edge/edge-webhook.mjs create --site-url https://<host> [--label <text>]
//   node tools/edge/edge-webhook.mjs delete <webhookId>
//   node tools/edge/edge-webhook.mjs ping --site-url https://<host>     (calls /api/revalidate directly)
//
// Env (.env.local, then .env, then the process):
//   SITECORE_EDGE_ADMIN_CLIENT_ID / SITECORE_EDGE_ADMIN_CLIENT_SECRET  Edge administration client
//     (SitecoreAI Deploy > Credentials > Environment > Create credentials > Edge administration)
//   SITECORE_REVALIDATE_SECRET  shared with the rendering host (Vercel env var of the same name)
//
// Secrets are never printed: header values are masked in every output.

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const AUTH_URL = 'https://auth.sitecorecloud.io/oauth/token';
const AUDIENCE = 'https://api.sitecorecloud.io';
const ADMIN_API = 'https://edge.sitecorecloud.io/api/admin/v1';
const SECRET_HEADER = 'x-revalidate-secret';

const [command, ...rest] = process.argv.slice(2);
const opt = (name) => {
  const i = rest.indexOf(`--${name}`);
  return i >= 0 && rest[i + 1] && !rest[i + 1].startsWith('--') ? rest[i + 1] : undefined;
};

const readEnv = (name) => {
  if (process.env[name]) return process.env[name].trim();
  for (const file of ['.env.local', '.env']) {
    try {
      const match = readFileSync(resolve(process.cwd(), file), 'utf8').match(new RegExp(`^${name}=(.*)$`, 'm'));
      if (match && match[1].trim()) return match[1].trim().replace(/^["']|["']$/g, '');
    } catch {
      // try the next file
    }
  }
  return undefined;
};

const fail = (message) => {
  console.error(`ERROR: ${message}`);
  process.exit(1);
};

const mask = (webhook) => ({
  ...webhook,
  headers: Object.fromEntries(Object.keys(webhook.headers ?? {}).map((k) => [k, '***'])),
});

const siteUrl = () => {
  const url = opt('site-url')?.replace(/\/$/, '');
  if (!url || !url.startsWith('https://')) fail('--site-url https://<host> is required (Edge accepts HTTPS only)');
  return url;
};

const revalidateSecret = () =>
  readEnv('SITECORE_REVALIDATE_SECRET') || fail('SITECORE_REVALIDATE_SECRET is not set in .env.local');

async function token() {
  const clientId = readEnv('SITECORE_EDGE_ADMIN_CLIENT_ID');
  const clientSecret = readEnv('SITECORE_EDGE_ADMIN_CLIENT_SECRET');
  if (!clientId || !clientSecret) {
    fail('SITECORE_EDGE_ADMIN_CLIENT_ID and SITECORE_EDGE_ADMIN_CLIENT_SECRET must be set in .env.local');
  }
  const res = await fetch(AUTH_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      audience: AUDIENCE,
    }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.access_token) fail(`token request failed: HTTP ${res.status} ${body.error ?? ''}`);
  return body.access_token;
}

async function admin(path, init = {}) {
  const res = await fetch(`${ADMIN_API}${path}`, {
    ...init,
    headers: { authorization: `Bearer ${await token()}`, 'content-type': 'application/json', ...init.headers },
  });
  const text = await res.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  if (!res.ok) fail(`${init.method ?? 'GET'} ${path}: HTTP ${res.status} ${typeof body === 'string' ? body : JSON.stringify(body)}`.slice(0, 600));
  return body;
}

async function list() {
  const hooks = (await admin('/webhooks')) ?? [];
  console.log(JSON.stringify(hooks.map(mask), null, 2));
  return hooks;
}

async function create() {
  const uri = `${siteUrl()}/api/revalidate`;
  const secret = revalidateSecret();
  const existing = ((await admin('/webhooks')) ?? []).filter((h) => h.uri === uri);
  if (existing.length) {
    console.log(`A webhook for ${uri} already exists (id ${existing.map((h) => h.id).join(', ')}); nothing created.`);
    return;
  }
  const created = await admin('/webhooks', {
    method: 'POST',
    body: JSON.stringify({
      label: opt('label') ?? `Revalidate ${new URL(uri).host} (all pages)`,
      uri,
      method: 'POST',
      headers: { [SECRET_HEADER]: secret, 'content-type': 'application/json' },
      body: JSON.stringify({ source: 'edge-webhook' }),
      createdBy: 'edge-webhook.mjs',
      executionMode: 'OnEnd',
    }),
  });
  console.log('Created:');
  console.log(JSON.stringify(mask(created ?? {}), null, 2));
}

async function remove() {
  const id = rest[0];
  if (!id || id.startsWith('--')) fail('usage: delete <webhookId>');
  await admin(`/webhooks/${encodeURIComponent(id)}`, { method: 'DELETE' });
  console.log(`Deleted webhook ${id}.`);
}

async function ping() {
  const uri = `${siteUrl()}/api/revalidate`;
  const res = await fetch(uri, {
    method: 'POST',
    headers: { [SECRET_HEADER]: revalidateSecret(), 'content-type': 'application/json' },
    body: JSON.stringify({ source: 'edge-webhook.mjs ping' }),
  });
  console.log(`POST ${uri}: HTTP ${res.status} ${await res.text()}`);
  process.exit(res.ok ? 0 : 1);
}

const commands = { list, create, delete: remove, ping };
if (!commands[command]) {
  console.log('Usage: node tools/edge/edge-webhook.mjs list | create --site-url <https://host> | delete <id> | ping --site-url <https://host>');
  process.exit(command ? 1 : 0);
}
await commands[command]();
