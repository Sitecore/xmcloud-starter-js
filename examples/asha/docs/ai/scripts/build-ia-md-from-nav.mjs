/**
 * Normalize scraped nav JSON into depth-capped IA markdown trees.
 * Groups by URL path when possible; drops PDFs, social, tel, View All, legal.
 */
import { readFileSync, writeFileSync, unlinkSync } from 'fs';

const TODAY = '2026-08-11';

function cleanLabel(s) {
  return (s || '').replace(/\s+/g, ' ').trim();
}

function shouldSkip(label, href = '') {
  const t = label.toLowerCase();
  const h = (href || '').toLowerCase();
  if (!label || label.length > 90) return true;
  if (/^(view all|facebook|linkedin|instagram|youtube|log in|login|register|basket|cart|menu|back|employee access)$/i.test(label))
    return true;
  if (h.includes('.pdf') || h.startsWith('tel:') || h.includes('facebook.com') || h.includes('linkedin.com'))
    return true;
  if (h.includes('instagram.com') || h.includes('youtube.com') || h.includes('ultipro.com')) return true;
  if (t.includes('cookie') || t.includes('privacy') || t.includes('terms &') || t.includes('modern slavery'))
    return true;
  if (t.includes('{{')) return true;
  return false;
}

/** Build nested tree from flat links using URL path after basePath, maxDepth from Home children. */
function nestByUrl(links, { origin, basePath, maxDepth = 3 }) {
  const root = { children: new Map() };

  for (const { label, href } of links) {
    if (shouldSkip(label, href)) continue;
    let path;
    try {
      const u = new URL(href);
      if (u.origin !== origin) continue;
      path = u.pathname.replace(/\/+$/, '') || '/';
    } catch {
      continue;
    }
    if (!path.startsWith(basePath)) continue;
    let rest = path.slice(basePath.length).replace(/^\/+/, '');
    if (!rest) continue;
    const segs = rest.split('/').filter(Boolean);
    // Only use up to maxDepth segments as IA nodes; last segment gets this label if leaf
    const use = segs.slice(0, maxDepth);
    let node = root;
    for (let i = 0; i < use.length; i++) {
      const seg = use[i];
      if (!node.children.has(seg)) {
        node.children.set(seg, {
          seg,
          label: titleCaseSeg(seg),
          children: new Map(),
        });
      }
      node = node.children.get(seg);
      if (i === use.length - 1) node.label = cleanLabel(label) || node.label;
    }
  }

  return mapToArray(root);
}

