/**
 * Rockland IA batch executor — tracks created item IDs and prints the next creatable batch.
 *
 * Usage:
 *   node docs/ai/scripts/rockland-ia-batch.mjs next [limit]
 *   node docs/ai/scripts/rockland-ia-batch.mjs record <pathKey> <itemId>
 *   node docs/ai/scripts/rockland-ia-batch.mjs status
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PLAN_PATH = join(__dirname, '..', 'ia', 'rockland-ia-plan.json');
const STATE_PATH = join(__dirname, '..', 'ia', 'rockland-ia-state.json');

function loadPlan() {
  return JSON.parse(readFileSync(PLAN_PATH, 'utf8'));
}

function loadState() {
  if (!existsSync(STATE_PATH)) {
    const plan = loadPlan();
    return {
      contentRootId: plan.contentRootId,
      created: { Home: plan.contentRootId },
      completed: [],
      failed: [],
    };
  }
  return JSON.parse(readFileSync(STATE_PATH, 'utf8'));
}

function saveState(state) {
  writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
}

function pathKey(path) {
  return path.join(' / ');
}

function fieldsArray(fields) {
  return Object.entries(fields).map(([name, value]) => ({ name, value }));
}

const cmd = process.argv[2];

if (cmd === 'status') {
  const state = loadState();
  const plan = loadPlan();
  console.log(JSON.stringify({
    total: plan.totalNodes,
    completed: state.completed.length,
    failed: state.failed.length,
    remaining: plan.totalNodes - state.completed.length,
  }, null, 2));
  process.exit(0);
}

if (cmd === 'record') {
  const key = process.argv[3];
  const itemId = process.argv[4];
  const state = loadState();
  state.created[key] = itemId;
  if (!state.completed.includes(key)) state.completed.push(key);
  saveState(state);
  console.log(`Recorded ${key} -> ${itemId}`);
  process.exit(0);
}

if (cmd === 'fail') {
  const key = process.argv[3];
  const error = process.argv[4] ?? 'unknown';
  const state = loadState();
  state.failed.push({ key, error });
  saveState(state);
  process.exit(0);
}

if (cmd === 'next') {
  const limit = Number(process.argv[3] ?? 20);
  const plan = loadPlan();
  const state = loadState();
  const batch = [];

  for (const node of plan.nodes) {
    const key = pathKey(node.path);
    if (state.completed.includes(key)) continue;

    const parentKey = node.path.length === 1 ? 'Home' : pathKey(node.path.slice(0, -1));
    const parentId = state.created[parentKey];
    if (!parentId) continue;

    batch.push({
      key,
      label: node.label,
      itemName: node.itemName,
      parentId,
      parentKey,
      templateId: plan.templateId,
      language: plan.language,
      fields: fieldsArray(node.fields),
    });

    if (batch.length >= limit) break;
  }

  console.log(JSON.stringify({ batch, remaining: plan.totalNodes - state.completed.length }, null, 2));
  process.exit(0);
}

console.error('Unknown command');
process.exit(1);
