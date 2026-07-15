import type { NextApiRequest, NextApiResponse } from 'next';
import sites from '.sitecore/sites.json';

const CACHE_MAX_AGE = 86400; // 24 hours

/** Generates the ai.txt content with crawler permissions and AI endpoints. */
function generateAiTxtContent(siteUrl: string): string {
  const lastModified = new Date().toISOString().split('T')[0];

  return `# AI Crawler Permissions for ${siteUrl}

User-Agent: *
Allow: /

User-Agent: GPTBot
Allow: /

User-Agent: Claude-Web
Allow: /

User-Agent: Anthropic-AI
Allow: /

User-Agent: Google-Extended
Allow: /

User-Agent: CCBot
Allow: /

User-Agent: PerplexityBot
Allow: /

Disallow: /api/editing/
Disallow: /sitecore/

AI-Endpoint: ${siteUrl}/ai/summary.json
AI-Endpoint: ${siteUrl}/ai/faq.json
AI-Endpoint: ${siteUrl}/ai/structured-data.json

Sitemap: ${siteUrl}/sitemap-llm.xml
Sitemap: ${siteUrl}/sitemap.xml

Last-Modified: ${lastModified}
`;
}

/** Resolves the site URL from request headers or falls back to configured sites. */
function resolveSiteUrl(req: NextApiRequest): string {
  const host = req.headers.host || req.headers['x-forwarded-host'];
  const protocol = req.headers['x-forwarded-proto'] || 'https';

  if (host) {
    const hostStr = Array.isArray(host) ? host[0] : host;
    const protoStr = Array.isArray(protocol) ? protocol[0] : protocol;
    return `${protoStr}://${hostStr}`;
  }

  const defaultSite = sites?.[0];
  if (defaultSite?.hostName) {
    return `https://${defaultSite.hostName}`;
  }

  return 'https://localhost:3000';
}

/** API handler that serves the ai.txt file for AI crawlers. */
export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).end('Method Not Allowed');
    return;
  }

  try {
    const siteUrl = resolveSiteUrl(req);
    const aiTxtContent = generateAiTxtContent(siteUrl);

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', `public, max-age=${CACHE_MAX_AGE}, s-maxage=${CACHE_MAX_AGE}`);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.status(200).send(aiTxtContent);
  } catch (error) {
    console.error('Error generating ai.txt:', error);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.status(500).send('# Error generating ai.txt\n');
  }
}
