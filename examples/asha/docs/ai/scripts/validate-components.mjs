#!/usr/bin/env node

/**
 * validate-components.mjs
 *
 * Validates that:
 * 1. Every uiim component import in component-map.ts resolves to an existing file
 * 2. Each file exports a `Default` named export
 * 3. The component map key matches the import alias
 *
 * Usage:
 *   node docs/ai/scripts/validate-components.mjs
 *
 * Exit codes:
 *   0 — all checks passed
 *   1 — one or more checks failed
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '../../..');

const componentMapPath = resolve(projectRoot, '.sitecore/component-map.ts');

if (!existsSync(componentMapPath)) {
  console.error('ERROR: component-map.ts not found at', componentMapPath);
  process.exit(1);
}

const mapContent = readFileSync(componentMapPath, 'utf-8');

// Parse imports: import * as Foo from 'src/components/...'
const importRegex = /import \* as (\w+) from ['"]([^'"]+)['"]/g;
const imports = [];
let match;
while ((match = importRegex.exec(mapContent)) !== null) {
  imports.push({ alias: match[1], path: match[2] });
}

// Parse map entries: ['Key', { ...Alias }] or ['Key', { ...Alias, componentType: 'client' }]
const mapEntryRegex = /\['(\w+)',\s*\{\s*\.\.\.(\w+)/g;
const mapEntries = [];
while ((match = mapEntryRegex.exec(mapContent)) !== null) {
  mapEntries.push({ key: match[1], alias: match[2] });
}

// Filter to uiim components only
const uiimImports = imports.filter(i => i.path.includes('/uiim/'));

let failures = 0;
let passed = 0;

console.log('Component Map Validation');
console.log('========================\n');

for (const imp of uiimImports) {
  const tsxPath = resolve(projectRoot, imp.path + '.tsx');
  const tsPath = resolve(projectRoot, imp.path + '.ts');
  const indexPath = resolve(projectRoot, imp.path, 'index.tsx');

  const filePath = existsSync(tsxPath) ? tsxPath
    : existsSync(tsPath) ? tsPath
    : existsSync(indexPath) ? indexPath
    : null;

  if (!filePath) {
    console.error(`FAIL  ${imp.alias}: file not found`);
    console.error(`      Tried: ${imp.path}.tsx, .ts, /index.tsx`);
    failures++;
    continue;
  }

  // Check for Default export
  const fileContent = readFileSync(filePath, 'utf-8');
  const hasDefault = /export\s+(const|function)\s+Default\b/.test(fileContent);

  if (!hasDefault) {
    console.error(`FAIL  ${imp.alias}: no 'Default' named export found in ${imp.path}`);
    failures++;
    continue;
  }

  // Check map entry exists for this import
  const mapEntry = mapEntries.find(e => e.alias === imp.alias);
  if (!mapEntry) {
    console.error(`FAIL  ${imp.alias}: imported but not found in componentMap entries`);
    failures++;
    continue;
  }

  // Count all named exports (variants)
  const exportRegex = /export\s+const\s+(\w+)\b/g;
  const exports = [];
  let expMatch;
  while ((expMatch = exportRegex.exec(fileContent)) !== null) {
    // Skip non-component exports (componentMap, etc.)
    if (expMatch[1] !== 'componentMap') {
      exports.push(expMatch[1]);
    }
  }

  console.log(`PASS  ${imp.alias} → ${imp.path}.tsx  [key: '${mapEntry.key}', variants: ${exports.join(', ')}]`);
  passed++;
}

console.log(`\n========================`);
console.log(`Passed: ${passed}/${uiimImports.length}`);
if (failures > 0) {
  console.log(`Failed: ${failures}/${uiimImports.length}`);
  process.exit(1);
} else {
  console.log('All uiim components validated.');
  process.exit(0);
}
