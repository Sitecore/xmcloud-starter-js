import type { NextApiRequest, NextApiResponse } from 'next';
import { SiteResolver } from '@sitecore-content-sdk/content/site';
import type { SitemapXmlOptions } from '@sitecore-content-sdk/content/client';
import type { SiteInfo } from '@sitecore-content-sdk/nextjs';
import scClient from 'lib/sitecore-client';
import sites from '.sitecore/sites.json';

// Excluded URL patterns only (all other pages from Sitecore are included)
const EXCLUDED_PATTERNS: RegExp[] = [
  /\/404/i,
  /\/api\//i,
  /\/500$/i,
  /\/error/i,
  /\/_/i,
  /sitemap/i,
  /\/robots/i,
  /\.xml$/i,
  /\.(json|txt|css|js|ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/i,
  /\?/i,
];

/** Include URL if it does not match any excluded pattern. */
function shouldIncludeUrl(url: string): boolean {
  try {
    const urlPath = new URL(url).pathname;
    return !EXCLUDED_PATTERNS.some((pattern) => pattern.test(urlPath));
  } catch {
    return false;
  }
}

// Escapes special XML characters
function escapeXml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function getSitemapOptions(req: NextApiRequest): SitemapXmlOptions {
  const sitesNormalized: SiteInfo[] = (
    sites as { name: string; hostName?: string; language?: string }[]
  ).map((s) => ({ name: s.name, hostName: s.hostName ?? '*', language: s.language ?? 'en' }));
  const siteResolver = new SiteResolver(sitesNormalized);
  const reqHost = (req.headers['x-forwarded-host'] as string) || req.headers.host || '';
  const forwardedProto = req.headers['x-forwarded-proto'];
  const reqProtocol = forwardedProto
    ? (typeof forwardedProto === 'string' ? forwardedProto : forwardedProto[0]).split(',')[0].trim()
    : reqHost.includes('localhost')
      ? 'http'
      : 'https';
  const site = siteResolver.getByHost(reqHost);
  return {
    reqHost,
    reqProtocol,
    siteName: site.name,
  };
}

/** Parses <url> entries from sitemap XML. */
function parseUrlEntriesFromXml(
  xml: string
): { loc: string; lastmod?: string; changefreq?: string; priority?: string }[] {
  const urls: { loc: string; lastmod?: string; changefreq?: string; priority?: string }[] = [];
  for (const block of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = block[1].match(/<loc>([^<]+)<\/loc>/)?.[1];
    if (loc) {
      urls.push({
        loc,
        lastmod: block[1].match(/<lastmod>([^<]+)<\/lastmod>/)?.[1],
        changefreq: block[1].match(/<changefreq>([^<]+)<\/changefreq>/)?.[1],
        priority: block[1].match(/<priority>([^<]+)<\/priority>/)?.[1],
      });
    }
  }
  return urls;
}

/** Parses <sitemap><loc>...</loc></sitemap> entries from a sitemap index. */
function parseSitemapIndexLocs(xml: string): string[] {
  const locs: string[] = [];
  for (const block of xml.matchAll(/<sitemap>([\s\S]*?)<\/sitemap>/g)) {
    const loc = block[1].match(/<loc>([^<]+)<\/loc>/)?.[1];
    if (loc) locs.push(loc);
  }
  return locs;
}

// Fetches sitemap via SitecoreClient.getSiteMap (Data fetching API), filters URLs, and returns LLM-optimized XML sitemap
export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const options = getSitemapOptions(req);
    let urls: { loc: string; lastmod?: string; changefreq?: string; priority?: string }[] = [];

    try {
      const xml = await scClient.getSiteMap(options);
      if (xml) {
        urls = parseUrlEntriesFromXml(xml);
        if (urls.length === 0) {
          const indexLocs = parseSitemapIndexLocs(xml);
          for (const loc of indexLocs) {
            try {
              const response = await fetch(loc, { headers: { Accept: 'application/xml' } });
              if (response.ok) {
                const subXml = await response.text();
                urls.push(...parseUrlEntriesFromXml(subXml));
              }
            } catch {
              // Skip failed sub-sitemap
            }
          }
        }
      }
    } catch {
      // getSiteMap failed or returned nothing; leave urls empty (sitemap will be empty)
    }

    const today = new Date().toISOString().split('T')[0];
    let baseUrl = `${options.reqProtocol}://${options.reqHost}`;
    if (urls.length > 0) {
      try {
        baseUrl = new URL(urls[0].loc).origin;
      } catch {
        // keep request-based baseUrl
      }
    }

    const pageEntries = urls
      .filter((u) => shouldIncludeUrl(u.loc))
      .map(
        (u) => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <lastmod>${u.lastmod || today}</lastmod>
    <changefreq>${u.changefreq || 'weekly'}</changefreq>
    <priority>${u.priority || '0.5'}</priority>
  </url>`
      );

    const aiEndpoints = ['/ai/faq.json', '/ai/summary.json', '/ai/service.json'] as const;
    const aiEntries = aiEndpoints.map(
      (path) => `  <url>
    <loc>${escapeXml(`${baseUrl}${path}`)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    );

    const entries = pageEntries.length > 0 ? [...pageEntries, ...aiEntries].join('\n') : '';

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader(
      'Cache-Control',
      'public, max-age=300, s-maxage=300, stale-while-revalidate=3600'
    );
    res.status(200).send(xml);
  } catch {
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res
      .status(200)
      .send(
        '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>'
      );
  }
}
