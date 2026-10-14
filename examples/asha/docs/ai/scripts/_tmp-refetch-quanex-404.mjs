import https from 'https';
import { readFileSync, writeFileSync } from 'fs';

function get(url, redirects = 0) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'text/html' } }, (r) => {
        if ([301, 302, 307, 308].includes(r.statusCode) && r.headers.location && redirects < 5) {
          const next = new URL(r.headers.location, url).href;
          r.resume();
          return resolve(get(next, redirects + 1));
        }
        let d = '';
        r.on('data', (c) => (d += c));
        r.on('end', () => resolve({ status: r.statusCode, url, body: d }));
      })
      .on('error', reject);
  });
}

function meta(body, prop) {
  const re1 = new RegExp(`property=["']${prop}["']\\s+content=["']([^"']+)["']`, 'i');
  const re2 = new RegExp(`name=["']${prop}["']\\s+content=["']([^"']+)["']`, 'i');
  const m = body.match(re1) || body.match(re2);
  return m ? m[1].replace(/&amp;/g, '&') : '';
}
function title(body) {
  const m = body.match(/<title[^>]*>([^<]+)<\/title>/i);
  return m ? m[1].replace(/\s+/g, ' ').trim() : '';
}
function h1(body) {
  const m = body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  return m ? m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : '';
}
function firstParagraph(body) {
  for (const m of body.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)) {
    const text = m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (text.length > 80 && !/cookie|subscribe|privacy|back on track/i.test(text)) return text.slice(0, 500);
  }
  return '';
}

const extra = [
  ['Weatherseals', 'https://www.quanex.com/product/weatherseals/'],
  ['For Architects', 'https://www.quanex.com/architects/'],
  ['Hardware Solutions', 'https://www.quanex.com/product/hardware-solutions/'],
  ['Access Solutions', 'https://www.quanex.com/product/access-solutions/'],
  ['Extruded Solutions', 'https://www.quanex.com/product/extruded-solutions/'],
  ['Mixing Solutions', 'https://www.quanex.com/product/mixing-solutions/'],
  ['Wood Solutions', 'https://www.quanex.com/product/wood-solutions/'],
  ['Security Screens', 'https://www.quanex.com/product/residential/security-screens/'],
  ['Commercial Window & Door Systems', 'https://www.quanex.com/architects/'],
  ['Materials & Finishes', 'https://www.quanex.com/product/commercial/'],
  ['Screens+', 'https://www.quanex.com/service-support/screens-plus/'],
  ['About', 'https://www.quanex.com/about-us/'],
  ['Project Profiles', 'https://www.quanex.com/project-profiles/'],
];

const out = JSON.parse(readFileSync('docs/ai/ia/_tmp-quanex-content.json', 'utf8'));
for (const [label, url] of extra) {
  try {
    const r = await get(url);
    const desc = meta(r.body, 'og:description') || meta(r.body, 'description') || firstParagraph(r.body);
    const heading = h1(r.body);
    const summary = desc;
    const ok = r.status === 200 && summary && !/back on track/i.test(summary);
    out[label] = {
      sourceUrl: r.url,
      status: r.status,
      title: title(r.body),
      pageTitle: heading || label,
      pageHeaderTitle: heading || label,
      pageShortTitle: label,
      pageSubtitle: heading && heading !== label ? heading : summary ? summary.slice(0, 120) : '',
      pageSummary: (summary || '').slice(0, 400),
      Detail: summary
        ? `<p>${summary.slice(0, 600)}</p><p><a href="${r.url}">Learn more on Quanex.com</a></p>`
        : `<p>${label} from Quanex.</p>`,
      imageUrl: meta(r.body, 'og:image'),
      ok,
    };
    console.log(r.status, label, ok ? 'OK' : 'WEAK', (summary || '').slice(0, 70));
  } catch (e) {
    console.log('ERR', label, e);
  }
}
writeFileSync('docs/ai/ia/_tmp-quanex-content.json', JSON.stringify(out, null, 2));
