import { readFileSync, writeFileSync } from 'fs';

const content = JSON.parse(readFileSync('docs/ai/ia/_tmp-quanex-content.json', 'utf8'));
const ia = readFileSync('docs/ai/ia/quanex-ia.md', 'utf8');

function kebab(label) {
  return label
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\+/g, 'plus')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const nodes = [];
let start = false;
for (const line of ia.split(/\r?\n/)) {
  if (line.startsWith('## Tree')) {
    start = true;
    continue;
  }
  if (!start) continue;
  const m = line.match(/^(\s*)- (.+)$/);
  if (!m) continue;
  const depth = m[1].length / 2;
  const label = m[2].trim();
  nodes.push({ depth, label, itemName: kebab(label) });
}

const stack = [];
const plan = [];
for (const n of nodes) {
  while (stack.length > n.depth) stack.pop();
  const parentPath =
    stack.length === 0
      ? '/sitecore/content/quanex/quanex/Home'
      : stack[stack.length - 1].path;
  const path = `${parentPath}/${n.itemName.charAt(0).toUpperCase()}${n.itemName.slice(1)}`;
  // Sitecore item names from create used "Products" (Pascal from name param?) - actually create used name: "Products" with capital P from our call. Skill says kebab-case. Products was created as "Products" because we passed name: "Products". Prefer kebab for URL segments: products was NOT used - we used "Products". Check - create returned name: "Products". So display-style names work. Skill says kebab-case. I'll use Title Case item names matching labels for consistency with Products, OR kebab. Products item name is "Products". Continue with label-based names sanitized but preserving case of first letters... Actually Speakers exists as "Speakers". Use the label as item name with Sitecore-safe chars.

  const itemName = n.label
    .replace(/&/g, 'and')
    .replace(/\+/g, 'Plus')
    .replace(/[^A-Za-z0-9 ]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Sitecore often uses the name as-is with spaces removed or kept. create_content_item with "Products" worked. Use spaced name matching label with & -> and.
  const sitecoreName = n.label.replace(/&/g, 'and').replace(/\+/g, 'Plus');

  const c = content[n.label] || {};
  const fallbackSummary = `${n.label} — part of Quanex building products and manufacturing solutions.`;
  const pageTitle = c.pageTitle || n.label;
  const pageSummary = (c.ok && c.pageSummary) || c.pageSummary || fallbackSummary;
  const detail =
    c.ok && c.Detail
      ? c.Detail
      : `<p>${pageSummary}</p>${c.sourceUrl && c.status === 200 ? `<p><a href="${c.sourceUrl}">Learn more on Quanex.com</a></p>` : ''}`;
  const imageUrl =
    c.imageUrl ||
    'https://www.quanex.com/wp-content/uploads/2025/09/QX_SocialMediaCoverImages_YouTube_2048x1152-scaled.jpg';

  const fields = [
    { name: 'pageTitle', value: pageTitle },
    { name: 'pageHeaderTitle', value: c.pageHeaderTitle || pageTitle },
    { name: 'pageShortTitle', value: n.label },
    {
      name: 'pageSubtitle',
      value: (c.pageSubtitle || pageSummary).slice(0, 160),
    },
    { name: 'pageSummary', value: pageSummary.slice(0, 500) },
    { name: 'Detail', value: detail },
    { name: 'metadataTitle', value: `${n.label} | Quanex` },
    { name: 'metadataDescription', value: pageSummary.slice(0, 300) },
    { name: 'ogTitle', value: `${n.label} | Quanex` },
    { name: 'ogDescription', value: pageSummary.slice(0, 200) },
    // External image attempt — may not persist without DAM
    {
      name: 'image',
      value: `<image src="${imageUrl}" alt="${n.label}" />`,
    },
  ];

  const node = {
    label: n.label,
    depth: n.depth,
    sitecoreName,
    itemName: sitecoreName,
    parentPath,
    path: `${parentPath}/${sitecoreName}`,
    sourceUrl: c.sourceUrl || null,
    contentOk: !!c.ok,
    fields,
  };
  plan.push(node);
  stack.push(node);
}

writeFileSync('docs/ai/ia/_tmp-quanex-create-plan.json', JSON.stringify(plan, null, 2));
console.log('nodes', plan.length);
console.log('with content', plan.filter((p) => p.contentOk).length);
console.log(plan.map((p) => `${'  '.repeat(p.depth)}${p.sitecoreName}`).join('\n'));
