#!/usr/bin/env node

/**
 * SitecoreAI Profile Import helper.
 *
 *   node docs/ai/scripts/profile-import.mjs validate --file guests.jsonl
 *   node docs/ai/scripts/profile-import.mjs upload --file guests.jsonl [--operation UPSERT|DELETE]
 *   node docs/ai/scripts/profile-import.mjs status --batch-id <id>
 *   node docs/ai/scripts/profile-import.mjs stats --batch-id <id>
 *   node docs/ai/scripts/profile-import.mjs results --batch-id <id> [--out results.jsonl]
 *   node docs/ai/scripts/profile-import.mjs list [--page 1] [--page-size 20]
 *
 * Env:
 *   SITECORE_PROFILE_IMPORT_API_KEY
 *   SITECORE_PROFILE_IMPORT_BASE_URL
 */

import { createHash } from 'crypto';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { basename, dirname } from 'path';

const args = process.argv.slice(2);
const command = args[0];

function flag(name, fallback = undefined) {
  const index = args.indexOf(`--${name}`);
  if (index === -1 || index === args.length - 1) return fallback;
  return args[index + 1];
}

function usage(exitCode = 1) {
  console.error(`Usage:
  node docs/ai/scripts/profile-import.mjs validate --file <path.jsonl>
  node docs/ai/scripts/profile-import.mjs upload --file <path.jsonl> [--operation UPSERT|DELETE]
  node docs/ai/scripts/profile-import.mjs status --batch-id <id>
  node docs/ai/scripts/profile-import.mjs stats --batch-id <id>
  node docs/ai/scripts/profile-import.mjs results --batch-id <id> [--out <path.jsonl>]
  node docs/ai/scripts/profile-import.mjs list [--page 1] [--page-size 20]`);
  process.exit(exitCode);
}

if (!command || command === '--help' || command === '-h') usage(0);

const apiKey = process.env.SITECORE_PROFILE_IMPORT_API_KEY || flag('api-key');
const baseUrl = (process.env.SITECORE_PROFILE_IMPORT_BASE_URL || flag('base-url') || '')
  .replace(/\/+$/, '');

function requireAuth() {
  if (!apiKey) {
    console.error('ERROR: Set SITECORE_PROFILE_IMPORT_API_KEY or pass --api-key');
    process.exit(1);
  }
  if (!baseUrl) {
    console.error('ERROR: Set SITECORE_PROFILE_IMPORT_BASE_URL or pass --base-url');
    process.exit(1);
  }
}

function md5Hex(buffer) {
  return createHash('md5').update(buffer).digest('hex');
}

function isScalar(value) {
  return value === null || ['string', 'number', 'boolean'].includes(typeof value);
}

function validateRecord(record, lineNumber, operation) {
  const errors = [];
  if (typeof record !== 'object' || record === null || Array.isArray(record)) {
    return [`line ${lineNumber}: record is not a JSON object`];
  }

  const type = record.recordType;
  const isDelete = operation === 'DELETE';
  if (isDelete) {
    if (String(type) !== 'PROFILE_DELETION') {
      errors.push(`line ${lineNumber}: recordType must be PROFILE_DELETION for DELETE batches`);
    }
    if (record.contact !== undefined || record.extensions !== undefined) {
      errors.push(`line ${lineNumber}: deletion records must not include contact or extensions`);
    }
  } else if (String(type).toLowerCase() !== 'profile') {
    errors.push(`line ${lineNumber}: recordType must be profile`);
  }

  if (!Array.isArray(record.identifiers) || record.identifiers.length === 0) {
    errors.push(`line ${lineNumber}: identifiers must be a non-empty array`);
  } else {
    const email = record.identifiers.find(
      (item) => item && String(item.provider).toLowerCase() === 'email' && String(item.id || '').trim()
    );
    if (!email) {
      errors.push(`line ${lineNumber}: identifiers must include { provider: "email", id: "<email>" }`);
    }
    record.identifiers.forEach((item, index) => {
      if (!item || !item.provider || !String(item.id || '').trim()) {
        errors.push(`line ${lineNumber}: identifiers[${index}] needs provider and non-empty id`);
      }
    });
  }

  if (!isDelete) {
    const contactEmpty =
      record.contact == null ||
      (typeof record.contact === 'object' && Object.keys(record.contact).length === 0);
    const extensionsEmpty =
      record.extensions == null ||
      (typeof record.extensions === 'object' && Object.keys(record.extensions).length === 0);
    if (contactEmpty && extensionsEmpty) {
      errors.push(`line ${lineNumber}: need at least one contact or extensions field`);
    }
  }

  const extensions = record.extensions;
  if (extensions && typeof extensions === 'object' && !Array.isArray(extensions)) {
    for (const [key, value] of Object.entries(extensions)) {
      if (!Array.isArray(value)) continue;
      if (value.length > 100) {
        errors.push(`line ${lineNumber}: extensions.${key} has more than 100 items`);
      }
      value.forEach((item, index) => {
        if (typeof item !== 'object' || item === null || Array.isArray(item)) {
          errors.push(`line ${lineNumber}: extensions.${key}[${index}] must be an object`);
          return;
        }
        for (const [prop, propValue] of Object.entries(item)) {
          if (!isScalar(propValue)) {
            errors.push(
              `line ${lineNumber}: extensions.${key}[${index}].${prop} must be a scalar (string, number, boolean, or null)`
            );
          }
        }
      });
    }
  }

  return errors;
}

