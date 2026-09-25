import { NextRequest } from 'next/server';
import {
  DEFAULT_LLMS_TXT,
  LLMS_TXT_CONTENT_TYPE,
  SiteResolver,
} from '@sitecore-content-sdk/content/site';
import type { SiteInfo } from '@sitecore-content-sdk/nextjs';
import sites from '.sitecore/sites.json';
import client from '@/lib/sitecore-client';

/**
 * API route for serving llms.txt
 *
 * Content is authored in Sitecore (Settings → Crawlers → LLMs.txt) as markdown
 * with root-relative links, for example [About](/about). Those links are
 * resolved against the current request origin the same way a browser resolves
 * a relative anchor href.
 */

export const dynamic = 'force-dynamic';

function requestHostHeader(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-host')?.split(',')[0].trim() ||
    req.headers.get('host') ||
    'localhost:3000'
  );
}

function resolveOrigin(req: NextRequest): string {
  const host = requestHostHeader(req);
  const proto =
    req.headers.get('x-forwarded-proto')?.split(',')[0].trim() ||
    (host.includes('localhost') ? 'http' : 'https');
  return `${proto}://${host}`;
}

/** True for path-relative hrefs. Absolute, protocol-relative, and fragment links stay as authored. */
function isRelativeHref(href: string): boolean {
  return !/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(href) && !href.startsWith('//') && !href.startsWith('#');
}

/**
 * Resolves relative markdown links against the request origin.
 * [About](/about) on http://localhost:3000 becomes [About](http://localhost:3000/about).
 */
function resolveRelativeUrls(markdown: string, origin: string): string {
  const base = origin.endsWith('/') ? origin : `${origin}/`;

  return markdown.replace(/\[([^\]]*)\]\(([^)\s]+)\)/g, (match, label: string, href: string) => {
    if (!isRelativeHref(href)) return match;
    return `[${label}](${new URL(href, base).href})`;
  });
}

export async function GET(req: NextRequest) {
  try {
    const hostName = requestHostHeader(req).split(':')[0] || 'localhost';
    const sitesNormalized: SiteInfo[] = (
      sites as { name: string; hostName?: string; language?: string }[]
    ).map((site) => ({
      name: site.name,
      hostName: site.hostName ?? '*',
      language: site.language ?? 'en',
    }));
    const site = new SiteResolver(sitesNormalized).getByHost(hostName);
    const content = await client.getLlmsTxt({ siteName: site.name });

    if (!content) {
      return new Response(DEFAULT_LLMS_TXT, {
        status: 404,
        headers: { 'Content-Type': LLMS_TXT_CONTENT_TYPE },
      });
    }

    return new Response(resolveRelativeUrls(content, resolveOrigin(req)), {
      status: 200,
      headers: { 'Content-Type': LLMS_TXT_CONTENT_TYPE },
    });
  } catch (error) {
    if (error instanceof Error && (error as { digest?: string }).digest === 'NEXT_PRERENDER_INTERRUPTED') {
      throw error;
    }

    console.log('Llms.txt route handler failed:');
    console.log(error);

    return new Response('Internal Server Error', {
      status: 500,
    });
  }
}
