import https from 'https';
import { writeFileSync } from 'fs';

function get(url, redirects = 0) {
  return new Promise((resolve, reject) => {
    https
      .get(
        url,
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            Accept: 'text/html,application/xhtml+xml',
          },
        },
        (r) => {
          if ([301, 302, 307, 308].includes(r.statusCode) && r.headers.location && redirects < 5) {
            const next = new URL(r.headers.location, url).href;
            r.resume();
            return resolve(get(next, redirects + 1));
          }
          let d = '';
          r.on('data', (c) => (d += c));
          r.on('end', () => resolve({ status: r.statusCode, url, body: d }));
        }
      )
      .on('error', reject);
  });
}

function meta(body, prop) {
  const patterns = [
    new RegExp(`property=["']${prop}["']\\s+content=["']([^"']+)["']`, 'i'),
    new RegExp(`content=["']([^"']+)["']\\s+property=["']${prop}["']`, 'i'),
    new RegExp(`name=["']${prop}["']\\s+content=["']([^"']+)["']`, 'i'),
    new RegExp(`content=["']([^"']+)["']\\s+name=["']${prop}["']`, 'i'),
  ];
  for (const p of patterns) {
    const m = body.match(p);
    if (m) return m[1].replace(/&amp;/g, '&').replace(/&#039;/g, "'");
  }
  return '';
}

function title(body) {
  const m = body.match(/<title[^>]*>([^<]+)<\/title>/i);
  return m ? m[1].replace(/\s+/g, ' ').trim() : '';
}

function h1(body) {
  const m = body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (!m) return '';
  return m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function firstParagraph(body) {
  // Prefer content-ish paragraphs
  const matches = [...body.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].slice(0, 20);
  for (const m of matches) {
    const text = m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (text.length > 80 && !/cookie|subscribe|privacy/i.test(text)) return text.slice(0, 500);
  }
  return '';
}

const seeds = [
  ['Products', 'https://www.quanex.com/products/'],
  ['Residential', 'https://www.quanex.com/products/residential/'],
  ['Commercial', 'https://www.quanex.com/products/commercial/'],
  ['Insulating Glass Spacers', 'https://www.quanex.com/products/insulating-glass-spacers/'],
  ['Weatherseals', 'https://www.quanex.com/products/weatherseals/'],
  ['Solar', 'https://www.quanex.com/products/solar/'],
  ['For Architects', 'https://www.quanex.com/products/for-architects/'],
  ['Hardware Solutions', 'https://www.quanex.com/products/hardware-solutions/'],
  ['Access Solutions', 'https://www.quanex.com/products/access-solutions/'],
  ['Extruded Solutions', 'https://www.quanex.com/products/extruded-solutions/'],
  ['Mixing Solutions', 'https://www.quanex.com/products/mixing-solutions/'],
  ['Wood Solutions', 'https://www.quanex.com/products/wood-solutions/'],
  ['Capabilities', 'https://www.quanex.com/capabilities/'],
  ['Cabinet Components', 'https://www.quanex.com/capabilities/cabinet-components/'],
  ['Custom Mixing', 'https://www.quanex.com/capabilities/custom-mixing/'],
  ['Engineered Wood', 'https://www.quanex.com/capabilities/engineered-wood/'],
  ['Extrusion Capabilities', 'https://www.quanex.com/capabilities/extrusion-capabilities/'],
  ['Hardwood Residues', 'https://www.quanex.com/capabilities/hardwood-residues/'],
  ['Material & Science Design', 'https://www.quanex.com/capabilities/material-science-design/'],
  ['Millwork', 'https://www.quanex.com/capabilities/millwork/'],
  ['Performance Solutions', 'https://www.quanex.com/capabilities/performance-solutions/'],
  ['Polymer Solutions', 'https://www.quanex.com/capabilities/polymer-solutions/'],
  ['Roll Forming', 'https://www.quanex.com/capabilities/roll-forming/'],
  ['Rolltrusion', 'https://www.quanex.com/capabilities/rolltrusion/'],
  ['Sealant Solutions', 'https://www.quanex.com/capabilities/sealant-solutions/'],
  ['Silicone Foam Solutions', 'https://www.quanex.com/capabilities/silicone-foam-solutions/'],
  ['Service & Support', 'https://www.quanex.com/service-support/'],
  ['Account Management', 'https://www.quanex.com/service-support/account-management/'],
  ['Continuing Education Resources', 'https://www.quanex.com/service-support/continuing-education-resources/'],
  ['Equipment', 'https://www.quanex.com/service-support/equipment/'],
  ['Plant Transformation', 'https://www.quanex.com/service-support/plant-transformation/'],
  ['Screens+', 'https://www.quanex.com/service-support/screens-plus/'],
  ['About', 'https://www.quanex.com/about/'],
  ['About Us', 'https://www.quanex.com/about-us/'],
  ['Project Profiles', 'https://www.quanex.com/project-profiles/'],
  ['Resources', 'https://www.quanex.com/resources/'],
  ['Sustainability', 'https://www.quanex.com/sustainability/'],
  ['News', 'https://www.quanex.com/news/'],
  ['Careers', 'https://www.quanex.com/careers/'],
  ['Locations', 'https://www.quanex.com/locations/'],
  ['Contact Us', 'https://www.quanex.com/contact/'],
  ['Contact', 'https://www.quanex.com/contact-us/'],
  ['Investors', 'https://www.quanex.com/investors/'],
  ['Events', 'https://www.quanex.com/events/'],
  ['Entry Door Components', 'https://www.quanex.com/products/residential/entry-door-components/'],
  ['Window Components', 'https://www.quanex.com/products/residential/window-components/'],
  ['Kitchen & Bath Components', 'https://www.quanex.com/products/residential/kitchen-bath-components/'],
  ['Security Screens', 'https://www.quanex.com/products/residential/security-screens/'],
  ['Solar Panel Components', 'https://www.quanex.com/products/residential/solar-panel-components/'],
  ['Warm-Edge Spacers', 'https://www.quanex.com/products/for-architects/warm-edge-spacers/'],
  ['Commercial Window & Door Systems', 'https://www.quanex.com/products/for-architects/commercial-window-door-systems/'],
  ['Line Layouts', 'https://www.quanex.com/service-support/equipment/line-layouts/'],
  ['Secondary Sealing Equipment Solutions', 'https://www.quanex.com/service-support/equipment/secondary-sealing-equipment-solutions/'],
  ['High-Speed Full Automation', 'https://www.quanex.com/service-support/equipment/high-speed-full-automation/'],
  ['Semi-Automated IG Equipment', 'https://www.quanex.com/service-support/equipment/semi-automated-ig-equipment/'],
  ['Manual Spacer Application', 'https://www.quanex.com/service-support/equipment/manual-spacer-application/'],
];

const out = {};
for (const [label, url] of seeds) {
  try {
    const r = await get(url);
    const t = title(r.body);
    const desc = meta(r.body, 'og:description') || meta(r.body, 'description');
    const img = meta(r.body, 'og:image');
    const heading = h1(r.body);
    const summary = desc || firstParagraph(r.body);
    const subtitle = heading && heading !== label ? heading : '';
    out[label] = {
      sourceUrl: r.url,
      status: r.status,
      title: t,
      pageTitle: heading || label,
      pageHeaderTitle: heading || label,
      pageShortTitle: label,
      pageSubtitle: subtitle || (desc ? desc.slice(0, 120) : ''),
      pageSummary: summary.slice(0, 400),
      Detail: summary
        ? `<p>${summary.slice(0, 600)}</p><p><a href="${r.url}">Learn more on Quanex.com</a></p>`
        : `<p>${label} from Quanex.</p>`,
      imageUrl: img,
      ok: r.status === 200 && !!summary,
    };
    console.log(`${r.status} ${label} -> ${r.url.slice(0, 70)} | ${summary.slice(0, 60)}`);
  } catch (e) {
    out[label] = { sourceUrl: url, error: String(e), ok: false };
    console.log(`ERR ${label}: ${e}`);
  }
}

writeFileSync('docs/ai/ia/_tmp-quanex-content.json', JSON.stringify(out, null, 2));
console.log('Wrote docs/ai/ia/_tmp-quanex-content.json', Object.keys(out).length);