function validateFile(filePath, operation = 'UPSERT') {
  const text = readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  if (!text.trim()) {
    console.error('ERROR: file is empty');
    process.exit(1);
  }
  const lines = text.split(/\r?\n/);
  const errors = [];
  let records = 0;
  lines.forEach((line, index) => {
    if (!line.trim()) return;
    records += 1;
    let parsed;
    try {
      parsed = JSON.parse(line);
    } catch (error) {
      errors.push(`line ${index + 1}: invalid JSON (${error.message})`);
      return;
    }
    errors.push(...validateRecord(parsed, index + 1, operation));
  });

  if (errors.length) {
    console.error(`Validation failed (${errors.length} issue(s), ${records} record(s)):\n`);
    errors.slice(0, 50).forEach((error) => console.error(`  ${error}`));
    if (errors.length > 50) console.error(`  … ${errors.length - 50} more`);
    process.exit(1);
  }

  const buffer = readFileSync(filePath);
  console.log(
    JSON.stringify(
      {
        ok: true,
        records,
        bytes: buffer.length,
        md5: md5Hex(buffer),
        operation,
      },
      null,
      2
    )
  );
}

async function api(path, { method = 'GET', body, headers } = {}) {
  requireAuth();
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      Authorization: `ApiKey ${apiKey}`,
      ...headers,
    },
    body,
  });
  const raw = await response.text();
  let json = null;
  try {
    json = raw ? JSON.parse(raw) : null;
  } catch {
    json = null;
  }
  return { status: response.status, json, raw, headers: response.headers };
}

async function upload(filePath, operation) {
  requireAuth();
  validateFile(filePath, operation);
  const buffer = readFileSync(filePath);
  if (buffer.length > 100 * 1024 * 1024) {
    console.error('ERROR: file exceeds 100 MB');
    process.exit(1);
  }
  const md5 = md5Hex(buffer);
  const form = new FormData();
  form.append('file', new Blob([buffer], { type: 'application/octet-stream' }), basename(filePath));
  form.append('md5', md5);
  if (operation === 'DELETE') form.append('operationType', 'DELETE');
  else if (operation === 'UPSERT') form.append('operationType', 'UPSERT');

  const result = await api('/v1/batches', { method: 'POST', body: form });
  if (result.status !== 202) {
    console.error(`Upload failed: HTTP ${result.status}`);
    console.error(result.raw);
    process.exit(1);
  }
  console.log(JSON.stringify({ md5, ...result.json }, null, 2));
}

async function getJson(path) {
  const result = await api(path);
  if (result.status < 200 || result.status >= 300) {
    console.error(`Request failed: HTTP ${result.status}`);
    console.error(result.raw);
    process.exit(1);
  }
  console.log(JSON.stringify(result.json, null, 2));
}

async function downloadResults(batchId, outPath) {
  const result = await api(`/v1/batches/${batchId}/results`);
  if (result.status !== 200) {
    console.error(`Results failed: HTTP ${result.status}`);
    console.error(result.raw);
    process.exit(1);
  }
  if (outPath) {
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, result.raw);
    console.log(`Wrote ${outPath}`);
  } else {
    process.stdout.write(result.raw.endsWith('\n') ? result.raw : `${result.raw}\n`);
  }
}

const filePath = flag('file');
const batchId = flag('batch-id');
const operation = (flag('operation', 'UPSERT') || 'UPSERT').toUpperCase();

switch (command) {
  case 'validate':
    if (!filePath) usage();
    validateFile(filePath, operation);
    break;
  case 'upload':
    if (!filePath) usage();
    if (operation !== 'UPSERT' && operation !== 'DELETE') {
      console.error('ERROR: --operation must be UPSERT or DELETE');
      process.exit(1);
    }
    await upload(filePath, operation);
    break;
  case 'status':
    if (!batchId) usage();
    await getJson(`/v1/batches/${batchId}/status`);
    break;
  case 'stats':
    if (!batchId) usage();
    await getJson(`/v1/batches/${batchId}/stats`);
    break;
  case 'results':
    if (!batchId) usage();
    await downloadResults(batchId, flag('out'));
    break;
  case 'list':
    await getJson(`/v1/batches?page=${flag('page', '1')}&pageSize=${flag('page-size', '20')}`);
    break;
  default:
    usage();
}
