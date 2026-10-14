/**
 * Bulk record created IA items. Usage:
 *   node docs/ai/scripts/rockland-ia-record-bulk.mjs '[["key","itemId"],...]'
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STATE_PATH = join(__dirname, '..', 'ia', 'rockland-ia-state.json');

const input = process.argv[2];
const records = input.endsWith('.json')
  ? JSON.parse(readFileSync(input, 'utf8'))
  : JSON.parse(input);
const state = JSON.parse(readFileSync(STATE_PATH, 'utf8'));

for (const [key, itemId] of records) {
  state.created[key] = itemId;
  if (!state.completed.includes(key)) state.completed.push(key);
  console.log(`Recorded ${key} -> ${itemId}`);
}

writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