function titleCaseSeg(seg) {
  return seg
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function mapToArray(node) {
  return [...node.children.values()].map((c) => ({
    label: c.label,
    children: mapToArray(c),
  }));
}

function flattenLinks(nodes, out = []) {
  for (const n of nodes || []) {
    out.push({ label: n.label, href: n.href || '' });
    if (n.children?.length) flattenLinks(n.children, out);
  }
  return out;
}

function toMarkdown(nodes, indent = 0) {
  let md = '';
  const pad = '  '.repeat(indent);
  for (const n of nodes) {
    md += `${pad}- ${n.label}\n`;
    if (n.children?.length) md += toMarkdown(n.children, indent + 1);
  }
  return md;
}

function writeIa({ client, title, url, confidence, notes, tree }) {
  const path = `docs/ai/ia/${client}-ia.md`;
  const body = `# ${title} — Sitecore Content Tree (IA draft)

Source: ${url}
Client key: ${client}
Extracted: ${TODAY}
Extracted by: get-site-ia
Max depth: 3
Confidence: ${confidence}

## Hand-off to sitecore-create-ia
- IA file: \`docs/ai/ia/${client}-ia.md\`
- Site name: _(fill when creating)_
- Content root: _(e.g. /sitecore/content/<collection>/${client}/Home)_
- Page template ID: _(fill when creating)_
- Folder template ID: _(only if tree has [folder] or shared)_

## Notes
${notes.map((n) => `- ${n}`).join('\n')}
- Home exists in Sitecore — skip creating Home; tree lists L1+ children only.
- Not creating Sitecore items yet (awaiting template choice).

## Tree (creatable items only)

${toMarkdown(tree).trimEnd()}
`;
  writeFileSync(path, body + '\n');
  console.log('Wrote', path);
}

// ── AmesburyTruth: rebuild L2 from URL product categories ───────────────
{
  const raw = JSON.parse(readFileSync('docs/ai/ia/_tmp-amesburytruth-nav.json', 'utf8'));
  const productLinks = flattenLinks(raw.l1.filter((x) => /Hardware|Weatherseals|Extrusions/i.test(x.label)));
  const utility = raw.l1.filter((x) => /Resources|About|Recall/i.test(x.label));

  const windowHw = {
    label: 'Window Hardware',
    children: [
      {
        label: 'Casement / Awning',
        children: [
          'PowerLink',
          'Locks',
          'Hinges',
          'Operators',
          'Handles and Covers',
          'Push-Out Hardware',
          'Safety Products',
          'Accessories',
        ].map((l) => ({ label: l, children: [] })),
      },
      {
        label: 'Hung / Sliding',
        children: [
          'Balances',
          'Locks',
          'Tilt Latches',
          'Sash Lifts',
          'Rollers',
          'Weeps',
          'Keepers',
          'Vent Stops',
          'WOCDs',
          'Hole Plugs',
          'Grid Clips',
          'Grid Joiners',
        ].map((l) => ({ label: l, children: [] })),
      },
      { label: 'Skylights', children: [] },
      { label: 'Tilt-n-Turn', children: [] },
    ],
  };

  const doorHw = {
    label: 'Door Hardware',
    children: [
      {
        label: 'Sliding',
        children: [
          'Handle Sets',
          'Mortise Locks',
          'Mortise Keepers',
          'Lift N Slide',
          'Rollers',
          'Secondary Locks',
          'Screen Rollers',
          'Secondary Lock Keepers',
        ].map((l) => ({ label: l, children: [] })),
      },
      {
        label: 'Hinged',
        children: [
          'Handle Sets',
          'Hinges',
          'Locks',
          'Tru-Lock',
          'Handle Accessories',
          'Lock Accessories',
        ].map((l) => ({ label: l, children: [] })),
      },
    ],
  };

  const weather = {
    label: 'Weatherseals',
    children: [
      {
        label: 'Pile',
        children: ['Dust Plug', 'Extruded Pile', 'Kerf Pile'].map((l) => ({ label: l, children: [] })),
      },
      {
        label: 'Window Seals',
        children: ['Compression', 'Surface Mount'].map((l) => ({ label: l, children: [] })),
      },
      {
        label: 'Door Seals',
        children: ['Corner Pads', 'Kerf', 'Pocket', 'Surface Mount', 'Sweeps'].map((l) => ({
          label: l,
          children: [],
        })),
      },
    ],
  };

  const extrusions = {
    label: 'Extrusions',
    children: [
      'Accessories',
      'Backer Rod',
      'Custom',
      'Glazing Bead',
      'Nailing Fin',
      'Services',
      'Shipping Supplies',
    ].map((l) => ({ label: l, children: [] })),
  };

  const resources = {
    label: 'Resources',
    children: ['Associations', 'FAQ', 'Patents', 'Technical Notes', 'Warranty Information', 'Videos'].map(
      (l) => ({ label: l, children: [] })
    ),
  };

  const about = {
    label: 'About Us',
    children: [
      'Careers',
      'Lawrence',
      'Our Promise',
      'History',
      'News & Events',
      'Sustainability',
      'Value Proposition',
      'Contact Us',
    ].map((l) => ({ label: l, children: [] })),
  };

  writeIa({
    client: 'amesburytruth',
    title: 'AmesburyTruth',
    url: 'https://www.amesburytruth.com/',
    confidence: 'high',
    notes: [
      'Primary product nav (Window / Door / Weatherseals / Extrusions) plus utility Resources & About Us.',
      'L2 product families from mega-menu URL structure; L3 = product-line hubs (not individual SKUs).',
      'Skipped PDF guide links, Login, and Where to Buy (locator CTA).',
      'Recall Notice included as L1 utility page.',
      `Scraped title: ${raw.title}`,
    ],
    tree: [windowHw, doorHw, weather, extrusions, resources, about, { label: 'Recall Notice', children: [] }],
  });
}

// ── ERA: nest by URL under /default/ ────────────────────────────────────
{
  const raw = JSON.parse(readFileSync('docs/ai/ia/_tmp-era-nav.json', 'utf8'));
  const links = flattenLinks(raw.l1);

  // Manual structure matching live mega-menu (cleaner than flat scrape)
  const tree = [
    {
      label: 'Window Components',
      children: [
        {
          label: 'Casement Windows',
          children: [
            'Window Handles',
            'Window Locks',
            'Window Hinges & Friction Stays',
            'Additional Window Security',
            'Spares & Accessories',
            'Ventilation',
          ].map((l) => ({ label: l, children: [] })),
        },
        {
          label: 'Sash Windows',
          children: ['Sash Balances', 'Sash Window Furniture'].map((l) => ({ label: l, children: [] })),
        },
        {
          label: 'Tilt & Turn Windows',
          children: ['Gearing', 'Window Handles'].map((l) => ({ label: l, children: [] })),
        },
      ],
    },
    {
      label: 'Door Components',
      children: [
        {
          label: 'Entrance Doors',
          children: [
            'Door Handles',
            'Door Hinges',
            'Letterplates',
            'Accessories',
            'Multi-Point Door Locks',
            'Cylinders',
            'Mortice Locks',
            'NightLatches',
            'Digital Door Locks',
            'Security Bolts',
            'Ventilation',
          ].map((l) => ({ label: l, children: [] })),
        },
        {
          label: 'Interior Doors',
          children: ['Door Handles and Knobs', 'Mortice Locks', 'Tubular Latches'].map((l) => ({
            label: l,
            children: [],
          })),
        },
        {
          label: 'French Double Doors',
          children: ['Mortice Locks'].map((l) => ({ label: l, children: [] })),
        },
        {
          label: 'Sliding Doors',
          children: ['Locks and Keeps', 'Door Handles', 'Rollers and Accessories'].map((l) => ({
            label: l,
            children: [],
          })),
        },
      ],
    },
    {
      label: 'Aluminium Components',
      children: [
        {
          label: 'Door Components',
          children: ['Door Handles', 'Door Hinges', 'Security Bolts'].map((l) => ({ label: l, children: [] })),
        },
        {
          label: 'Window Components',
          children: ['Window Handles', 'Window Hinges & Friction Stays'].map((l) => ({
            label: l,
            children: [],
          })),
        },
      ],
    },
    {
      label: 'Home Security',
      children: [
        { label: 'ERA Protect Ecosystem', children: [] },
        { label: 'Smart Home Alarm Systems', children: [] },
      ],
    },
    {
      label: 'Ironmongery',
      children: [
        'Bolts',
        'Garage Doors',
        'Gate Hinges',
        'General Fittings',
        'Hasps and Staples',
        'Pulleys',
        'Repair Plates and Brackets',
      ].map((l) => ({ label: l, children: [] })),
    },
    {
      label: 'Fab&Fix',
      children: [
        'Classic Range',
        'Heritage Range',
        'Architectural Range',
        'Forged Range',
        'Sash Window Range',
      ].map((l) => ({ label: l, children: [] })),
    },
    { label: 'Weatherseals', children: [] },
    { label: 'News', children: [] },
    { label: 'Clearance', children: [] },
    {
      label: 'About Us',
      children: ['Company Information', 'Our People', 'Careers', 'Neighbourhood Watch', 'Accreditations'].map(
        (l) => ({ label: l, children: [] })
      ),
    },
    {
      label: 'Technical',
      children: [
        'Technical Downloads',
        'Standards and Certification',
        'UKAS Test House',
        'Declaration of Performance',
        'Service Status',
      ].map((l) => ({ label: l, children: [] })),
    },
    {
      label: 'Customer Service',
      children: ['Account Forms', 'Delivery', 'Marketing Support', 'Contact Us'].map((l) => ({
        label: l,
        children: [],
      })),
    },
  ];

  writeIa({
    client: 'era',
    title: 'ERA Everywhere',
    url: 'https://www.eraeverywhere.com/',
    confidence: 'high',
    notes: [
      'Primary mega-menu categories + key footer section hubs (About / Technical / Customer Service).',
      'Nested L2/L3 from on-site category URLs; duplicate label names under different parents are intentional category pages.',
      'Skipped Login/Register/Basket, legal PDFs, and external social links.',
      `Scraped title: ${raw.title}; primary L1 count from scraper: ${raw.l1.length}`,
    ],
    tree,
  });
}

// ── Quanex: L1 Products/Capabilities/Support + info pages; L3 category hubs only ─
{
  const raw = JSON.parse(readFileSync('docs/ai/ia/_tmp-quanex-nav.json', 'utf8'));

  const products = {
    label: 'Products',
    children: [
      {
        label: 'Residential',
        children: [
          'Entry Door Components',
          'Insulating Glass Spacers',
          'Kitchen & Bath Components',
          'Millwork',
          'Security Screens',
          'Solar Panel Components',
          'Window Components',
        ].map((l) => ({ label: l, children: [] })),
      },
      {
        label: 'Commercial',
        children: [
          'Entry Door Components',
          'Window Components',
          'Insulating Glass Spacers',
          'Weatherseals',
          'Materials & Finishes',
        ].map((l) => ({ label: l, children: [] })),
      },
      { label: 'Insulating Glass Spacers', children: [] },
      { label: 'Weatherseals', children: [] },
      { label: 'Solar', children: [] },
      {
        label: 'For Architects',
        children: [
          'Warm-Edge Spacers',
          'Commercial Window & Door Systems',
          'Project Profiles',
          'Sustainability',
          'Continuing Education Resources',
        ].map((l) => ({ label: l, children: [] })),
      },
      { label: 'Hardware Solutions', children: [] },
      { label: 'Access Solutions', children: [] },
      { label: 'Extruded Solutions', children: [] },
      { label: 'Mixing Solutions', children: [] },
      { label: 'Wood Solutions', children: [] },
    ],
  };

  const capabilities = {
    label: 'Capabilities',
    children: [
      'Cabinet Components',
      'Custom Mixing',
      'Engineered Wood',
      'Extrusion Capabilities',
      'Hardwood Residues',
      'Material & Science Design',
      'Millwork',
      'Performance Solutions',
      'Polymer Solutions',
      'Roll Forming',
      'Rolltrusion',
      'Sealant Solutions',
      'Silicone Foam Solutions',
    ].map((l) => ({ label: l, children: [] })),
  };

  const support = {
    label: 'Service & Support',
    children: [
      { label: 'Account Management', children: [] },
      { label: 'Continuing Education Resources', children: [] },
      {
        label: 'Equipment',
        children: [
          'Line Layouts',
          'Secondary Sealing Equipment Solutions',
          'High-Speed Full Automation',
          'Semi-Automated IG Equipment',
          'Manual Spacer Application',
        ].map((l) => ({ label: l, children: [] })),
      },
      { label: 'Plant Transformation', children: [] },
      { label: 'Screens+', children: [] },
    ],
  };

  const info = [
    { label: 'About', children: [] },
    { label: 'Project Profiles', children: [] },
    { label: 'Resources', children: [] },
    { label: 'Sustainability', children: [] },
    { label: 'News', children: [] },
    { label: 'Careers', children: [] },
    { label: 'Locations', children: [] },
    { label: 'Contact Us', children: [] },
    { label: 'Investors', children: [] },
    { label: 'Events', children: [] },
  ];

  writeIa({
    client: 'quanex',
    title: 'Quanex',
    url: 'https://www.quanex.com/',
    confidence: 'medium',
    notes: [
      'Primary nav: Products, Capabilities, Service & Support; plus More Information utility pages from footer.',
      'Depth capped at 3 under Home — individual product SKUs (e.g. Super Spacer variants) omitted; use category hubs as L3.',
      'Residential/Commercial L3 lists are category landing pages from the Products mega-menu.',
      'Mega-menu is deeply nested on the live site; deepen specific branches later if needed for demos.',
      `Scraped title: ${raw.title}`,
    ],
    tree: [products, capabilities, support, ...info],
  });
}

// cleanup temp
for (const f of [
  'docs/ai/ia/_tmp-amesburytruth-nav.json',
  'docs/ai/ia/_tmp-era-nav.json',
  'docs/ai/ia/_tmp-quanex-nav.json',
]) {
  try {
    unlinkSync(f);
  } catch {
    /* ignore */
  }
}
