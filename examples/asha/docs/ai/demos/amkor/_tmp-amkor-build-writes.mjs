/**
 * Throwaway: render the validated image plan into the exact Sitecore image XML
 * field values to push through the Marketer MCP `update_fields_on_item` tool.
 *
 * Usage: node docs/ai/demos/amkor/_tmp-amkor-build-writes.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const DIR = import.meta.dirname;
const plan = JSON.parse(fs.readFileSync(path.join(DIR, '_tmp-amkor-image-plan.json'), 'utf8'));

const escapeXmlAttr = (value) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const writes = plan.map((entry) => ({
  id: entry.id,
  path: entry.path,
  query: entry.query,
  value: `<image src="${escapeXmlAttr(entry.url)}" alt="${escapeXmlAttr(entry.alt)}" />`,
}));

const out = path.join(DIR, '_tmp-amkor-image-writes.json');
fs.writeFileSync(out, JSON.stringify(writes, null, 2));
console.log('writes:', writes.length);
console.log(JSON.stringify(writes[0], null, 2));
console.log('wrote', out);
